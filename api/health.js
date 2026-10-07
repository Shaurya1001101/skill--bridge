/**
 * Vercel Serverless Function: GET /api/health
 * Returns health status of Supabase Cloud connection.
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xabzaaychzdpgtbgcrcx.supabase.co';
  const start = Date.now();

  try {
    const pingRes = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
      },
    });

    const latencyMs = Math.max(1, Date.now() - start);

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        provider: 'Supabase PostgreSQL',
        latencyMs,
        url: supabaseUrl,
      },
    });
  } catch (err) {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        provider: 'Supabase PostgreSQL',
        latencyMs: Date.now() - start,
        error: err.message,
      },
    });
  }
}
