import { useState } from 'react';
import { User, Bell, Calendar, Key, Save } from 'lucide-react';
import useStore from '../store/useStore.js';

export default function SettingsPage() {
  const user = useStore(s => s.user);
  const setUser = useStore(s => s.setUser);
  const theme = useStore(s => s.theme);
  const setTheme = useStore(s => s.setTheme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const planDuration = useStore(s => s.planDuration);
  const setPlanDuration = useStore(s => s.setPlanDuration);
  const notifications = useStore(s => s.notifications);
  const setNotifications = useStore(s => s.setNotifications);
  const addToast = useStore(s => s.addToast);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('sb_ai_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [tab, setTab] = useState('profile');

  const saveProfile = () => {
    setUser({ ...user, name, email });
    addToast('Profile saved', 'success');
  };

  const saveApiKey = () => {
    if (apiKey) localStorage.setItem('sb_ai_key', apiKey);
    else localStorage.removeItem('sb_ai_key');
    addToast('API key saved — AI Assistant will use it for responses', 'success');
  };

  const toggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    addToast(`${key} ${!notifications[key] ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile, theme, notification preferences, and API keys.</p>
        </div>
      </div>

      <div className="tab-list">
        {[
          { key: 'profile', label: 'Profile', icon: User },
          { key: 'appearance', label: 'Appearance' },
          { key: 'notifications', label: 'Notifications' },
          { key: 'integrations', label: 'Integrations & API' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-header">
            <h2 className="card-title">Profile Information</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{name || 'User'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{email || 'No email set'}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input id="settings-name" type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input id="settings-email" type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, border: '1px solid var(--border)' }}>
              {user?.role || 'Free User'} · SkillBridge v2.0
            </div>
          </div>
          <button id="save-profile-btn" className="btn btn-primary" onClick={saveProfile}>
            <Save size={14} /> Save Profile
          </button>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-header">
            <h2 className="card-title">Appearance</h2>
          </div>
          <div className="form-group">
            <label className="form-label">Color Theme</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['light', 'dark'].map(t => (
                <button
                  key={t}
                  id={`theme-${t}`}
                  className={`btn ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setTheme(t);
                    addToast(`Theme switched to ${t === 'light' ? 'Light' : 'Dark'} mode`, 'info');
                  }}
                >
                  {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Plan Duration</label>
            <select className="form-select" value={planDuration} onChange={e => setPlanDuration(Number(e.target.value))}>
              {[12, 16, 20, 24, 36, 52].map(w => <option key={w} value={w}>{w} weeks</option>)}
            </select>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>
              Controls the default plan duration in Improvement Map
            </div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-header">
            <h2 className="card-title">Notification Preferences</h2>
          </div>
          {[
            { key: 'weeklyDigest', label: 'Weekly Progress Digest', desc: 'Receive a weekly summary of your skill progress and learning milestones' },
            { key: 'streakReminder', label: 'Daily Streak Reminder', desc: 'Remind you to solve the daily problem before midnight to keep your streak' },
            { key: 'newsAlerts', label: 'Skill News Alerts', desc: 'Get notified when important tech news relevant to your skill gaps is published' },
          ].map(n => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{n.desc}</div>
              </div>
              <div
                id={`toggle-${n.key}`}
                onClick={() => toggle(n.key)}
                style={{
                  width: 40, height: 22, borderRadius: 11, cursor: 'pointer', flexShrink: 0,
                  background: notifications[n.key] ? 'var(--brand)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'background 0.2s', marginLeft: 12, marginTop: 2,
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: notifications[n.key] ? 21 : 3,
                  transition: 'left 0.2s',
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 540 }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">AI Assistant API Key</h2>
              <span className="badge badge-info">Optional</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
              The AI assistant works with rule-based answers by default. Add an OpenAI-compatible key to enable real AI responses. The key is stored in your browser's localStorage and sent to the /api/ai Vercel function proxy — never to third parties directly.
            </p>
            <div className="form-group">
              <label className="form-label">API Key (VITE_AI_KEY)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="api-key-input"
                  type={showKey ? 'text' : 'password'}
                  className="form-input"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowKey(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: apiKey ? 'var(--success)' : 'var(--text-subtle)' }} />
              <span style={{ fontSize: 12, color: apiKey ? 'var(--success)' : 'var(--text-subtle)' }}>
                {apiKey ? 'API key configured — AI mode active' : 'No API key — using rule-based fallback'}
              </span>
            </div>
            <button id="save-api-key-btn" className="btn btn-primary btn-sm" onClick={saveApiKey}>
              <Key size={12} /> Save API Key
            </button>
            {apiKey && (
              <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => { setApiKey(''); localStorage.removeItem('sb_ai_key'); addToast('API key removed', 'info'); }}>
                Remove Key
              </button>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Vercel Deployment</h2>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, background: '#0a0f1e', padding: 14, borderRadius: 8, color: '#e2e8f0', lineHeight: 2 }}>
              <div><span style={{ color: '#6EE7B7' }}>$</span> npm install -g vercel</div>
              <div><span style={{ color: '#6EE7B7' }}>$</span> vercel</div>
              <div style={{ color: '#94A3B8' }}># Optional: set VITE_AI_KEY in Vercel dashboard</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
              No database or backend required. The /api/news and /api/ai serverless functions are auto-deployed by Vercel from the /api folder. See README for full deployment instructions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
