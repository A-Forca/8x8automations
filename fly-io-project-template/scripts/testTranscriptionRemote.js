// Test transcription on Fly.io - gets fresh recording URL from API
const { fetchLatestRecordings, getPresignedRecordingUrl } = require('../lib/recordings');
const { transcribeRecording } = require('../lib/transcription');

async function test() {
  try {
    const clientId = process.env.EIGHT_BY_EIGHT_CLIENT_ID;
    const clientSecret = process.env.EIGHT_BY_EIGHT_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Missing 8x8 credentials');
    }

    console.log('Fetching latest recordings...');
    const result = await fetchLatestRecordings({
      clientId,
      clientSecret,
      limit: 1,
    });

    if (result.recordings.length === 0) {
      throw new Error('No recordings found');
    }

    const recording = result.recordings[0];
    console.log(`Found recording: ${recording.id}`);

    // Get presigned URL
    const presignedUrl = await getPresignedRecordingUrl({
      token: result.token,
      region: result.region,
      objectId: recording.id,
    });

    console.log(`Got presigned URL, testing transcription...`);
    console.log(`URL: ${presignedUrl.substring(0, 100)}...`);

    const transcription = await transcribeRecording(presignedUrl, {
      logger: console,
      recordingId: recording.id,
    });

    console.log('\n✓ Transcription successful!');
    console.log('\nTranscription (first 500 chars):');
    console.log('─'.repeat(80));
    console.log(transcription.substring(0, 500));
    if (transcription.length > 500) {
      console.log(`... (${transcription.length - 500} more characters)`);
    }
    console.log('─'.repeat(80));
    console.log(`\nTotal length: ${transcription.length} characters`);
    
  } catch (err) {
    console.error('\n✗ Test failed:', err.message);
    if (err.status) {
      console.error(`Status: ${err.status}`);
    }
    if (err.details) {
      console.error('Details:', typeof err.details === 'string' ? err.details.substring(0, 200) : err.details);
    }
    process.exit(1);
  }
}

test();

