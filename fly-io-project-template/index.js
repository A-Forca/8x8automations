require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  fetchLatestRecordings,
  downloadRecordingsZip,
  EightByEightError,
} = require('./lib/recordings');
const { syncRecordings } = require('./lib/recordingSync');
const {
  listAgentsWithKpis,
  getAgentProfile,
  getAgentSummary,
  getAgentTimeSeries,
  getAgentCategoryBreakdown,
  getAgentInsights,
  listAgentCalls,
  listAllCalls,
  normalizeRangeDays,
} = require('./lib/db/analytics');

const app = express();
const port = Number(process.env.PORT) || 8080;

const dashboardOrigins = (process.env.DASHBOARD_ORIGINS ||
  'https://agent-insights-dashboard.fly.dev,https://agent-insights-dashboard.fly.dev/'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || dashboardOrigins.length === 0 || dashboardOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-shared-secret'],
  })
);
app.use(express.json({ limit: '1mb' }));

const syncStatus = {
  intervalMinutes: null,
  lastRunLabel: null,
  lastRunStartedAt: null,
  lastRunCompletedAt: null,
  lastRunResult: null,
  lastRunError: null,
  nextRunScheduledAt: null,
};

function requireSharedSecret(req, res, next) {
  const configuredSecret = process.env.WEBHOOK_SECRET || '';
  if (!configuredSecret) return res.status(500).json({ error: 'Server secret not configured' });
  const provided = req.headers['x-shared-secret'];
  if (!provided || provided !== configuredSecret) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function ensureEightByEightCredentials() {
  const clientId = process.env.EIGHT_BY_EIGHT_CLIENT_ID;
  const clientSecret = process.env.EIGHT_BY_EIGHT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing 8x8 credentials. Set EIGHT_BY_EIGHT_CLIENT_ID and EIGHT_BY_EIGHT_CLIENT_SECRET.');
  }
  return { clientId, clientSecret };
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

function resolveAgentFilter() {
  const raw = process.env.RECORDING_AGENT_FILTER;
  if (raw === undefined || raw === null) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (trimmed === '*' || trimmed.toLowerCase() === 'all') return null;
  return trimmed
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

function scheduleNextRun(intervalMs) {
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    syncStatus.nextRunScheduledAt = null;
    return;
  }
  syncStatus.nextRunScheduledAt = new Date(Date.now() + intervalMs).toISOString();
}

function computeLookbackMinutes() {
  const lookbackEnv = Number(process.env.RECORDING_LOOKBACK_MINUTES);
  return Number.isFinite(lookbackEnv) ? lookbackEnv : undefined;
}

async function executeSyncRun({ label, lookbackMinutes }) {
  const agents = resolveAgentFilter();
  const agentNames =
    agents === null
      ? null
      : Array.isArray(agents) && agents.length > 0
        ? agents
        : undefined;
  syncStatus.lastRunLabel = label;
  syncStatus.lastRunStartedAt = new Date().toISOString();
  syncStatus.lastRunError = null;
  syncStatus.lastRunResult = null;
  try {
    const result = await syncRecordings({
      agentNames,
      lookbackMinutes,
      logger: console,
    });
    syncStatus.lastRunCompletedAt = new Date().toISOString();
    syncStatus.lastRunResult = result;
    return result;
  } catch (err) {
    syncStatus.lastRunCompletedAt = new Date().toISOString();
    syncStatus.lastRunError = { message: err.message };
    throw err;
  }
}

async function runSyncOnce({ lookbackMinutes } = {}) {
  return executeSyncRun({ label: 'manual', lookbackMinutes });
}

async function maybeRunSyncOnBoot() {
  const enabled = String(process.env.RUN_RECORDING_SYNC_ON_BOOT || '').toLowerCase() === 'true';
  if (!enabled) return false;
  const exitAfter = String(process.env.EXIT_AFTER_RECORDING_SYNC || '').toLowerCase() === 'true';
  const lookbackEnv = Number(process.env.RECORDING_LOOKBACK_MINUTES);
  const lookbackMinutes = Number.isFinite(lookbackEnv) ? lookbackEnv : undefined;
  console.log('[recording-sync] RUN_RECORDING_SYNC_ON_BOOT enabled, executing once...');
  try {
    const result = await runSyncOnce({ lookbackMinutes });
    console.log('[recording-sync] bootstrap run complete', result);
    if (exitAfter) {
      console.log('[recording-sync] EXIT_AFTER_RECORDING_SYNC=true, shutting down');
      process.exit(0);
    }
    return true;
  } catch (err) {
    console.error('[recording-sync] bootstrap run failed', err);
    if (exitAfter) process.exit(1);
    throw err;
  }
}

function startScheduledRecordingSync() {
  const exitAfter = String(process.env.EXIT_AFTER_RECORDING_SYNC || '').toLowerCase() === 'true';
  if (exitAfter) {
    console.log('[recording-sync] EXIT_AFTER_RECORDING_SYNC=true detected; skipping interval worker');
    return null;
  }
  const enabled = String(process.env.ENABLE_RECORDING_SYNC || 'true').toLowerCase() !== 'false';
  if (!enabled) {
    console.log('[recording-sync] ENABLE_RECORDING_SYNC=false; interval worker disabled');
    return null;
  }

  const intervalMinutes = toPositiveNumber(process.env.RECORDING_SYNC_INTERVAL_MINUTES, 1);
  const intervalMs = Math.max(intervalMinutes, 1) * 60 * 1000;
  console.log(`[recording-sync] Interval worker enabled (every ${intervalMinutes}m)`);
  syncStatus.intervalMinutes = intervalMinutes;

  let running = false;
  const runner = async (label) => {
    if (running) {
      console.log('[recording-sync] previous run still in progress; skipping this interval');
      return;
    }
    running = true;
    try {
      const lookbackMinutes = computeLookbackMinutes();
      const result = await executeSyncRun({ label, lookbackMinutes });
      console.log(`[recording-sync] ${label} run complete`, result);
    } catch (err) {
      console.error(`[recording-sync] ${label} run failed`, err);
    } finally {
      running = false;
    }
  };

  runner('startup');
  scheduleNextRun(intervalMs);
  const timer = setInterval(() => {
    scheduleNextRun(intervalMs);
    runner('interval');
  }, intervalMs);
  return () => clearInterval(timer);
}

const stopScheduledSync = startScheduledRecordingSync();
maybeRunSyncOnBoot().catch((err) => {
  console.error('[recording-sync] bootstrap execution error', err);
});

function getSyncStatus() {
  const nextTs = syncStatus.nextRunScheduledAt ? Date.parse(syncStatus.nextRunScheduledAt) : null;
  const secondsUntilNextRun = nextTs ? Math.max(0, Math.round((nextTs - Date.now()) / 1000)) : null;
  return {
    ...syncStatus,
    secondsUntilNextRun,
  };
}

// Minimal health endpoint for Fly and monitoring
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Agent analytics API is running.',
    docs: {
      agents: '/agents',
      agentMetrics: '/agents/:agentId/metrics',
      agentInsights: '/agents/:agentId/insights',
      status: '/recordings/sync/status',
    },
  });
});

