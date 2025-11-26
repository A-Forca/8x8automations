const { query } = require('./client');

const MAX_RANGE_DAYS = 90;
const MIN_RANGE_DAYS = 1;

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeRangeDays(value, fallback = 30) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < MIN_RANGE_DAYS) return fallback;
  return Math.min(MAX_RANGE_DAYS, Math.max(MIN_RANGE_DAYS, Math.round(parsed)));
}

function subtractDays(date, days) {
  const clone = new Date(date.getTime());
  clone.setUTCDate(clone.getUTCDate() - days);
  return clone;
}

function resolveRange(days) {
  const normalizedDays = normalizeRangeDays(days);
  const now = new Date();
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startDate = subtractDays(endDate, normalizedDays - 1);
  return {
    startDate,
    endDate,
    start: toDateString(startDate),
    end: toDateString(endDate),
    days: normalizedDays,
  };
}

function toNumber(value) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

async function getAgentProfile(agentId) {
  if (!agentId) return null;
  const { rows } = await query(
    `
      SELECT id, full_name, email, profile_photo_url, metadata
      FROM agents
      WHERE id = $1
    `,
    [agentId]
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    profilePhotoUrl: row.profile_photo_url,
    metadata: row.metadata || {},
  };
}

async function listAgentsWithKpis(rangeDays = 7) {
  const range = resolveRange(rangeDays);
  const { rows } = await query(
    `
      WITH agg AS (
        SELECT
          agent_id,
          COUNT(*) AS total_calls,
          COUNT(*) FILTER (WHERE qa_total_score IS NOT NULL) AS scored_calls,
          AVG(qa_total_score) AS avg_score,
          AVG(duration_seconds) AS avg_call_seconds,
          SUM(duration_seconds) AS total_call_seconds
        FROM calls
        WHERE call_date BETWEEN $1 AND $2
        GROUP BY agent_id
      )
      SELECT
        a.id,
        a.full_name,
        a.profile_photo_url,
        COALESCE(agg.total_calls, 0) AS total_calls,
        agg.avg_score,
        agg.avg_call_seconds,
        agg.total_call_seconds
      FROM agents a
      LEFT JOIN agg ON agg.agent_id = a.id
      ORDER BY LOWER(a.full_name)
    `,
    [range.start, range.end]
  );

  return rows.map((row) => {
    const totalCalls = Number(row.total_calls) || 0;
    const avgCallSeconds = toNumber(row.avg_call_seconds);
    const totalCallSeconds = toNumber(row.total_call_seconds) || 0;
    return {
      id: row.id,
      fullName: row.full_name,
      profilePhotoUrl: row.profile_photo_url,
      totalCalls,
      avgScore: toNumber(row.avg_score),
      avgCallSeconds,
      avgCallMinutes: avgCallSeconds ? avgCallSeconds / 60 : null,
      avgCallsPerDay: totalCalls / range.days,
      totalCallMinutes: totalCallSeconds / 60,
      rangeStart: range.start,
      rangeEnd: range.end,
      rangeDays: range.days,
    };
  });
}

async function getAgentSummary(agentId, rangeDays = 30) {
  const range = resolveRange(rangeDays);
  const start30 = subtractDays(range.endDate, 29);
  const start7 = subtractDays(range.endDate, 6);

  const { rows } = await query(
    `
      SELECT
        AVG(qa_total_score) FILTER (WHERE call_date BETWEEN $2 AND $3) AS avg_score_range,
        AVG(qa_total_score) FILTER (WHERE call_date BETWEEN $4 AND $3) AS avg_score_30d,
        AVG(qa_total_score) FILTER (WHERE call_date BETWEEN $5 AND $3) AS avg_score_7d,
        AVG(qa_total_score) FILTER (WHERE call_date = $3) AS avg_score_1d,
        COUNT(*) FILTER (WHERE call_date BETWEEN $2 AND $3) AS total_calls_range,
        SUM(duration_seconds) FILTER (WHERE call_date BETWEEN $2 AND $3) AS total_call_seconds_range,
        AVG(duration_seconds) FILTER (WHERE call_date BETWEEN $2 AND $3) AS avg_call_seconds_range
      FROM calls
      WHERE agent_id = $1
    `,
    [agentId, range.start, range.end, toDateString(start30), toDateString(start7)]
  );

  const row = rows[0] || {};
  const totalCalls = Number(row.total_calls_range) || 0;
  const totalCallSeconds = toNumber(row.total_call_seconds_range) || 0;
  const avgCallSeconds = toNumber(row.avg_call_seconds_range);

  return {
    rangeStart: range.start,
    rangeEnd: range.end,
    rangeDays: range.days,
    avgScoreRange: toNumber(row.avg_score_range),
    avgScore30d: toNumber(row.avg_score_30d),
    avgScore7d: toNumber(row.avg_score_7d),
    avgScore1d: toNumber(row.avg_score_1d),
    totalCalls,
    avgCallsPerDay: totalCalls / range.days,
    avgCallSeconds,
    avgCallMinutes: avgCallSeconds ? avgCallSeconds / 60 : null,
    totalCallSeconds,
    totalCallMinutes: totalCallSeconds / 60,
  };
}

