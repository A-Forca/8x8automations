/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { pool } = require('./client');

const migrationsDir = path.join(__dirname, 'migrations');

function loadMigrations() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.js'))
    .sort()
    .map((file) => {
      const migration = require(path.join(migrationsDir, file)); // eslint-disable-line global-require
      if (!migration?.id || !migration?.up) {
        throw new Error(`Migration ${file} must export { id, up }`);
      }
      return migration;
    });
}

async function ensureSchemaMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function hasRunMigration(client, id) {
  const { rowCount } = await client.query('SELECT 1 FROM schema_migrations WHERE id = $1', [id]);
  return rowCount > 0;
}

async function recordMigration(client, id) {
  await client.query('INSERT INTO schema_migrations (id) VALUES ($1) ON CONFLICT DO NOTHING', [id]);
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('[db] DATABASE_URL is required to run migrations.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    await ensureSchemaMigrationsTable(client);
    const migrations = loadMigrations();
    for (const migration of migrations) {
      const alreadyRan = await hasRunMigration(client, migration.id);
      if (alreadyRan) {
        console.log(`[db] Skipping migration ${migration.id} (already applied).`);
        continue;
      }

      console.log(`[db] Applying migration ${migration.id}...`);
      await client.query('BEGIN');
      try {
        await client.query(migration.up);
        await recordMigration(client, migration.id);
        await client.query('COMMIT');
        console.log(`[db] Migration ${migration.id} applied.`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    console.log('[db] All migrations applied.');
  } finally {
    client.release();
    if (pool) {
      await pool.end();
    }
  }
}

run().catch((error) => {
  console.error('[db] Migration failed:', error);
  process.exitCode = 1;
});

