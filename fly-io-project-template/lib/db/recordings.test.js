const assert = require('assert');
const { buildBackfillWhereClause } = require('./recordings');

function testEmpty() {
  const result = buildBackfillWhereClause({});
  assert.strictEqual(result.clause, '', 'no filters should produce empty clause');
  assert.deepStrictEqual(result.params, [], 'no filters -> empty params');
}

function testOnlyMissing() {
  const result = buildBackfillWhereClause({ onlyMissing: true });
  assert.ok(result.clause.includes('c.transcription'), 'onlyMissing clause should reference transcription');
  assert.ok(result.clause.includes('c.qa_payload'), 'onlyMissing clause should reference qa_payload');
  assert.strictEqual(result.params.length, 0, 'onlyMissing does not add params');
}

function testAgentAndId() {
  const result = buildBackfillWhereClause({ onlyAgent: 'Dayna Pierre', callId: 'abc123' });
  assert.ok(result.clause.startsWith('WHERE'), 'combined clause should start with WHERE');
  assert.ok(result.clause.includes('c.call_id'), 'clause should include call_id filter');
  assert.ok(result.clause.includes('LOWER(a.full_name)'), 'clause should include agent filter');
  assert.deepStrictEqual(result.params, ['abc123', 'dayna pierre']);
}

function run() {
  testEmpty();
  testOnlyMissing();
  testAgentAndId();
  console.log('recordings backfill clause tests passed');
}

if (require.main === module) {
  run();
}

module.exports = { run };

