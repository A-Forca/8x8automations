const OpenAI = require('openai');

class GradingError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'GradingError';
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_MAX_OUTPUT_TOKENS = 1600;
const MAX_OUTPUT_TOKENS_CAP = Number(process.env.OPENAI_GRADING_MAX_OUTPUT_TOKENS_LIMIT) || 4096;

const RUBRIC = [
  { key: 'greeting', label: 'Greeting/identity', short: 'Greet', description: 'Clear greeting and states name/company.' },
  { key: 'empathy', label: 'Empathy/tone', short: 'Emp', description: 'Acknowledges issue and stays polite/patient.' },
  { key: 'listening', label: 'Listening/clarity', short: 'Listen', description: 'Lets customer speak, confirms understanding, communicates clearly.' },
  { key: 'resolution', label: 'Resolution steps', short: 'Resolve', description: 'Provides accurate, actionable guidance and next steps.' },
  { key: 'verification', label: 'Verification/summary', short: 'Verify', description: 'Summarizes resolution and confirms satisfaction.' },
  { key: 'closing', label: 'Closing', short: 'Close', description: 'Thanks the customer and offers further help.' },
];

const MAX_SCORE_PER_CRITERION = 2;
const MAX_TOTAL_SCORE = RUBRIC.length * MAX_SCORE_PER_CRITERION;

function normalizeScore(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  if (parsed < 0) return 0;
  if (parsed > MAX_SCORE_PER_CRITERION) return MAX_SCORE_PER_CRITERION;
  return Math.round(parsed);
}

function computeTotal(scores) {
  return RUBRIC.reduce((sum, { key }) => sum + normalizeScore(scores?.[key]), 0);
}

function approximateTokenCount(text = '') {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return Math.ceil(trimmed.split(/\s+/).length * 1.3);
}

function formatSynopsis({ scores, total, rationale }) {
  const labelParts = RUBRIC.map(({ key, short }) => `${short}:${normalizeScore(scores?.[key])}/${MAX_SCORE_PER_CRITERION}`);
  const base = `Score ${total}/${MAX_TOTAL_SCORE} — ${labelParts.join(' | ')}`;
  const trimmed = (rationale || '').toString().trim().replace(/\s+/g, ' ');
  if (!trimmed) return base;
  return `${base}. Notes: ${trimmed}`;
}

function normalizeResponse(raw) {
  const scores = {};
  RUBRIC.forEach(({ key }) => {
    scores[key] = normalizeScore(raw?.scores?.[key]);
  });

  const suppliedTotal = Number(raw?.total);
  const computedTotal = computeTotal(scores);
  const total = Number.isFinite(suppliedTotal)
    ? Math.min(Math.max(Math.round(suppliedTotal), 0), MAX_TOTAL_SCORE)
    : computedTotal;

  const finalTotal = Number.isFinite(total) ? total : computedTotal;
  const rationale = (raw?.rationale || raw?.summary || raw?.notes || '').toString().trim();

  return {
    scores,
    total: finalTotal,
    rationale,
    synopsis: formatSynopsis({ scores, total: finalTotal, rationale }),
  };
}

function safeParseJson(content) {
  if (!content) return null;
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  try {
    return JSON.parse(candidate);
  } catch (_) {
    return null;
  }
}

function extractOutputText(payload) {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  if (payload?.text?.value) return payload.text.value;
  if (typeof payload?.text === 'string') return payload.text;

  const content = payload.content || payload.output || payload.text;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (typeof part?.text === 'string') return part.text;
        if (part?.text?.value) return part.text.value;
        if (typeof part?.content === 'string') return part.content;
        return part?.content?.text || '';
      })
      .join(' ')
      .trim();
  }
  return '';
}

