const OpenAI = require('openai');

class SummarizationError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'SummarizationError';
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_SUMMARY_MAX_OUTPUT_TOKENS = 600;
const SUMMARY_MAX_OUTPUT_TOKENS_CAP =
  Number(process.env.OPENAI_SUMMARY_MAX_OUTPUT_TOKENS_LIMIT) || 2048;

function approximateTokenCount(text = '') {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return Math.ceil(trimmed.split(/\s+/).length * 1.3);
}

function extractOutputText(payload) {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  if (payload?.output_text) return payload.output_text;
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

async function summarizeWithOpenAI(transcription, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY;
  if (!apiKey) {
    throw new SummarizationError('OPENAI_API_KEY not configured', 401);
  }

  const model = options.model || process.env.OPENAI_SUMMARY_MODEL || 'gpt-5-mini-2025-08-07';
  const logger = options.logger || console;

  if (!transcription || !transcription.trim()) {
    throw new SummarizationError('Empty transcription provided', 400);
  }

  const textVerbosity = options.textVerbosity || process.env.OPENAI_SUMMARY_TEXT_VERBOSITY || 'low';
  const reasoningEffort =
    options.reasoningEffort || process.env.OPENAI_SUMMARY_REASONING_EFFORT || 'low';
  const truncationMode = options.truncation || process.env.OPENAI_SUMMARY_TRUNCATION || 'auto';
  const requestedMaxOutputTokens =
    Number(options.maxOutputTokens) ||
    Number(process.env.OPENAI_SUMMARY_MAX_OUTPUT_TOKENS) ||
    DEFAULT_SUMMARY_MAX_OUTPUT_TOKENS;
  const approxTranscriptTokens = approximateTokenCount(transcription);
  const scaledBudget = Math.max(requestedMaxOutputTokens, Math.ceil(approxTranscriptTokens * 0.15));
  const maxOutputTokens = Math.min(SUMMARY_MAX_OUTPUT_TOKENS_CAP, scaledBudget);

  try {
    const client = new OpenAI({ apiKey });
    logger.debug('[summarization] sending transcription to OpenAI for summarization...');

    const requestPayload = {
      model,
      input: [
        {
          role: 'system',
          content:
            'You are a call analysis assistant. Summarize phone call transcripts concisely. Focus on key points, customer needs, actions taken, and outcomes. Keep summaries brief (2-4 sentences) unless the call is particularly complex.',
        },
        {
          role: 'user',
          content: `Please provide a concise summary of this phone call transcript:\n\n${transcription}`,
        },
      ],
      text: { format: { type: 'text' }, verbosity: textVerbosity },
      max_output_tokens: maxOutputTokens,
      truncation: truncationMode,
    };

    if (reasoningEffort) {
      requestPayload.reasoning = { effort: reasoningEffort };
    }

    const response = await client.responses.create(requestPayload);

    if (response?.status === 'incomplete') {
      const reason = response?.incomplete_details?.reason || 'unknown';
      logger.warn('[summarization] OpenAI returned incomplete response', {
        model,
        reason,
        responseId: response?.id,
        maxOutputTokens,
      });
      throw new SummarizationError(`OpenAI summarization incomplete (${reason})`, 422, {
        reason,
        responseId: response?.id,
        maxOutputTokens,
      });
    }

    const summaryText =
      response?.output_text ||
      (Array.isArray(response?.output)
        ? response.output
            .map((item) => extractOutputText(item))
            .join(' ')
            .trim()
        : extractOutputText(response));

    if (summaryText && summaryText.trim()) {
      return summaryText.trim();
    }

    logger.warn('[summarization] unexpected response format from OpenAI', {
      model,
      responseSnippet:
        typeof response === 'string' ? response?.slice(0, 1200) : JSON.stringify(response)?.slice(0, 1200),
    });
    return 'Summary unavailable (model output format unexpected)';
  } catch (err) {
    if (err instanceof SummarizationError) throw err;
    const status =
      err?.status || err?.statusCode || err?.response?.status || err?.response?.statusCode || 500;
    const details = err?.details || err?.response?.data || err?.response?.statusText || err?.message;
    options.logger?.error?.('[summarization] OpenAI API error', { status, details });
    throw new SummarizationError(err?.message || 'Summarization failed', status, details);
  }
}

function isRetryableError(err) {
  // Retry on network errors, rate limits (429), and server errors (5xx)
  // Don't retry on client errors (4xx) except rate limits
  if (!err.status) return true; // Network/timeout errors
  if (err.status === 429) return true; // Rate limit
  if (err.status === 422 && err.details?.reason === 'max_output_tokens') return true;
  if (err.status >= 500) return true; // Server errors
  return false;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function summarizeCallWithRetry(transcription, options = {}) {
  const logger = options.logger || console;
  const recordingId = options.recordingId || 'unknown';
  const maxRetries = Number(options.maxRetries) || Number(process.env.SUMMARIZATION_MAX_RETRIES) || 3;
  const baseDelayMs = Number(options.retryDelayMs) || Number(process.env.SUMMARIZATION_RETRY_DELAY_MS) || 2000;

  if (!transcription || !transcription.trim()) {
    logger.warn(`[summarization] skipping summary for ${recordingId} - no transcription available`);
    return '';
  }

  let lastError;
  let summarizationOptions = { ...options };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt === 0) {
        logger.info(`[summarization] summarizing call ${recordingId} via OpenAI...`);
      } else {
        logger.info(`[summarization] retrying summarization for recording ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1})...`);
      }
      
      const summary = await summarizeWithOpenAI(transcription, summarizationOptions);
      
      logger.info(`[summarization] ✓ summary complete for recording ${recordingId} (${summary.length} chars)`);
      return summary;
    } catch (err) {
      lastError = err;
      
      // Don't retry if it's not a retryable error
      if (!isRetryableError(err)) {
        logger.error(`[summarization] ✗ failed for recording ${recordingId} (non-retryable error)`, {
          error: err.message,
          status: err.status,
        });
        throw err;
      }

      if (err?.details?.reason === 'max_output_tokens') {
        const currentBudget =
          Number(summarizationOptions.maxOutputTokens) ||
          Number(process.env.OPENAI_SUMMARY_MAX_OUTPUT_TOKENS) ||
          DEFAULT_SUMMARY_MAX_OUTPUT_TOKENS;
        const bumpedBudget = Math.min(SUMMARY_MAX_OUTPUT_TOKENS_CAP, Math.ceil(currentBudget * 1.5));
        if (bumpedBudget > currentBudget) {
          summarizationOptions = { ...summarizationOptions, maxOutputTokens: bumpedBudget };
          logger.warn(`[summarization] increasing max_output_tokens to ${bumpedBudget} after truncation`, {
            recordingId,
          });
        }
      }

      // Don't retry on last attempt
      if (attempt >= maxRetries) {
        logger.error(`[summarization] ✗ failed for recording ${recordingId} after ${maxRetries + 1} attempts`, {
          error: err.message,
          status: err.status,
        });
        throw err;
      }

      // Calculate exponential backoff delay
      const delayMs = baseDelayMs * Math.pow(2, attempt);
      logger.warn(`[summarization] summarization failed for recording ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`, {
        error: err.message,
        status: err.status,
      });
      
      await sleep(delayMs);
    }
  }

  // Should never reach here, but just in case
  throw lastError || new SummarizationError('Summarization failed after retries', 500);
}

async function summarizeCall(transcription, options = {}) {
  // Use retry logic by default
  return summarizeCallWithRetry(transcription, options);
}

module.exports = {
  summarizeCall,
  SummarizationError,
};
