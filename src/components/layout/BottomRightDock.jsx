import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Sliders, Moon, Sun, ShieldCheck } from 'lucide-react';
import useStore from '../../store/useStore.js';

export default function BottomRightDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const safetyScale = useStore(s => s.safetyScale);
  const toggleSafetyScale = useStore(s => s.toggleSafetyScale);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);

  const isSettingsActive = location.pathname === '/settings';

  return (
    <aside className="bottom-right-dock" aria-label="Quick Settings Bar">
      {/* 90% Scale Toggle */}
      <button
        type="button"
        className={`dock-btn ${safetyScale ? 'dock-btn-accent' : ''}`}
        onClick={toggleSafetyScale}
        title={safetyScale ? '90% View Scale Active. Click for 100% scale.' : '100% Scale. Click for 90% View Scale safety net.'}
        aria-label="Toggle view scale"
      >
        <span className="dock-scale-badge">{safetyScale ? '90%' : '100%'}</span>
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        className="dock-btn"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Settings Launcher */}
      <button
        type="button"
        className={`dock-btn ${isSettingsActive ? 'dock-btn-active' : ''}`}
        onClick={() => navigate('/settings')}
        title="Settings & Preferences"
        aria-label="Open Settings"
        id="dock-settings-btn"
      >
        <Settings size={16} />
      </button>
    </aside>
  );
}
