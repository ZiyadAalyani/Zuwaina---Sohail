const { getDb, ensureTables } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      ok: false,
      database: 'not configured',
      error: 'DATABASE_URL is missing from Vercel environment variables. Please add your Neon connection string.'
    });
  }

  try {
    const sql = getDb();
    await sql`SELECT 1`;
    await ensureTables(sql);
    return res.status(200).json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      ok: false,
      database: 'connection failed',
      error: error && error.message ? error.message : 'The database connection failed. Check the DATABASE_URL value in Vercel.'
    });
  }
};
