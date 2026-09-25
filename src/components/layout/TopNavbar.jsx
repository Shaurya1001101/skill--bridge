import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Brain, BarChart2, TrendingUp, Map, Code2,
  PlayCircle, Briefcase, Zap, HelpCircle, Search, Bell,
  Sun, Moon, ShieldCheck, Trophy, Sparkles, ChevronDown, Settings, LogOut
} from 'lucide-react';
import useStore from '../../store/useStore.js';

const FEATURE_TABS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/analyzer', label: 'Skill Analyzer', icon: Brain, badge: 'AI' },
  { path: '/gap-analysis', label: 'Gap Analysis', icon: BarChart2 },
  { path: '/trajectory', label: 'Skill Trajectory', icon: TrendingUp, badge: 'Sim' },
  { path: '/improvement-map', label: 'Improvement Map', icon: Map, badge: 'Plan' },
  { path: '/code-labs', label: 'Code Labs', icon: Code2, badge: 'IDE' },
  { path: '/jobs', label: 'Job Market', icon: Briefcase },
  { path: '/daily-problem', label: 'Daily Problem', icon: Zap, badge: '+10 XP' },
  { path: '/videos', label: 'Learning Hub', icon: PlayCircle, badge: 'Free' },
  { path: '/help', label: 'Help & Guide', icon: HelpCircle },
];

const NOTIFICATIONS = [
  { title: 'Gap analysis updated', sub: 'Your MLOps gap score improved by 12%', time: '2h ago' },
  { title: 'Daily coding drill ready', sub: 'Solve today\'s challenge for +10 XP', time: '8h ago' },
  { title: 'Streak milestone active', sub: 'Keep your momentum alive! Day 3 streak', time: '1d ago' },
];

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const safetyScale = useStore(s => s.safetyScale);
  const toggleSafetyScale = useStore(s => s.toggleSafetyScale);

  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const tabsContainerRef = useRef(null);

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
      const term = search.toLowerCase();
      if (term.includes('gap')) navigate('/gap-analysis');
      else if (term.includes('video') || term.includes('learn')) navigate('/videos');
      else if (term.includes('job')) navigate('/jobs');
      else if (term.includes('code') || term.includes('python') || term.includes('sql')) navigate('/code-labs');
      else if (term.includes('problem')) navigate('/daily-problem');
      else if (term.includes('trajectory') || term.includes('simul')) navigate('/trajectory');
      else if (term.includes('map') || term.includes('roadmap') || term.includes('calendar')) navigate('/improvement-map');
      else if (term.includes('analyz') || term.includes('resume')) navigate('/analyzer');
      else if (term.includes('setting')) navigate('/settings');
      else if (term.includes('help') || term.includes('faq')) navigate('/help');
      else navigate('/');
      setSearch('');
    }
  };

  return (
    <header className="top-command-center">
      {/* ─── Row 1: Primary Header ────────────────────────────────────────── */}
      <div className="top-header-row">
        {/* Brand Logo & Tagline */}
        <div className="top-brand-area" onClick={() => navigate('/')}>
          <div className="top-brand-logo">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M4 14C4 8.5 8.5 4 14 4C19.5 4 24 8.5 24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 18C8 15.2 10.7 13 14 13C17.3 13 20 15.2 20 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="14" cy="21" r="2.5" fill="white"/>
            </svg>
          </div>
          <div className="top-brand-info">
            <span className="top-brand-title">SkillBridge</span>
            <span className="top-brand-by">by Code Hustlers</span>
          </div>

          <button
            className="market-live-pill"
            onClick={(e) => { e.stopPropagation(); navigate('/jobs'); }}
            title="Live hiring market trends"
          >
            <span className="live-dot" />
            <span>Market Live</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="top-search-wrapper">
          <Search size={14} className="top-search-icon" />
          <input
            id="global-search"
            type="text"
            className="top-search-input"
            placeholder="Search skills, tools, roles, roadmaps... (Enter to go)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Action Controls & User Meta */}
        <div className="top-actions-area">
          {/* XP & Streak Gamification Pill */}
          <div className="gamification-pill" title="Your XP & active streak">
            <span className="streak-indicator">🔥 {streak}d</span>
            <span className="xp-divider">|</span>
            <span className="xp-indicator">{xp} XP</span>
          </div>

          {/* 90% View Safety Scale Toggle */}
          <button
            type="button"
            className={`scale-safety-pill ${safetyScale ? 'active' : ''}`}
            onClick={toggleSafetyScale}
            title={safetyScale ? '90% View Safety active (ensures no clipping). Click for 100%.' : '100% Scale. Click for 90% View Safety mode.'}
          >
            <span className="scale-indicator-dot" />
            <span>{safetyScale ? '90% View' : '100%'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="top-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              className="top-icon-btn"
              onClick={() => setShowNotif(v => !v)}
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell size={15} />
              <div className="top-notif-dot" />
            </button>
            {showNotif && (
              <div className="notif-panel">
                <div className="notif-header">Platform Updates</div>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="notif-item">
                    <div className="notif-item-title">{n.title}</div>
                    <div className="notif-item-sub">{n.sub} · {n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile & Settings Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => setShowProfile(v => !v)}
              title="Account Menu"
            >
              <div className="user-avatar-sm">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="user-name-label">{user?.name || 'User'}</span>
              <ChevronDown size={12} color="var(--text-subtle)" />
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-user">
                  <div className="dropdown-username">{user?.name || 'User'}</div>
                  <div className="dropdown-email">{user?.email || 'user@skillbridge.io'}</div>
                </div>
                <button
                  type="button"
                  className="dropdown-item-btn"
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                >
                  <Settings size={14} />
                  <span>Settings & Preferences</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item-btn danger"
                  onClick={() => { logout(); navigate('/login'); }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Row 2: Sticky Action Feature Navigation Tabs Bar ────────────── */}
      <nav className="top-feature-tabs-bar" aria-label="Feature navigation" ref={tabsContainerRef}>
        <div className="top-feature-tabs-scroll">
          {FEATURE_TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) => `feature-tab-item ${isActive ? 'active' : ''}`}
            >
              <tab.icon size={15} className="feature-tab-icon" />
              <span className="feature-tab-label">{tab.label}</span>
              {tab.badge && <span className="feature-tab-badge">{tab.badge}</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
