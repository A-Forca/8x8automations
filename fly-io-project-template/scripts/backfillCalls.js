#!/usr/bin/env node
/* eslint-disable no-console */
require('dotenv').config();

const {
  listCallsForBackfill,
  persistCallArtifacts,
} = require('../lib/db/recordings');
const { transcribeRecording } = require('../lib/transcription');
const { summarizeCall } = require('../lib/summarization');
const { gradeCall, parseGradeSynopsis } = require('../lib/grading');
const { evaluateCallEligibility } = require('../lib/gradingEligibility');
const {
  getPresignedRecordingUrl,
  fetchRecordingById,
  createStorageSession,
} = require('../lib/recordings');

const DEFAULT_LIMIT = Number(process.env.BACKFILL_CALL_LIMIT) || 50;
const DEFAULT_DISCOVERY_REGION = process.env.EIGHT_BY_EIGHT_DISCOVERY_REGION || 'us-east';

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseJsonField(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractRegionFromUrl(url) {
  if (!url) return null;
  const match = /storage\/([^/]+)\/v3/i.exec(url);
  return match ? match[1] : null;
}

function normalizeTimestamp(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

function normalizeNumber(value) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function determineActions(call, options, existingGrade) {
  const needsTranscription = options.forceTranscription || !hasText(call.transcription);
  const needsSummary =
    options.forceSummary || (!hasText(call.summary) && (hasText(call.transcription) || needsTranscription));
  const gradePayload = existingGrade || null;
  const hasScore = gradePayload && Number.isFinite(gradePayload.total);
  const wasSkipped = gradePayload?.status === 'skipped';
  const needsGrade = options.forceRegrade || !hasScore || wasSkipped;
  return { needsTranscription, needsSummary, needsGrade };
}

function parseArgs(argv = []) {
  const options = {
    limit: DEFAULT_LIMIT,
    offset: 0,
    dryRun: false,
    onlyMissing: false,
    onlyAgent: null,
    callId: null,
    forceRegrade: false,
    forceTranscription: false,
    forceSummary: false,
    region: process.env.EIGHT_BY_EIGHT_REGION || null,
    discoveryRegion: DEFAULT_DISCOVERY_REGION,
  };

  const normalized = [...argv];
  for (let i = 0; i < normalized.length; i += 1) {
    let arg = normalized[i];
    if (!arg.startsWith('--')) continue;

    let value = null;
    if (arg.includes('=')) {
      const [flag, val] = arg.split('=');
      arg = flag;
      value = val;
    }

    const nextIsValue = normalized[i + 1] && !normalized[i + 1].startsWith('--');
    switch (arg) {
      case '--limit':
        options.limit = Number(value ?? (nextIsValue ? normalized[++i] : options.limit));
        break;
      case '--offset':
        options.offset = Number(value ?? (nextIsValue ? normalized[++i] : options.offset));
        break;
      case '--callId':
      case '--call-id':
        options.callId = value ?? (nextIsValue ? normalized[++i] : options.callId);
        break;
      case '--onlyAgent':
      case '--only-agent':
        options.onlyAgent = value ?? (nextIsValue ? normalized[++i] : options.onlyAgent);
        break;
      case '--region':
        options.region = value ?? (nextIsValue ? normalized[++i] : options.region);
        break;
      case '--discovery-region':
        options.discoveryRegion = value ?? (nextIsValue ? normalized[++i] : options.discoveryRegion);
        break;
      case '--dryRun':
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--onlyMissing':
      case '--only-missing':
        options.onlyMissing = true;
        break;
      case '--forceRegrade':
      case '--force-regrade':
        options.forceRegrade = true;
        break;
      case '--forceTranscription':
      case '--force-transcription':
        options.forceTranscription = true;
        break;
      case '--forceSummary':
      case '--force-summary':
        options.forceSummary = true;
        break;
      case '--help':
        options.help = true;
        break;
      default:
        console.warn(`[backfill] unknown flag ${arg}, ignoring`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/backfillCalls.js [options]

Options:
  --limit <n>              Number of calls to process (default ${DEFAULT_LIMIT})
  --offset <n>             Offset into calls table (default 0)
  --callId <id>            Process a specific recording/call id
  --onlyAgent "<name>"     Restrict to a single agent full name match
  --only-missing           Only process rows missing transcript/summary/grade
  --force-regrade          Recompute QA scores even if present
  --force-transcription    Regenerate transcripts even if present
  --force-summary          Regenerate summaries even if present
  --dry-run                Log actions without writing changes
  --region <region>        Override storage region (defaults to env/discovery)
  --discovery-region <r>   Region used for discovery fallback (default ${DEFAULT_DISCOVERY_REGION})
`);
}

function summarizeActions(actions) {
  const labels = [];
  if (actions.needsTranscription) labels.push('transcribe');
  if (actions.needsSummary) labels.push('summarize');
  if (actions.needsGrade) labels.push('grade');
  return labels.length > 0 ? labels.join(',') : 'noop';
}

async function ensurePresignedUrl({ call, session, regionHint, ttlSeconds }) {
  const objectId = call.call_id;
  if (!objectId) return null;
  const region = regionHint || session.region;
  if (!region) {
    console.warn(`[backfill] unable to determine region for recording ${objectId}`);
    return null;
  }
  try {
    return await getPresignedRecordingUrl({
      token: session.token,
      region,
      objectId,
      ttlSeconds,
    });
  } catch (err) {
    console.warn(`[backfill] presign failed for ${objectId}: ${err.message}`);
    return null;
  }
}

async function ensureRawRecording({ call, session, regionHint, dryRun }) {
  const existing = parseJsonField(call.raw_payload);
  if (existing) return existing;
  if (dryRun) return null;
  if (!session?.token) return null;
  const region = regionHint || session.region;
  if (!region) return null;
  try {
    const fetched = await fetchRecordingById({
      token: session.token,
      region,
      objectId: call.call_id,
    });
    return {
      ...fetched,
      fetchedAt: new Date().toISOString(),
      source: 'api_lookup',
    };
  } catch (err) {
    console.warn(`[backfill] recording lookup failed for ${call.call_id}: ${err.message}`);
    return null;
  }
}

async function processCall(call, ctx) {
  const { options, session, stats, logger } = ctx;
  const recordingId = call.call_id;
  const agentName = call.agent_name || 'Unknown Agent';
  if (!recordingId) {
    logger.warn('[backfill] skipping row without call_id', { dbId: call.id });
    stats.skipped += 1;
    return;
  }

  const existingGrade =
    parseJsonField(call.qa_payload) ||
    (hasText(call.grade_synopsis) ? parseGradeSynopsis(call.grade_synopsis) : null);
  const actions = determineActions(call, options, existingGrade);
  const actionLabel = summarizeActions(actions);

  if (!actions.needsTranscription && !actions.needsSummary && !actions.needsGrade) {
    logger.info(`[backfill] skipping ${recordingId} — nothing to do (${actionLabel})`);
    stats.skipped += 1;
    return;
  }

  logger.info(
    `[backfill] processing ${recordingId} (agent="${agentName}" actions=${actionLabel})`
  );

  let transcription = hasText(call.transcription) ? call.transcription : '';
  let summary = hasText(call.summary) ? call.summary : '';
  let grade = existingGrade;
  let transcriptionUpdated = false;
  let summaryUpdated = false;
  let gradeUpdated = false;
  const ttlSeconds = Number(process.env.RECORDING_PRESIGN_TTL_SECONDS) || undefined;
  let recordingUrl = call.recording_url || null;

  const inferredRegion = options.region || extractRegionFromUrl(call.recording_url) || session.region;
  const rawRecording = await ensureRawRecording({
    call,
    session,
    regionHint: inferredRegion,
    dryRun: options.dryRun,
  });

  if (actions.needsTranscription) {
    if (options.dryRun) {
      transcriptionUpdated = true;
    } else {
      const audioUrl = await ensurePresignedUrl({
        call,
        session,
        regionHint: inferredRegion,
        ttlSeconds,
      });
      if (!audioUrl) {
        logger.warn(`[backfill] unable to presign audio for ${recordingId}, skipping transcription`);
      } else {
        try {
          transcription = await transcribeRecording(audioUrl, {
            logger,
            recordingId,
          });
          recordingUrl = audioUrl;
          transcriptionUpdated = true;
          stats.transcribed += 1;
        } catch (err) {
          logger.error(`[backfill] transcription failed for ${recordingId}: ${err.message}`);
        }
      }
    }
  }

  if (actions.needsSummary) {
    if (!hasText(transcription) && !options.dryRun) {
      logger.warn(`[backfill] cannot summarize ${recordingId} without transcription`);
    } else if (options.dryRun) {
      summaryUpdated = true;
    } else {
      try {
        summary = await summarizeCall(transcription, {
          logger,
          recordingId,
          agentName,
        });
        summaryUpdated = true;
        stats.summarized += 1;
      } catch (err) {
        logger.error(`[backfill] summarization failed for ${recordingId}: ${err.message}`);
      }
    }
  }

  if (actions.needsGrade) {
    if (!hasText(transcription) && !options.dryRun) {
      logger.warn(`[backfill] cannot grade ${recordingId} without transcription`);
    } else if (options.dryRun) {
      gradeUpdated = true;
    } else {
      const eligibility = evaluateCallEligibility({
        transcription,
        durationSeconds: normalizeNumber(call.duration_seconds),
        metadata: { recording: rawRecording },
      });
      if (!eligibility.shouldGrade) {
        grade = {
          status: 'skipped',
          synopsis: `Skipped (not gradable): ${eligibility.reason || 'eligibility-failed'}`,
          reason: eligibility.reason,
          reasons: eligibility.reasons,
          signals: eligibility.signals,
          total: null,
          maxScore: 0,
          scores: {},
        };
        gradeUpdated = true;
        stats.gradesSkipped += 1;
        logger.info(`[backfill] grade skipped for ${recordingId} — ${eligibility.reason}`);
      } else {
        try {
          grade = await gradeCall(transcription, {
            logger,
            recordingId,
          });
          gradeUpdated = true;
          stats.graded += 1;
        } catch (err) {
          logger.error(`[backfill] grading failed for ${recordingId}: ${err.message}`);
        }
      }
    }
  }

  if (options.dryRun) {
    stats.dryRunTouched += 1;
    logger.info(
      `[backfill] (dry-run) would update ${recordingId} ` +
        `[transcription=${transcriptionUpdated} summary=${summaryUpdated} grade=${gradeUpdated}]`
    );
    return;
  }

  if (!transcriptionUpdated && !summaryUpdated && !gradeUpdated) {
    stats.skipped += 1;
    logger.info(`[backfill] no updates applied to ${recordingId}`);
    return;
  }

  await persistCallArtifacts({
    recordingId,
    agentName,
    customerPhone: call.customer_phone,
    recordingUrl,
    callTimestamp: normalizeTimestamp(call.call_timestamp) || new Date(),
    durationSeconds: normalizeNumber(call.duration_seconds),
    transcription,
    summary,
    grade,
    rawRecording,
  });

  stats.persisted += 1;
  logger.info(
    `[backfill] ✓ stored updates for ${recordingId} ` +
      `[transcription=${transcriptionUpdated} summary=${summaryUpdated} grade=${gradeUpdated}]`
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured to backfill calls.');
  }

  const clientId = process.env.EIGHT_BY_EIGHT_CLIENT_ID;
  const clientSecret = process.env.EIGHT_BY_EIGHT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('EIGHT_BY_EIGHT_CLIENT_ID/SECRET must be set to fetch recordings.');
  }

  const session = await createStorageSession({
    clientId,
    clientSecret,
    region: options.region,
    discoveryRegion: options.discoveryRegion,
  });

  const calls = await listCallsForBackfill({
    limit: options.limit,
    offset: options.offset,
    onlyMissing: options.onlyMissing,
    onlyAgent: options.onlyAgent,
    callId: options.callId,
  });

  if (!calls.length) {
    console.log('[backfill] no calls matched selection criteria.');
    return;
  }

  console.log(
    `[backfill] starting batch: total=${calls.length} limit=${options.limit} offset=${options.offset} ` +
      `onlyMissing=${options.onlyMissing} onlyAgent=${options.onlyAgent || 'n/a'} ` +
      `forceRegrade=${options.forceRegrade} dryRun=${options.dryRun}`
  );

  const stats = {
    processed: 0,
    transcribed: 0,
    summarized: 0,
    graded: 0,
    gradesSkipped: 0,
    skipped: 0,
    persisted: 0,
    dryRunTouched: 0,
  };

  const ctx = { options, session, stats, logger: console };

  for (const call of calls) {
    // eslint-disable-next-line no-await-in-loop
    await processCall(call, ctx);
    stats.processed += 1;
  }

  console.log(
    `[backfill] complete: processed=${stats.processed} persisted=${stats.persisted} ` +
      `transcribed=${stats.transcribed} summarized=${stats.summarized} graded=${stats.graded} ` +
      `grades_skipped=${stats.gradesSkipped} dryrun=${stats.dryRunTouched} skipped=${stats.skipped}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[backfill] failed', err);
    process.exit(1);
  });

