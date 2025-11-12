require('dotenv').config();
const { listExistingRows, updateCells } = require('../lib/googleSheets');
const { transcribeRecording } = require('../lib/transcription');
const { summarizeCall } = require('../lib/summarization');

async function backfillTranscriptions() {
  try {
    console.log('Fetching existing rows from Google Sheet...');
    const rows = await listExistingRows();
    
    if (rows.length < 2) {
      console.error('No data rows found. Need at least header + 1 data row.');
      process.exit(1);
    }

    // Get last N rows (skip header row 0)
    const numRows = Number(process.argv[2]) || Number(process.env.BACKFILL_ROWS) || 10;
    const startIndex = Math.max(1, rows.length - numRows);
    const rowsToProcess = rows.slice(startIndex);
    
    console.log(`\nProcessing last ${rowsToProcess.length} rows (starting from row ${startIndex + 1})...\n`);

    const updates = [];
    let transcriptionsProcessed = 0;
    let summariesProcessed = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rowsToProcess.length; i++) {
      const row = rowsToProcess[i];
      const rowIndex = startIndex + i;
      const recordingUrl = row?.[2]; // Column C (index 2)
      const existingTranscription = row?.[6]; // Column G (index 6)
      const existingSummary = row?.[7]; // Column H (index 7)
      const recordingId = row?.[5] || `row-${rowIndex}`;
      const agentName = row?.[0] || 'unknown';

      if (!recordingUrl) {
        console.log(`[${rowIndex + 1}] Skipping - no recording URL`);
        skipped += 1;
        continue;
      }

      // Check if we need transcription
      const needsTranscription = !existingTranscription || !existingTranscription.trim();
      // Check if we need summary (if we have transcription, or will have it after transcribing)
      const needsSummary = (!existingSummary || !existingSummary.trim()) && (existingTranscription || needsTranscription);

      if (!needsTranscription && !needsSummary) {
        console.log(`[${rowIndex + 1}] Skipping - already has transcription and summary`);
        skipped += 1;
        continue;
      }

      try {
        let transcription = existingTranscription;
        let summary = existingSummary;

        // Transcribe if needed
        if (needsTranscription) {
          console.log(`[${rowIndex + 1}] Transcribing ${agentName} - ${recordingId}...`);
          transcription = await transcribeRecording(recordingUrl, {
            logger: console,
            recordingId,
          });
          updates.push({
            rowIndex,
            columnIndex: 6, // Column G
            value: transcription,
          });
          transcriptionsProcessed += 1;
          console.log(`    ✓ Transcription: ${transcription.substring(0, 100)}...`);
        }

        // Summarize if needed (and we have transcription)
        if (needsSummary && transcription) {
          console.log(`[${rowIndex + 1}] Summarizing ${agentName} - ${recordingId}...`);
          summary = await summarizeCall(transcription, {
            logger: console,
            recordingId,
          });
          updates.push({
            rowIndex,
            columnIndex: 7, // Column H
            value: summary,
          });
          summariesProcessed += 1;
          console.log(`    ✓ Summary: ${summary.substring(0, 100)}...`);
        }
      } catch (err) {
        console.error(`[${rowIndex + 1}] ✗ Failed: ${err.message}`);
        failed += 1;
      }
    }

    if (updates.length > 0) {
      console.log(`\nUpdating ${updates.length} cells in Google Sheet...`);
      await updateCells(updates);
      console.log(`✓ Successfully updated ${updates.length} cells`);
    } else {
      console.log('\nNo cells to update');
    }

    console.log(`\nSummary: transcriptions=${transcriptionsProcessed} summaries=${summariesProcessed} skipped=${skipped} failed=${failed}`);
    
  } catch (err) {
    console.error('\n✗ Backfill failed:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

backfillTranscriptions();