app.get(
  '/agents',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const rangeDays = normalizeRangeDays(req.query?.rangeDays, 7);
    const agents = await listAgentsWithKpis(rangeDays);
    res.json({
      ok: true,
      rangeDays,
      agents,
    });
  })
);

app.get(
  '/agents/:agentId/metrics',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const rangeDays = normalizeRangeDays(req.query?.rangeDays, 30);
    const agent = await getAgentProfile(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    const summary = await getAgentSummary(agentId, rangeDays);
    const timeSeries = await getAgentTimeSeries(agentId, rangeDays);
    const categories = await getAgentCategoryBreakdown(agentId, rangeDays);
    return res.json({
      ok: true,
      agent,
      range: {
        start: summary.rangeStart,
        end: summary.rangeEnd,
        days: summary.rangeDays,
      },
      summary,
      charts: {
        dailyCalls: timeSeries.map((day) => ({
          date: day.date,
          callCount: day.callCount,
        })),
        dailyScores: timeSeries.map((day) => ({
          date: day.date,
          avgScore: day.avgScore,
        })),
        dailyHandleTime: timeSeries.map((day) => ({
          date: day.date,
          avgCallSeconds: day.avgCallSeconds,
        })),
      },
      categories,
    });
  })
);

app.get(
  '/agents/:agentId/insights',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const limit = Math.min(Math.max(1, Number(req.query?.limit) || 3), 20);
    const agent = await getAgentProfile(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    const insights = await getAgentInsights(agentId, limit);
    return res.json({
      ok: true,
      agent: {
        id: agent.id,
        fullName: agent.fullName,
      },
      insights,
    });
  })
);

