import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, ChevronRight } from 'lucide-react';
import useStore from '../../store/useStore.js';

const PAGE_NAMES = {
  '/': 'Dashboard',
  '/analyzer': 'Skill Analyzer',
  '/gap-analysis': 'Gap Analysis',
  '/trajectory': 'Skill Trajectory Simulator',
  '/improvement-map': 'Improvement Map',
  '/code-labs': 'Code Labs',
  '/videos': 'Learning & Videos',
  '/jobs': 'Job Market Intelligence',
  '/daily-problem': 'Daily Coding Problem',
  '/help': 'Help & Guide',
  '/settings': 'Settings',
};

const NOTIFICATIONS = [
  { title: 'Gap analysis updated', sub: 'Your MLOps gap improved by 12%', time: '2h ago' },
  { title: 'Daily problem available', sub: 'Solve today\'s challenge for +10 XP', time: '8h ago' },
  { title: 'Streak reminder', sub: 'Keep your streak alive! Day 3', time: '1d ago' },
];

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const toggleMobileSidebar = useStore(s => s.toggleMobileSidebar);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const safetyScale = useStore(s => s.safetyScale);
  const toggleSafetyScale = useStore(s => s.toggleSafetyScale);

  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const currentPage = PAGE_NAMES[location.pathname] || 'SkillBridge';

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      // Simple search navigation
      const term = search.toLowerCase();
      if (term.includes('gap')) navigate('/gap-analysis');
      else if (term.includes('video') || term.includes('learn')) navigate('/videos');
      else if (term.includes('job')) navigate('/jobs');
      else if (term.includes('code') || term.includes('python') || term.includes('sql')) navigate('/code-labs');
      else if (term.includes('problem')) navigate('/daily-problem');
      else if (term.includes('trajectory') || term.includes('simul')) navigate('/trajectory');
      else if (term.includes('map') || term.includes('roadmap')) navigate('/improvement-map');
      setSearch('');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={toggleMobileSidebar}>
          <Menu size={18} />
        </button>
        <div className="breadcrumb">
          <span>SkillBridge</span>
          <ChevronRight size={12} />
          <span className="breadcrumb-active">{currentPage}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="search-bar">
          <Search size={13} color="var(--text-subtle)" />
          <input
            type="text"
            placeholder="Search pages, skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            id="global-search"
          />
        </div>

        {/* Market Live */}
        <button className="market-live-chip" onClick={() => navigate('/jobs')} title="Live job market intelligence">
          <div className="live-dot" />
          <span>Market Live</span>
        </button>


        {/* Theme toggle */}
        <button className="topbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="topbar-icon-btn" onClick={() => setShowNotif(v => !v)} title="Notifications" style={{ position: 'relative' }}>
            <Bell size={15} />
            <div className="notif-dot" />
          </button>
          {showNotif && (
            <div className="notif-panel">
              <div className="notif-header">Notifications</div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="notif-item">
                  <div className="notif-item-title">{n.title}</div>
                  <div className="notif-item-sub">{n.sub} · {n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div className="user-avatar" onClick={() => setShowProfile(v => !v)} title="Profile">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          {showProfile && (
            <div className="profile-dropdown">
              <div style={{ padding: '8px 10px 4px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{user?.email || ''}</div>
              </div>
              <div className="dropdown-item" onClick={() => { navigate('/settings'); setShowProfile(false); }}>
                Settings
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => { logout(); navigate('/login'); }}>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
