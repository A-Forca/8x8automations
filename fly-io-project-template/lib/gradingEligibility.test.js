const assert = require('assert');
const { evaluateCallEligibility, detectVoicemail, countWords } = require('./gradingEligibility');

function testCountWords() {
  assert.strictEqual(countWords(''), 0);
  assert.strictEqual(countWords('hello world'), 2);
  assert.strictEqual(countWords('  multiple   spaces here '), 3);
}

function testVoicemailDetection() {
  const voicemail = detectVoicemail('Please leave your message for extension 5168.');
  assert.ok(voicemail.matched, 'should flag voicemail');
  assert.ok(voicemail.phrase);

  const normal = detectVoicemail('Thank you for calling, how can I help?');
  assert.ok(!normal.matched, 'should not flag conversational opening');
}

function testEligibility() {
  const convo = evaluateCallEligibility({
    transcription:
      'Agent: Hi thanks for calling today, how can I support you? Customer: I need help resetting my desk phone PIN so I can check voicemail.',
    durationSeconds: 180,
  });
  assert.ok(convo.shouldGrade, 'full conversation should grade');

  const shortDuration = evaluateCallEligibility({
    transcription: 'Hello? Hello?',
    durationSeconds: 2,
  });
  assert.ok(!shortDuration.shouldGrade, 'short duration should skip');
  assert.ok(shortDuration.reasons.includes('short-duration'));

  const voicemail = evaluateCallEligibility({
    transcription: 'Please leave your message for 5168.',
    durationSeconds: 5,
  });
  assert.ok(!voicemail.shouldGrade, 'voicemail should skip');
  assert.ok(voicemail.reasons.includes('voicemail-detected'));
}

function run() {
  testCountWords();
  testVoicemailDetection();
  testEligibility();
  console.log('gradingEligibility tests passed');
}

if (require.main === module) {
  run();
}

module.exports = {
  run,
};

