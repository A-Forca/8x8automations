require('dotenv').config();
const { listExistingRows, updateCells } = require('../lib/googleSheets');
const { summarizeCall } = require('../lib/summarization');

async function backfillSummaries() {
  try {
    console.log('Fetching existing rows from Google Sheet...');
    const rows = await listExistingRows();
    
    if (rows.length < 2) {
      console.error('No data rows found. Need at least header + 1 data row.');
      process.exit(1);
    }

    // Get last N rows (skip header row 0)
    const numRows = Number(process.argv[2]) || Number(process.env.BACKFILL_ROWS) || 5;
    const startIndex = Math.max(1, rows.length - numRows);
    const rowsToProcess = rows.slice(startIndex);
    
    console.log(`\nProcessing last ${rowsToProcess.length} rows (starting from row ${startIndex + 1})...\n`);

    const updates = [];
    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rowsToProcess.length; i++) {
      const row = rowsToProcess[i];
      const rowIndex = startIndex + i;
      const transcription = row?.[6]; // Column G (index 6)
      const existingSummary = row?.[7]; // Column H (index 7)
      const recordingId = row?.[5] || `row-${rowIndex}`;

      // Skip if no transcription
      if (!transcription || !transcription.trim()) {
        console.log(`[${rowIndex + 1}] Skipping - no transcription`);
        skipped += 1;
        continue;
      }

      // Skip if summary already exists
      if (existingSummary && existingSummary.trim()) {
        console.log(`[${rowIndex + 1}] Skipping - summary already exists`);
        skipped += 1;
        continue;
      }

      try {
        console.log(`[${rowIndex + 1}] Summarizing recording ${recordingId}...`);
        console.log(`    Transcription: ${transcription.substring(0, 100)}...`);
        
        const summary = await summarizeCall(transcription, {
          logger: console,
          recordingId,
        });

        console.log(`    ✓ Summary: ${summary.substring(0, 100)}...`);
        
        updates.push({
          rowIndex,
          columnIndex: 7, // Column H
          value: summary,
        });
        
        processed += 1;
      } catch (err) {
        console.error(`[${rowIndex + 1}] ✗ Failed: ${err.message}`);
        failed += 1;
      }
    }

    if (updates.length > 0) {
      console.log(`\nUpdating ${updates.length} rows in Google Sheet...`);
      await updateCells(updates);
      console.log(`✓ Successfully updated ${updates.length} rows`);
    } else {
      console.log('\nNo rows to update');
    }

    console.log(`\nSummary: processed=${processed} skipped=${skipped} failed=${failed}`);
    
  } catch (err) {
    console.error('\n✗ Backfill failed:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

backfillSummaries();

