/**
 * SkillBridge Resilient API Configuration & Client.
 * Automatically connects to the Express + Supabase backend server across:
 * 1. Direct port 5000 CORS requests (IPv4 / localhost / LAN)
 * 2. Vite dev-server proxy (/api/...)
 * 3. Remote production deployments (Vercel / custom domains)
 */

function resolveInitialApiBase() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // In local browser dev environments, default directly to backend port 5000
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '5000') {
      return `http://${hostname}:5000`;
    }
  }
  return '';
}

export const API_BASE = resolveInitialApiBase();

/**
 * Normalizes an API endpoint path.
 * Ensures leading slash and /api prefix if not present.
 */
export function normalizeEndpoint(endpoint) {
  let clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!clean.startsWith('/api')) {
    clean = `/api${clean}`;
  }
  return clean;
}

/**
 * Returns full URL for an API endpoint.
 * Example: apiUrl('/api/auth') => 'http://localhost:5000/api/auth'
 */
export function apiUrl(endpoint) {
  const clean = normalizeEndpoint(endpoint);
  return `${API_BASE}${clean}`;
}

/**
 * Resilient fetch that tries the primary URL and automatically falls back
 * across direct port 5000, 127.0.0.1:5000, and relative Vite proxy (/api/...)
 * if any connection/CORS issue arises.
 */
export async function apiFetch(endpoint, options = {}) {
  const norm = normalizeEndpoint(endpoint);
  const primaryUrl = apiUrl(endpoint);

  // Candidate URLs to try in order
  const candidates = [primaryUrl];

  // If primary was absolute, add relative proxy as fallback
  if (primaryUrl.startsWith('http')) {
    if (!candidates.includes(norm)) candidates.push(norm);
    if (primaryUrl.includes('localhost:5000')) {
      const ipCandidate = primaryUrl.replace('localhost:5000', '127.0.0.1:5000');
      if (!candidates.includes(ipCandidate)) candidates.push(ipCandidate);
    } else if (primaryUrl.includes('127.0.0.1:5000')) {
      const hostCandidate = primaryUrl.replace('127.0.0.1:5000', 'localhost:5000');
      if (!candidates.includes(hostCandidate)) candidates.push(hostCandidate);
    }
  } else {
    // Primary was relative, add direct candidates
    candidates.push(`http://localhost:5000${norm}`);
    candidates.push(`http://127.0.0.1:5000${norm}`);
  }

  let lastError = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      lastError = err;
      // Continue to next candidate
    }
  }

  throw lastError || new Error(`Failed to connect to API endpoint: ${endpoint}`);
}

/**
 * Actively checks backend API status and Supabase PostgreSQL connectivity.
 * @returns {Promise<{ online: boolean, database: string, latencyMs: number|null, data?: any, error?: string }>}
 */
export async function checkBackendHealth() {
  const startTime = Date.now();
  try {
    const res = await apiFetch('/api/health');
    if (!res.ok) {
      return {
        online: false,
        database: 'unhealthy',
        latencyMs: Date.now() - startTime,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }
    const data = await res.json();
    const isDbConnected =
      data.database?.status === 'connected' ||
      data.database === 'configured' ||
      data.database?.status?.startsWith('connected');

    return {
      online: true,
      database: isDbConnected ? 'connected' : (data.database?.status || 'disconnected'),
      latencyMs: data.database?.latencyMs ?? (Date.now() - startTime),
      data,
    };
  } catch (err) {
    return {
      online: false,
      database: 'offline',
      latencyMs: Date.now() - startTime,
      error: err.message || 'Cannot reach server',
    };
  }
}

export default apiUrl;
