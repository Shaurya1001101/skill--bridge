import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense, Component } from 'react';
import useStore from './store/useStore.js';

import AppLayout from './components/layout/AppLayout.jsx';

// Roadmap P7.3: Error boundary around routes so a single error never turns the whole app blank
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SkillBridge Route Crash caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24, textAlign: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', fontSize: 24 }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
            Something went wrong loading this screen
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440, margin: 0 }}>
            An unexpected error occurred while rendering the view. You can return to the dashboard safely.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
          >
            Back to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Route-based code splitting: heavy modules (charts, analyzers, IDE, PDF/Mammoth) load on demand
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const SkillAssessmentPage = lazy(() => import('./pages/SkillAssessmentPage.jsx'));
const ImprovementMapPage = lazy(() => import('./pages/ImprovementMapPage.jsx'));
const CodeLabsPage = lazy(() => import('./pages/CodeLabsPage.jsx'));
const VideoHubPage = lazy(() => import('./pages/VideoHubPage.jsx'));
const JobMarketPage = lazy(() => import('./pages/JobMarketPage.jsx'));
const DailyProblemPage = lazy(() => import('./pages/DailyProblemPage.jsx'));
const HelpPage = lazy(() => import('./pages/HelpPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 12 }}>
      <div style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: '3px solid rgba(37, 99, 235, 0.25)',
        borderTopColor: 'var(--brand)',
        animation: 'spin 0.75s linear infinite',
      }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', fontFamily: 'var(--font-display)' }}>
        Loading workspace...
      </span>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const user = useStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const theme = useStore(s => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="assessment" element={<SkillAssessmentPage />} />
              <Route path="analyzer" element={<Navigate to="/assessment?stage=analyze" replace />} />
              <Route path="gap-analysis" element={<Navigate to="/assessment?stage=gap" replace />} />
              <Route path="trajectory" element={<Navigate to="/assessment?stage=trajectory" replace />} />
              <Route path="improvement-map" element={<ImprovementMapPage />} />
              <Route path="code-labs" element={<CodeLabsPage />} />
              <Route path="videos" element={<VideoHubPage />} />
              <Route path="jobs" element={<JobMarketPage />} />
              <Route path="daily-problem" element={<DailyProblemPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
