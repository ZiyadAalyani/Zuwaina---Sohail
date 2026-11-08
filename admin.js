const crypto = require('crypto');
const { getDb, ensureTables, clean } = require('./_db');

function validKey(value) {
  const expected = process.env.ADMIN_KEY || 'change-me';
  const a = Buffer.from(String(value || ''));
  const b = Buffer.from(String(expected));
  return expected && a.length === b.length && crypto.timingSafeEqual(a, b);
}

function keyFrom(req, body = {}) {
  return req.headers['x-admin-key'] || body.key || '';
}

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const body = parseBody(req);

    // Login handshake
    if (req.method === 'POST' && body.action === 'login') {
      if (!validKey(body.key)) return res.status(401).json({ ok: false, error: 'Invalid admin key.' });
      return res.status(200).json({ ok: true });
    }

    const key = keyFrom(req, body);
    if (!validKey(key)) return res.status(401).json({ ok: false, error: 'Unauthorized.' });

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        ok: false,
        error: 'DATABASE_URL is not configured in Vercel settings. Please add your Neon connection string.'
      });
    }

    const sql = getDb();
    await ensureTables(sql);

    if (req.method === 'POST' && body.action === 'delete-rsvp') {
      const id = Number(body.id);
      if (!Number.isInteger(id)) return res.status(400).json({ ok: false, error: 'Invalid RSVP id.' });
      await sql`DELETE FROM rsvps WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'POST' && body.action === 'delete-wish') {
      const id = Number(body.id);
      if (!Number.isInteger(id)) return res.status(400).json({ ok: false, error: 'Invalid wish id.' });
      await sql`DELETE FROM wishes WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    const rsvps = await sql`SELECT id, name, guests, attending, created_at AS at FROM rsvps ORDER BY created_at DESC`;
    const wishes = await sql`SELECT id, name, message, created_at AS at FROM wishes ORDER BY created_at DESC`;
    const attending = rsvps.filter(x => x.attending);
    const declined = rsvps.filter(x => !x.attending);
    const totalGuests = attending.reduce((sum, x) => sum + Number(x.guests || 0), 0);

    return res.status(200).json({
      ok: true,
      stats: {
        rsvps: rsvps.length,
        attending: attending.length,
        declined: declined.length,
        guests: totalGuests,
        wishes: wishes.length,
        lastRsvpAt: rsvps[0]?.at || null
      },
      rsvps: rsvps.map(x => ({ ...x, guests: Number(x.guests || 0) })),
      wishes
    });
  } catch (e) {
    console.error('Admin API error:', e);
    return res.status(500).json({
      ok: false,
      error: 'Unable to load admin data: ' + (e && e.message ? e.message : 'Database error')
    });
  }
};