async function gradeWithOpenAI(transcription, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY;
  if (!apiKey) {
    throw new GradingError('OPENAI_API_KEY not configured', 401);
  }

  if (!transcription || !transcription.trim()) {
    throw new GradingError('Empty transcription provided', 400);
  }

  const model = options.model || process.env.OPENAI_GRADING_MODEL || 'gpt-5-mini-2025-08-07';
  const logger = options.logger || console;
  const rubricText = RUBRIC.map((item) => `- ${item.label}: ${item.description}`).join('\n');
  const textVerbosity = options.textVerbosity || process.env.OPENAI_GRADING_TEXT_VERBOSITY || 'low';
  const reasoningEffort =
    options.reasoningEffort || process.env.OPENAI_GRADING_REASONING_EFFORT || 'low';
  const envTemperature = Number(process.env.OPENAI_GRADING_TEMPERATURE);
  const temperature =
    options.temperature !== undefined
      ? options.temperature
      : Number.isFinite(envTemperature)
        ? envTemperature
        : undefined;
  const truncationMode = options.truncation || process.env.OPENAI_GRADING_TRUNCATION || 'auto';
  const requestedMaxOutputTokens =
    Number(options.maxOutputTokens) ||
    Number(process.env.OPENAI_GRADING_MAX_OUTPUT_TOKENS) ||
    DEFAULT_MAX_OUTPUT_TOKENS;
  const approxTranscriptTokens = approximateTokenCount(transcription);
  const scaledBudget = Math.max(requestedMaxOutputTokens, Math.ceil(approxTranscriptTokens * 0.2));
  const maxOutputTokens = Math.min(MAX_OUTPUT_TOKENS_CAP, scaledBudget);

  const client = new OpenAI({ apiKey });

  logger.debug('[grading] sending transcript for QA scoring via OpenAI (responses API)...');

  const requestPayload = {
    model,
    input: [
      {
        role: 'system',
        content:
          'You are a call QA grader for frontline customer support calls. Score each criterion 0-2 (0=missing, 1=partial, 2=clear/complete). Keep rationale concise. Output JSON.',
      },
      {
        role: 'user',
        content: `Score this phone call transcript using the rubric.\n\nRubric:\n${rubricText}\n\nTranscript:\n${transcription}\n\nReturn JSON with: {"scores":{"greeting":0-2,"empathy":0-2,"listening":0-2,"resolution":0-2,"verification":0-2,"closing":0-2},"total":number,"rationale":"1-2 sentence reason"}`,
      },
    ],
    text: { format: { type: 'json_object' }, verbosity: textVerbosity }, // Responses API expects an object for format
    max_output_tokens: maxOutputTokens,
    truncation: truncationMode,
  };

  if (reasoningEffort) {
    requestPayload.reasoning = { effort: reasoningEffort };
  }
  if (temperature !== undefined && temperature !== null) {
    requestPayload.temperature = temperature;
  }

  const response = await client.responses.create(requestPayload);

  if (response?.status === 'incomplete') {
    const reason = response?.incomplete_details?.reason || 'unknown';
    logger.warn('[grading] OpenAI returned incomplete response', {
      model,
      reason,
      responseId: response?.id,
      maxOutputTokens,
    });
    throw new GradingError(`OpenAI grading incomplete (${reason})`, 422, {
      reason,
      responseId: response?.id,
      maxOutputTokens,
    });
  }

  const rawText =
    response?.output_text ||
    (Array.isArray(response?.output)
      ? response.output
          .map((item) => extractOutputText(item))
          .join(' ')
          .trim()
      : extractOutputText(response));

  const parsed = safeParseJson(rawText);
  if (!parsed) {
    const fallbackSynopsis = rawText?.trim() ? rawText.trim() : 'Grade unavailable (model output format unexpected)';
    logger.warn('[grading] unexpected response format from OpenAI (grading)', {
      model,
      responseSnippet: typeof response === 'string' ? response?.slice(0, 1200) : JSON.stringify(response)?.slice(0, 1200),
    });
    return normalizeResponse({
      scores: {},
      total: 0,
      rationale: fallbackSynopsis,
      synopsis: fallbackSynopsis,
    });
  }

  return normalizeResponse(parsed);
}

function isRetryableError(err) {
  if (!err?.status) return true; // Network/timeout or unknown status
  if (err.status === 429) return true; // Rate limit
  if (err.status === 422 && err.details?.reason === 'max_output_tokens') return true;
  if (err.status >= 500) return true; // Server errors
  return false;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gradeCallWithRetry(transcription, options = {}) {
  const logger = options.logger || console;
  const recordingId = options.recordingId || 'unknown';
  const maxRetries = Number(options.maxRetries) || Number(process.env.GRADING_MAX_RETRIES) || 2;
  const baseDelayMs = Number(options.retryDelayMs) || Number(process.env.GRADING_RETRY_DELAY_MS) || 2000;

  let lastError;
  let gradingOptions = { ...options };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt === 0) {
        logger.info(`[grading] scoring call ${recordingId}...`);
      } else {
        logger.info(`[grading] retrying grading for ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1})...`);
      }

      const grade = await gradeWithOpenAI(transcription, gradingOptions);
      logger.info(`[grading] ✓ grading complete for recording ${recordingId} (${grade.total}/${MAX_TOTAL_SCORE})`);
      return grade;
    } catch (err) {
      lastError = err;

      if (!isRetryableError(err)) {
        logger.error(`[grading] ✗ failed for recording ${recordingId} (non-retryable)`, {
          error: err.message,
          status: err.status,
        });
        throw err;
      }

      if (err?.details?.reason === 'max_output_tokens') {
        const currentBudget =
          Number(gradingOptions.maxOutputTokens) ||
          Number(process.env.OPENAI_GRADING_MAX_OUTPUT_TOKENS) ||
          DEFAULT_MAX_OUTPUT_TOKENS;
        const bumpedBudget = Math.min(MAX_OUTPUT_TOKENS_CAP, Math.ceil(currentBudget * 1.5));
        if (bumpedBudget > currentBudget) {
          gradingOptions = { ...gradingOptions, maxOutputTokens: bumpedBudget };
          logger.warn(`[grading] increasing max_output_tokens to ${bumpedBudget} after truncation`, {
            recordingId,
          });
        }
      }

      if (attempt >= maxRetries) {
        logger.error(`[grading] ✗ failed for recording ${recordingId} after ${maxRetries + 1} attempts`, {
          error: err.message,
          status: err.status,
        });
        throw err;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt);
      logger.warn(
        `[grading] grading failed for recording ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`,
        {
          error: err.message,
          status: err.status,
        }
      );

      await sleep(delayMs);
    }
  }

  throw lastError || new GradingError('Grading failed after retries', 500);
}

async function gradeCall(transcription, options = {}) {
  return gradeCallWithRetry(transcription, options);
}

module.exports = {
  gradeCall,
  GradingError,
  MAX_TOTAL_SCORE,
};
