import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, TrendingUp, AlertTriangle, Users, ArrowRight,
  Newspaper, Lightbulb, Star, Trophy, Zap, BookOpen,
  CheckCircle2, Compass, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

import useStore from '../store/useStore.js';
import { PEER_PROFILES, TREND_DATA, STATIC_NEWS_FALLBACK, VIDEO_LIBRARY, SKILL_ROLES } from '../lib/data.js';
import { computeReadiness, rankVideosForGaps } from '../lib/storage.js';
import { apiUrl } from '../lib/api.js';
import CuratedLearningAndNewsFeed from '../components/ui/CuratedLearningAndNewsFeed.jsx';

// ─── Compact KPI Card ────────────────────────────────────────────────────────
function ConsolidatedKPICard({ title, value, subtitle, badge, badgeColor, icon: Icon, onClick, ctaText }) {
  return (
    <div
      className="card kpi-consolidated-card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--bg-subtle, rgba(255,255,255,0.06))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand)',
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display, inherit)' }}>
          {value}
        </span>
        {badge && (
          <span
            className="badge"
            style={{
              background: badgeColor ? `${badgeColor}18` : 'rgba(59,130,246,0.15)',
              color: badgeColor || 'var(--brand-light)',
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 7px',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
          {subtitle}
        </span>
        {ctaText && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 2 }}>
            {ctaText} →
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Compact Auto-Scrolling Market Pulse Ticker ─────────────────────────────
function CompactMarketTicker() {
  const navigate = useNavigate();
  const TICKER = [
    'LinkedIn Hiring Index: 142,850+ Open Roles (+14.2% MoM)',
    'Top Rising Skills: LangChain, PyTorch & MLOps (+312% YoY)',
    'Median GenAI Salary: ₹28.5L–₹45L LPA',
    'MLOps Engineer Velocity: Up 28% YoY',
    'Python: #1 Most Demanded Language for 12 Consecutive Years',
    'Cloud AI Demand: +110.8% MoM Surge in Bengaluru',
  ];

  return (
    <div className="compact-market-pulse-bar" style={{ marginBottom: 18 }}>
      <div className="pulse-tag">
        <span className="pulse-ping" />
        <span>Market Pulse</span>
      </div>
      <div className="pulse-track-window">
        <div className="pulse-track-slider">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="pulse-item">
              {t}
              <span className="pulse-sep">·</span>
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="pulse-action-link"
        onClick={() => navigate('/jobs')}
      >
        Jobs →
      </button>
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
            <div style={{ width: 30, height: 30, borderRadius: 6, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {p.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{p.currentRole}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: col, fontFamily: 'var(--font-display)' }}>{p.score}%</div>
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
        <YAxis tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} unit="%" />
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

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useStore(s => s.user);
  const gapResults = useStore(s => s.gapResults);
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const solvedProblems = useStore(s => s.solvedProblems);
  const targetRole = useStore(s => s.targetRole) || 'ml-engineer';

  const [insightsOpen, setInsightsOpen] = useState(false);

  const isDemo = user?.email === 'user@skillbridge.io';
  const hasAnalysis = Boolean(gapResults);
  const gapSkills = gapResults?.gaps || (isDemo ? ['MLOps', 'PyTorch', 'Docker', 'Kubernetes'] : []);
  const readiness = gapResults?.readiness !== undefined ? gapResults.readiness : isDemo ? 67 : 0;
  const targetRoleObj = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'];

  return (
    <div className="dashboard-page-container">
      {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 14 }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            Welcome back, {user?.name || 'Developer'} 👋
          </h1>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Target Role: <strong style={{ color: 'var(--text)' }}>{targetRoleObj.name}</strong> · AI Skill Diagnostic & Learning Roadmap
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/assessment?stage=analyze')}
          >
            Analyze Resume
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/assessment?stage=gap')}
          >
            Skill Assessment →
          </button>
        </div>
      </div>

      {/* ─── Compact Live Market Pulse Ticker ──────────────────────────────────── */}
      <CompactMarketTicker />

      {/* ─── Single Consolidated Row of Key Metrics (Zero Duplication) ───────── */}
      <div className="kpi-consolidated-grid" style={{ marginBottom: 20 }}>
        {/* 1. AI Readiness */}
        <ConsolidatedKPICard
          title="AI Role Readiness"
          value={`${readiness}%`}
          subtitle={hasAnalysis ? `Benchmarked to ${targetRoleObj.name}` : 'Click to run initial diagnostic'}
          badge={readiness >= 75 ? 'Strong Fit' : readiness >= 50 ? 'Good Fit' : 'Diagnose'}
          badgeColor={readiness >= 75 ? 'var(--success)' : readiness >= 50 ? 'var(--warning)' : 'var(--danger)'}
          icon={Compass}
          onClick={() => navigate('/assessment?stage=gap')}
          ctaText="View Gap Report"
        />

        {/* 2. Identified Skill Gaps */}
        <ConsolidatedKPICard
          title="Identified Skill Gaps"
          value={gapSkills.length}
          subtitle={gapSkills.length > 0 ? `${gapSkills.slice(0, 2).join(', ')}...` : 'All role skills mastered'}
          badge={gapSkills.length > 0 ? `${gapSkills.length} to master` : 'Clean'}
          badgeColor={gapSkills.length > 0 ? 'var(--danger)' : 'var(--success)'}
          icon={AlertTriangle}
          onClick={() => navigate('/assessment?stage=gap')}
          ctaText="Review Gaps"
        />

        {/* 3. XP & Streak Gamification (Consolidated) */}
        <ConsolidatedKPICard
          title="Experience & Streak"
          value={`${xp} XP`}
          subtitle={`${streak}-day active practice streak`}
          badge={streak >= 3 ? `🔥 ${streak}d On Fire` : `⚡ ${streak}d Streak`}
          badgeColor="var(--warning)"
          icon={Trophy}
          onClick={() => navigate('/daily-problem')}
          ctaText="+10 XP Today"
        />

        {/* 4. Problem & Lab Mastery */}
        <ConsolidatedKPICard
          title="Coding Drills Solved"
          value={solvedProblems.length}
          subtitle="Daily challenges & interactive lab exercises"
          badge="Interactive"
          badgeColor="var(--brand)"
          icon={BookOpen}
          onClick={() => navigate('/daily-problem')}
          ctaText="Solve Next"
        />
      </div>

      {/* ─── Main Content Grid: YouTube Feeds & Actionable Insights ──────────── */}
      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        {/* Curated YouTube Learning Masterclasses & Tech News with Image Support */}
        <CuratedLearningAndNewsFeed />

        {/* Right Column: Top Critical Gaps Quick Action */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ paddingBottom: 10 }}>
              <h2 className="card-title">Top Priority Gaps</h2>
              <span className={`badge ${gapSkills.length > 0 ? 'badge-danger' : 'badge-success'}`}>
                {gapSkills.length > 0 ? `${gapSkills.length} Action Items` : 'All Clear'}
              </span>
            </div>

            {gapSkills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {gapSkills.slice(0, 4).map((gap, i) => (
                  <div key={gap}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{gap}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: i < 2 ? 'var(--danger)' : 'var(--warning)' }}>
                        {i < 2 ? 'Critical Gap' : 'Medium Gap'}
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: 6 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.max(25, 65 - i * 12)}%`,
                          background: i < 2 ? 'var(--danger)' : 'var(--warning)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                  No critical gaps identified yet. Diagnose your skills or upload a resume in the Assessment tab.
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <button
              className="btn btn-primary btn-full btn-sm"
              onClick={() => navigate('/assessment?stage=gap')}
            >
              Open Full Assessment & Chart <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Progressive Disclosure: Secondary Insights Accordion ────────────── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          onClick={() => setInsightsOpen(!insightsOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '4px 0',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--brand)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Secondary Market Insights & Peer Benchmarks
            </h3>
            <span className="badge badge-info" style={{ fontSize: 10 }}>
              {insightsOpen ? 'Click to collapse' : 'Click to expand'}
            </span>
          </div>
          <button
            type="button"
            className="btn-chip"
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
          >
            {insightsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{insightsOpen ? 'Hide' : 'Show Details'}</span>
          </button>
        </div>

        {insightsOpen && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div className="responsive-two-col-grid" style={{ marginBottom: 16 }}>
              {/* Emerging Demand Trend Chart */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                    Emerging Skill Demand (AI/ML)
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Multi-year trajectory</span>
                </div>
                <TrendChart />
              </div>

              {/* Peer Learner Benchmarks */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                    Peer Learners in {targetRoleObj.name}
                  </span>
                  <button
                    className="btn-link"
                    style={{ fontSize: 11 }}
                    onClick={() => navigate('/jobs')}
                  >
                    Explore Job Market →
                  </button>
                </div>
                <PeerBenchmarks />
              </div>
            </div>

            {/* 8-Stage AI Engineering Pipeline */}
            <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                Industry 8-Stage AI Pipeline Progression
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
        )}
      </div>

      <style>{`
        .kpi-consolidated-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 1024px) {
          .kpi-consolidated-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .kpi-consolidated-grid {
            grid-template-columns: 1fr;
          }
        }
        .kpi-consolidated-card:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .compact-market-pulse-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 36px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0 12px;
          overflow: hidden;
        }
        .pulse-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          padding-right: 8px;
          border-right: 1px solid var(--border);
        }
        .pulse-ping {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }
        .pulse-track-window {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }
        .pulse-track-slider {
          display: inline-block;
          white-space: nowrap;
          animation: tickerScroll 42s linear infinite;
        }
        .pulse-track-slider:hover {
          animation-play-state: paused;
        }
        .pulse-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          color: var(--text-muted);
        }
        .pulse-sep {
          color: var(--text-subtle);
          font-weight: bold;
        }
        .pulse-action-link {
          background: transparent;
          border: none;
          color: var(--brand);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          padding-left: 8px;
        }
        .pulse-action-link:hover {
          text-decoration: underline;
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
