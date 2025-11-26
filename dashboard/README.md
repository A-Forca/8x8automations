# Agent Insights Dashboard

Lightweight Vite/React dashboard for visualizing agent performance on top of the new Fly.io Postgres API.

## Getting started

1. Install dependencies:

   ```bash
   cd dashboard
   npm install
   ```

2. Create a `.env` file (optional) with the API base URL and shared secret:

   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SHARED_SECRET=super-secret-token
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   The app expects the backend Express server to be running and serving the new `/agents`, `/agents/:id/metrics`, and `/agents/:id/insights` routes.

## Features

- Agent grid with profile photos and headline KPIs.
- Detail panel with:
  - Line charts for daily call volume and QA scores.
  - Category breakdown chart (greet/emp/listen/etc.).
  - Rolling averages for 30d/7d/1d.
  - Insights panel that surfaces strengths, weaknesses, and weekly action items.
- Range toggles (7/30/60 days) that re-query the backend via the typed API client.

The dashboard uses React Query for caching, Recharts for visualization, and environment-based configuration for the shared secret header. Build with `npm run build` before deploying behind Fly or another static host.

