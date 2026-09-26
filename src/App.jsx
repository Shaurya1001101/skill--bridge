import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import useStore from './store/useStore.js';

import AppLayout from './components/layout/AppLayout.jsx';

// Route-based code splitting: heavy modules (charts, analyzers, IDE, PDF/Mammoth) load on demand
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const SkillAnalyzerPage = lazy(() => import('./pages/SkillAnalyzerPage.jsx'));
const GapAnalysisPage = lazy(() => import('./pages/GapAnalysisPage.jsx'));
const TrajectoryPage = lazy(() => import('./pages/TrajectoryPage.jsx'));
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
        border: '3px solid rgba(122, 155, 118, 0.25)',
        borderTopColor: 'var(--brand)',
        animation: 'spin 0.75s linear infinite',
      }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-subtle)', fontFamily: 'Outfit, sans-serif' }}>
        Loading view...
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="analyzer" element={<SkillAnalyzerPage />} />
            <Route path="gap-analysis" element={<GapAnalysisPage />} />
            <Route path="trajectory" element={<TrajectoryPage />} />
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
    </BrowserRouter>
  );
}
