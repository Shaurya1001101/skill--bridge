import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search, Bell, Sun, Moon, Flame, ChevronDown,
  Settings, LogOut, Menu, Target, Check
} from 'lucide-react';
import useStore from '../../store/useStore.js';
import { SKILL_ROLES } from '../../lib/data.js';

export default function TopNavbar() {
  const navigate = useNavigate();

  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const targetRole = useStore(s => s.targetRole) || 'ml-engineer';
  const toggleMobileSidebar = useStore(s => s.toggleMobileSidebar);

  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const targetRoleObj = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'];

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const term = search.toLowerCase();
      if (term.includes('assess') || term.includes('gap') || term.includes('skill')) navigate('/assessment');
      else if (term.includes('problem') || term.includes('daily')) navigate('/daily-problem');
      else if (term.includes('code') || term.includes('python') || term.includes('sql') || term.includes('lab')) navigate('/code-labs');
      else if (term.includes('map') || term.includes('roadmap') || term.includes('plan')) navigate('/improvement-map');
      else if (term.includes('job') || term.includes('salary')) navigate('/jobs');
      else if (term.includes('video') || term.includes('doc')) navigate('/videos');
      else if (term.includes('setting')) navigate('/settings');
      else if (term.includes('help')) navigate('/help');
      else navigate('/');
      setSearch('');
    }
  };

  return (
    <div className="sb-top-navigation-shell">
      <header className="sb-topbar">
        {/* Left: Mobile Toggle + Search */}
        <div className="sb-topbar-left">
          <button
            type="button"
            className="sb-mobile-btn"
            onClick={toggleMobileSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="sb-search-box">
            <Search size={14} className="sb-search-icon" />
            <input
              id="global-search-input"
              type="text"
              className="sb-search-input"
              placeholder="Search skills, problems, roadmaps... (Enter)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Right: Target Role, Gamification, Theme & Profile */}
        <div className="sb-topbar-right">
          {/* Active Target Role Badge */}
          <button
            type="button"
            className="sb-target-role-pill"
            onClick={() => navigate('/assessment?stage=gap')}
            title="Change target role or view gap analysis"
          >
            <Target size={13} className="sb-target-icon" />
            <span className="sb-target-name">{targetRoleObj.name}</span>
          </button>

          {/* Gamification Stats */}
          <div className="sb-stats-pill">
            <span className="sb-streak-item" title="Daily streak">
              🔥 {streak}d
            </span>
            <span className="sb-stats-sep">·</span>
            <span className="sb-xp-item" title="Total XP">
              {xp} XP
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="sb-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User Profile */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="sb-avatar-btn"
              onClick={() => setShowProfile(v => !v)}
              title="Account Menu"
            >
              <div className="sb-avatar-circle">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={12} color="var(--text-subtle)" />
            </button>

            {showProfile && (
              <div className="sb-profile-menu">
                <div className="sb-profile-header">
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{user?.name || 'Learner'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{user?.email || 'learner@skillbridge.io'}</div>
                </div>
                <button
                  type="button"
                  className="sb-menu-item"
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <div className="sb-menu-divider" />
                <button
                  type="button"
                  className="sb-menu-item danger"
                  onClick={() => { logout(); navigate('/login'); }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Liquid Frosted Glass Horizontal Navigation Tabs Bar */}
      <nav className="sb-glass-nav-tabs" aria-label="Main">
        <NavLink to="/" end className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/assessment" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Skill assessment <em>Guided</em>
        </NavLink>
        <NavLink to="/improvement-map" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Improvement map <em>Plan</em>
        </NavLink>
        <NavLink to="/code-labs" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Code labs <em>IDE</em>
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Job market
        </NavLink>
        <NavLink to="/daily-problem" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Daily problem <em>+20 XP</em>
        </NavLink>
        <NavLink to="/videos" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Learning hub <em>Free</em>
        </NavLink>
        <NavLink to="/help" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Help &amp; guide
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sb-glass-tab ${isActive ? 'active' : ''}`}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
}