app.get(
  '/agents/:agentId/calls',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const limit = Math.min(Math.max(Number(req.query?.limit) || 50, 1), 200);
    const offset = Math.max(Number(req.query?.offset) || 0, 0);
    const includeTranscript =
      String(req.query?.includeTranscript || 'false').toLowerCase() === 'true';

    const agent = await getAgentProfile(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const calls = await listAgentCalls(agentId, { limit, offset, includeTranscript });
    return res.json({
      ok: true,
      agent: {
        id: agent.id,
        fullName: agent.fullName,
      },
      calls,
      paging: {
        limit,
        offset,
        returned: calls.length,
      },
    });
  })
);

app.get(
  '/calls',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query?.limit) || 1000, 1), 5000);
    const offset = Math.max(Number(req.query?.offset) || 0, 0);
    const includeTranscript =
      String(req.query?.includeTranscript || 'false').toLowerCase() === 'true';

    const calls = await listAllCalls({ limit, offset, includeTranscript });
    res.json({
      ok: true,
      calls,
      paging: {
        limit,
        offset,
        returned: calls.length,
      },
    });
  })
);

// Generic webhook endpoint (no external integrations by default)
app.post('/webhook', requireSharedSecret, async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const body = req.body || {};
    const size = Buffer.byteLength(JSON.stringify(body));
    console.log(`[${timestamp}] 📥 Webhook received`, {
      contentType: req.headers['content-type'],
      size
    });
    return res.json({ ok: true, receivedAt: timestamp });
  } catch (err) {
    console.error(`[${timestamp}] 💥 Webhook error:`, { error: err.message });
    return res.status(500).json({ error: 'Internal error' });
  }
});

// --- 8x8 Cloud Storage helpers ---
app.get(
  '/recordings/latest',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const { clientId, clientSecret } = ensureEightByEightCredentials();
    const {
      limit = '10',
      region,
      objectType = 'callrecording',
      discoveryRegion = 'us-east',
    } = req.query || {};

    const limitNumber = toPositiveNumber(limit, 10);

    const result = await fetchLatestRecordings({
      clientId,
      clientSecret,
      limit: limitNumber,
      region,
      objectType,
      discoveryRegion,
    });

    res.json({
      ok: true,
      region: result.region,
      count: result.recordings.length,
      recordings: result.recordings,
      meta: {
        limit: limitNumber,
        objectType,
        discoveryRegion,
      },
    });
  })
);

