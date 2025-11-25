const { fetchAllRecordings, buildRecordingDownloadUrl, getPresignedRecordingUrl } = require('./recordings');
const { listExistingRows, appendRows, updateCell, updateCells } = require('./googleSheets');
const { transcribeRecording, TranscriptionError } = require('./transcription');
const { summarizeCall, SummarizationError } = require('./summarization');
const { gradeCall } = require('./grading');

const DEFAULT_AGENT_FILTER = [
  'Dayna Pierre',
  'Kizzy Abraham',
  'Shirnelle Alexander',
  'Samuel Conliffe',
  'Kimlyn Laurie-Charles',
  'Jade Beharry',
  'Esther Francois',
  'Mauricia Springer',
  'Shanice Seetan',
  'Sinead Lutchman',
  'Gerald Rodd',
];
const EASTERN_TZ = 'America/New_York';
const MAX_REASONABLE_CALL_SECONDS = 24 * 60 * 60; // 24 hours
const GRADE_COLUMN_INDEX = 8; // column I (0-based index)
const PHONE_KEY_PATTERN = /(phone|customer|caller|callee|ani|address|number|dnis|destination|remote|contact|party)/i;
const PHONE_TAG_KEYS = [
  'customerPhone',
  'customer',
  'customerNumber',
  'caller',
  'callerId',
  'callerNumber',
  'callee',
  'calleeNumber',
  'calledNumber',
  'destination',
  'destinationNumber',
  'dnis',
  'ani',
  'address',
  'phone',
  'phoneNumber',
  'remoteNumber',
  'otherParty',
  'otherNumber',
];
const PHONE_FIELD_PATHS = [
  'customer',
  'customerPhone',
  'customerNumber',
  'customerInfo.phone',
  'customerInfo.number',
  'caller',
  'callerId',
  'callerNumber',
  'callerPhone',
  'caller.phone',
  'caller.number',
  'callee',
  'calleeId',
  'calleeNumber',
  'calleePhone',
  'calledNumber',
  'destination',
  'destinationNumber',
  'destinationPhone',
  'dnis',
  'ani',
  'aniNumber',
  'address',
  'phone',
  'phoneNumber',
  'remoteNumber',
  'remoteParty',
  'remoteParty.number',
  'contactNumber',
  'contact.phone',
  'otherParty',
  'otherPartyNumber',
];
const easternFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: EASTERN_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});
function normalize(value) {
  return (value || '').trim().toLowerCase();
}

