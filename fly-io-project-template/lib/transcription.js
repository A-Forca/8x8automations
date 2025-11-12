const OpenAI = require('openai');
const { File } = require('formdata-node');

class TranscriptionError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'TranscriptionError';
    this.status = status;
    this.details = details;
  }
}

async function downloadAudioFile(audioUrl) {
  try {
    const resp = await fetch(audioUrl);
    if (!resp.ok) {
      throw new TranscriptionError('Failed to download audio file', resp.status, await resp.text().catch(() => ''));
    }
    const arrayBuffer = await resp.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    if (err instanceof TranscriptionError) throw err;
    throw new TranscriptionError('Error downloading audio', 0, err.message);
  }
}

async function transcribeWithOpenAI(audioBuffer, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new TranscriptionError('OPENAI_API_KEY not configured', 401);
  }

  const model = options.model || 'whisper-1';
  const logger = options.logger || console;
  const useTranslation = options.useTranslation || false;

  try {
    const openai = new OpenAI({ apiKey });

    logger.debug(`[transcription] sending audio to OpenAI Whisper (${useTranslation ? 'translations' : 'transcriptions'})...`);

    // Use File from formdata-node (used by OpenAI SDK internally)
    const audioFile = new File([audioBuffer], 'recording.mp3', { type: 'audio/mpeg' });

    let response;
    if (useTranslation) {
      response = await openai.audio.translations.create({
        file: audioFile,
        model,
        response_format: options.response_format || 'text',
        temperature: options.temperature,
        prompt: options.prompt,
      });
    } else {
      response = await openai.audio.transcriptions.create({
        file: audioFile,
        model,
        response_format: options.response_format || 'text',
        temperature: options.temperature,
        prompt: options.prompt,
      });
    }

    // Response is already text if response_format is 'text', otherwise it's an object
    if (typeof response === 'string') {
      return response.trim();
    }
    return response.text?.trim() || JSON.stringify(response);
  } catch (err) {
    logger.error(`[transcription] OpenAI API error: ${err.message}`);
    if (err.status) {
      throw new TranscriptionError(`OpenAI ${useTranslation ? 'translations' : 'transcriptions'} failed`, err.status, err.message);
    }
    throw new TranscriptionError('Transcription failed', 500, err.message);
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

async function transcribeRecordingWithRetry(audioUrl, options = {}) {
  const logger = options.logger || console;
  const recordingId = options.recordingId || 'unknown';
  const maxRetries = Number(options.maxRetries) || Number(process.env.TRANSCRIPTION_MAX_RETRIES) || 3;
  const baseDelayMs = Number(options.retryDelayMs) || Number(process.env.TRANSCRIPTION_RETRY_DELAY_MS) || 2000;

  let lastError;
  let audioBuffer = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Download audio on first attempt or if we need to retry
      if (!audioBuffer) {
        logger.info(`[transcription] downloading audio for recording ${recordingId}...`);
        audioBuffer = await downloadAudioFile(audioUrl);
        logger.info(`[transcription] downloaded ${audioBuffer.length} bytes, sending to OpenAI Whisper...`);
      } else {
        logger.info(`[transcription] retrying transcription for recording ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1})...`);
      }

      // Use transcriptions endpoint (preserves original language)
      // Set useTranslation to true if you want English translations instead
      const useTranslation = String(process.env.OPENAI_USE_TRANSLATIONS || 'false').toLowerCase() === 'true';
      const transcription = await transcribeWithOpenAI(audioBuffer, {
        ...options,
        useTranslation,
      });
      
      logger.info(`[transcription] ✓ ${useTranslation ? 'translation' : 'transcription'} complete for recording ${recordingId} (${transcription.length} chars)`);
      return transcription;
    } catch (err) {
      lastError = err;
      
      // Don't retry if it's not a retryable error
      if (!isRetryableError(err)) {
        logger.error(`[transcription] ✗ failed for recording ${recordingId} (non-retryable error)`, {
          error: err.message,
          status: err.status,
        });
        throw err;
      }

      // Don't retry on last attempt
      if (attempt >= maxRetries) {
        logger.error(`[transcription] ✗ failed for recording ${recordingId} after ${maxRetries + 1} attempts`, {
          error: err.message,
          status: err.status,
        });
        throw err;
      }

      // Calculate exponential backoff delay
      const delayMs = baseDelayMs * Math.pow(2, attempt);
      logger.warn(`[transcription] transcription failed for recording ${recordingId} (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`, {
        error: err.message,
        status: err.status,
      });
      
      await sleep(delayMs);
    }
  }

  // Should never reach here, but just in case
  throw lastError || new TranscriptionError('Transcription failed after retries', 500);
}

async function transcribeRecording(audioUrl, options = {}) {
  // Use retry logic by default
  return transcribeRecordingWithRetry(audioUrl, options);
}

module.exports = {
  transcribeRecording,
  TranscriptionError,
};
