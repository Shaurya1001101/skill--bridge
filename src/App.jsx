import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useStore from './store/useStore.js';

import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SkillAnalyzerPage from './pages/SkillAnalyzerPage.jsx';
import GapAnalysisPage from './pages/GapAnalysisPage.jsx';
import TrajectoryPage from './pages/TrajectoryPage.jsx';
import ImprovementMapPage from './pages/ImprovementMapPage.jsx';
import CodeLabsPage from './pages/CodeLabsPage.jsx';
import VideoHubPage from './pages/VideoHubPage.jsx';
import JobMarketPage from './pages/JobMarketPage.jsx';
import DailyProblemPage from './pages/DailyProblemPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ProtectedRoute({ children }) {
  const user = useStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const theme = useStore(s => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
