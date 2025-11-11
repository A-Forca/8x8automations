const TOKEN_URL = 'https://api.8x8.com/oauth/v2/token';
const STORAGE_BASE = (region) => `https://api.8x8.com/storage/${region}/v3`;
const DEFAULT_PAGE_SIZE = 100;
const DEFAULT_PRESIGN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

class EightByEightError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'EightByEightError';
    this.status = status;
    this.details = details;
  }
}

async function fetchJson(url, { label, expectedStatus = 200, ...options }) {
  const resp = await fetch(url, options);
  if (resp.status === expectedStatus) {
    if (expectedStatus === 204) return null;
    return resp.json();
  }
  const text = await resp.text().catch(() => '');
  throw new EightByEightError(`${label} failed`, resp.status, safeJsonParse(text));
}

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : undefined;
  } catch {
    return text;
  }
}

async function getAccessToken(clientId, clientSecret) {
  const params = new URLSearchParams({ grant_type: 'client_credentials' });
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  return fetchJson(TOKEN_URL, {
    label: 'OAuth token request',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: params.toString(),
  });
}

async function discoverRegion(token, discoveryRegion = 'us-east') {
  const url = `${STORAGE_BASE(discoveryRegion)}/regions`;
  const regions = await fetchJson(url, {
    label: 'Region discovery',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!Array.isArray(regions) || regions.length === 0) {
    throw new EightByEightError('Region discovery returned no regions', 500);
  }
  return regions[0];
}

async function fetchRecordings({ token, region, objectType, limit, pageKey }) {
  const params = new URLSearchParams({
    limit: String(limit),
    sortField: 'createdTime',
    sortDirection: 'DESC',
    filter: `type==${objectType}`,
  });
  if (typeof pageKey === 'number') {
    params.set('pageKey', String(pageKey));
  }
  const url = `${STORAGE_BASE(region)}/objects?${params.toString()}`;
  return fetchJson(url, {
    label: 'Fetch recordings',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
}

async function startBulkDownload({ token, region, objectIds }) {
  const url = `${STORAGE_BASE(region)}/bulk/download/start`;
  return fetchJson(url, {
    label: 'Start bulk download',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(objectIds),
  });
}

async function getBulkDownloadStatus({ token, region, zipName }) {
  const url = `${STORAGE_BASE(region)}/bulk/download/status/${zipName}`;
  return fetchJson(url, {
    label: 'Bulk download status',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
}

async function downloadZip({ token, region, zipName }) {
  const url = `${STORAGE_BASE(region)}/bulk/download/${zipName}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/zip',
    },
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new EightByEightError('Download zip failed', resp.status, safeJsonParse(text));
  }
  const arrayBuffer = await resp.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForZip({ token, region, zipName, pollIntervalMs, pollTimeoutMs }) {
  const deadline = Date.now() + pollTimeoutMs;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const status = await getBulkDownloadStatus({ token, region, zipName });
    const current = status?.status;
    if (current === 'DONE') return;
    if (current && !['NOT_STARTED', 'IN_PROGRESS'].includes(current)) {
      throw new EightByEightError(`Bulk download failed with status ${current}`, 500, status);
    }
    if (Date.now() > deadline) {
      throw new EightByEightError('Timed out waiting for bulk download to finish', 504);
    }
    await sleep(pollIntervalMs);
  }
}

async function fetchLatestRecordings({
  clientId,
  clientSecret,
  region,
  discoveryRegion = 'us-east',
  objectType = 'callrecording',
  limit = 10,
}) {
  const trimmedLimit = Number.isFinite(Number(limit)) ? Math.min(Math.max(Number(limit), 1), 100) : 10;
  const tokenResponse = await getAccessToken(clientId, clientSecret);
  const accessToken = tokenResponse.access_token;
  if (!accessToken) {
    throw new EightByEightError('OAuth response missing access_token', 500, tokenResponse);
  }

  let finalRegion = region;
  if (!finalRegion) {
    finalRegion = await discoverRegion(accessToken, discoveryRegion);
  }

  const payload = await fetchRecordings({
    token: accessToken,
    region: finalRegion,
    objectType,
    limit: trimmedLimit,
  });
  const recordings = Array.isArray(payload?.content) ? payload.content : [];
  return {
    recordings,
    region: finalRegion,
    raw: payload,
    token: accessToken,
  };
}

async function fetchAllRecordings({
  clientId,
  clientSecret,
  region,
  discoveryRegion = 'us-east',
  objectType = 'callrecording',
  pageSize = DEFAULT_PAGE_SIZE,
  maxPages = 25,
}) {
  const trimmedPageSize = Number.isFinite(Number(pageSize))
    ? Math.min(Math.max(Number(pageSize), 1), DEFAULT_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;
  const tokenResponse = await getAccessToken(clientId, clientSecret);
  const accessToken = tokenResponse.access_token;
  if (!accessToken) {
    throw new EightByEightError('OAuth response missing access_token', 500, tokenResponse);
  }

  let finalRegion = region;
  if (!finalRegion) {
    finalRegion = await discoverRegion(accessToken, discoveryRegion);
  }

  let nextPageKey = 0;
  let requestedPages = 0;
  let hasMore = true;
  const all = [];

  while (hasMore && requestedPages < maxPages) {
    requestedPages += 1;
    const payload = await fetchRecordings({
      token: accessToken,
      region: finalRegion,
      objectType,
      limit: trimmedPageSize,
      pageKey: nextPageKey,
    });
    const recordings = Array.isArray(payload?.content) ? payload.content : [];
    all.push(...recordings);

    const lastPageFlag = payload?.lastPage;
    if (lastPageFlag === true) {
      hasMore = false;
    } else {
      const serverPageKey = Number.isFinite(Number(payload?.pageKey))
        ? Number(payload.pageKey)
        : nextPageKey;
      nextPageKey = serverPageKey + 1;
      if (!Number.isFinite(nextPageKey)) {
        hasMore = false;
      }
    }
  }

  return {
    recordings: all,
    region: finalRegion,
    token: accessToken,
  };
}

function buildRecordingDownloadUrl({ region, objectId, presign = false }) {
  const base = `${STORAGE_BASE(region)}/objects/${objectId}/content`;
  if (presign) return `${base}?presignUrl=true`;
  return base;
}

async function getPresignedRecordingUrl({ token, region, objectId, ttlSeconds = DEFAULT_PRESIGN_TTL_SECONDS }) {
  if (!token) throw new EightByEightError('Missing token for presign request', 401);
  const params = new URLSearchParams({ presignUrl: 'true' });
  if (ttlSeconds) params.set('presignTtlSeconds', String(Math.max(60, ttlSeconds)));
  const url = `${STORAGE_BASE(region)}/objects/${objectId}/content?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new EightByEightError('Presign URL request failed', resp.status, safeJsonParse(text));
  }
  const raw = await resp.text();
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new EightByEightError('Presign response empty', 500);
  }
  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('json')) {
    const data = safeJsonParse(trimmed);
    if (typeof data === 'string') return data;
    if (data && typeof data.url === 'string') return data.url;
    if (data && typeof data.presignedUrl === 'string') return data.presignedUrl;
    throw new EightByEightError('Presign response missing url', 500, data);
  }
  return trimmed;
}

async function downloadRecordingsZip({
  token,
  region,
  objectIds,
  pollIntervalMs = 5_000,
  pollTimeoutMs = 180_000,
}) {
  if (!Array.isArray(objectIds) || objectIds.length === 0) {
    throw new EightByEightError('No recording IDs supplied for download', 400);
  }
  const startResp = await startBulkDownload({ token, region, objectIds });
  const zipName = startResp?.zipName;
  if (!zipName) {
    throw new EightByEightError('Bulk download did not return zipName', 500, startResp);
  }
  await waitForZip({ token, region, zipName, pollIntervalMs, pollTimeoutMs });
  const buffer = await downloadZip({ token, region, zipName });
  return { zipName, buffer };
}

module.exports = {
  EightByEightError,
  fetchLatestRecordings,
  fetchAllRecordings,
  downloadRecordingsZip,
  STORAGE_BASE,
  buildRecordingDownloadUrl,
  getPresignedRecordingUrl,
};
