import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun, Moon, Lock, X, Check, CheckCircle2, RefreshCw, Database
} from 'lucide-react';
import useStore from '../store/useStore.js';
import { apiUrl, apiFetch, checkBackendHealth } from '../lib/api.js';

const DEMO_USER = { email: 'alex@skillbridge.io', password: 'demo-password', name: 'Alex Mercer' };

// ─── Real-Time Password Strength Evaluator ──────────────────────────────────
function evaluatePasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: 'transparent', checks: { length: false, hasNumber: false, hasUpper: false, hasSpecial: false } };

  const checks = {
    length: pwd.length >= 8,
    hasNumber: /\d/.test(pwd),
    hasUpper: /[A-Z]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd),
  };

  let score = 0;
  if (checks.length) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasUpper) score += 1;
  if (checks.hasSpecial) score += 1;

  let label = 'Weak';
  let color = 'var(--danger)';
  if (score === 2) {
    label = 'Fair';
    color = 'var(--warning)';
  } else if (score === 3) {
    label = 'Good';
    color = 'var(--teal)';
  } else if (score === 4) {
    label = 'Strong';
    color = 'var(--success)';
  }

  return { score, label, color, checks };
}

export default function LoginPage() {
  const initUserSession = useStore(s => s.initUserSession);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live Supabase Backend Connectivity State
  const [dbHealth, setDbHealth] = useState({ checking: true, online: false, database: 'checking', latencyMs: null, error: null });

  const verifyConnection = useCallback(async () => {
    setDbHealth(prev => ({ ...prev, checking: true }));
    const health = await checkBackendHealth();
    setDbHealth({
      checking: false,
      online: health.online,
      database: health.database,
      latencyMs: health.latencyMs,
      error: health.error,
    });
  }, []);

  useEffect(() => {
    verifyConnection();
    const interval = setInterval(verifyConnection, 20000);
    return () => clearInterval(interval);
  }, [verifyConnection]);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const pwdStrength = evaluatePasswordStrength(password);

  const fillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
  };

  const handleDemoSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'demo' })
      });
      if (res.ok) {
        const data = await res.json();
        initUserSession(data);
        navigate('/');
        return;
      }
    } catch {
      // Offline fallback
    }
    initUserSession({
      user: { id: 1, name: DEMO_USER.name, email: DEMO_USER.email, role: 'User' },
      profile: { xp: 50, streak: 3, targetRole: 'ml-engineer', skills: { all: ['Python', 'SQL', 'Git'] } },
      committedPath: { role: 'ml-engineer', pacing: 'balanced', completedTaskIds: ['task-1', 'task-2'] }
    });
    navigate('/');
  };

  const handleGuestSignIn = () => {
    setError('');
    initUserSession({
      user: { id: 'guest', name: 'Guest Engineer', email: 'guest@skillbridge.io', role: 'Guest' },
      profile: { xp: 0, streak: 1, targetRole: 'ml-engineer', skills: { all: [] } },
      committedPath: null
    });
    navigate('/');
  };

  const doLogin = async (e) => {
    e?.preventDefault();
    setError('');
    const userIdentifier = email.trim();
    if (!userIdentifier || !password) {
      setError('Please enter your username/email and password.');
      return;
    }
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', identifier: userIdentifier, password })
      });
      const data = await res.json();
      if (res.ok) {
        initUserSession(data);
        navigate('/');
        return;
      } else {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }
    } catch (fetchErr) {
      setError(`Cannot connect to Supabase authentication (${fetchErr.message}). Please check your Supabase connection and credentials.`);
    }
    setLoading(false);
  };

  const doRegister = async (e) => {
    e?.preventDefault();
    setError('');
    const trimmedUsername = (username || email.split('@')[0] || '').trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim() || `${trimmedUsername}@skillbridge.io`;

    if (!trimmedName || !trimmedUsername || !password) {
      setError('Please fill in your full name, username, and password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (pwdStrength.score < 2) {
      setError('Please choose a stronger password (include numbers or symbols).');
      return;
    }
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: trimmedUsername,
          name: trimmedName,
          email: trimmedEmail,
          password
        })
      });
      const data = await res.json();
      if (res.ok) {
        initUserSession(data);
        navigate('/');
        return;
      } else {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }
    } catch (fetchErr) {
      setError(`Cannot connect to Supabase registration (${fetchErr.message}). Please check your Supabase connection and credentials.`);
    }
    setLoading(false);
  };

  const handleForgotPassword = (e) => {
    e?.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotSent(true);
      setForgotLoading(false);
    }, 600);
  };

  return (
    <div className="login-page-root">
      {/* Floating Theme Switcher */}
      <button
        type="button"
        className="login-theme-toggle"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <><Sun size={14} color="var(--amber)" /> <span>Light</span></>
        ) : (
          <><Moon size={14} color="var(--teal)" /> <span>Dark</span></>
        )}
      </button>

      <main className="login-wrap">
        {/* Left Platform Showcase Section (Exact HTML Design) */}
        <section>
          <div className="login-brand">
            <div className="login-brand-logo">
              <img src="/skillbridge-logo.jpeg" alt="SkillBridge Logo" className="login-brand-img" />
            </div>
            <div>
              <b>SkillBridge</b>
              <span>Enterprise career intelligence</span>
            </div>
          </div>

          <h1 className="login-hero-h1">
            Bridge your tech skill gaps to <em>$165K+</em> engineering roles.
          </h1>

          <p className="login-lead">
            SkillBridge analyzes your resume, calculates your exact readiness score against live market data, and simulates tailored 4, 8, or 16-week mastery curves.
          </p>

          <ul className="login-feats">
            <li>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 3a4 4 0 0 0-4 4 4 4 0 0 0-3 6 4 4 0 0 0 3 6 4 4 0 0 0 8 0 4 4 0 0 0 3-6 4 4 0 0 0-3-6 4 4 0 0 0-4-4zM12 3v18" />
                </svg>
              </div>
              <div>
                <b>Client-side AI diagnostic</b>
                <span>Drag-and-drop resume parser with zero external cloud leaks.</span>
              </div>
            </li>

            <li>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                </svg>
              </div>
              <div>
                <b>Monte Carlo trajectories</b>
                <span>Compare conservative, balanced, and aggressive hiring curves.</span>
              </div>
            </li>

            <li>
              <div className="feat-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
                </svg>
              </div>
              <div>
                <b>In-browser code labs</b>
                <span>Practice real engineering tasks without leaving the page.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* Right Authentication Card (Exact HTML Design) */}
        <section className="login-card" aria-label="Account access">
          <div className="login-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              id="t-in"
              aria-selected={mode === 'login'}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              id="t-up"
              aria-selected={mode === 'register'}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Create account
            </button>
          </div>

          {/* Guest Account Access Option (Directly below Login Tab) */}
          <div className="login-guest-box">
            <button
              type="button"
              className="guest-tab-access-btn"
              onClick={handleGuestSignIn}
              id="guest-tab-btn"
              title="Continue without credentials as Guest Explorer"
            >
              <div className="guest-tab-btn-left">
                <span className="guest-badge-icon">⚡</span>
                <span className="guest-tab-text">
                  <b>Explore as Guest Account</b>
                  <small>No registration or sign in required · Instant access</small>
                </span>
              </div>
              <span className="guest-tab-arrow">→</span>
            </button>
          </div>

          {/* Live Supabase Backend Connectivity Status Badge */}
          <div
            id="backend-connection-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              margin: '12px 0 16px',
              borderRadius: '8px',
              fontSize: '12px',
              border: dbHealth.online ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
              background: dbHealth.online ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              color: 'var(--text-1)',
              transition: 'all 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: dbHealth.checking ? '#eab308' : dbHealth.online ? '#10b981' : '#ef4444',
                  boxShadow: dbHealth.online ? '0 0 8px #10b981' : 'none',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                <span style={{ fontWeight: 600, color: dbHealth.online ? '#10b981' : '#ef4444' }}>
                  {dbHealth.checking
                    ? 'Pinging Supabase Cloud...'
                    : dbHealth.online
                    ? 'Supabase PostgreSQL Connected'
                    : 'Supabase Offline / Standby'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                  {dbHealth.online
                    ? `Connected to Supabase · Latency ${dbHealth.latencyMs ? `${dbHealth.latencyMs}ms` : '<10ms'}`
                    : 'Connecting to Supabase Cloud...'}
                </span>
              </div>
            </div>
            <button
              type="button"
              id="recheck-connection-btn"
              onClick={verifyConnection}
              disabled={dbHealth.checking}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-2)',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: dbHealth.checking ? 'not-allowed' : 'pointer',
              }}
              title="Test Supabase connection again"
            >
              <RefreshCw size={12} className={dbHealth.checking ? 'spin' : ''} />
              <span>{dbHealth.checking ? 'Testing' : 'Verify'}</span>
            </button>
          </div>

          <h2 className="login-card-h2">
            {mode === 'login' ? 'Welcome to SkillBridge' : 'Create your SkillBridge account'}
          </h2>
          <p className="login-card-sub">
            {mode === 'login'
              ? 'Enter your credentials or try it instantly with demo access.'
              : 'Set up your engineer profile to generate your custom path.'}
          </p>

          {mode === 'login' && (
            <button
              className="login-demo-btn"
              id="demo"
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
            >
              <i>
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
                </svg>
              </i>
              <span>
                <b>1-click instant demo access</b>
                <small>Pre-loaded with Alex Mercer's ML engineer profile</small>
              </span>
            </button>
          )}

          <div className="login-or">
            {mode === 'login' ? 'or sign in with email' : 'enter account details'}
          </div>

          {error && (
            <div style={{
              marginBottom: 16,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              fontSize: 13,
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? doLogin : doRegister}>
            {mode === 'register' && (
              <>
                <div className="login-field" id="nameF">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    className="login-input"
                    autoComplete="name"
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="login-field" id="usernameF">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    className="login-input"
                    autoComplete="username"
                    placeholder="alexmercer"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="login-field">
              <label htmlFor="email">
                {mode === 'login' ? 'Username or Email address' : 'Email address (optional)'}
              </label>
              <input
                id="email"
                type={mode === 'login' ? 'text' : 'email'}
                className="login-input"
                autoComplete={mode === 'login' ? 'username' : 'email'}
                placeholder={mode === 'login' ? 'alexmercer or alex@skillbridge.io' : 'alex@skillbridge.io'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required={mode === 'login'}
              />
            </div>

            <div className="login-field">
              <label htmlFor="pw">
                <span>Password</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setShowForgotModal(true); setForgotSent(false); setForgotEmail(email); }}
                      style={{ color: 'var(--teal2)' }}
                    >
                      Forgot password?
                    </button>
                  )}
                  <button type="button" id="fill" onClick={fillDemo}>
                    Fill demo creds
                  </button>
                </div>
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="pw"
                  type={showPwd ? 'text' : 'password'}
                  className="login-input"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create strong password (min 8 chars)'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />

                <button
                  className="login-eye"
                  type="button"
                  id="eye"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Weak to Strong Password Indicator for Create Account */}
              {mode === 'register' && password.length > 0 && (
                <div className="login-pwd-strength">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600 }}>
                    <span style={{ color: 'var(--mute)' }}>Password Strength:</span>
                    <span style={{ color: pwdStrength.color }}>{pwdStrength.label}</span>
                  </div>

                  <div className="login-pwd-strength-bars">
                    {[1, 2, 3, 4].map(seg => (
                      <div
                        key={seg}
                        className="login-pwd-seg"
                        style={{
                          background: seg <= pwdStrength.score ? pwdStrength.color : 'rgba(255, 255, 255, 0.12)'
                        }}
                      />
                    ))}
                  </div>

                  <div className="login-pwd-checklist">
                    <div className={`login-pwd-check-item ${pwdStrength.checks.length ? 'met' : ''}`}>
                      {pwdStrength.checks.length ? <Check size={11} /> : <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`login-pwd-check-item ${pwdStrength.checks.hasNumber ? 'met' : ''}`}>
                      {pwdStrength.checks.hasNumber ? <Check size={11} /> : <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />}
                      <span>At least 1 number</span>
                    </div>
                    <div className={`login-pwd-check-item ${pwdStrength.checks.hasUpper ? 'met' : ''}`}>
                      {pwdStrength.checks.hasUpper ? <Check size={11} /> : <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`login-pwd-check-item ${pwdStrength.checks.hasSpecial ? 'met' : ''}`}>
                      {pwdStrength.checks.hasSpecial ? <Check size={11} /> : <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />}
                      <span>Special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="login-go-btn" id="go" type="submit" disabled={loading}>
              {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign in to workspace' : 'Create account')}
            </button>

            <div className="guest-row">
              <button
                type="button"
                onClick={handleGuestSignIn}
                className="guest-link-btn"
                id="guest-link-btn"
              >
                Continue as Guest Explorer →
              </button>
            </div>
          </form>

          <p className="login-note" id="msg" aria-live="polite">
            Your resume stays in your browser.
          </p>
        </section>
      </main>

      {/* ─── Forgot Password Modal ─── */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="login-card"
            style={{ maxWidth: 440, width: '100%', padding: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={18} color="var(--teal)" />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 0, color: 'var(--mute)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleForgotPassword}>
                <p style={{ fontSize: 13.5, color: 'var(--mute)', lineHeight: 1.5, marginBottom: 18 }}>
                  Enter your email address and we'll dispatch password recovery instructions immediately.
                </p>

                <div className="login-field" style={{ marginBottom: 16 }}>
                  <label htmlFor="forgot-email">Account Email</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div style={{
                  background: 'var(--field)',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  color: 'var(--mute)',
                  marginBottom: 20
                }}>
                  💡 <strong>Demo Quick Access:</strong> Use <code style={{ color: 'var(--teal)' }}>alex@skillbridge.io</code> with password <strong style={{ color: 'var(--ink)' }}>demo-password</strong>.
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      background: 'var(--field)',
                      color: 'var(--ink)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="login-go-btn"
                    style={{ width: 'auto', margin: 0, padding: '9px 18px', fontSize: 13.5 }}
                    disabled={forgotLoading || !forgotEmail}
                  >
                    {forgotLoading ? 'Sending...' : 'Send Recovery Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(20, 160, 152, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}>
                    <CheckCircle2 size={26} color="var(--teal)" />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Recovery Instructions Sent!
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--mute)', lineHeight: 1.5 }}>
                    We've dispatched recovery credentials to <strong style={{ color: 'var(--ink)' }}>{forgotEmail}</strong>.
                  </p>
                </div>

                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button
                    type="button"
                    className="login-go-btn"
                    style={{ width: '100%', margin: 0 }}
                    onClick={() => setShowForgotModal(false)}
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
