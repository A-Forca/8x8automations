# 8x8 Call Analyzer (Fly.io)

Node/Express service that mirrors `scripts/get_last_recordings.py` on Fly.io so you can pull the latest 8x8 call recordings (JSON or ZIP) behind a shared-secret. Optional Trello webhook endpoints from the original template remain available but disabled unless configured.

## Quick Start

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure environment

   - Locally (optional):
     ```bash
     cp .env.example .env
     # edit .env
     ```
   - On Fly (recommended):
     ```bash
     fly apps create 8x8-call-analyzer
     fly secrets set WEBHOOK_SECRET=xxx \
       EIGHT_BY_EIGHT_CLIENT_ID=eght_xxx \
       EIGHT_BY_EIGHT_CLIENT_SECRET=yyy
     # optional Trello secrets if you need card creation
     fly secrets set TRELLO_KEY=xxx TRELLO_TOKEN=xxx \
       TRELLO_LIST_ID=optional-list-id \
       TRELLO_BOARD="Optional Board Name" \
       TRELLO_LIST="Optional List Name"
     ```

3. (Optional) Configure Trello boards/lists

   - Edit `trello/boards.json` with your boards and lists (ids and names)

4. Run locally

   ```bash
   npm start
   # Hit http://localhost:8080/recordings/latest with header x-shared-secret: <WEBHOOK_SECRET>
   ```

5. Deploy to Fly.io
   ```bash
   fly deploy
   ```

## Endpoints

- `GET /health` — health check for Fly/monitoring
- `GET /recordings/latest` — fetches recent 8x8 call recordings (requires credentials + shared secret)
- `GET /recordings/latest/download` — fetches and streams a ZIP containing the most recent recordings
- `POST /webhook` — legacy generic webhook (still protected by shared secret)
- `POST /trello/cards` — optional Trello integration if env/config is provided
- `POST /recordings/sync` — trigger a one-off recording → Google Sheets sync

## Recording Sync → Google Sheets (Hourly + On-Demand)

By default the service keeps an in-process worker that runs once on boot and then every `RECORDING_SYNC_INTERVAL_MINUTES` (60 min default). Each run:

- Pulls the newest 8x8 call recordings (you can cap the lookback window)
- Filters so only calls handled by **Dayna Pierre** or **Kizzy Abraham** (override with `RECORDING_AGENT_FILTER`)
- Writes rows into Google Sheet columns:
  - **A** Agent Name
  - **B** Customer Phone
  - **C** Call Recording URL
  - **D** Call Time (Eastern, formatted `YYYY-MM-DD HH:MM:SS`)
  - **E** Call Duration (`HH:MM:SS`)
- Avoids duplicates by checking the Call Recording column before writing

### Required settings

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=1DkX2Q6C3asl2ID8kPcRfp7gXQBPRTstTAd-778Q3bj8   # default already matches requested sheet
```

- `GOOGLE_SHEETS_TAB` — tab name (defaults to `Sheet1`)
- `RECORDING_AGENT_FILTER` — comma-separated agent names if you want more than Dayna/Kizzy
- `RECORDING_PAGE_SIZE` / `RECORDING_MAX_PAGES` — control how many 8x8 pages to examine per run
- `RECORDING_LOOKBACK_MINUTES` — ignore recordings older than this window (defaults to 60)
- `RECORDING_SYNC_INTERVAL_MINUTES` — cadence for the background worker (defaults to 60)
- `ENABLE_RECORDING_SYNC` — set to `false` only if you *don’t* want the hourly worker
- `RECORDING_PRESIGN_TTL_SECONDS` — lifetime for the public download link (defaults to 7 days)
- `RUN_RECORDING_SYNC_ON_BOOT` + `EXIT_AFTER_RECORDING_SYNC` — use together for "job mode" (machine boots, syncs once, exits). Leave `EXIT_AFTER_RECORDING_SYNC=false` when relying on the hourly worker so the process stays alive.

> The Call Recording cell stores the stable API download URL
> (`https://api.8x8.com/storage/<region>/v3/objects/<id>/content`), which requires a valid 8x8 access token
> when you actually fetch the audio. This keeps duplicates easy to detect across sync runs.

### Run a manual sync (CLI)

After exporting the same env vars you plan to use in Fly, run:

```bash
RECORDING_LOOKBACK_MINUTES=60 \
npm run recordings:sync
```

The script loads `.env`, respects the agent filter + lookback window, and performs a single sync pass so you can confirm only recent calls are written.

### Trigger via API (on-demand)

Send a POST request (with the shared secret) to `/recordings/sync`:

```bash
curl -X POST https://<app>.fly.dev/recordings/sync \
  -H "x-shared-secret: $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"lookbackMinutes":60}'
```

This endpoint is useful if you want to kick off an extra run between the hourly intervals. If you disable the worker (set `ENABLE_RECORDING_SYNC=false`) you can still schedule this endpoint externally.

### Check next scheduled run / countdown

```bash
curl -s https://<app>.fly.dev/recordings/sync/status \
  -H "x-shared-secret: $WEBHOOK_SECRET"
```

The response includes `nextRunScheduledAt` plus `secondsUntilNextRun`, so you can see exactly when the next automatic sync will fire as well as the last run result/error.

### Job-style boot (optional)

If you prefer the old "start → sync → exit" flow, set:

```
RUN_RECORDING_SYNC_ON_BOOT=true
EXIT_AFTER_RECORDING_SYNC=true
ENABLE_RECORDING_SYNC=false
```

and trigger machines on a schedule (Fly jobs, `fly machines run`, etc.).

## Trello Integration (Optional)

This template can create cards using:

- `TRELLO_KEY` and `TRELLO_TOKEN` (required to call Trello)
- One of:
  - `TRELLO_LIST_ID` (direct list id), or
  - `TRELLO_BOARD` + `TRELLO_LIST` names/ids that are resolved via `trello/boards.json`, or
  - Provide `listId` or `board`+`list` in the request body

`trello/boards.json` example structure:

```json
{
  "boards": [
    {
      "id": "YOUR_BOARD_ID",
      "name": "Your Board Name",
      "lists": [
        { "id": "YOUR_LIST_ID", "name": "Backlog" },
        { "id": "ANOTHER_LIST_ID", "name": "In Progress" }
      ]
    }
  ]
}
```

## 8x8 Cloud Storage Helper

The `/recordings/*` endpoints are a thin HTTP wrapper over the original Python helper. Every request must send `x-shared-secret: <WEBHOOK_SECRET>` so the service stays private.

### Fetch latest recordings

```bash
curl "http://localhost:8080/recordings/latest?limit=10&objectType=callrecording" \
  -H "x-shared-secret: $WEBHOOK_SECRET"
```

### Download recordings as ZIP

```bash
curl -L "http://localhost:8080/recordings/latest/download?limit=5" \
  -H "x-shared-secret: $WEBHOOK_SECRET" \
  -o latest-recordings.zip
```

Query params:

- `limit` (default 10, max 100)
- `region` (optional — auto-discovered if omitted)
- `objectType` (default `callrecording`)
- `discoveryRegion` (default `us-east`)
- `pollInterval` / `pollTimeout` (seconds; download endpoint only)

> Always set Fly secrets (`fly secrets set ...`) so credentials never ship in the Docker image.

## Notes

- Keep `WEBHOOK_SECRET` secret; every protected endpoint requires the `x-shared-secret` header.
- Health endpoint is kept minimal; no in-memory stats by default to keep the template lean.
- The Dockerfile targets port 8080 to match Fly's default internal port.
