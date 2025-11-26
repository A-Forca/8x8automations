#!/usr/bin/env node
require('dotenv').config();

const { pool, query } = require('../lib/db/client');

async function recomputeDailyMetrics() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured before recomputing metrics.');
  }

  const lookbackDays = Number(process.env.METRICS_LOOKBACK_DAYS) || 60;
  const sinceDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
  const since = sinceDate.toISOString().slice(0, 10);

  await query(
    `
      WITH day_stats AS (
        SELECT
          agent_id,
          call_date AS metric_date,
          COUNT(*) AS call_count,
          COUNT(*) FILTER (WHERE qa_total_score IS NOT NULL) AS total_calls_with_score,
          AVG(qa_total_score) AS avg_score,
          AVG(duration_seconds) AS avg_call_seconds,
          SUM(duration_seconds) AS total_call_seconds,
          percentile_disc(0.95) WITHIN GROUP (ORDER BY duration_seconds) AS p95_call_seconds
        FROM calls
        WHERE call_date >= $1
        GROUP BY agent_id, call_date
      ),
      enriched AS (
        SELECT
          agent_id,
          metric_date,
          call_count,
          total_calls_with_score,
          avg_score,
          avg_call_seconds,
          total_call_seconds,
          p95_call_seconds,
          avg_score - LAG(avg_score) OVER (PARTITION BY agent_id ORDER BY metric_date) AS score_trend
        FROM day_stats
      )
      INSERT INTO daily_agent_metrics (
        agent_id,
        metric_date,
        call_count,
        avg_score,
        avg_call_seconds,
        avg_call_minutes,
        total_call_seconds,
        total_call_minutes,
        total_calls_with_score,
        score_trend,
        additional_stats
      )
      SELECT
        agent_id,
        metric_date,
        call_count,
        avg_score,
        avg_call_seconds,
        CASE WHEN avg_call_seconds IS NOT NULL THEN avg_call_seconds / 60.0 ELSE NULL END AS avg_call_minutes,
        total_call_seconds,
        CASE WHEN total_call_seconds IS NOT NULL THEN total_call_seconds / 60.0 ELSE NULL END AS total_call_minutes,
        total_calls_with_score,
        score_trend,
        jsonb_build_object(
          'p95_call_seconds', p95_call_seconds,
          'lookback_days', $2::int
        )
      FROM enriched
      ON CONFLICT (agent_id, metric_date) DO UPDATE SET
        call_count = EXCLUDED.call_count,
        avg_score = EXCLUDED.avg_score,
        avg_call_seconds = EXCLUDED.avg_call_seconds,
        avg_call_minutes = EXCLUDED.avg_call_minutes,
        total_call_seconds = EXCLUDED.total_call_seconds,
        total_call_minutes = EXCLUDED.total_call_minutes,
        total_calls_with_score = EXCLUDED.total_calls_with_score,
        score_trend = EXCLUDED.score_trend,
        additional_stats = EXCLUDED.additional_stats,
        updated_at = NOW()
    `,
    [since, lookbackDays]
  );

  console.log(`[metrics] recompute complete for data since ${since}`);
}

recomputeDailyMetrics()
  .then(async () => {
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('[metrics] recompute failed', err);
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  });