function toTimestamp(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getTagValue(recording, candidateKeys = []) {
  if (!Array.isArray(recording?.tags)) return null;
  const lowered = candidateKeys.map((k) => k.toLowerCase());
  const hit = recording.tags.find((tag) => lowered.includes(String(tag?.key || '').toLowerCase()));
  return hit?.value || null;
}

function pickField(recording, fields = []) {
  for (const field of fields) {
    const parts = field.split('.');
    let current = recording;
    for (const key of parts) {
      current = current?.[key];
      if (current === undefined || current === null) break;
    }
    if (current !== undefined && current !== null && String(current).trim()) {
      return String(current);
    }
  }
  return null;
}

function extractAgentName(recording) {
  return (
    getTagValue(recording, ['agent', 'agentName', 'username', 'user']) ||
    pickField(recording, ['agentName', 'userName', 'ownerName', 'metadata.agentName']) ||
    null
  );
}

function extractCustomerPhone(recording) {
  const normalizedFromTags = normalizePhoneString(getTagValue(recording, PHONE_TAG_KEYS));
  if (normalizedFromTags) return normalizedFromTags;

  for (const path of PHONE_FIELD_PATHS) {
    const paths = path.startsWith('metadata.') ? [path] : [path, `metadata.${path}`];
    const direct = pickField(recording, paths);
    const normalized = normalizePhoneString(direct);
    if (normalized) return normalized;
  }

  const fallback = normalizePhoneString(
    String(recording?.address || recording?.phoneNumber || recording?.destination || '').trim()
  );
  if (fallback) return fallback;

  return findPhoneByKey(recording);
}

function extractRecordingIdFromLink(link) {
  if (!link) return null;
  const objectMatch = /objects\/(.+?)\/content/i.exec(link);
  if (objectMatch) return objectMatch[1];
  const idMatch = /recordingId=([^&]+)/i.exec(link);
  if (idMatch) return idMatch[1];
  return null;
}

function extractCallTimestamp(recording) {
  return (
    pickField(recording, ['metadata.callStartTime', 'metadata.startTime']) ||
    recording?.createdTime ||
    null
  );
}

function formatTimestampToEastern(source) {
  const ts = toTimestamp(source);
  if (!ts) return '';
  const parts = easternFormatter.formatToParts(new Date(ts)).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  if (!parts.year || !parts.month || !parts.day) return '';
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour || '00'}:${parts.minute || '00'}:${parts.second || '00'}`;
}

function normalizePhoneString(value) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  const broadMatch = str.match(/(\+?\d[\d\s().-]{6,}\d)/);
  const candidate = broadMatch ? broadMatch[1] : str;
  const digitsOnly = candidate.replace(/[^\d]/g, '');
  if (digitsOnly.length < 7) return null;
  const hasPlus = candidate.trim().startsWith('+');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

function findPhoneByKey(source, depth = 0) {
  if (!source || depth > 5) return null;
  if (Array.isArray(source)) {
    for (const item of source) {
      const nested = findPhoneByKey(item, depth + 1);
      if (nested) return nested;
    }
    return null;
  }
  if (typeof source === 'object') {
    for (const [key, value] of Object.entries(source)) {
      if (PHONE_KEY_PATTERN.test(key) && typeof value !== 'object') {
        const normalized = normalizePhoneString(value);
        if (normalized) return normalized;
      }
      if (value && typeof value === 'object') {
        const nested = findPhoneByKey(value, depth + 1);
        if (nested) return nested;
      }
    }
  }
  return null;
}

function parseClockDuration(value) {
  if (typeof value !== 'string' || !value.includes(':')) return null;
  const parts = value
    .split(':')
    .map((segment) => Number(segment.trim()))
    .filter((segment) => !Number.isNaN(segment));
  if (parts.length < 2 || parts.length > 3) return null;
  while (parts.length < 3) {
    parts.unshift(0);
  }
  const [hours, minutes, seconds] = parts;
  if (hours < 0 || minutes < 0 || seconds < 0) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

function parseIsoDuration(value) {
  if (typeof value !== 'string' || !value.trim().toUpperCase().startsWith('P')) return null;
  const match = value
    .trim()
    .toUpperCase()
    .match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
  if (!match) return null;
  const [, days, hours, minutes, seconds] = match;
  const total =
    (Number(days) || 0) * 24 * 60 * 60 +
    (Number(hours) || 0) * 60 * 60 +
    (Number(minutes) || 0) * 60 +
    (Number(seconds) || 0);
  return Number.isFinite(total) && total >= 0 ? total : null;
}

function toFiniteNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized) return null;
  const cleaned = normalized.replace(/,/g, '');
  if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeNumericDuration(value, unitHint = 'auto') {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unitHint === 'milliseconds') {
    return Math.max(0, Math.round(value / 1000));
  }
  if (unitHint === 'seconds') {
    return Math.round(value);
  }

  const msCandidate = value / 1000;
  if (value >= MAX_REASONABLE_CALL_SECONDS && msCandidate > 0 && msCandidate < MAX_REASONABLE_CALL_SECONDS) {
    return Math.round(msCandidate);
  }
  return Math.round(value);
}

function parseDurationValue(value, unitHint = 'auto') {
  if (value === undefined || value === null) return null;
  const numeric = toFiniteNumber(value);
  if (numeric !== null) {
    return normalizeNumericDuration(numeric, unitHint);
  }
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const clock = parseClockDuration(trimmed);
  if (clock !== null) return clock;
  const iso = parseIsoDuration(trimmed);
  if (iso !== null) return iso;
  return null;
}

function extractDurationSeconds(recording) {
  const sources = [
    { value: pickField(recording, ['metadata.durationSeconds']), unit: 'seconds' },
    { value: pickField(recording, ['metadata.duration']), unit: 'milliseconds' },
    { value: pickField(recording, ['duration']), unit: 'milliseconds' },
    { value: getTagValue(recording, ['duration']), unit: 'milliseconds' },
    { value: getTagValue(recording, ['callDuration', 'talkTime']), unit: 'seconds' },
  ];

  for (const source of sources) {
    const parsed = parseDurationValue(source.value, source.unit);
    if (parsed !== null) return parsed;
  }

  const startMs = toFiniteNumber(pickField(recording, ['metadata.startTime']) || getTagValue(recording, ['startTime']));
  const endMs = toFiniteNumber(pickField(recording, ['metadata.endTime']) || getTagValue(recording, ['endTime']));
  if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs > startMs) {
    const derived = parseDurationValue(endMs - startMs, 'milliseconds');
    if (derived !== null) return derived;
  }

  return null;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function buildAgentFilter(customAgents) {
  if (customAgents === null) return null;
  const source = Array.isArray(customAgents) && customAgents.length > 0 ? customAgents : DEFAULT_AGENT_FILTER;
  const agentSet = new Set();
  source.forEach((agent) => {
    const normalized = normalize(agent);
    if (normalized) agentSet.add(normalized);
  });
  return agentSet;
}

function isOlderThanLookback(recording, lookbackThresholdMs) {
  if (!lookbackThresholdMs) return false;
  const ts = toTimestamp(recording?.createdTime);
  return ts ? ts < lookbackThresholdMs : false;
}

async function ensureGradeHeader(existingRows, logger) {
  const headerRow = existingRows?.[0];
  if (!Array.isArray(headerRow)) return;
  const current = String(headerRow[GRADE_COLUMN_INDEX] || '').trim();
  if (current) return;
  try {
    await updateCell(0, GRADE_COLUMN_INDEX, 'Grade');
    headerRow[GRADE_COLUMN_INDEX] = 'Grade';
    logger.info('[recording-sync] set Grade header in column I');
  } catch (err) {
    logger.warn('[recording-sync] unable to set Grade header in column I', { error: err.message });
  }
}

async function syncRecordings(options = {}) {
  const {
    agentNames,
    logger = console,
    discoveryRegion = process.env.EIGHT_BY_EIGHT_DISCOVERY_REGION || 'us-east',
    maxPages = Number(process.env.RECORDING_MAX_PAGES) || 1,
    pageSize = Number(process.env.RECORDING_PAGE_SIZE) || 100,
    lookbackMinutes: providedLookbackMinutes,
    backfillMinutes: providedBackfillMinutes,
  } = options;

  const envLookback = Number(process.env.RECORDING_LOOKBACK_MINUTES);
  const lookbackMinutes = Number.isFinite(providedLookbackMinutes)
    ? providedLookbackMinutes
    : Number.isFinite(envLookback)
      ? envLookback
      : 60;
  const lookbackThreshold =
    lookbackMinutes > 0 ? Date.now() - lookbackMinutes * 60 * 1000 : null;
  const envBackfillMinutes = Number(process.env.RECORDING_BACKFILL_MINUTES);
  const backfillMinutes = Number.isFinite(providedBackfillMinutes)
    ? providedBackfillMinutes
    : Number.isFinite(envBackfillMinutes)
      ? envBackfillMinutes
      : 60;
  const backfillThreshold =
    backfillMinutes > 0 ? Date.now() - backfillMinutes * 60 * 1000 : null;

  const clientId = process.env.EIGHT_BY_EIGHT_CLIENT_ID;
  const clientSecret = process.env.EIGHT_BY_EIGHT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing 8x8 credentials for recording sync (EIGHT_BY_EIGHT_CLIENT_ID/SECRET).');
  }

  const agentFilter = buildAgentFilter(agentNames);
  if (agentFilter && agentFilter.size === 0) {
    throw new Error('No agent names configured for recording sync.');
  }

  const existingRows = await listExistingRows();
  await ensureGradeHeader(existingRows, logger);
  const existingIds = new Set();
  const existingRowById = new Map();
  existingRows.forEach((row, index) => {
    if (!row) return;
    const headerRow = index === 0;
    const candidateId = String(row?.[5] || '').trim();
    if (candidateId && (!headerRow || candidateId.toLowerCase() !== 'recording id')) {
      existingIds.add(candidateId);
      existingRowById.set(candidateId, { rowIndex: index, row });
      return;
    }
    const link = String(row?.[2] || '').trim();
    if (!link) return;
    const headerLink = headerRow && link.toLowerCase() === 'call recording';
    if (headerLink) return;
    const parsedId = extractRecordingIdFromLink(link);
    if (parsedId) existingIds.add(parsedId);
  });

  logger.info(`[recording-sync] loaded ${existingIds.size} existing recording IDs from sheet`);

  const { recordings, region, token } = await fetchAllRecordings({
    clientId,
    clientSecret,
    discoveryRegion,
    objectType: 'callrecording',
    pageSize,
    maxPages,
    region: process.env.EIGHT_BY_EIGHT_REGION,
  });

  logger.info(`[recording-sync] fetched ${recordings.length} recordings from API`);

  const rowsToAppend = [];
  let considered = 0;
  let skippedOldRecordings = 0;
  let skippedWrongAgent = 0;
  let skippedDuplicates = 0;
  let transcriptionsSucceeded = 0;
  let transcriptionsFailed = 0;
  let summariesSucceeded = 0;
  let summariesFailed = 0;
  let gradesSucceeded = 0;
  let gradesFailed = 0;
  const updatesToApply = [];

  for (const recording of recordings) {
    if (!recording?.id) continue;
RECORDING_BACKFILL_MINUTES
    const rawAgentName = extractAgentName(recording);
    if (!rawAgentName) {
      skippedWrongAgent += 1;
      continue;
    }
    const agentName = rawAgentName.trim();
    if (!agentName) {
      skippedWrongAgent += 1;
      continue;
    }
    const normalizedAgent = normalize(agentName);
    if (agentFilter && !agentFilter.has(normalizedAgent)) {
      skippedWrongAgent += 1;
      logger.debug(`[recording-sync] skipped agent="${agentName}" id=${recording.id}`);
      continue;
    }

    const alreadyInSheet = existingIds.has(recording.id);
    if (!alreadyInSheet && isOlderThanLookback(recording, lookbackThreshold)) {
      skippedOldRecordings += 1;
      continue;
    }

    considered += 1;
    const transcriptionOn = String(process.env.ENABLE_TRANSCRIPTION || 'true').toLowerCase() === 'true';
    const summarizationOn = String(process.env.ENABLE_SUMMARIZATION || 'true').toLowerCase() === 'true';
    const gradingOn = String(process.env.ENABLE_GRADING || 'true').toLowerCase() === 'true';
    const customerPhone = (extractCustomerPhone(recording) || '').trim();
    const callTimestampRaw = extractCallTimestamp(recording);
    const callTimestampMs =
      toTimestamp(callTimestampRaw) ??
      toTimestamp(recording?.createdTime) ??
      null;
    const callTimeEst = formatTimestampToEastern(callTimestampRaw || recording?.createdTime);
    const durationSeconds = extractDurationSeconds(recording);
    const durationFormatted = formatDuration(durationSeconds);
    const recordingUrl = buildRecordingDownloadUrl({
      region,
      objectId: recording.id,
    });
    const presignTtl = Number(process.env.RECORDING_PRESIGN_TTL_SECONDS) || undefined;
    let publicUrl = recordingUrl;
    try {
      publicUrl = await getPresignedRecordingUrl({
        token,
        region,
        objectId: recording.id,
        ttlSeconds: presignTtl,
      });
    } catch (presignErr) {
      logger.warn('[recording-sync] presign failed, falling back to API URL', {
        recordingId: recording.id,
        error: presignErr.message,
      });
    }
    if (alreadyInSheet) {
      skippedDuplicates += 1;
      const existing = existingRowById.get(recording.id);
      const row = existing?.row || [];
      const rowIndex = existing?.rowIndex;
      const currentTranscription = String(row?.[6] || '').trim();
      const currentSummary = String(row?.[7] || '').trim();
      const currentGrade = String(row?.[8] || '').trim();
      const needsSummary = summarizationOn && currentTranscription && !currentSummary;
      const needsGrade = gradingOn && currentTranscription && !currentGrade;

      if (!needsSummary && !needsGrade) {
        logger.debug(
          `[recording-sync] skipped duplicate id=${recording.id} agent="${agentName}" phone=${customerPhone}`
        );
        continue;
      }

      if (backfillThreshold && callTimestampMs && callTimestampMs < backfillThreshold) {
        logger.debug(
          `[recording-sync] skipped backfill (outside ${backfillMinutes}m window) id=${recording.id}`
        );
        continue;
      }

      let backfillTranscription = currentTranscription;
      // If no transcription on the row but we want to fill, we can transcribe again
      if (!backfillTranscription && transcriptionOn) {
        try {
          backfillTranscription = await transcribeRecording(publicUrl, {
            logger,
            recordingId: recording.id,
          });
          transcriptionsSucceeded += 1;
          logger.info(`[recording-sync] ✓ transcription backfill complete for ${recording.id}`);
        } catch (transErr) {
          transcriptionsFailed += 1;
          logger.warn(
            `[recording-sync] transcription backfill failed for ${recording.id}, continuing without backfill`,
            { error: transErr.message }
          );
          continue;
        }
      }

      let updatedSummary = currentSummary;
      if (needsSummary && backfillTranscription) {
        try {
          updatedSummary = await summarizeCall(backfillTranscription, {
            logger,
            recordingId: recording.id,
          });
          summariesSucceeded += 1;
          logger.info(`[recording-sync] ✓ summary backfill complete for ${recording.id}`);
          updatesToApply.push({
            rowIndex,
            columnIndex: 7,
            value: updatedSummary,
          });
        } catch (sumErr) {
          summariesFailed += 1;
          logger.warn(
            `[recording-sync] summarization backfill failed for ${recording.id}, leaving blank`,
            { error: sumErr.message }
          );
        }
      }

      if (needsGrade && backfillTranscription) {
        try {
          const grade = await gradeCall(backfillTranscription, {
            logger,
            recordingId: recording.id,
          });
          const gradeSynopsis = grade?.synopsis || '';
          gradesSucceeded += 1;
          logger.info(`[recording-sync] ✓ grading backfill complete for ${recording.id}`);
          updatesToApply.push({
            rowIndex,
            columnIndex: 8,
            value: gradeSynopsis,
          });
        } catch (gradeErr) {
          gradesFailed += 1;
          logger.warn(
            `[recording-sync] grading backfill failed for ${recording.id}, leaving blank`,
            { error: gradeErr.message }
          );
        }
      }

      continue;
    }
    existingIds.add(recording.id);

    logger.info(`[recording-sync] ✓ processing: agent="${agentName}" phone=${customerPhone} time=${callTimeEst} duration=${durationFormatted} id=${recording.id}`);
    
    // Transcribe the recording
    let transcription = '';
    if (transcriptionOn) {
      try {
        transcription = await transcribeRecording(publicUrl, {
          logger,
          recordingId: recording.id,
        });
        transcriptionsSucceeded += 1;
        logger.info(`[recording-sync] ✓ transcription complete for ${recording.id}`);
      } catch (transErr) {
        transcriptionsFailed += 1;
        logger.warn(`[recording-sync] transcription failed for ${recording.id}, continuing without transcription`, {
          error: transErr.message,
        });
        transcription = ''; // Leave empty if transcription fails
      }
    }
    
    // Summarize the call using OpenAI
    let summary = '';
    if (summarizationOn && transcription) {
      try {
        summary = await summarizeCall(transcription, {
          logger,
          recordingId: recording.id,
        });
        summariesSucceeded += 1;
        logger.info(`[recording-sync] ✓ summary complete for ${recording.id}`);
      } catch (sumErr) {
        summariesFailed += 1;
        logger.warn(`[recording-sync] summarization failed for ${recording.id}, continuing without summary`, {
          error: sumErr.message,
        });
        summary = ''; // Leave empty if summarization fails
      }
    }
    
    // Grade the call using the transcription
    let gradeSynopsis = '';
    if (gradingOn && transcription) {
      try {
        const grade = await gradeCall(transcription, {
          logger,
          recordingId: recording.id,
        });
        gradeSynopsis = grade?.synopsis || '';
        gradesSucceeded += 1;
        logger.info(`[recording-sync] ✓ grading complete for ${recording.id}`);
      } catch (gradeErr) {
        gradesFailed += 1;
        logger.warn(`[recording-sync] grading failed for ${recording.id}, continuing without grade`, {
          error: gradeErr.message,
        });
        gradeSynopsis = ''; // Leave empty if grading fails
      }
    }
    
    rowsToAppend.push([
      agentName,
      customerPhone,
      publicUrl,
      callTimeEst,
      durationFormatted,
      String(recording.id),
      transcription,
      summary,
      gradeSynopsis,
    ]);
  }

  logger.info(
    `[recording-sync] filter summary: total=${recordings.length} ` +
    `skipped_old=${skippedOldRecordings} skipped_wrong_agent=${skippedWrongAgent} ` +
    `skipped_duplicate=${skippedDuplicates} matched=${considered} new=${rowsToAppend.length} ` +
    `transcriptions_succeeded=${transcriptionsSucceeded} transcriptions_failed=${transcriptionsFailed} ` +
    `summaries_succeeded=${summariesSucceeded} summaries_failed=${summariesFailed} ` +
    `grades_succeeded=${gradesSucceeded} grades_failed=${gradesFailed}`
  );

  if (rowsToAppend.length > 0) {
    logger.info(`[recording-sync] appending ${rowsToAppend.length} new rows to sheet...`);
    await appendRows(rowsToAppend);
    logger.info(`[recording-sync] ✓ successfully appended ${rowsToAppend.length} rows`);
  } else {
    logger.info('[recording-sync] no new recordings to append');
  }

  if (updatesToApply.length > 0) {
    logger.info(`[recording-sync] applying ${updatesToApply.length} backfill updates to sheet...`);
    await updateCells(updatesToApply);
    logger.info('[recording-sync] ✓ backfill updates applied');
  }

  logger.info(
    `[recording-sync] COMPLETE: fetched=${recordings.length} matched=${considered} appended=${rowsToAppend.length} lookback=${lookbackMinutes}m`
  );

  return {
    fetched: recordings.length,
    matched: considered,
    appended: rowsToAppend.length,
  };
}

function scheduleRecordingSync(options = {}) {
  const { intervalMs = 60 * 60 * 1000, logger = console } = options;
  let running = false;

  const runner = async () => {
    if (running) {
      logger.warn('[recording-sync] previous run still in progress, skipping this interval');
      return;
    }
    running = true;
    try {
      await syncRecordings(options);
    } catch (err) {
      logger.error('[recording-sync] run failed', { error: err.message });
    } finally {
      running = false;
    }
  };

  runner();
  const timer = setInterval(runner, intervalMs);
  return () => clearInterval(timer);
}

module.exports = {
  syncRecordings,
  scheduleRecordingSync,
  DEFAULT_AGENT_FILTER,
};
