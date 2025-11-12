require('dotenv').config();
const { listExistingRows, updateCells } = require('../lib/googleSheets');
const { transcribeRecording } = require('../lib/transcription');
const { summarizeCall } = require('../lib/summarization');

async function retryFailedTranscriptions() {
  try {
    console.log('Fetching existing rows from Google Sheet...');
    const rows = await listExistingRows();
    
    if (rows.length < 2) {
      console.error('No data rows found. Need at least header + 1 data row.');
      process.exit(1);
    }

    // Process all rows (skip header row 0)
    const rowsToProcess = rows.slice(1);
    
    console.log(`\nScanning ${rowsToProcess.length} rows for failed transcriptions/summaries...\n`);

    const updates = [];
    let transcriptionsRetried = 0;
    let summariesRetried = 0;
    let transcriptionsSucceeded = 0;
    let summariesSucceeded = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rowsToProcess.length; i++) {
      const row = rowsToProcess[i];
      const rowIndex = i + 1; // +1 because we skipped header
      const recordingUrl = row?.[2]; // Column C (index 2)
      const existingTranscription = row?.[6]; // Column G (index 6)
      const existingSummary = row?.[7]; // Column H (index 7)
      const recordingId = row?.[5] || `row-${rowIndex}`;
      const agentName = row?.[0] || 'unknown';

      if (!recordingUrl) {
        skipped += 1;
        continue;
      }

      // Check if we need to retry transcription
      const needsTranscription = !existingTranscription || !existingTranscription.trim();
      // Check if we need to retry summary (only if we have transcription)
      const needsSummary = !needsTranscription && (!existingSummary || !existingSummary.trim());

      if (!needsTranscription && !needsSummary) {
        skipped += 1;
        continue;
      }

      try {
        let transcription = existingTranscription;
        let summary = existingSummary;

        // Retry transcription if needed
        if (needsTranscription) {
          console.log(`[${rowIndex}] Retrying transcription for ${agentName} - ${recordingId}...`);
          transcriptionsRetried += 1;
          transcription = await transcribeRecording(recordingUrl, {
            logger: console,
            recordingId,
          });
          updates.push({
            rowIndex,
            columnIndex: 6, // Column G
            value: transcription,
          });
          transcriptionsSucceeded += 1;
          console.log(`    ✓ Transcription: ${transcription.substring(0, 100)}...`);
        }

        // Retry summary if needed (and we have transcription)
        if (needsSummary && transcription) {
          console.log(`[${rowIndex}] Retrying summary for ${agentName} - ${recordingId}...`);
          summariesRetried += 1;
          summary = await summarizeCall(transcription, {
            logger: console,
            recordingId,
          });
          updates.push({
            rowIndex,
            columnIndex: 7, // Column H
            value: summary,
          });
          summariesSucceeded += 1;
          console.log(`    ✓ Summary: ${summary.substring(0, 100)}...`);
        }
      } catch (err) {
        console.error(`[${rowIndex}] ✗ Failed: ${err.message}`);
        failed += 1;
      }
    }

    if (updates.length > 0) {
      console.log(`\nUpdating ${updates.length} cells in Google Sheet...`);
      await updateCells(updates);
      console.log(`✓ Successfully updated ${updates.length} cells`);
    } else {
      console.log('\nNo failed transcriptions/summaries found to retry');
    }

    console.log(`\nSummary:`);
    console.log(`  Transcriptions: retried=${transcriptionsRetried} succeeded=${transcriptionsSucceeded} failed=${transcriptionsRetried - transcriptionsSucceeded}`);
    console.log(`  Summaries: retried=${summariesRetried} succeeded=${summariesSucceeded} failed=${summariesRetried - summariesSucceeded}`);
    console.log(`  Skipped=${skipped} total_failed=${failed}`);
    
  } catch (err) {
    console.error('\n✗ Retry failed:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

retryFailedTranscriptions();

