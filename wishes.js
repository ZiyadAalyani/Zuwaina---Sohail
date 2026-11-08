const { getDb, ensureTables, clean } = require('./_db');

function parseBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = {};
    }
  }
  return (typeof body === 'object' && body) ? body : {};
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!process.env.DATABASE_URL) {
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(500).json({
      error: 'DATABASE_URL is not configured in Vercel. Please add your Neon connection string in project settings.'
    });
  }

  try {
    const sql = getDb();
    await ensureTables(sql);
    if (req.method === 'POST') {
      const body = parseBody(req);
      const name = clean(body.name, 60);
      const message = clean(body.message, 300);
      if (!name || !message) return res.status(400).json({ error: 'Add your name and a message.' });
      await sql`INSERT INTO wishes (name, message) VALUES (${name}, ${message})`;
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'GET') {
      const rows = await sql`SELECT name, message, created_at AS at FROM wishes ORDER BY id DESC LIMIT 50`;
      return res.status(200).json(rows);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('Wishes API failed:', e);
    return res.status(500).json({
      error: 'Unable to process wishes: ' + (e && e.message ? e.message : 'Database error')
    });
  }
};
