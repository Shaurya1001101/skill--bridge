import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, TrendingUp, AlertTriangle, Users, ArrowRight,
  Newspaper, Lightbulb, Star, Trophy, Zap, BookOpen
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import useStore from '../store/useStore.js';
import { HEATMAP_DATA, PEER_PROFILES, TREND_DATA, STATIC_NEWS_FALLBACK, VIDEO_LIBRARY, SKILL_ROLES } from '../lib/data.js';
import { computeReadiness, rankVideosForGaps } from '../lib/storage.js';

// ─── Animated KPI Card ────────────────────────────────────────────────────────
function KPICard({ value, suffix, label, trend, trendUp, colorClass }) {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);
  useEffect(() => {
    let start = null;
    const target = value;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setDisplayed(Math.round(prog * target));
      if (prog < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  return (
    <div className={`kpi-card ${colorClass}`}>
      <div className="kpi-value">{displayed}{suffix}</div>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-trend ${trendUp ? 'kpi-up' : 'kpi-down'}`}>{trend}</div>
    </div>
  );
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
function SkillHeatmap() {
  const catClass = { critical: 'heat-critical', high: 'heat-high', medium: 'heat-medium', low: 'heat-low', ok: 'heat-ok' };
  const catLabel = { critical: 'Critical', high: 'High Gap', medium: 'Medium', low: 'Low Gap', ok: 'Met' };
  return (
    <div className="skill-heatmap">
      {HEATMAP_DATA.map(d => (
        <div key={d.name} className={`heat-cell ${catClass[d.cat]}`} title={`${d.name}: ${d.pct}% coverage`}>
          <div className="heat-cell-name">{d.name}</div>
          <div className="heat-cell-val">{d.pct}%</div>
          <div className="heat-cell-sub">{catLabel[d.cat]}</div>
        </div>
      ))}
    </div>
  );
}

// ─── News Panel ───────────────────────────────────────────────────────────────
function NewsPanel() {
  const [news, setNews] = useState(STATIC_NEWS_FALLBACK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const cached = localStorage.getItem('sb_daily_news');
    if (cached) {
      try {
        const { date, items } = JSON.parse(cached);
        if (date === today) { setNews(items); return; }
      } catch {}
    }
    setLoading(true);
    fetch('/api/news')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.items?.length) {
          setNews(data.items);
          localStorage.setItem('sb_daily_news', JSON.stringify({ date: today, items: data.items }));
        }
      })
      .catch(() => {}) // silently fall back to static
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 40 }} />)}
        </div>
      ) : (
        news.slice(0, 5).map((item, i) => (
          <div key={i} className="news-item">
            <div className="news-dot" />
            <div>
              <div className="news-title" onClick={() => window.open(item.url || '#', '_blank')}>
                {item.title}
              </div>
              <div className="news-meta">
                <span className="badge badge-brand" style={{ fontSize: 9, marginRight: 6 }}>{item.tag}</span>
                {item.date}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Peer Benchmarks ─────────────────────────────────────────────────────────
function PeerBenchmarks() {
  const role = SKILL_ROLES['ml-engineer'];
  const peers = PEER_PROFILES.slice(0, 4).map(p => ({
    ...p, score: computeReadiness(p.skills, role),
  })).sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {peers.map(p => {
        const col = p.score >= 80 ? 'var(--success)' : p.score >= 65 ? 'var(--warning)' : 'var(--info)';
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {p.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{p.currentRole}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: col }}>{p.score}%</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Trend Chart ─────────────────────────────────────────────────────────────
function TrendChart() {
  const datasets = TREND_DATA['ai-ml'];
  const data = TREND_DATA.labels.map((label, i) => {
    const point = { label };
    datasets.forEach(ds => { point[ds.name] = ds.data[i]; });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} />
        <Tooltip
          contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: 'var(--text)' }}
        />
        {datasets.map(ds => (
          <Line key={ds.name} type="monotone" dataKey={ds.name} stroke={ds.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Recommended Videos Row ──────────────────────────────────────────────────
function RecommendedVideos({ gapSkills }) {
  const ranked = rankVideosForGaps(VIDEO_LIBRARY, gapSkills).slice(0, 3);
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {ranked.map(v => (
        <div key={v.id} className="card" style={{ padding: 12, cursor: 'pointer' }} onClick={() => window.open(v.url, '_blank')}>
          <div style={{ height: 60, borderRadius: 6, background: v.thumbnail, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: 'Outfit' }}>
            {v.channel.charAt(0)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>{v.title.slice(0, 45)}...</div>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{v.channel} · {v.duration}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Project Suggestion ──────────────────────────────────────────────────────
function ProjectSuggestion({ gapResults }) {
  if (!gapResults) return null;
  const topGaps = gapResults.gaps?.slice(0, 3) || [];
  if (topGaps.length === 0) return null;
  return (
    <div className="card" style={{ background: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Lightbulb size={16} color="var(--brand-light)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Closes the Most Gaps: Suggested Project</span>
        <span className="badge badge-brand">AI Pick</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
        {topGaps.includes('MLOps') || topGaps.includes('Docker')
          ? 'End-to-End ML API with Docker & CI/CD'
          : topGaps.includes('PyTorch') || topGaps.includes('Deep Learning')
          ? 'Custom Neural Network from Scratch in PyTorch'
          : 'Predictive Analytics Dashboard with Scikit-learn & SQL'}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        This project directly demonstrates your top gap skills: <strong style={{ color: 'var(--brand-light)' }}>{topGaps.join(', ')}</strong>. 
        Building and deploying it covers more of your missing competencies than any other single project.
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useStore(s => s.user);
  const gapResults = useStore(s => s.gapResults);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const solvedProblems = useStore(s => s.solvedProblems);

  const gapSkills = gapResults?.gaps || [];
  const readiness = gapResults?.readiness || 67;

  // Ticker items
  const TICKER = [
    'LinkedIn Hiring Index: 142,850+ Open Roles  +14.2% MoM',
    'Stack Overflow Top Rising: LangChain & PyTorch  +312% YoY',
    'Median GenAI Salary: ₹28.5L–₹45L LPA',
    'MLOps Engineer Salary Up 28% YoY',
    'Python: #1 Most Used Language 12 Years Running',
    'GenAI Demand: +110.8% MoM Velocity in Bengaluru',
  ];

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back, {user?.name || 'User'} 👋
          </h1>
          <p className="page-subtitle">
            AI Skill Gap Platform · Interactive Labs · Learning Roadmaps · Daily Challenges
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/analyzer')}>Analyze Resume</button>
          <button className="btn btn-primary" onClick={() => navigate('/gap-analysis')}>Run Gap Analysis</button>
        </div>
      </div>

      {/* Market Pulse Ticker */}
      <div className="market-ticker" style={{ marginBottom: 20 }}>
        <div className="ticker-badge">LIVE MARKET PULSE</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div className="ticker-scroll">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="ticker-item">{t}</span>
            ))}
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>Explore Jobs →</button>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard value={500} suffix="" label="Learners Evaluated" trend="+12 this month" trendUp colorClass="kpi-primary" />
        <KPICard value={readiness} suffix="%" label="AI Readiness" trend="+5% vs last quarter" trendUp colorClass="kpi-success" />
        <KPICard value={gapSkills.length || 8} suffix="" label="Critical Skill Gaps" trend={gapSkills.length > 0 ? `${gapSkills.length} gaps identified` : 'Run analysis'} trendUp={false} colorClass="kpi-warning" />
        <KPICard value={43} suffix="" label="Upskilling Candidates" trend="Ready for transition" trendUp colorClass="kpi-info" />
      </div>

      {/* XP / Streak Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Trophy size={22} color="var(--warning)" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit' }}>{xp} XP</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total experience points</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Zap size={22} color="#F59E0B" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit' }}>{streak} days</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Current streak</div>
          </div>
          {streak >= 3 && <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>On Fire!</span>}
        </div>
        <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BookOpen size={22} color="var(--success)" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit' }}>{solvedProblems.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Problems solved</div>
          </div>
          <button className="btn btn-sm btn-success" style={{ marginLeft: 'auto' }} onClick={() => navigate('/daily-problem')}>
            Today's Problem
          </button>
        </div>
      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        {/* Skill Heatmap (wide) */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 className="card-title">Organizational Skill Heatmap</h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#F87171', display: 'inline-block' }} /> Critical
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#FCD34D', display: 'inline-block' }} /> High
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#93C5FD', display: 'inline-block' }} /> Medium
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#34D399', display: 'inline-block' }} /> Met
              </div>
            </div>
          </div>
          <SkillHeatmap />
        </div>

        {/* Top Critical Gaps */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Critical Gaps</h2>
            <span className="badge badge-danger">Needs Action</span>
          </div>
          {HEATMAP_DATA.filter(d => d.pct < 55).sort((a, b) => a.pct - b.pct).slice(0, 6).map(d => {
            const col = d.pct < 40 ? 'var(--danger)' : d.pct < 55 ? 'var(--warning)' : 'var(--info)';
            return (
              <div key={d.name} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{d.pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${d.pct}%`, background: col }} />
                </div>
              </div>
            );
          })}
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => navigate('/gap-analysis')}>
            Run Full Analysis <ArrowRight size={12} />
          </button>
        </div>

        {/* Peer Benchmarks */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Peer Learners & Benchmarks</h2>
            <button className="btn-link" onClick={() => navigate('/jobs')}>View All →</button>
          </div>
          <PeerBenchmarks />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h2 className="card-title">Emerging Skill Demand (AI/ML — 2022–2024)</h2>
          <span className="badge badge-info">Illustrative Data</span>
        </div>
        <TrendChart />
      </div>

      {/* Daily News + Recommended Videos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><Newspaper size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Daily Skill News</h2>
            <span className="badge badge-success">Daily</span>
          </div>
          <NewsPanel />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recommended for You</h2>
            <span className="badge badge-brand">Gap-Ranked</span>
          </div>
          <RecommendedVideos gapSkills={gapSkills} />
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => navigate('/videos')}>
            All Videos →
          </button>
        </div>
      </div>

      {/* Project Suggestion */}
      <ProjectSuggestion gapResults={gapResults} />

      {/* Pipeline Overview */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <h2 className="card-title">8-Stage AI Pipeline</h2>
          <span className="badge badge-success">Active</span>
        </div>
        <div className="pipeline-stages">
          {['Problem', 'Collect Data', 'Clean Data', 'Analyze', 'Build AI', 'Insight', 'Product', 'Impact'].map((stage, i) => (
            <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`pipeline-stage ${i < 4 ? 'completed' : i === 4 ? 'active-stage' : ''}`}>
                <div className="stage-dot" />
                <span>{stage}</span>
              </div>
              {i < 7 && <div className={`pipeline-connector ${i < 4 ? 'completed' : ''}`} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
