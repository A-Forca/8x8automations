const DEFAULT_MIN_DURATION_SECONDS = Number(process.env.GRADING_MIN_DURATION_SECONDS) || 8;
const DEFAULT_MIN_TRANSCRIPT_WORDS = Number(process.env.GRADING_MIN_TRANSCRIPT_WORDS) || 12;

const DEFAULT_VOICEMAIL_PHRASES = [
  'please leave your message',
  'please leave a message',
  'leave your message after the tone',
  'leave a message after the beep',
  'not available to take your call',
  'voicemail box',
  'voice mailbox of',
  'has not set up voicemail',
  'record your message',
];

let cachedPatterns;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getVoicemailPatterns() {
  if (cachedPatterns) return cachedPatterns;

  const envPhrases = (process.env.GRADING_VOICEMAIL_PHRASES || '')
    .split(',')
    .map((phrase) => phrase.trim())
    .filter(Boolean);

  const phrases = envPhrases.length > 0 ? envPhrases : DEFAULT_VOICEMAIL_PHRASES;
  cachedPatterns = phrases.map((phrase) => ({
    phrase,
    regex: new RegExp(escapeRegExp(phrase), 'i'),
  }));

  return cachedPatterns;
}

function countWords(text) {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function detectVoicemail(transcription) {
  if (!transcription || !transcription.trim()) {
    return { matched: false };
  }

  const normalized = transcription.trim();
  for (const { phrase, regex } of getVoicemailPatterns()) {
    if (regex.test(normalized)) {
      return { matched: true, phrase };
    }
  }

  return { matched: false };
}

function evaluateCallEligibility(input = {}) {
  const {
    transcription = '',
    durationSeconds,
    metadata = {},
    minDurationSeconds = DEFAULT_MIN_DURATION_SECONDS,
    minTranscriptWords = DEFAULT_MIN_TRANSCRIPT_WORDS,
  } = input;

  const normalizedTranscript = transcription?.trim() || '';
  const transcriptWords = countWords(normalizedTranscript);
  const duration = Number.isFinite(durationSeconds) ? durationSeconds : null;
  const voicemail = detectVoicemail(normalizedTranscript);

  const reasons = [];

  if (!normalizedTranscript) {
    reasons.push('empty-transcript');
  }

  if (duration !== null && duration < minDurationSeconds) {
    reasons.push('short-duration');
  }

  if (transcriptWords > 0 && transcriptWords < minTranscriptWords) {
    reasons.push('short-transcript');
  }

  if (voicemail.matched) {
    reasons.push('voicemail-detected');
  }

  const shouldGrade = reasons.length === 0;

  const signals = {
    durationSeconds: duration,
    transcriptWords,
    voicemailMatched: voicemail.matched,
    voicemailPhrase: voicemail.phrase || null,
    hasTranscript: Boolean(normalizedTranscript),
    metadataSummary: {
      hasRecording: Boolean(metadata?.recording),
      disposition: metadata?.recording?.disposition || metadata?.disposition || null,
    },
  };

  return {
    shouldGrade,
    reason: shouldGrade ? null : reasons.join(','),
    reasons,
    signals,
  };
}

module.exports = {
  evaluateCallEligibility,
  detectVoicemail,
  countWords,
  getVoicemailPatterns,
  DEFAULT_MIN_DURATION_SECONDS,
  DEFAULT_MIN_TRANSCRIPT_WORDS,
};

