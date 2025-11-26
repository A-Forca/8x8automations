#!/usr/bin/env node
require('dotenv').config();

const { generateInsightsForAllAgents } = require('../lib/insights');

(async () => {
  try {
    const windowDays = Number(process.env.INSIGHTS_WINDOW_DAYS) || 7;
    console.log(`[insights] generating summaries for all agents (window=${windowDays}d)...`);
    const results = await generateInsightsForAllAgents({ windowDays, logger: console });
    console.log(`[insights] complete. generated=${results.length}`);
    process.exit(0);
  } catch (err) {
    console.error('[insights] failed', err);
    process.exit(1);
  }
})();

