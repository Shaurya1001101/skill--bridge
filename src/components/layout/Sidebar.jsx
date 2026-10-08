import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Code2, Calendar, BookOpen,
  Briefcase, Zap, HelpCircle, Settings, LogOut, LogIn,
  PanelLeftClose, PanelLeft, Flame, Trophy, ChevronRight
} from 'lucide-react';
import useStore from '../../store/useStore.js';

export default function Sidebar() {
  const collapsed = useStore(s => s.sidebarCollapsed);
  const mobileSidebarOpen = useStore(s => s.mobileSidebarOpen);
  const closeMobileSidebar = useStore(s => s.closeMobileSidebar);
  const toggleSidebar = useStore(s => s.toggleSidebar);
  const user = useStore(s => s.user);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = () => {
    if (mobileSidebarOpen) closeMobileSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const PRIMARY_ITEMS = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/assessment', label: 'Skill Assessment', icon: Compass, badge: 'Diagnostic' },
    { path: '/daily-problem', label: 'Daily Problem', icon: Zap, badge: '+20 XP' },
    { path: '/code-labs', label: 'Code Labs', icon: Code2, badge: 'IDE' },
    { path: '/improvement-map', label: 'Learning Roadmap', icon: Calendar },
  ];

  const SECONDARY_ITEMS = [
    { path: '/videos', label: 'Video Hub & Docs', icon: BookOpen },
    { path: '/jobs', label: 'Job Benchmarks', icon: Briefcase },
  ];

  return (
    <aside className={`sb-sidebar ${collapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sb-sidebar-header">
        <NavLink to="/" className="sb-brand-link" title="SkillBridge">
          <div className="sb-brand-mark">
            <img src="/skillbridge-logo.jpeg" alt="SkillBridge Logo" className="sb-brand-logo-img" />
          </div>
          {!collapsed && (
            <div className="sb-brand-text">
              <span className="sb-brand-name">SkillBridge</span>
              <span className="sb-brand-badge">Practice</span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          className="sb-collapse-btn"
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <div className="sb-sidebar-body">
        {/* Practice & Diagnostics */}
        <div className="sb-nav-section">
          {!collapsed && <span className="sb-section-title">PRACTICE &amp; SKILLS</span>}
          <div className="sb-nav-list">
            {PRIMARY_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `sb-nav-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sb-nav-icon"><Icon size={16} /></span>
                  {!collapsed && (
                    <>
                      <span className="sb-nav-label">{item.label}</span>
                      {item.badge && <span className="sb-nav-pill">{item.badge}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Explore & Benchmarks */}
        <div className="sb-nav-section">
          {!collapsed && <span className="sb-section-title">EXPLORE</span>}
          <div className="sb-nav-list">
            {SECONDARY_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sb-nav-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sb-nav-icon"><Icon size={16} /></span>
                  {!collapsed && <span className="sb-nav-label">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="sb-sidebar-footer">
        <div className="sb-nav-list">
          <NavLink
            to="/help"
            className={({ isActive }) => `sb-nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
            title={collapsed ? 'Help & Guide' : undefined}
          >
            <span className="sb-nav-icon"><HelpCircle size={16} /></span>
            {!collapsed && <span className="sb-nav-label">Help &amp; Guide</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `sb-nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
            title={collapsed ? 'Settings' : undefined}
          >
            <span className="sb-nav-icon"><Settings size={16} /></span>
            {!collapsed && <span className="sb-nav-label">Settings</span>}
          </NavLink>
        </div>

        {/* User Card */}
        <div className="sb-user-card-wrap">
          {user ? (
            <div className="sb-user-card">
              <div className="sb-user-avatar">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="sb-user-meta">
                  <div className="sb-user-name">{user.name || 'Learner'}</div>
                  <div className="sb-user-badges">
                    <span className="sb-streak-badge">🔥 {streak}d</span>
                    <span className="sb-xp-text">{xp} XP</span>
                  </div>
                </div>
              )}
              {!collapsed && (
                <button
                  type="button"
                  className="sb-signout-btn"
                  onClick={handleLogout}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="sb-signin-btn"
              onClick={() => navigate('/login')}
            >
              <LogIn size={15} />
              {!collapsed && <span>Sign In / Demo</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
