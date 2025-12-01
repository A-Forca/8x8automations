const OpenAI = require('openai');
const { query } = require('./db/client');

const DEFAULT_WINDOW_DAYS = Number(process.env.INSIGHTS_WINDOW_DAYS) || 7;
const DEFAULT_MODEL = process.env.OPENAI_INSIGHTS_MODEL || 'gpt-4o-mini';
const TIME_ZONE = process.env.APP_TIME_ZONE || 'America/New_York';

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function subtractDays(date, days) {
  const clone = new Date(date.getTime());
  clone.setUTCDate(clone.getUTCDate() - days);
  return clone;
}

function resolveRange(windowDays = DEFAULT_WINDOW_DAYS) {
  const normalized = Math.max(3, Math.min(30, Math.round(windowDays)));
  const end = startOfTodayInTz();
  const start = subtractDays(end, normalized - 1);
  const previousEnd = subtractDays(start, 1);
  const previousStart = subtractDays(previousEnd, normalized - 1);
  return {
    windowDays: normalized,
    current: { start, end },
    previous: { start: previousStart, end: previousEnd },
  };
}

function startOfTodayInTz(tz = TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const lookup = (type) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(Date.UTC(lookup('year'), lookup('month') - 1, lookup('day')));
}

function summarizeRollup(rows = []) {
  return rows.reduce(
    (acc, row) => {
      const callCount = Number(row.call_count) || 0;
      const score = row.avg_score !== null ? Number(row.avg_score) : null;
      const handleSeconds = row.avg_call_seconds !== null ? Number(row.avg_call_seconds) : null;
      const totalSeconds = row.total_call_seconds !== null ? Number(row.total_call_seconds) : 0;
      acc.totalCalls += callCount;
      if (score !== null) {
        acc.scoreSum += score * callCount;
        acc.scoredCalls += callCount;
      }
      if (handleSeconds !== null) {
        acc.handleSum += handleSeconds * callCount;
      }
      acc.totalSeconds += totalSeconds;
      acc.series.push({
        date: row.metric_date,
        callCount,
        avgScore: score,
        avgHandleSeconds: handleSeconds,
      });
      return acc;
    },
    {
      totalCalls: 0,
      scoredCalls: 0,
      scoreSum: 0,
      handleSum: 0,
      totalSeconds: 0,
      series: [],
    }
  );
}

async function fetchRollup(agentId, startDate, endDate) {
  const { rows } = await query(
    `
      SELECT
        call_date AS metric_date,
        COUNT(*) AS call_count,
        AVG(qa_total_score) AS avg_score,
        AVG(duration_seconds) AS avg_call_seconds,
        SUM(duration_seconds) AS total_call_seconds
      FROM calls
      WHERE agent_id = $1
        AND call_date BETWEEN $2 AND $3
      GROUP BY call_date
      ORDER BY metric_date
    `,
    [agentId, toDateString(startDate), toDateString(endDate)]
  );
  return summarizeRollup(rows);
}

async function fetchCategoryScores(agentId, startDate, endDate) {
  const { rows } = await query(
    `
      SELECT
        sc.slug,
        sc.label,
        AVG(cs.score) AS avg_score
      FROM call_scores cs
      JOIN score_categories sc ON sc.id = cs.category_id
      JOIN calls c ON c.id = cs.call_id
      WHERE c.agent_id = $1
        AND c.call_date BETWEEN $2 AND $3
      GROUP BY sc.slug, sc.label
    `,
    [agentId, toDateString(startDate), toDateString(endDate)]
  );
  return rows.reduce((acc, row) => {
    acc[row.slug] = {
      label: row.label,
      avgScore: row.avg_score !== null ? Number(row.avg_score) : null,
    };
    return acc;
  }, {});
}

function buildPromptPayload(agentName, range, currentStats, previousStats, currentCategories, previousCategories) {
  return {
    agent: agentName,
    windowDays: range.windowDays,
    currentWindow: {
      start: toDateString(range.current.start),
      end: toDateString(range.current.end),
      totalCalls: currentStats.totalCalls,
      avgScore:
        currentStats.scoredCalls > 0 ? currentStats.scoreSum / currentStats.scoredCalls : null,
      avgHandleSeconds:
        currentStats.totalCalls > 0 ? currentStats.handleSum / currentStats.totalCalls : null,
      categoryScores: currentCategories,
    },
    previousWindow: {
      start: toDateString(range.previous.start),
      end: toDateString(range.previous.end),
      totalCalls: previousStats.totalCalls,
      avgScore:
        previousStats.scoredCalls > 0 ? previousStats.scoreSum / previousStats.scoredCalls : null,
      avgHandleSeconds:
        previousStats.totalCalls > 0 ? previousStats.handleSum / previousStats.totalCalls : null,
      categoryScores: previousCategories,
    },
  };
}

