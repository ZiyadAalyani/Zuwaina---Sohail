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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      error: 'DATABASE_URL is not configured in Vercel. Please add your Neon connection string in project settings.'
    });
  }

  try {
    const sql = getDb();
    await ensureTables(sql);
    const body = parseBody(req);
    const name = clean(body.name, 80);
    if (!name) return res.status(400).json({ error: 'Please enter your name.' });
    const guests = Math.min(Math.max(Number(body.guests) || 1, 1), 10);
    const attending = body.attending !== 'no';
    await sql`INSERT INTO rsvps (name, guests, attending) VALUES (${name}, ${guests}, ${attending})`;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('RSVP API failed:', e && e.message ? e.message : e);
    return res.status(500).json({
      error: 'Unable to save RSVP: ' + (e && e.message ? e.message : 'Database error')
    });
  }
};
