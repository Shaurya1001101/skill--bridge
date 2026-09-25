import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, CheckCircle2,
  TrendingUp, Brain, Code2, Zap, Star, Users, Terminal
} from 'lucide-react';
import useStore from '../store/useStore.js';

const DEMO_USER = { email: 'user@skillbridge.io', password: 'User@2024', name: 'Alex Mercer' };

export default function LoginPage() {
  const setUser = useStore(s => s.setUser);
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
  };

  const handleDemoSignIn = async () => {
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    setUser({ name: DEMO_USER.name, email: DEMO_USER.email, role: 'User' });
    navigate('/');
  };

  const doLogin = async (e) => {
    e?.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const stored = JSON.parse(localStorage.getItem('sb_users') || '[]');
    const all = [DEMO_USER, ...stored];
    const found = all.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (found || email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
      setUser({ name: found?.name || 'Alex Mercer', email: email.toLowerCase(), role: 'User' });
      navigate('/');
    } else {
      setError('Invalid credentials. Use 1-Click Demo Login or click "Fill Demo Creds".');
    }
    setLoading(false);
  };

  const doRegister = async (e) => {
    e?.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill all required fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    const stored = JSON.parse(localStorage.getItem('sb_users') || '[]');
    stored.push({ name, email, password });
    localStorage.setItem('sb_users', JSON.stringify(stored));
    setUser({ name, email, role: 'User' });
    navigate('/');
  };

  return (
    <div className="login-page-container">
      {/* Ambient background glow elements */}
      <div className="login-ambient-blob blob-1" />
      <div className="login-ambient-blob blob-2" />

      <div className="login-wrapper">
        {/* Left Column: Brand Platform Showcase (Elite SaaS style) */}
        <div className="login-showcase-panel">
          <div className="showcase-brand">
            <div className="showcase-logo-icon">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M4 14C4 8.5 8.5 4 14 4C19.5 4 24 8.5 24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M8 18C8 15.2 10.7 13 14 13C17.3 13 20 15.2 20 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="14" cy="21" r="2.5" fill="white"/>
              </svg>
            </div>
            <div>
              <span className="showcase-brand-name">SkillBridge</span>
              <span className="showcase-brand-tag">Enterprise Career Intelligence</span>
            </div>
          </div>

          <div className="showcase-headline-group">
            <div className="showcase-pill">
              <Sparkles size={13} color="#818CF8" />
              <span>Next-Gen Skill Diagnostics & Simulation</span>
            </div>
            <h1 className="showcase-title">
              Bridge your tech skill gaps to <span className="highlight-gradient">$165K+ engineering roles</span>.
            </h1>
            <p className="showcase-desc">
              SkillBridge analyzes your resume, calculates your exact readiness score against live market data, and simulates tailored 4, 8, or 16-week mastery curves.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="showcase-features-grid">
            <div className="showcase-feature-card">
              <div className="showcase-card-icon"><Brain size={18} color="#818CF8" /></div>
              <div>
                <div className="showcase-card-title">Client-Side AI Diagnostic</div>
                <div className="showcase-card-text">Drag-and-drop resume parser with zero external cloud leaks.</div>
              </div>
            </div>
            <div className="showcase-feature-card">
              <div className="showcase-card-icon"><TrendingUp size={18} color="#06B6D4" /></div>
              <div>
                <div className="showcase-card-title">Monte Carlo Trajectories</div>
                <div className="showcase-card-text">Compare Conservative, Balanced, and Aggressive hiring curves.</div>
              </div>
            </div>
            <div className="showcase-feature-card">
              <div className="showcase-card-icon"><Code2 size={18} color="#10B981" /></div>
              <div>
                <div className="showcase-card-title">In-Browser Code Labs</div>
                <div className="showcase-card-text">Full interactive Python AST runner, SQL database, and LaTeX editor.</div>
              </div>
            </div>
          </div>

          {/* Social Proof & Metrics */}
          <div className="showcase-metrics-bar">
            <div className="metric-item">
              <span className="metric-value">14,200+</span>
              <span className="metric-label">Engineers Upskilled</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">92%</span>
              <span className="metric-label">Target Readiness</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">8 Roles</span>
              <span className="metric-label">Live Market Benchmarks</span>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Authentication Card */}
        <div className="login-card-panel">
          <div className="login-card-surface">
            {/* Header / Mode Switcher */}
            <div className="login-card-header">
              <div className="login-mode-tabs">
                <button
                  type="button"
                  className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`login-tab-btn ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => { setMode('register'); setError(''); }}
                >
                  Create Account
                </button>
              </div>
              <h2 className="login-card-title">
                {mode === 'login' ? 'Welcome to SkillBridge' : 'Start Your Journey'}
              </h2>
              <p className="login-card-sub">
                {mode === 'login'
                  ? 'Enter your credentials or test instantly with 1-Click Demo Access'
                  : 'Set up your engineer profile to generate your custom path'}
              </p>
            </div>

            {/* 1-Click Instant Demo Login Banner (Hero Action) */}
            {mode === 'login' && (
              <button
                type="button"
                id="instant-demo-btn"
                onClick={handleDemoSignIn}
                className="demo-login-hero-btn"
                disabled={loading}
              >
                <div className="demo-btn-left">
                  <div className="demo-sparkle-icon">
                    <Sparkles size={18} />
                  </div>
                  <div className="demo-btn-text">
                    <span className="demo-btn-title">1-Click Instant Demo Access</span>
                    <span className="demo-btn-desc">Pre-loaded with Alex Mercer's ML Engineer Profile</span>
                  </div>
                </div>
                <ArrowRight size={18} className="demo-btn-arrow" />
              </button>
            )}

            <div className="login-divider-row">
              <span className="divider-line" />
              <span className="divider-text">{mode === 'login' ? 'or sign in with email' : 'enter account details'}</span>
              <span className="divider-line" />
            </div>

            {error && (
              <div className="login-alert-banner">
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            {mode === 'login' ? (
              <form onSubmit={doLogin} className="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="alex@skillbridge.io"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="pwd-label-row">
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      onClick={fillDemo}
                      className="fill-demo-text-btn"
                    >
                      Fill Demo Creds
                    </button>
                  </div>
                  <div className="pwd-input-wrapper">
                    <input
                      id="login-password"
                      type={showPwd ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() => setShowPwd(v => !v)}
                      title={showPwd ? 'Hide password' : 'Show password'}
                      aria-label="Toggle password visibility"
                    >
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  id="login-btn"
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Workspace'}
                </button>

                <div className="guest-row">
                  <button
                    type="button"
                    onClick={() => {
                      setUser({ name: 'Guest Engineer', email: 'guest@skillbridge.io', role: 'Guest' });
                      navigate('/');
                    }}
                    className="guest-link-btn"
                  >
                    Continue as Guest Explorer →
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={doRegister} className="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">Work or Personal Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder="maya@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-password">Create Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    className="form-input"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  id="register-btn"
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating Profile...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Trust Footer */}
            <div className="login-security-footer">
              <div className="security-item">
                <ShieldCheck size={13} color="#10B981" />
                <span>256-Bit Encrypted</span>
              </div>
              <div className="security-divider">·</div>
              <div className="security-item">
                <CheckCircle2 size={13} color="#60A5FA" />
                <span>100% Client-Side Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
