require('dotenv').config();
const { listExistingRows } = require('../lib/googleSheets');
const { transcribeRecording } = require('../lib/transcription');

async function testTranscription() {
  try {
    console.log('Fetching existing rows from Google Sheet...');
    const rows = await listExistingRows();
    
    if (rows.length < 2) {
      console.error('No data rows found. Need at least header + 1 data row.');
      process.exit(1);
    }

    // Skip header row, get first data row
    const firstDataRow = rows[1];
    console.log('\nFirst data row:', firstDataRow);

    // Column C (index 2) should be the recording URL
    const recordingUrl = firstDataRow?.[2];
    if (!recordingUrl) {
      console.error('No recording URL found in column C');
      process.exit(1);
    }

    console.log(`\nTesting transcription for recording URL: ${recordingUrl}`);
    console.log('Recording ID:', firstDataRow?.[5] || 'unknown');
    
    const transcription = await transcribeRecording(recordingUrl, {
      logger: console,
      recordingId: firstDataRow?.[5] || 'test',
    });

    console.log('\n✓ Transcription successful!');
    console.log('\nTranscription:');
    console.log('─'.repeat(80));
    console.log(transcription);
    console.log('─'.repeat(80));
    console.log(`\nLength: ${transcription.length} characters`);
    
  } catch (err) {
    console.error('\n✗ Transcription failed:', err.message);
    if (err.status) {
      console.error(`Status: ${err.status}`);
    }
    if (err.details) {
      console.error('Details:', err.details);
    }
    process.exit(1);
  }
}

testTranscription();

