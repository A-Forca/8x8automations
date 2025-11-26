module.exports = {
  id: '001_init',
  up: `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS agents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      external_agent_id TEXT UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT,
      profile_photo_url TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_agents_full_name ON agents (LOWER(full_name));

    CREATE TABLE IF NOT EXISTS score_categories (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS calls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
      call_id TEXT NOT NULL UNIQUE,
      call_timestamp TIMESTAMPTZ NOT NULL,
      call_date DATE NOT NULL,
      duration_seconds INTEGER CHECK (duration_seconds >= 0),
      customer_phone TEXT,
      qa_total_score NUMERIC(5,2),
      qa_max_score NUMERIC(5,2),
      recording_url TEXT,
      transcript_url TEXT,
      transcription TEXT,
      summary TEXT,
      grade_synopsis TEXT,
      qa_payload JSONB,
      raw_payload JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_calls_agent_date ON calls (agent_id, call_date DESC);
    CREATE INDEX IF NOT EXISTS idx_calls_timestamp ON calls (call_timestamp DESC);

    CREATE TABLE IF NOT EXISTS call_scores (
      call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
      category_id INTEGER NOT NULL REFERENCES score_categories(id) ON DELETE CASCADE,
      score NUMERIC(5,2),
      max_score NUMERIC(5,2),
      ai_notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (call_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS daily_agent_metrics (
      id BIGSERIAL PRIMARY KEY,
      agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      metric_date DATE NOT NULL,
      call_count INTEGER NOT NULL DEFAULT 0,
      avg_score NUMERIC(5,2),
      avg_call_seconds INTEGER,
      avg_call_minutes NUMERIC(10,2),
      total_call_seconds INTEGER NOT NULL DEFAULT 0,
      total_call_minutes NUMERIC(12,2),
      total_calls_with_score INTEGER NOT NULL DEFAULT 0,
      score_trend NUMERIC(6,2),
      additional_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (agent_id, metric_date)
    );

    CREATE INDEX IF NOT EXISTS idx_daily_agent_metrics_agent_date
      ON daily_agent_metrics (agent_id, metric_date DESC);

    CREATE TABLE IF NOT EXISTS agent_ai_insights (
      id BIGSERIAL PRIMARY KEY,
      agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      from_date DATE NOT NULL,
      to_date DATE NOT NULL,
      summary TEXT,
      strengths JSONB,
      weaknesses JSONB,
      action_items JSONB,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (agent_id, from_date, to_date)
    );

    CREATE INDEX IF NOT EXISTS idx_agent_ai_insights_agent_generated
      ON agent_ai_insights (agent_id, generated_at DESC);

    INSERT INTO score_categories (slug, label, description)
    VALUES
      ('greeting', 'Greeting / Identity', 'Opens call confidently and states identity/company'),
      ('empathy', 'Empathy / Tone', 'Acknowledges issues with warmth and patience'),
      ('listening', 'Listening / Clarity', 'Lets customer speak, clarifies needs'),
      ('resolution', 'Resolution', 'Delivers accurate, actionable solutions'),
      ('verification', 'Verification / Summary', 'Recaps and confirms satisfaction'),
      ('closing', 'Closing', 'Sets next steps and leaves positive sendoff')
    ON CONFLICT (slug) DO UPDATE
      SET label = EXCLUDED.label,
          description = EXCLUDED.description;
  `,
};

