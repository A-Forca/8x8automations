#!/usr/bin/env node
require('dotenv').config();

const { syncRecordings } = require('../lib/recordingSync');

function buildAgentList() {
  return (process.env.RECORDING_AGENT_FILTER || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

(async () => {
  const agents = buildAgentList();
  const lookback = Number(process.env.RECORDING_LOOKBACK_MINUTES);
  console.log(
    `[recording-sync:once] starting (agents=${agents.length > 0 ? agents.join(', ') : 'defaults'} lookback=${
      Number.isFinite(lookback) ? lookback : '60 (default)'
    }m)`
  );
  try {
    const result = await syncRecordings({
      agentNames: agents.length > 0 ? agents : undefined,
    });
    console.log('[recording-sync:once] completed', result);
    process.exit(0);
  } catch (err) {
    console.error('[recording-sync:once] failed', err);
    process.exit(1);
  }
})();
