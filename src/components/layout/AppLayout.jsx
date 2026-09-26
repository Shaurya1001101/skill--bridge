import { Outlet } from 'react-router-dom';
import useStore from '../../store/useStore.js';
import TopNavbar from './TopNavbar.jsx';
import BottomRightDock from './BottomRightDock.jsx';
import ToastContainer from '../ui/ToastContainer.jsx';
import AIAssistant from '../ui/AIAssistant.jsx';

export default function AppLayout() {
  const safetyScale = useStore(s => s.safetyScale);

  return (
    <div className={`app-shell ${safetyScale ? 'safety-scale-active' : ''}`}>
      {/* Sticky Dual-Row Top Navigation (Command Header + Feature Tabs Bar) */}
      <TopNavbar />

      {/* Main Scrollable Viewport: when user scrolls, TopNavbar remains firmly pinned */}
      <main className="app-viewport">
        <div className="app-content-container">
          <Outlet />
        </div>
      </main>

      {/* Floating Bottom-Right Settings Dock */}
      <BottomRightDock />

      {/* Bottom-Right AI Career Assistant */}
      <AIAssistant />

      {/* Top-Right Notification Toasts (dismissible, never blocks bottom right) */}
      <ToastContainer />
    </div>
  );
}
