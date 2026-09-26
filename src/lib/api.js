/**
 * SkillBridge API configuration helper.
 * If VITE_API_URL is configured (e.g. https://sb-backend.vercel.app),
 * requests will target the remote backend directly.
 * Otherwise, requests fallback to relative paths (e.g. /api/...)
 * which are proxied locally by Vite or handled by Vercel rewrites.
 */
export const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';

export function apiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
}

export default apiUrl;
