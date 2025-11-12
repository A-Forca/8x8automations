const { google } = require('googleapis');

let cachedSheetsClient;
let cachedAuthClient;

function normalizePrivateKey(value) {
  return value ? value.replace(/\\n/g, '\n') : '';
}

async function getAuthClient() {
  if (cachedAuthClient) return cachedAuthClient;

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '');

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing Google Sheets credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  cachedAuthClient = await auth.getClient();
  return cachedAuthClient;
}

async function getSheetsClient() {
  if (cachedSheetsClient) return cachedSheetsClient;
  const authClient = await getAuthClient();
  cachedSheetsClient = google.sheets({ version: 'v4', auth: authClient });
  return cachedSheetsClient;
}

function getSheetConfig() {
  const spreadsheetId =
    process.env.GOOGLE_SHEETS_ID || '1DkX2Q6C3asl2ID8kPcRfp7gXQBPRTstTAd-778Q3bj8';
  const sheetName = process.env.GOOGLE_SHEETS_TAB || 'Sheet1';

  return {
    spreadsheetId,
    sheetName,
    valueRange: `${sheetName}!A:H`,
  };
}

async function listExistingRows() {
  const sheets = await getSheetsClient();
  const { spreadsheetId, valueRange } = getSheetConfig();
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: valueRange,
  });

  return Array.isArray(resp.data.values) ? resp.data.values : [];
}

async function appendRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const sheets = await getSheetsClient();
  const { spreadsheetId, valueRange } = getSheetConfig();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: valueRange,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: rows,
    },
  });
}

async function updateCell(rowIndex, columnIndex, value) {
  const sheets = await getSheetsClient();
  const { spreadsheetId, sheetName } = getSheetConfig();
  // Convert 0-based column index to letter (A=0, B=1, etc.)
  const columnLetter = String.fromCharCode(65 + columnIndex); // A=65
  const range = `${sheetName}!${columnLetter}${rowIndex + 1}`; // +1 because sheets are 1-indexed
  
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[value]],
    },
  });
}

async function updateCells(updates) {
  // updates is an array of {rowIndex, columnIndex, value}
  if (!Array.isArray(updates) || updates.length === 0) return;
  
  const sheets = await getSheetsClient();
  const { spreadsheetId, sheetName } = getSheetConfig();
  
  // Group updates by column for batch updates
  const data = updates.map(({ rowIndex, columnIndex, value }) => {
    const columnLetter = String.fromCharCode(65 + columnIndex);
    const range = `${sheetName}!${columnLetter}${rowIndex + 1}`;
    return {
      range,
      values: [[value]],
    };
  });
  
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data,
    },
  });
}

module.exports = {
  getSheetConfig,
  listExistingRows,
  appendRows,
  updateCell,
  updateCells,
};