async function getAgentTimeSeries(agentId, rangeDays = 30) {
  const range = resolveRange(rangeDays);
  const { rows } = await query(
    `
      WITH date_series AS (
        SELECT generate_series($2::date, $3::date, '1 day')::date AS metric_date
      ),
      daily AS (
        SELECT
          call_date AS metric_date,
          COUNT(*) AS call_count,
          AVG(qa_total_score) AS avg_score,
          AVG(duration_seconds) AS avg_call_seconds
        FROM calls
        WHERE agent_id = $1
          AND call_date BETWEEN $2 AND $3
        GROUP BY call_date
      )
      SELECT
        ds.metric_date,
        COALESCE(d.call_count, 0) AS call_count,
        d.avg_score,
        d.avg_call_seconds
      FROM date_series ds
      LEFT JOIN daily d ON d.metric_date = ds.metric_date
      ORDER BY ds.metric_date
    `,
    [agentId, range.start, range.end]
  );

  return rows.map((row) => ({
    date: toDateString(new Date(row.metric_date)),
    callCount: Number(row.call_count) || 0,
    avgScore: toNumber(row.avg_score),
    avgCallSeconds: toNumber(row.avg_call_seconds),
  }));
}

async function getAgentCategoryBreakdown(agentId, rangeDays = 30) {
  const range = resolveRange(rangeDays);
  const { rows } = await query(
    `
      SELECT
        sc.slug,
        sc.label,
        AVG(cs.score) AS avg_score,
        MAX(cs.max_score) AS max_score
      FROM call_scores cs
      JOIN score_categories sc ON sc.id = cs.category_id
      JOIN calls c ON c.id = cs.call_id
      WHERE c.agent_id = $1
        AND c.call_date BETWEEN $2 AND $3
      GROUP BY sc.slug, sc.label
      ORDER BY sc.label
    `,
    [agentId, range.start, range.end]
  );

  return rows.map((row) => ({
    slug: row.slug,
    label: row.label,
    avgScore: toNumber(row.avg_score),
    maxScore: toNumber(row.max_score) || 0,
  }));
}

async function getAgentInsights(agentId, limit = 3) {
  const safeLimit = Math.min(Math.max(1, Number(limit) || 3), 20);
  const { rows } = await query(
    `
      SELECT
        id,
        from_date,
        to_date,
        summary,
        strengths,
        weaknesses,
        action_items,
        metadata,
        generated_at
      FROM agent_ai_insights
      WHERE agent_id = $1
      ORDER BY generated_at DESC
      LIMIT $2
    `,
    [agentId, safeLimit]
  );
  return rows.map((row) => ({
    id: row.id,
    fromDate: row.from_date,
    toDate: row.to_date,
    summary: row.summary,
    strengths: row.strengths || [],
    weaknesses: row.weaknesses || [],
    actionItems: row.action_items || [],
    metadata: row.metadata || {},
    generatedAt: row.generated_at,
  }));
}

async function listAgentCalls(agentId, options = {}) {
  const limit = Math.min(Math.max(Number(options.limit) || 50, 1), 200);
  const offset = Math.max(Number(options.offset) || 0, 0);
  const includeTranscript =
    String(options.includeTranscript ?? 'false').toLowerCase() === 'true';

  const columns = [
    'id',
    'call_timestamp',
    'duration_seconds',
    'customer_phone',
    'recording_url',
    'transcription',
    'summary',
    'grade_synopsis',
    'qa_total_score',
    'qa_max_score',
  ];

  const { rows } = await query(
    `
      SELECT ${columns.join(', ')}
      FROM calls
      WHERE agent_id = $1
      ORDER BY call_timestamp DESC
      LIMIT $2 OFFSET $3
    `,
    [agentId, limit, offset]
  );

  return rows.map((row) => ({
    id: row.id,
    callTimestamp: row.call_timestamp,
    durationSeconds: toNumber(row.duration_seconds),
    customerPhone: row.customer_phone,
    recordingUrl: row.recording_url,
    transcription: includeTranscript ? row.transcription : undefined,
    summary: row.summary,
    gradeSynopsis: row.grade_synopsis,
    qaTotalScore: toNumber(row.qa_total_score),
    qaMaxScore: toNumber(row.qa_max_score),
  }));
}

async function listAllCalls(options = {}) {
  const limit = Math.min(Math.max(Number(options.limit) || 500, 1), 5000);
  const offset = Math.max(Number(options.offset) || 0, 0);
  const includeTranscript =
    String(options.includeTranscript ?? 'false').toLowerCase() === 'true';

  const columns = [
    'c.id',
    'a.full_name AS agent_name',
    'c.agent_id',
    'c.call_timestamp',
    'c.duration_seconds',
    'c.customer_phone',
    'c.recording_url',
    'c.transcription',
    'c.summary',
    'c.grade_synopsis',
    'c.qa_total_score',
    'c.qa_max_score',
  ];

  const { rows } = await query(
    `
      SELECT ${columns.join(', ')}
      FROM calls c
      LEFT JOIN agents a ON a.id = c.agent_id
      ORDER BY c.call_timestamp DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return rows.map((row) => ({
    id: row.id,
    agentId: row.agent_id,
    agentName: row.agent_name,
    callTimestamp: row.call_timestamp,
    durationSeconds: toNumber(row.duration_seconds),
    customerPhone: row.customer_phone,
    recordingUrl: row.recording_url,
    transcription: includeTranscript ? row.transcription : undefined,
    summary: row.summary,
    gradeSynopsis: row.grade_synopsis,
    qaTotalScore: toNumber(row.qa_total_score),
    qaMaxScore: toNumber(row.qa_max_score),
  }));
}

module.exports = {
  normalizeRangeDays,
  listAgentsWithKpis,
  getAgentProfile,
  getAgentSummary,
  getAgentTimeSeries,
  getAgentCategoryBreakdown,
  getAgentInsights,
  listAgentCalls,
  listAllCalls,
};

