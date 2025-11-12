const XAI_API_BASE = 'https://api.x.ai/v1';

class SummarizationError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'SummarizationError';
    this.status = status;
    this.details = details;
  }
}

async function fetchJson(url, { label, expectedStatus = 200, ...options }) {
  const resp = await fetch(url, options);
  if (resp.status === expectedStatus) {
    if (expectedStatus === 204) return null;
    return resp.json();
  }
  const text = await resp.text().catch(() => '');
  throw new SummarizationError(`${label} failed`, resp.status, text);
}

async function summarizeWithXAI(transcription, options = {}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new SummarizationError('XAI_API_KEY not configured', 401);
  }

  const model = options.model || process.env.XAI_SUMMARY_MODEL || 'grok-2-vision-1212';
  const logger = options.logger || console;

  if (!transcription || !transcription.trim()) {
    throw new SummarizationError('Empty transcription provided', 400);
  }

  try {
    const url = `${XAI_API_BASE}/chat/completions`;
    
    const requestBody = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a call analysis assistant. Summarize phone call transcripts concisely. Focus on key points, customer needs, actions taken, and outcomes. Keep summaries brief (2-4 sentences) unless the call is particularly complex.',
        },
        {
          role: 'user',
          content: `Please provide a concise summary of this phone call transcript:\n\n${transcription}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    };

    logger.debug('[summarization] sending transcription to xAI for summarization...');
    
    const response = await fetchJson(url, {
      label: 'xAI summarization',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Extract summary from response
    if (response?.choices?.[0]?.message?.content) {
      return response.choices[0].message.content.trim();
    }

    throw new SummarizationError('Unexpected response format from xAI', 500, response);
  } catch (err) {
    if (err instanceof SummarizationError) throw err;
    logger.error(`[summarization] xAI API error: ${err.message}`);
    throw new SummarizationError('Summarization failed', err.status || 500, err.message);
  }
}

function isRetryableError(err) {
  // Retry on network errors, rate limits (429), and server errors (5xx)
  // Don't retry on client errors (4xx) except rate limits
  if (!err.status) return true; // Network/timeout errors
  if (err.status === 429) return true; // Rate limit
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

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt === 0) {
        logger.info(`[summarization] summarizing call ${recordingId} via xAI...`);
      } else {
        logger.info(`[summarization] retrying summarization for recording ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1})...`);
      }
      
      const summary = await summarizeWithXAI(transcription, options);
      
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

