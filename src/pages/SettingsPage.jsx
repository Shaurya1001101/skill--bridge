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
  const [tab, setTab] = useState('profile');

  const saveProfile = () => {
    setUser({ ...user, name, email });
    addToast('Profile saved', 'success');
  };

  const toggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    addToast(`${key} ${!notifications[key] ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <div className="settings-page-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile, theme, notification preferences, and API keys.</p>
        </div>
      </div>

      <div className="tabs2" role="tablist">
        {[
          { key: 'profile', label: 'Profile', icon: User },
          { key: 'appearance', label: 'Appearance' },
          { key: 'notifications', label: 'Notifications' },
          { key: 'integrations', label: 'Integrations & API' },
        ].map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`tab-btn ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="panel" style={{ maxWidth: 540 }}>
          <div className="card-header" style={{ marginBottom: 18 }}>
            <h2 className="card-title" style={{ fontSize: 18 }}>Profile Information</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', boxShadow: '0 4px 14px rgba(20, 160, 152, 0.35)' }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{name || 'User'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{email || 'No email set'}</div>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Display Name</label>
            <input id="settings-name" type="text" className="form-input login-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Email Address</label>
            <input id="settings-email" type="email" className="form-input login-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Account Type</label>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--field)', borderRadius: 10, border: '1px solid var(--line)' }}>
              {user?.role || 'Guest Engineer'} · SkillBridge v2.0 Enterprise
            </div>
          </div>
          <button id="save-profile-btn" className="btn btn-primary" onClick={saveProfile} style={{ padding: '10px 20px', borderRadius: 10, fontWeight: 600 }}>
            <Save size={14} style={{ display: 'inline', marginRight: 6 }} /> Save Profile
          </button>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="panel" style={{ maxWidth: 540 }}>
          <div className="card-header" style={{ marginBottom: 18 }}>
            <h2 className="card-title" style={{ fontSize: 18 }}>Appearance</h2>
          </div>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Color Theme</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['light', 'dark'].map(t => (
                <button
                  key={t}
                  id={`theme-${t}`}
                  type="button"
                  className={`btn ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '9px 18px', borderRadius: 10 }}
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
            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Plan Duration</label>
            <select className="form-select login-input" value={planDuration} onChange={e => setPlanDuration(Number(e.target.value))}>
              {[12, 16, 20, 24, 36, 52].map(w => <option key={w} value={w}>{w} weeks</option>)}
            </select>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 6 }}>
              Controls the default plan duration in Improvement Map
            </div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="panel" style={{ maxWidth: 540 }}>
          <div className="card-header" style={{ marginBottom: 18 }}>
            <h2 className="card-title" style={{ fontSize: 18 }}>Notification Preferences</h2>
          </div>
          {[
            { key: 'weeklyDigest', label: 'Weekly Progress Digest', desc: 'Receive a weekly summary of your skill progress and learning milestones' },
            { key: 'streakReminder', label: 'Daily Streak Reminder', desc: 'Remind you to solve the daily problem before midnight to keep your streak' },
            { key: 'newsAlerts', label: 'Skill News Alerts', desc: 'Get notified when important tech news relevant to your skill gaps is published' },
          ].map(n => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{n.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--mute)' }}>{n.desc}</div>
              </div>
              <div
                id={`toggle-${n.key}`}
                onClick={() => toggle(n.key)}
                style={{
                  width: 40, height: 22, borderRadius: 11, cursor: 'pointer', flexShrink: 0,
                  background: notifications[n.key] ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 580 }}>
          <div className="panel">
            <div className="card-header" style={{ marginBottom: 14 }}>
              <h2 className="card-title" style={{ fontSize: 18 }}>AI &amp; Backend Infrastructure</h2>
              <span className="badge badge-success" style={{ background: 'rgba(20, 160, 152, 0.15)', color: 'var(--teal)', border: '1px solid rgba(20, 160, 152, 0.3)', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Server-Side Gateway</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--mute)', marginBottom: 14, lineHeight: 1.6 }}>
              In accordance with security best practices, AI Gateway credentials are held strictly on the server and are never requested or stored in your browser.
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'var(--field)', borderRadius: 10, border: '1px solid var(--line)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 12, color: 'var(--ink)' }}>
                Direct serverless endpoint active · Browser security protected
              </span>
            </div>
          </div>

          <div className="panel">
            <div className="card-header" style={{ marginBottom: 14 }}>
              <h2 className="card-title" style={{ fontSize: 18 }}>Vercel Deployment</h2>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, background: '#0a0f1e', padding: 14, borderRadius: 10, color: '#e2e8f0', lineHeight: 2, border: '1px solid var(--line)' }}>
              <div><span style={{ color: '#6EE7B7' }}>$</span> npm install -g vercel</div>
              <div><span style={{ color: '#6EE7B7' }}>$</span> vercel</div>
              <div style={{ color: '#94A3B8' }}># Optional: set VITE_AI_KEY in Vercel dashboard</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 10, lineHeight: 1.6 }}>
              No database or backend required. Serverless endpoints are auto-deployed by Vercel.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
