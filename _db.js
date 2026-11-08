const { neon } = require('@neondatabase/serverless');

let sqlClient = null;
let tablesEnsured = false;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured. Add a Neon/Postgres DATABASE_URL in Vercel project settings.');
  }
  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient;
}

async function ensureTables(sql) {
  if (tablesEnsured) return;
  await sql`CREATE TABLE IF NOT EXISTS rsvps (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    attending BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS wishes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS guests INTEGER NOT NULL DEFAULT 1`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS attending BOOLEAN NOT NULL DEFAULT TRUE`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
  await sql`ALTER TABLE wishes ADD COLUMN IF NOT EXISTS message TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE wishes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
  tablesEnsured = true;
}

function clean(value, max = 300) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
}

module.exports = { getDb, ensureTables, clean };