function extractText(response) {
  if (!response) return '';
  if (typeof response === 'string') return response;
  if (response.output_text) return response.output_text;
  if (Array.isArray(response.output)) {
    return response.output
      .map((part) => {
        if (typeof part === 'string') return part;
        if (Array.isArray(part.content)) {
          return part.content.map((entry) => entry?.text || '').join(' ');
        }
        if (typeof part?.content === 'string') return part.content;
        return part?.text || '';
      })
      .join(' ');
  }
  return '';
}

function safeParseJson(payload) {
  if (!payload) return null;
  try {
    return JSON.parse(payload);
  } catch (_) {
    return null;
  }
}

async function callInsightsModel(promptPayload, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured for insights generation.');
  }
  const client = new OpenAI({ apiKey });
  const model = options.model || DEFAULT_MODEL;
  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'system',
        content:
          'You are a QA performance coach. Compare two time windows of call center metrics and generate concise coaching insights. Output strict JSON.',
      },
      {
        role: 'user',
        content: `Metrics payload:\n${JSON.stringify(promptPayload, null, 2)}\n\nRespond with JSON: {"summary":"text","strengths":["bullet"],"weaknesses":["bullet"],"actionItems":["coaching task"]}`,
      },
    ],
    text: { format: { type: 'json_object' }, verbosity: 'medium' },
    max_output_tokens: Number(process.env.OPENAI_INSIGHTS_MAX_TOKENS) || 800,
  });

  const parsed = safeParseJson(extractText(response));
  if (!parsed) {
    throw new Error('Insights model returned non-JSON output.');
  }
  return {
    summary: parsed.summary || '',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
  };
}

async function persistInsight(agentId, range, result, metadata = {}) {
  const { rows } = await query(
    `
      INSERT INTO agent_ai_insights (
        agent_id,
        from_date,
        to_date,
        summary,
        strengths,
        weaknesses,
        action_items,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb)
      ON CONFLICT (agent_id, from_date, to_date) DO UPDATE SET
        summary = EXCLUDED.summary,
        strengths = EXCLUDED.strengths,
        weaknesses = EXCLUDED.weaknesses,
        action_items = EXCLUDED.action_items,
        metadata = EXCLUDED.metadata,
        generated_at = NOW()
      RETURNING *
    `,
    [
      agentId,
      toDateString(range.current.start),
      toDateString(range.current.end),
      result.summary,
      JSON.stringify(result.strengths),
      JSON.stringify(result.weaknesses),
      JSON.stringify(result.actionItems),
      JSON.stringify({ ...metadata, source: 'insights:v1' }),
    ]
  );
  return rows[0];
}

async function getAgentName(agentId) {
  const { rows } = await query('SELECT full_name FROM agents WHERE id = $1', [agentId]);
  return rows[0]?.full_name || 'Agent';
}

async function generateAgentInsight(options = {}) {
  const { agentId, agentName, windowDays = DEFAULT_WINDOW_DAYS, logger = console } = options;
  if (!agentId) throw new Error('generateAgentInsight requires agentId');
  const range = resolveRange(windowDays);
  const name = agentName || (await getAgentName(agentId));

  const [currentStats, previousStats, currentCategories, previousCategories] = await Promise.all([
    fetchRollup(agentId, range.current.start, range.current.end),
    fetchRollup(agentId, range.previous.start, range.previous.end),
    fetchCategoryScores(agentId, range.current.start, range.current.end),
    fetchCategoryScores(agentId, range.previous.start, range.previous.end),
  ]);

  if (currentStats.totalCalls < 3) {
    logger.warn(`[insights] skipping agent=${agentId} (insufficient data)`);
    return null;
  }

  const promptPayload = buildPromptPayload(
    name,
    range,
    currentStats,
    previousStats,
    currentCategories,
    previousCategories
  );

  logger.info(
    `[insights] generating summary for agent=${agentId} window=${promptPayload.currentWindow.start}→${promptPayload.currentWindow.end}`
  );

  const result = await callInsightsModel(promptPayload);
  const metadata = {
    stats: {
      current: promptPayload.currentWindow,
      previous: promptPayload.previousWindow,
    },
  };

  return persistInsight(agentId, range, result, metadata);
}

async function generateInsightsForAllAgents(options = {}) {
  const { rows } = await query('SELECT id, full_name FROM agents ORDER BY full_name');
  const results = [];
  for (const row of rows) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const insight = await generateAgentInsight({
        agentId: row.id,
        agentName: row.full_name,
        windowDays: options.windowDays,
        logger: options.logger || console,
      });
      if (insight) {
        results.push(insight);
      }
    } catch (err) {
      (options.logger || console).error('[insights] generation failed', {
        agentId: row.id,
        error: err.message,
      });
    }
  }
  return results;
}

module.exports = {
  generateAgentInsight,
  generateInsightsForAllAgents,
  resolveRange,
  DEFAULT_WINDOW_DAYS,
};
