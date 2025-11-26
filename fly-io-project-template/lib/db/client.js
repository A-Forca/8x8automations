const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    '[db] DATABASE_URL is not set. Database features will be unavailable until it is configured.'
  );
}

const pool = connectionString
  ? new Pool({
      connectionString,
      max: Number.parseInt(process.env.PG_POOL_SIZE || '10', 10),
      idleTimeoutMillis: Number.parseInt(process.env.PG_IDLE_TIMEOUT_MS || '30000', 10),
      ssl:
        process.env.PG_SSL === 'true' || /amazonaws\.com|render\.com/i.test(connectionString)
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : null;

function requirePool() {
  if (!pool) {
    throw new Error('DATABASE_URL must be configured before using the database.');
  }
  return pool;
}

async function withTransaction(callback) {
  const activePool = requirePool();
  const client = await activePool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query: async (...args) => {
    const activePool = requirePool();
    return activePool.query(...args);
  },
  withTransaction,
};

