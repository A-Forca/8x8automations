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
    valueRange: `${sheetName}!A:F`,
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

module.exports = {
  getSheetConfig,
  listExistingRows,
  appendRows,
};
