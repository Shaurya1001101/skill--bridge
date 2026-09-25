import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Brain, BarChart2, TrendingUp, Map, Code2,
  PlayCircle, Briefcase, Zap, HelpCircle, Settings, LogOut,
  ChevronLeft, ChevronRight, Trophy
} from 'lucide-react';
import useStore from '../../store/useStore.js';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/analyzer', label: 'Skill Analyzer', icon: Brain, badge: 'AI' },
  { path: '/gap-analysis', label: 'Gap Analysis', icon: BarChart2 },
  { path: '/trajectory', label: 'Skill Trajectory', icon: TrendingUp, badge: 'Sim' },
  { path: '/improvement-map', label: 'Improvement Map', icon: Map, badge: 'New' },
  { path: '/code-labs', label: 'Code Labs', icon: Code2, badge: 'Code' },
  { path: '/videos', label: 'Learning & Videos', icon: PlayCircle, badge: 'Free' },
  { path: '/jobs', label: 'Job Market', icon: Briefcase },
  { path: '/daily-problem', label: 'Daily Problem', icon: Zap, badge: 'XP' },
];

const SUPPORT_ITEMS = [
  { path: '/help', label: 'Help & Assistant', icon: HelpCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <span className="nav-icon"><item.icon size={16} /></span>
      {!collapsed && (
        <>
          <span className="nav-label">{item.label}</span>
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const collapsed = useStore(s => s.sidebarCollapsed);
  const mobileSidebarOpen = useStore(s => s.mobileSidebarOpen);
  const toggleSidebar = useStore(s => s.toggleSidebar);
  const user = useStore(s => s.user);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <path d="M4 14C4 8.5 8.5 4 14 4C19.5 4 24 8.5 24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 18C8 15.2 10.7 13 14 13C17.3 13 20 15.2 20 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="14" cy="21" r="2.5" fill="white"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-name">SkillBridge</span>
              <span className="logo-by">by Code Hustlers</span>
            </div>
          )}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Scrollable Nav */}
      <div className="sidebar-scroll">
        {!collapsed && <div className="sidebar-section-label">MAIN</div>}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && <div className="sidebar-section-label">SUPPORT</div>}
        <nav className="sidebar-nav">
          {SUPPORT_ITEMS.map(item => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
          <button
            className="nav-item"
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--text-muted)' }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <span className="nav-icon"><LogOut size={16} /></span>
            {!collapsed && <span className="nav-label">Sign Out</span>}
          </button>
        </nav>
      </div>

      {/* Footer — XP & Streak */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="user-avatar" style={{ flexShrink: 0 }}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <span className="streak-badge" style={{ fontSize: 10, padding: '1px 6px' }}>
                  <Trophy size={10} /> {streak} day streak
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 600 }}>{xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
