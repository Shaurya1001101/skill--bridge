import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, BookOpen, Compass, ChevronDown, ChevronUp, Sparkles,
  ExternalLink, Check, Clock, Award, Code2, Database, Layers,
  Calendar, Info, X, Target, Zap, ArrowRight, ShieldCheck, Flame,
  Terminal, CheckCircle2, AlertTriangle, Plus, PlayCircle, MapPin
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

import useStore from '../store/useStore.js';
import { PEER_PROFILES, TREND_DATA, SKILL_ROLES } from '../lib/data.js';
import CuratedLearningAndNewsFeed from '../components/ui/CuratedLearningAndNewsFeed.jsx';

// ─── Ticking Countdown to Midnight Hook ─────────────────────────────────────
function useCountdownToMidnight() {
  const [time, setTime] = useState({ hours: '06', minutes: '22', seconds: '58' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay - now);

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

// ─── 4-Phase Structured Curriculum Roadmaps by Role ─────────────────────────
const ROLE_CURRICULA = {
  'ml-engineer': [
    {
      phase: 1,
      title: 'Python Core & Algorithmic Foundations',
      hours: '24 hrs',
      status: 'completed',
      topics: ['Python OOP & Metaprogramming', 'Vectorization with NumPy', 'Time & Space Complexity', 'Algorithmic Drills']
    },
    {
      phase: 2,
      title: 'Deep Learning & Neural Architectures',
      hours: '32 hrs',
      status: 'in-progress',
      topics: ['PyTorch Tensors & Autograd', 'CNN & Transformer Backbones', 'Loss Functions & Optimization', 'Hyperparameter Tuning']
    },
    {
      phase: 3,
      title: 'MLOps, Packaging & Containerization',
      hours: '28 hrs',
      status: 'upcoming',
      topics: ['Docker Multi-Stage Builds', 'FastAPI Inference Endpoints', 'Model Registries & Artifacts', 'CI/CD Automated Testing']
    },
    {
      phase: 4,
      title: 'Distributed Inference & Production Scale',
      hours: '30 hrs',
      status: 'upcoming',
      topics: ['Kubernetes Deployment Manifests', 'Prometheus & Grafana Telemetry', 'Triton / ONNX Acceleration', 'Live System Benchmark']
    }
  ],
  'data-engineer': [
    {
      phase: 1,
      title: 'Relational Schemas & Advanced SQL',
      hours: '20 hrs',
      status: 'completed',
      topics: ['Window Functions & CTEs', 'B-Tree & Hash Index Optimization', 'ACID Transactions & Locks', 'Schema Normalization']
    },
    {
      phase: 2,
      title: 'Distributed Data Processing with Spark',
      hours: '30 hrs',
      status: 'in-progress',
      topics: ['PySpark RDDs & DataFrames', 'Shuffle & Partition Tuning', 'Batch ETL Pipelines', 'Delta Lake Architecture']
    },
    {
      phase: 3,
      title: 'Pipeline Orchestration & Streaming',
      hours: '26 hrs',
      status: 'upcoming',
      topics: ['Apache Airflow DAG Authoring', 'Kafka Pub/Sub Event Streaming', 'Schema Registries (Avro)', 'Data Quality Checks (Great Expectations)']
    },
    {
      phase: 4,
      title: 'Cloud Warehousing & Analytics Scale',
      hours: '28 hrs',
      status: 'upcoming',
      topics: ['Snowflake / BigQuery Partitioning', 'dbt Data Modeling & Tests', 'Cost & Query Profiling', 'Production Warehouse Benchmark']
    }
  ],
  'mlops-engineer': [
    {
      phase: 1,
      title: 'Linux Systems & Cloud Infrastructure',
      hours: '22 hrs',
      status: 'completed',
      topics: ['Shell Scripting & Permissions', 'Network Sockets & DNS', 'AWS/GCP IAM & VPC Networking', 'Terraform Basics']
    },
    {
      phase: 2,
      title: 'Containerization & Microservices',
      hours: '28 hrs',
      status: 'in-progress',
      topics: ['Docker Security & Layer Caching', 'Docker Compose Multi-Container', 'FastAPI & gRPC Protocol', 'Automated Health Probes']
    },
    {
      phase: 3,
      title: 'Kubernetes & Workflow Automation',
      hours: '34 hrs',
      status: 'upcoming',
      topics: ['K8s Pods, Deployments & Services', 'Helm Charts Packaging', 'GitHub Actions CI/CD', 'Argo Workflows / Kubeflow']
    },
    {
      phase: 4,
      title: 'Model Observability & Drift Detection',
      hours: '26 hrs',
      status: 'upcoming',
      topics: ['Evidently AI Drift Metrics', 'Prometheus Metrics Scraping', 'Grafana Alerting Rules', 'Production SLA Benchmark']
    }
  ],
  'data-scientist': [
    {
      phase: 1,
      title: 'Mathematical Statistics & EDA',
      hours: '20 hrs',
      status: 'completed',
      topics: ['Probability Distributions & Z-Scores', 'Hypothesis Testing & p-values', 'Pandas Data Wrangling', 'Seaborn & Plotly Visualization']
    },
    {
      phase: 2,
      title: 'Predictive Modeling & Scikit-Learn',
      hours: '30 hrs',
      status: 'in-progress',
      topics: ['Regularized Regression & Logistic', 'Tree Ensembles (XGBoost, LightGBM)', 'Feature Engineering & Imputation', 'Cross-Validation & ROC-AUC']
    },
    {
      phase: 3,
      title: 'Unsupervised Learning & NLP Foundations',
      hours: '24 hrs',
      status: 'upcoming',
      topics: ['K-Means & DBSCAN Clustering', 'PCA & Dimensionality Reduction', 'TF-IDF & Embeddings', 'Topic Modeling & Semantic Search']
    },
    {
      phase: 4,
      title: 'Business A/B Testing & Production Impact',
      hours: '22 hrs',
      status: 'upcoming',
      topics: ['Sample Size & Power Analysis', 'Causal Inference & Synthetic Controls', 'Streamlit Dashboard Apps', 'Executive Metric Presentation']
    }
  ]
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useStore(s => s.user);
  const userSkills = useStore(s => s.userSkills) || { all: [] };
  const gapResults = useStore(s => s.gapResults);
  const xp = useStore(s => s.xp) || 0;
  const streak = useStore(s => s.streak) || 1;
  const addXP = useStore(s => s.addXP);
  const addXp = useStore(s => s.addXp || s.addXP);
  const addToast = useStore(s => s.addToast);
  const solvedProblems = useStore(s => s.solvedProblems) || [];
  const targetRole = useStore(s => s.targetRole) || 'ml-engineer';
  const setTargetRole = useStore(s => s.setTargetRole);

  const [mounted, setMounted] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [matrixFilter, setMatrixFilter] = useState('gaps'); // 'gaps' | 'all' | 'ready'
  const [expandedPhase, setExpandedPhase] = useState(2);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Interactive Daily Practice Plan
  // Interactive Daily Practice Plan (starts 0 done for new users)
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: 'Establish baseline skills via Skill Assessment', xp: 25, done: false, link: '/skill-assessment' },
    { id: 2, text: 'Complete Daily Coding Challenge: Highest Earner SQL', xp: 20, done: false, link: '/daily-problem' },
    { id: 3, text: 'Explore Code Labs sandbox environment', xp: 15, done: false, link: '/code-labs' },
  ]);

  const countdown = useCountdownToMidnight();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 25);
    return () => clearTimeout(t);
  }, []);

  const isDemo = (user?.email === 'user@skillbridge.io' || user?.email === 'alex@skillbridge.io') && (user?.id === 1 || user?.id === '1') && Boolean(userSkills?.all?.length > 0 || gapResults);
  const targetRoleObj = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'] || { name: 'Machine Learning Engineer', skills: [] };
  const hasUserSkills = Boolean((userSkills?.all && userSkills.all.length > 0) || gapResults);

  // Safely normalize skills from targetRoleObj.skills
  const allRoleSkills = (targetRoleObj?.skills || []).map(s => {
    if (typeof s === 'string') return { name: s, weight: 0.15, required: 3 };
    return { name: s.name, weight: s.weight ?? 0.15, required: s.required ?? 3 };
  });

  const userSkillList = (userSkills?.all || []).map(s => String(s).toLowerCase());

  // Determine gap skills: For new users, all target role skills need assessment
  const gapSkills = gapResults?.gaps || (
    isDemo
      ? ['Docker', 'PyTorch', 'MLOps', 'Kubernetes']
      : hasUserSkills
        ? allRoleSkills.map(s => s.name).filter(name => !userSkillList.includes(name.toLowerCase()))
        : allRoleSkills.map(s => s.name)
  );

  // Build matrix list: For brand new user / guest (hasUserSkills is false), START AT 0%
  const matrixList = allRoleSkills.map(skObj => {
    const skillName = skObj.name;
    const weight = skObj.weight >= 0.15 ? 'Core' : skObj.weight >= 0.10 ? 'High' : 'Medium';

    if (!hasUserSkills && !isDemo) {
      return {
        skill: skillName,
        isGap: true,
        evidence: 'Unassessed',
        weight,
        pct: 0, // Starts strictly at 0% for new users & guest!
        required: skObj.required,
      };
    }

    if (isDemo) {
      let evidence = 'Claimed';
      let pct = 25;
      if (skillName === 'Docker' || skillName === 'PyTorch') {
        evidence = 'Claimed';
        pct = 25;
      } else if (skillName === 'MLOps' || skillName === 'Kubernetes') {
        evidence = 'Quizzed';
        pct = 60;
      } else if (skillName === 'Python' || skillName === 'SQL' || skillName === 'Git') {
        evidence = 'Tested';
        pct = 100;
      }
      return {
        skill: skillName,
        isGap: gapSkills.includes(skillName),
        evidence,
        weight,
        pct,
        required: skObj.required,
      };
    }

    // Authenticated user with real assessed skills
    const isMastered = userSkillList.includes(skillName.toLowerCase());
    return {
      skill: skillName,
      isGap: !isMastered,
      evidence: isMastered ? 'Tested' : 'Gap',
      weight,
      pct: isMastered ? 100 : 0,
      required: skObj.required,
    };
  });

  const filteredMatrix = matrixList.filter(item => {
    if (matrixFilter === 'gaps') return item.isGap;
    if (matrixFilter === 'ready') return !item.isGap;
    return true;
  });

  const topGap = gapSkills[0] || allRoleSkills[0]?.name || 'Assessment';
  const rawPhases = ROLE_CURRICULA[targetRole] || ROLE_CURRICULA['ml-engineer'];
  const phases = (!hasUserSkills && !isDemo)
    ? rawPhases.map((p, idx) => ({ ...p, status: idx === 0 ? 'in-progress' : 'upcoming' }))
    : rawPhases;

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name ? user.name.split(' ')[0] : 'Alex';
    if (hour < 12) return `Good morning, ${name} ☕`;
    if (hour < 17) return `Good afternoon, ${name} ☀️`;
    return `Good evening, ${name} 🌙`;
  };

  const handleToggleTask = (task) => {
    setDailyTasks(prev => prev.map(t => {
      if (t.id === task.id) {
        const nextDone = !t.done;
        if (nextDone) {
          addXp(t.xp);
          addToast(`Task completed! +${t.xp} XP added to your streak.`, 'success');
        }
        return { ...t, done: nextDone };
      }
      return t;
    }));
  };

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!newCustomTask.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newCustomTask.trim(),
      xp: 15,
      done: false,
    };
    setDailyTasks(prev => [...prev, newTask]);
    setNewCustomTask('');
    setShowAddTask(false);
    addToast('Custom practice task added to your plan.', 'info');
  };

  return (
    <div className={`sb-dashboard ${mounted ? 'is-mounted' : ''}`}>

      {/* ─── 1. Header & Role Selector Bar (Readiness Display Removed) ─── */}
      <div className="sb-dash-header">
        <div className="sb-dash-title-wrap">
          <h1 className="sb-dash-title">{getGreeting()}</h1>
          <div className="sb-dash-subtitle">
            <span>Targeting:</span>
            <div className="sb-dash-target-pill">
              <Target size={12} />
              <span>{targetRoleObj.name}</span>
            </div>
            <span style={{ color: 'var(--text-subtle)' }}>·</span>
            <span style={{ color: 'var(--brand-light)', fontWeight: 600 }}>
              {gapSkills.length} Priority Skill Gaps
            </span>
            <span style={{ color: 'var(--text-subtle)' }}>·</span>
            <button
              type="button"
              className="btn-link"
              onClick={() => setShowEvidenceModal(true)}
              style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Info size={12} /> Evidence Verification Guide
            </button>
          </div>
        </div>

        <div className="sb-dash-header-actions">
          {/* Target Role Selector Dropdown */}
          <select
            className="form-select"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text)',
              cursor: 'pointer'
            }}
          >
            {['Data Science & AI', 'Data Engineering', 'Analytics & BI', 'Cloud & Infrastructure', 'Software & Engineering'].map(cat => (
              <optgroup key={cat} label={`── ${cat} ──`}>
                {Object.entries(SKILL_ROLES)
                  .filter(([_, v]) => v.category === cat)
                  .map(([key, r]) => (
                    <option key={key} value={key}>
                      🎯 {r.name} ({r.avgSalary})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/assessment?stage=analyze')}
          >
            Upload Résumé
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/assessment?stage=gap')}
          >
            Skill Diagnostics →
          </button>
        </div>
      </div>

      {/* ─── 2. Spotlight Practice Focus Hero Card (Readiness Score Removed) ─── */}
      <div className="sb-spotlight-card">
        <div className="sb-spotlight-badge">
          <Sparkles size={12} />
          <span>Priority Practice Focus</span>
        </div>

        <div className="sb-spotlight-grid">
          <div>
            <h2 className="sb-spotlight-heading">
              Close your top shortfall: <span className="sb-spotlight-target-highlight">{topGap}</span>
            </h2>
            <p className="sb-spotlight-desc">
              Your target role requires verified proficiency in <strong>{topGap}</strong>. Your current evidence is <span style={{ color: isDemo ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>{isDemo ? 'Claimed (0.25)' : 'Unassessed (0.00)'}</span>. Completing interactive lab exercises in the browser upgrades your evidence to <span style={{ color: 'var(--success)', fontWeight: 600 }}>Tested (1.00)</span> and proves production readiness.
            </p>

            <div className="sb-spotlight-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/code-labs')}
              >
                Launch {topGap} Lab (15 min) →
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/videos')}
              >
                <BookOpen size={14} /> Review Concept Guide
              </button>
            </div>
          </div>

          <div className="sb-spotlight-metric-box">
            <div className="sb-spotlight-metric-tag">Next Skill Focus</div>
            <div className="sb-spotlight-metric-number" style={{ color: 'var(--brand-light)', fontSize: 24, margin: '8px 0' }}>
              {topGap}
            </div>
            <div className="sb-spotlight-metric-sub">
              Estimated: ~15 mins · Production Sandbox
            </div>

            <div className="sb-evidence-ladder">
              <span className={`sb-ladder-step ${!isDemo ? 'active' : ''}`}>Unassessed 0.00</span>
              <span className="sb-ladder-arrow">→</span>
              <span className={`sb-ladder-step ${isDemo ? 'active' : ''}`}>Claimed 0.25</span>
              <span className="sb-ladder-arrow">→</span>
              <span className="sb-ladder-step">Quizzed 0.60</span>
              <span className="sb-ladder-arrow">→</span>
              <span className="sb-ladder-step">Tested 1.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. 4 Metric KPI Cards (Readiness Card Replaced with Roadmap Phase) ─── */}
      <div className="sb-kpi-grid">
        {/* Card 1: Active Roadmap Phase */}
        <div className="sb-kpi-card" onClick={() => navigate('/improvement-map')}>
          <div className="sb-kpi-top">
            <span className="sb-kpi-label">Roadmap Milestone</span>
            <div className="sb-kpi-icon-wrap">
              <Layers size={15} />
            </div>
          </div>
          <div className="sb-kpi-val" style={{ color: 'var(--brand-light)' }}>
            {isDemo ? 'Phase 2 of 4' : 'Phase 1 of 4'}
          </div>
          <span className="sb-kpi-hint">
            {isDemo ? 'In Progress · 4 of 12 Weeks' : 'Getting Started · Week 1 of 12'}
          </span>
        </div>

        {/* Card 2: Skill Shortfalls */}
        <div className="sb-kpi-card" onClick={() => navigate('/assessment?stage=gap')}>
          <div className="sb-kpi-top">
            <span className="sb-kpi-label">Skill Shortfalls</span>
            <div className="sb-kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)' }}>
              <Compass size={15} />
            </div>
          </div>
          <div className="sb-kpi-val" style={{ color: gapSkills.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {gapSkills.length} Skills
          </div>
          <span className="sb-kpi-hint">
            {gapSkills.slice(0, 2).join(', ') || 'No critical gaps'}
          </span>
        </div>

        {/* Card 3: Daily Streak */}
        <div className="sb-kpi-card" onClick={() => navigate('/daily-problem')}>
          <div className="sb-kpi-top">
            <span className="sb-kpi-label">Daily Streak</span>
            <div className="sb-kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--gold)' }}>
              <Flame size={15} />
            </div>
          </div>
          <div className="sb-kpi-val" style={{ color: 'var(--gold)' }}>
            🔥 {streak} Days
          </div>
          <span className="sb-kpi-hint">{xp} Total XP accumulated</span>
        </div>

        {/* Card 4: Challenges Tested */}
        <div className="sb-kpi-card" onClick={() => navigate('/daily-problem')}>
          <div className="sb-kpi-top">
            <span className="sb-kpi-label">Challenges Tested</span>
            <div className="sb-kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
              <Code2 size={15} />
            </div>
          </div>
          <div className="sb-kpi-val">
            {solvedProblems.length} Solved
          </div>
          <span className="sb-kpi-hint">100% verified test passes</span>
        </div>
      </div>

      {/* ─── 4. Two-Column Workstation Layout ────────────────────────────── */}
      <div className="sb-dash-split-layout">

        {/* ─── LEFT COLUMN: Diagnostics & Curriculum ─── */}
        <div className="sb-main-feed">

          {/* Skill Diagnostic & Shortfall Matrix (CRASH FIXED) */}
          <div className="sb-matrix-card">
            <div className="sb-matrix-header">
              <div>
                <h3 className="card-title">Skill Diagnostic &amp; Shortfall Matrix</h3>
                <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '2px 0 0 0' }}>
                  Target: {targetRoleObj.name} · Verified Evidence Breakdown
                </p>
              </div>

              <div className="sb-filter-pill-group">
                <button
                  type="button"
                  className={`sb-filter-pill ${matrixFilter === 'gaps' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('gaps')}
                >
                  Critical Gaps ({matrixList.filter(i => i.isGap).length})
                </button>
                <button
                  type="button"
                  className={`sb-filter-pill ${matrixFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('all')}
                >
                  All Skills ({matrixList.length})
                </button>
                <button
                  type="button"
                  className={`sb-filter-pill ${matrixFilter === 'ready' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('ready')}
                >
                  Ready ({matrixList.filter(i => !i.isGap).length})
                </button>
              </div>
            </div>

            <div className="sb-gap-items-list">
              {filteredMatrix.map((item) => (
                <div key={item.skill} className="sb-gap-row">
                  <div className="sb-gap-row-left">
                    <span className="sb-gap-name">{item.skill}</span>
                    <span
                      className="sb-gap-tag"
                      style={{
                        color: item.evidence === 'Tested'
                          ? 'var(--success)'
                          : item.evidence === 'Quizzed'
                            ? 'var(--warning)'
                            : 'var(--danger)'
                      }}
                    >
                      {item.evidence === 'Tested'
                        ? '✓ Tested (1.00)'
                        : item.evidence === 'Quizzed'
                          ? 'Quizzed (0.60)'
                          : item.evidence === 'Claimed'
                            ? 'Claimed (0.25)'
                            : 'Unassessed (0.00)'}
                    </span>
                  </div>

                  <div className="sb-gap-progress-container">
                    <div className="sb-gap-track">
                      <div
                        className="sb-gap-fill"
                        style={{
                          width: `${item.pct}%`,
                          background: item.evidence === 'Tested'
                            ? 'var(--success)'
                            : item.evidence === 'Quizzed'
                              ? 'var(--brand)'
                              : 'var(--danger)'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 11, padding: '4px 10px' }}
                    onClick={() => navigate('/code-labs')}
                  >
                    {item.evidence === 'Tested' ? 'Retest' : 'Practice Lab'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Roadmap Track */}
          <div className="sb-curriculum-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <h3 className="card-title">Structured Learning Roadmap</h3>
                <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '2px 0 0 0' }}>
                  Target: {targetRoleObj.name} · 4-Phase Pathway
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/improvement-map')}
              >
                View Full Timeline →
              </button>
            </div>

            <div className="sb-phases-container">
              {phases.map(p => {
                const isExpanded = expandedPhase === p.phase;
                return (
                  <div
                    key={p.phase}
                    className={`sb-phase-item ${p.status === 'in-progress' ? 'is-active-phase' : ''}`}
                  >
                    <div
                      className="sb-phase-header"
                      onClick={() => setExpandedPhase(isExpanded ? 0 : p.phase)}
                    >
                      <div className="sb-phase-title-row">
                        <div className="sb-phase-num">{p.phase}</div>
                        <div>
                          <span className="sb-phase-name">{p.title}</span>
                        </div>
                      </div>

                      <div className="sb-phase-meta">
                        <span style={{
                          color: p.status === 'completed'
                            ? 'var(--success)'
                            : p.status === 'in-progress'
                              ? 'var(--brand-light)'
                              : 'var(--text-subtle)',
                          fontWeight: 700,
                          fontSize: 10,
                          textTransform: 'uppercase'
                        }}>
                          {p.status === 'completed' ? '✓ Completed' : p.status === 'in-progress' ? '● In Progress' : 'Upcoming'}
                        </span>
                        <span>{p.hours}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="sb-phase-content">
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                          Core competency drills in this milestone:
                        </div>
                        <div className="sb-topic-pills">
                          {p.topics.map(t => (
                            <span key={t} className="sb-topic-pill">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Demand & Peer Calibration (Accordion - Score References Removed) */}
          <div className="card">
            <div
              className="sb-insights-toggle"
              onClick={() => setInsightsOpen(v => !v)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="var(--brand)" />
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                  Market Demand &amp; Peer Calibration
                </h3>
                <span className="badge badge-warning" style={{ fontSize: 10 }}>AccioJob 2026</span>
              </div>
              <button type="button" className="btn-chip" style={{ fontSize: 11 }}>
                {insightsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{insightsOpen ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            {insightsOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Demand Trend (India Hubs)</span>
                      <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Sample 2026</span>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={(TREND_DATA?.labels || ['Q1', 'Q2', 'Q3', 'Q4']).map((l, i) => ({ label: l, demand: TREND_DATA?.['ai-ml']?.[0]?.data?.[i] ?? 45 }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} unit="%" />
                        <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }} />
                        <Line type="monotone" dataKey="demand" stroke="var(--brand)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Peer Candidates ({targetRoleObj.name})</span>
                      <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Cohort Calibration</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(PEER_PROFILES || []).slice(0, 4).map(p => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                            {p.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{p.currentRole}</div>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-light)' }}>
                            Active
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ─── RIGHT COLUMN: Practice & Routine Rail ─── */}
        <div className="sb-side-rail">

          {/* Problem of the Day Card */}
          <div className="card sb-potd-widget">
            <div className="sb-potd-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={15} color="var(--brand)" />
                <h3 className="card-title" style={{ fontSize: 14 }}>Problem of the Day</h3>
              </div>
              <span className="badge badge-brand">+20 XP</span>
            </div>

            <div className="sb-potd-challenge-box">
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>
                Reverse Linked List II
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>
                Data Structures · Medium · Tested in Browser
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="sb-countdown-box">
              <div className="sb-countdown-label">NEXT PROBLEM IN</div>
              <div className="sb-clock-display">
                <span className="sb-digits">{countdown.hours}</span>
                <span className="sb-sep">:</span>
                <span className="sb-digits">{countdown.minutes}</span>
                <span className="sb-sep">:</span>
                <span className="sb-digits">{countdown.seconds}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => navigate('/daily-problem')}
            >
              Solve Challenge in Editor →
            </button>
          </div>

          {/* Today's Practice Plan (Checklist) */}
          <div className="card sb-planner-widget">
            <div className="card-header" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={15} color="var(--brand)" />
                <h3 className="card-title" style={{ fontSize: 14 }}>Today's Practice Plan</h3>
              </div>
              <button
                type="button"
                className="btn-chip"
                onClick={() => setShowAddTask(v => !v)}
                style={{ fontSize: 10, padding: '2px 8px' }}
              >
                <Plus size={11} /> Task
              </button>
            </div>

            {showAddTask && (
              <form onSubmit={handleAddCustomTask} style={{ marginBottom: 10, display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: 11, padding: '5px 8px' }}
                  placeholder="e.g. Practice Docker CLI"
                  value={newCustomTask}
                  onChange={e => setNewCustomTask(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>
                  Add
                </button>
              </form>
            )}

            <div className="sb-tasks-list">
              {dailyTasks.map(task => (
                <div
                  key={task.id}
                  className={`sb-task-item ${task.done ? 'is-complete' : ''}`}
                  onClick={() => handleToggleTask(task)}
                >
                  <div className="sb-task-checkbox">
                    {task.done && <Check size={12} />}
                  </div>
                  <div className="sb-task-content">
                    <span className="sb-task-text">{task.text}</span>
                    <span className="sb-task-xp">+{task.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <button
                type="button"
                className="btn-link"
                style={{ fontSize: 11.5 }}
                onClick={() => navigate('/improvement-map')}
              >
                Open Full Roadmap Calendar →
              </button>
            </div>
          </div>

          {/* Fast-Track Code Labs Quick Jump */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={15} color="var(--brand)" />
                <h3 className="card-title" style={{ fontSize: 14 }}>Code Labs Quick Jump</h3>
              </div>
            </div>

            <div className="sb-quick-labs-grid">
              <div className="sb-quick-lab-item" onClick={() => navigate('/code-labs')}>
                <span>🐍</span>
                <span>Python IDE</span>
              </div>
              <div className="sb-quick-lab-item" onClick={() => navigate('/code-labs')}>
                <span>🗄️</span>
                <span>SQL Sandbox</span>
              </div>
              <div className="sb-quick-lab-item" onClick={() => navigate('/code-labs')}>
                <span>🐳</span>
                <span>Docker Lab</span>
              </div>
              <div className="sb-quick-lab-item" onClick={() => navigate('/code-labs')}>
                <span>🧠</span>
                <span>PyTorch Lab</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ─── 5. Curated Learning & Tech News Feed: At the Very Bottom ─────── */}
      <div className="sb-dash-bottom-news">
        <CuratedLearningAndNewsFeed />
      </div>

      {/* ─── 6. Evidence Verification Explainer Modal ─────────────────────── */}
      {showEvidenceModal && (
        <div className="modal-backdrop" onClick={() => setShowEvidenceModal(false)}>
          <div className="modal-card" style={{ maxWidth: 520, padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color="var(--brand)" />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Evidence Verification Guide</h3>
              </div>
              <button
                type="button"
                className="btn-chip"
                onClick={() => setShowEvidenceModal(false)}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
              SkillBridge tracks what you can prove with executable code in the browser rather than unverified self-ratings.
            </p>

            <div style={{ background: 'var(--bg-subtle)', padding: 16, borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text)' }}>
              <div><strong style={{ color: 'var(--brand-light)' }}>1. Three Verified Evidence Tiers:</strong></div>
              <p style={{ margin: '4px 0 12px 0', color: 'var(--text-muted)' }}>
                • <strong>Claimed (0.25):</strong> Detected from résumé or job keywords.<br />
                • <strong>Quizzed (0.60):</strong> Conceptual knowledge drill completed.<br />
                • <strong>Tested (1.00):</strong> Automated code test passed in browser IDE.
              </p>

              <div><strong style={{ color: 'var(--brand-light)' }}>2. Closing Critical Shortfalls:</strong></div>
              <p style={{ margin: '4px 0 12px 0', color: 'var(--text-muted)' }}>
                Completing coding challenges in Daily Problem and Code Labs upgrades your skills to Tested status, validating them for recruiters.
              </p>

              <div><strong style={{ color: 'var(--brand-light)' }}>3. Deterministic Evaluation:</strong></div>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                Your progress is verified through standard unit tests and test suites, never generated or hallucinated by AI models.
              </p>
            </div>

            <div style={{ marginTop: 18, textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowEvidenceModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
