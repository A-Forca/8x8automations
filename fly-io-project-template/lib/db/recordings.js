const { query, withTransaction } = require('./client');
const { MAX_TOTAL_SCORE, MAX_SCORE_PER_CRITERION } = require('../grading');

function normalizeAgentIdentifier(name) {
  if (!name) return null;
  return name.trim().toLowerCase();
}

function textOrNull(value) {
  if (value === undefined || value === null) return null;
  const str = value.toString();
  return str.trim() ? str : null;
}

function safeDate(value) {
  if (!value) return new Date();
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? new Date() : parsed;
}

function toDateOnly(value) {
  const date = safeDate(value);
  return date.toISOString().slice(0, 10);
}

let cachedCategories;

async function fetchScoreCategories(client) {
  if (cachedCategories) return cachedCategories;
  const { rows } = await client.query('SELECT id, slug FROM score_categories');
  cachedCategories = rows.reduce((acc, row) => {
    acc.set(row.slug, row.id);
    return acc;
  }, new Map());
  return cachedCategories;
}

async function findCallByRecordingId(recordingId) {
  if (!recordingId) return null;
  const { rows } = await query(
    `
      SELECT id, transcription, summary, grade_synopsis, qa_total_score, qa_payload
      FROM calls
      WHERE call_id = $1
      LIMIT 1
    `,
    [recordingId]
  );
  return rows[0] || null;
}

async function persistCallArtifacts(payload = {}) {
  const {
    recordingId,
    agentName,
    agentEmail,
    profilePhotoUrl,
    customerPhone,
    recordingUrl,
    transcriptUrl,
    callTimestamp,
    durationSeconds,
    transcription,
    summary,
    grade,
    rawRecording,
  } = payload;

  if (!recordingId) {
    throw new Error('persistCallArtifacts requires a recordingId');
  }

  return withTransaction(async (client) => {
    let agentId = null;
    const normalizedAgentId = normalizeAgentIdentifier(agentName);
    if (normalizedAgentId) {
      const agentResult = await client.query(
        `
          INSERT INTO agents (external_agent_id, full_name, email, profile_photo_url)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (external_agent_id) DO UPDATE
            SET full_name = EXCLUDED.full_name,
                email = COALESCE(EXCLUDED.email, agents.email),
                profile_photo_url = COALESCE(EXCLUDED.profile_photo_url, agents.profile_photo_url),
                updated_at = NOW()
          RETURNING id
        `,
        [normalizedAgentId, agentName?.trim() || agentName, agentEmail || null, profilePhotoUrl || null]
      );
      agentId = agentResult.rows[0]?.id || null;
    }

    const qaTotal = Number.isFinite(grade?.total) ? Number(grade.total) : null;
    const qaPayload = grade ? { ...grade } : null;
    const qaSynopsis = textOrNull(grade?.synopsis);
    const qaMaxScore = Number.isFinite(grade?.maxScore) ? Number(grade.maxScore) : MAX_TOTAL_SCORE;

    const normalizedTimestamp = safeDate(callTimestamp);
    const callResult = await client.query(
      `
        INSERT INTO calls (
          agent_id,
          call_id,
          call_timestamp,
          call_date,
          duration_seconds,
          customer_phone,
          qa_total_score,
          qa_max_score,
          recording_url,
          transcript_url,
          transcription,
          summary,
          grade_synopsis,
          qa_payload,
          raw_payload
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (call_id) DO UPDATE SET
          agent_id = COALESCE(EXCLUDED.agent_id, calls.agent_id),
          call_timestamp = COALESCE(EXCLUDED.call_timestamp, calls.call_timestamp),
          call_date = COALESCE(EXCLUDED.call_date, calls.call_date),
          duration_seconds = COALESCE(EXCLUDED.duration_seconds, calls.duration_seconds),
          customer_phone = COALESCE(EXCLUDED.customer_phone, calls.customer_phone),
          qa_total_score = COALESCE(EXCLUDED.qa_total_score, calls.qa_total_score),
          qa_max_score = COALESCE(EXCLUDED.qa_max_score, calls.qa_max_score),
          recording_url = COALESCE(EXCLUDED.recording_url, calls.recording_url),
          transcript_url = COALESCE(EXCLUDED.transcript_url, calls.transcript_url),
          transcription = COALESCE(EXCLUDED.transcription, calls.transcription),
          summary = COALESCE(EXCLUDED.summary, calls.summary),
          grade_synopsis = COALESCE(EXCLUDED.grade_synopsis, calls.grade_synopsis),
          qa_payload = COALESCE(EXCLUDED.qa_payload, calls.qa_payload),
          raw_payload = COALESCE(EXCLUDED.raw_payload, calls.raw_payload),
          updated_at = NOW()
        RETURNING id
      `,
      [
        agentId,
        recordingId,
        normalizedTimestamp,
        toDateOnly(normalizedTimestamp),
        Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : null,
        textOrNull(customerPhone),
        qaTotal,
        qaMaxScore,
        textOrNull(recordingUrl),
        textOrNull(transcriptUrl),
        textOrNull(transcription),
        textOrNull(summary),
        qaSynopsis,
        qaPayload,
        rawRecording || null,
      ]
    );

    const insertedCallId = callResult.rows[0]?.id;
    if (insertedCallId && grade?.scores && Object.keys(grade.scores).length > 0) {
      const categories = await fetchScoreCategories(client);
      const rationale = textOrNull(grade.rationale);
      const inserts = [];
      for (const [slug, score] of Object.entries(grade.scores)) {
        const categoryId = categories.get(slug);
        if (!categoryId) continue;
        inserts.push(
          client.query(
            `
              INSERT INTO call_scores (call_id, category_id, score, max_score, ai_notes)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (call_id, category_id) DO UPDATE SET
                score = EXCLUDED.score,
                max_score = EXCLUDED.max_score,
                ai_notes = COALESCE(EXCLUDED.ai_notes, call_scores.ai_notes),
                updated_at = NOW()
            `,
            [
              insertedCallId,
              categoryId,
              Number.isFinite(score) ? Number(score) : null,
              MAX_SCORE_PER_CRITERION,
              rationale,
            ]
          )
        );
      }
      await Promise.all(inserts);
    }

    return { callId: insertedCallId, agentId };
  });
}

module.exports = {
  persistCallArtifacts,
  findCallByRecordingId,
};