app.get(
  '/recordings/latest/download',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const { clientId, clientSecret } = ensureEightByEightCredentials();
    const {
      limit = '10',
      region,
      objectType = 'callrecording',
      discoveryRegion = 'us-east',
      pollInterval = '5',
      pollTimeout = '180',
    } = req.query || {};

    const limitNumber = toPositiveNumber(limit, 10);
    const pollIntervalSeconds = toPositiveNumber(pollInterval, 5);
    const pollTimeoutSeconds = toPositiveNumber(pollTimeout, 180);

    const result = await fetchLatestRecordings({
      clientId,
      clientSecret,
      limit: limitNumber,
      region,
      objectType,
      discoveryRegion,
    });

    if (result.recordings.length === 0) {
      return res.status(404).json({ error: 'No recordings found for the provided criteria.' });
    }

    const ids = result.recordings.map((r) => r.id).filter(Boolean);
    const { zipName, buffer } = await downloadRecordingsZip({
      token: result.token,
      region: result.region,
      objectIds: ids,
      pollIntervalMs: pollIntervalSeconds * 1000,
      pollTimeoutMs: pollTimeoutSeconds * 1000,
    });

    const filename = zipName || `recordings-${Date.now()}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('x-recordings-count', String(ids.length));
    return res.send(buffer);
  })
);

app.post(
  '/recordings/sync',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const lookbackMinutes = Number(req.body?.lookbackMinutes);
    const result = await runSyncOnce({
      lookbackMinutes: Number.isFinite(lookbackMinutes) ? lookbackMinutes : undefined,
    });
    res.json({ ok: true, result });
  })
);

app.get(
  '/recordings/sync/status',
  requireSharedSecret,
  (req, res) => {
    res.json({ ok: true, status: getSyncStatus() });
  }
);

app.post(
  '/recordings/test-transcription',
  requireSharedSecret,
  asyncHandler(async (req, res) => {
    const { transcribeRecording } = require('./lib/transcription');
    const { summarizeCall } = require('./lib/summarization');
    const { listExistingRows } = require('./lib/googleSheets');
    
    const { audioUrl, rowIndex, testSummary } = req.body || {};
    
    let recordingUrl = audioUrl;
    let recordingId = 'test';
    let existingTranscription = null;
    
    // If no URL provided, get first row from sheet
    if (!recordingUrl) {
      const rows = await listExistingRows();
      const targetRowIndex = Number.isFinite(Number(rowIndex)) ? Number(rowIndex) : 1;
      
      if (rows.length <= targetRowIndex) {
        return res.status(400).json({ error: `Row index ${targetRowIndex} not found. Sheet has ${rows.length} rows.` });
      }
      
      const row = rows[targetRowIndex];
      recordingUrl = row?.[2]; // Column C (index 2) is the recording URL
      recordingId = row?.[5] || `row-${targetRowIndex}`; // Column F (index 5) is the recording ID
      existingTranscription = row?.[6]; // Column G (index 6) is the transcription
      
      if (!recordingUrl) {
        return res.status(400).json({ error: 'No recording URL found in the specified row (column C).' });
      }
    }
    
    console.log(`[test-transcription] Testing transcription for: ${recordingId}`);
    console.log(`[test-transcription] URL: ${recordingUrl}`);
    
    try {
      let transcription = existingTranscription;
      if (!transcription || testSummary) {
        // Transcribe if we don't have it or if testing summary
        transcription = await transcribeRecording(recordingUrl, {
          logger: console,
          recordingId,
        });
      }
      
      let summary = null;
      if (testSummary && transcription) {
        console.log(`[test-summarization] Testing summarization for: ${recordingId}`);
        summary = await summarizeCall(transcription, {
          logger: console,
          recordingId,
        });
      }
      
      return res.json({
        ok: true,
        recordingId,
        transcription,
        transcriptionLength: transcription?.length || 0,
        summary,
        summaryLength: summary?.length || 0,
      });
    } catch (err) {
      console.error('[test-transcription] Failed:', err.message);
      return res.status(500).json({
        ok: false,
        error: err.message,
        status: err.status,
        details: err.details,
      });
    }
  })
);

// --- Trello helpers (optional) ---
function getBoardsConfig() {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require('./trello/boards.json');
  } catch (_) {
    return { boards: [] };
  }
}

function resolveListId({ listId, board, list }) {
  if (listId) return String(listId);
  if (process.env.TRELLO_LIST_ID) return String(process.env.TRELLO_LIST_ID);

  const cfg = getBoardsConfig();
  const boardSel = board || process.env.TRELLO_BOARD;
  const listSel = list || process.env.TRELLO_LIST;
  if (!boardSel || !listSel) return null;

  const b = (cfg.boards || []).find(
    (x) => x.id === boardSel || x.name === boardSel
  );
  if (!b) return null;
  const l = (b.lists || []).find(
    (x) => x.id === listSel || x.name === listSel
  );
  return l ? String(l.id) : null;
}

async function createTrelloCard({ name, desc = '', listId, pos = 'bottom' }) {
  const trelloKey = process.env.TRELLO_KEY;
  const trelloToken = process.env.TRELLO_TOKEN;
  const finalListId = resolveListId({ listId });

  if (!trelloKey || !trelloToken) {
    throw new Error('Trello not configured (missing TRELLO_KEY/TRELLO_TOKEN)');
  }
  if (!finalListId) {
    throw new Error('Unable to resolve Trello list id. Provide listId, or board+list, or env defaults.');
  }

  const params = new URLSearchParams({
    key: trelloKey,
    token: trelloToken,
    idList: finalListId,
    name,
    desc,
    pos,
  });
  const url = `https://api.trello.com/1/cards?${params.toString()}`;
  const resp = await fetch(url, { method: 'POST' });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Trello create card failed: ${resp.status} ${text}`);
  }
  return resp.json();
}

// Trello card creation endpoint (optional)
app.post('/trello/cards', requireSharedSecret, async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const { name, desc, listId, board, list, pos } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Missing required field: name' });

    const resolved = resolveListId({ listId, board, list });
    if (!resolved) {
      return res.status(400).json({
        error: 'Unable to resolve Trello list id. Provide listId, or board+list, or set TRELLO_LIST_ID / TRELLO_BOARD / TRELLO_LIST.'
      });
    }

    const created = await createTrelloCard({ name, desc, listId: resolved, pos });
    return res.status(201).json({
      ok: true,
      cardId: created.id,
      cardUrl: created.shortUrl || `https://trello.com/c/${created.shortLink}`,
    });
  } catch (err) {
    console.error(`[${timestamp}] 💥 Trello error:`, { error: err.message });
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof EightByEightError) {
    return res.status(err.status || 500).json({
      error: err.message,
      details: err.details,
    });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('SIGTERM', () => {
  if (typeof stopScheduledSync === 'function') {
    stopScheduledSync();
  }
  process.exit(0);
});
