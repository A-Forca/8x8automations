const { fetchAllRecordings, buildRecordingDownloadUrl, getPresignedRecordingUrl } = require('./recordings');
const { transcribeRecording, TranscriptionError } = require('./transcription');
const { summarizeCall, SummarizationError } = require('./summarization');
const { gradeCall, parseGradeSynopsis } = require('./grading');
const { persistCallArtifacts, findCallByRecordingId } = require('./db/recordings');

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

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured to persist recordings in Postgres.');
  }

  const agentFilter = buildAgentFilter(agentNames);
  if (agentFilter && agentFilter.size === 0) {
    throw new Error('No agent names configured for recording sync.');
  }

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
  let insertedCalls = 0;
  let updatedCalls = 0;

  for (const recording of recordings) {
    if (!recording?.id) continue;
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

    const existingCall = await findCallByRecordingId(recording.id);
    const alreadyPersisted = Boolean(existingCall);

    if (!alreadyPersisted && isOlderThanLookback(recording, lookbackThreshold)) {
      skippedOldRecordings += 1;
      continue;
    }

    const hasTranscription = Boolean(existingCall?.transcription);
    const hasSummary = Boolean(existingCall?.summary);
    const hasGrade =
      Number.isFinite(existingCall?.qa_total_score) ||
      Boolean(existingCall?.grade_synopsis) ||
      Boolean(existingCall?.qa_payload);

    const needsTranscription = transcriptionOn && !hasTranscription;
    const needsSummary = summarizationOn && (!hasSummary || (!existingCall?.summary && needsTranscription));
    const needsGrade = gradingOn && !hasGrade;
    const requiresWork = !alreadyPersisted || needsTranscription || needsSummary || needsGrade;

    if (alreadyPersisted && !requiresWork) {
      skippedDuplicates += 1;
      continue;
    }

    if (
      alreadyPersisted &&
      requiresWork &&
      backfillThreshold &&
      callTimestampMs &&
      callTimestampMs < backfillThreshold
    ) {
      skippedDuplicates += 1;
      logger.debug(
        `[recording-sync] skipped backfill (outside ${backfillMinutes}m window) id=${recording.id}`
      );
      continue;
    }

    considered += 1;

    logger.info(
      `[recording-sync] processing agent="${agentName}" phone=${customerPhone} time=${callTimeEst} duration=${durationFormatted} id=${recording.id}`
    );

    let transcription = existingCall?.transcription || '';
    if (!transcription && transcriptionOn) {
      try {
        transcription = await transcribeRecording(publicUrl, {
          logger,
          recordingId: recording.id,
        });
        transcriptionsSucceeded += 1;
        logger.info(`[recording-sync] ✓ transcription complete for ${recording.id}`);
      } catch (transErr) {
        transcriptionsFailed += 1;
        logger.warn(
          `[recording-sync] transcription failed for ${recording.id}, continuing without transcription`,
          { error: transErr.message }
        );
        transcription = '';
      }
    }

    let summary = existingCall?.summary || '';
    if ((!summary || !summary.trim()) && summarizationOn && transcription) {
      try {
        summary = await summarizeCall(transcription, {
          logger,
          recordingId: recording.id,
          agentName,
        });
        summariesSucceeded += 1;
        logger.info(`[recording-sync] ✓ summary complete for ${recording.id}`);
      } catch (sumErr) {
        summariesFailed += 1;
        logger.warn(
          `[recording-sync] summarization failed for ${recording.id}, continuing without summary`,
          { error: sumErr.message }
        );
        summary = '';
      }
    }

    let gradeResult =
      existingCall?.qa_payload ||
      (existingCall?.grade_synopsis ? parseGradeSynopsis(existingCall.grade_synopsis) : null);

    if ((!gradeResult || !Number.isFinite(existingCall?.qa_total_score)) && gradingOn && transcription) {
      try {
        gradeResult = await gradeCall(transcription, {
          logger,
          recordingId: recording.id,
        });
        gradesSucceeded += 1;
        logger.info(`[recording-sync] ✓ grading complete for ${recording.id}`);
      } catch (gradeErr) {
        gradesFailed += 1;
        logger.warn(
          `[recording-sync] grading failed for ${recording.id}, continuing without grade`,
          { error: gradeErr.message }
        );
        gradeResult = gradeResult || null;
      }
    }

    await persistCallArtifacts({
      recordingId: recording.id,
      agentName,
      customerPhone,
      recordingUrl: publicUrl,
      callTimestamp: callTimestampMs ? new Date(callTimestampMs) : new Date(),
      durationSeconds,
      transcription,
      summary,
      grade: gradeResult,
      rawRecording: recording,
    });

    if (alreadyPersisted) {
      updatedCalls += 1;
    } else {
      insertedCalls += 1;
    }
  }

  logger.info(
    `[recording-sync] filter summary: total=${recordings.length} ` +
      `skipped_old=${skippedOldRecordings} skipped_wrong_agent=${skippedWrongAgent} ` +
      `skipped_duplicate=${skippedDuplicates} matched=${considered} inserted=${insertedCalls} updated=${updatedCalls} ` +
      `transcriptions_succeeded=${transcriptionsSucceeded} transcriptions_failed=${transcriptionsFailed} ` +
      `summaries_succeeded=${summariesSucceeded} summaries_failed=${summariesFailed} ` +
      `grades_succeeded=${gradesSucceeded} grades_failed=${gradesFailed}`
  );

  logger.info(
    `[recording-sync] COMPLETE: fetched=${recordings.length} matched=${considered} inserted=${insertedCalls} updated=${updatedCalls} lookback=${lookbackMinutes}m`
  );

  return {
    fetched: recordings.length,
    matched: considered,
    inserted: insertedCalls,
    updated: updatedCalls,
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
