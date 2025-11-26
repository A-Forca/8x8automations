#!/usr/bin/env node
require('dotenv').config();

const { listExistingRows } = require('../lib/googleSheets');
const { persistCallArtifacts, findCallByRecordingId } = require('../lib/db/recordings');
const { parseGradeSynopsis } = require('../lib/grading');

const EASTERN_TZ = 'America/New_York';
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

function parseDuration(value) {
  if (typeof value !== 'string' || !value.includes(':')) return null;
  const parts = value
    .split(':')
    .map((segment) => Number(segment.trim()))
    .filter((segment) => !Number.isNaN(segment));
  if (parts.length !== 3) return null;
  const [hours, minutes, seconds] = parts;
  if (hours < 0 || minutes < 0 || seconds < 0) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

function extractEasternParts(date) {
  return easternFormatter.formatToParts(date).reduce((acc, part) => {
    if (part.type === 'dayPeriod') return acc;
    acc[part.type] = part.value;
    return acc;
  }, {});
}

function parseSheetTimestamp(value) {
  if (typeof value !== 'string') return null;
  const match = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match.map(Number);
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const formattedParts = extractEasternParts(new Date(targetUtc));
  if (!formattedParts.year) return new Date(targetUtc);
  const formattedUtc = Date.UTC(
    Number(formattedParts.year),
    Number(formattedParts.month) - 1,
    Number(formattedParts.day),
    Number(formattedParts.hour),
    Number(formattedParts.minute),
    Number(formattedParts.second || 0)
  );
  const deltaMs = targetUtc - formattedUtc;
  return new Date(targetUtc + deltaMs);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured before running the backfill.');
  }

  const rows = await listExistingRows();
  if (!rows || rows.length <= 1) {
    console.log('[backfill] no sheet rows to migrate.');
    return;
  }

  const dataRows = rows.slice(1);
  let processed = 0;
  let skippedExisting = 0;

  for (const row of dataRows) {
    const recordingId = String(row?.[5] || '').trim();
    if (!recordingId) continue;

    const alreadyInDb = await findCallByRecordingId(recordingId);
    if (alreadyInDb) {
      skippedExisting += 1;
      continue;
    }

    const agentName = String(row?.[0] || '').trim();
    if (!agentName) continue;
    const customerPhone = String(row?.[1] || '').trim();
    const recordingUrl = String(row?.[2] || '').trim();
    const callTimestamp = parseSheetTimestamp(String(row?.[3] || '').trim());
    const durationSeconds = parseDuration(String(row?.[4] || '').trim());
    const transcription = row?.[6] || '';
    const summary = row?.[7] || '';
    const gradeSynopsis = row?.[8] || '';
    const grade = gradeSynopsis ? parseGradeSynopsis(gradeSynopsis) : null;

    await persistCallArtifacts({
      recordingId,
      agentName,
      customerPhone,
      recordingUrl,
      callTimestamp: callTimestamp || new Date(),
      durationSeconds,
      transcription,
      summary,
      grade,
      rawRecording: {
        source: 'google_sheets',
        row,
      },
    });

    processed += 1;
    if (processed % 25 === 0) {
      console.log(`[backfill] processed ${processed} rows...`);
    }
  }

  console.log(
    `[backfill] complete: processed=${processed} skipped_existing=${skippedExisting} total_rows=${dataRows.length}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[backfill] failed', err);
    process.exit(1);
  });

