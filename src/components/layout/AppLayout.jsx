import { Outlet, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import useStore from '../../store/useStore.js';
import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';
import ToastContainer from '../ui/ToastContainer.jsx';
import AIAssistant from '../ui/AIAssistant.jsx';

export default function AppLayout() {
  const safetyScale = useStore(s => s.safetyScale);
  const mobileSidebarOpen = useStore(s => s.mobileSidebarOpen);
  const closeMobileSidebar = useStore(s => s.closeMobileSidebar);
  const location = useLocation();
  const workspaceRef = useRef(null);

  // Automatically reset scroll position when switching tabs/routes (e.g. clicking Settings)
  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`sb-app-shell ${safetyScale ? 'safety-scale-active' : ''}`}>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="sb-mobile-backdrop"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="sb-workspace-pane" ref={workspaceRef}>
        <TopNavbar />
        <main className="sb-main-viewport">
          <div className="sb-content-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Career Assistant and Notifications */}
      <AIAssistant />
      <ToastContainer />
    </div>
  );
}
