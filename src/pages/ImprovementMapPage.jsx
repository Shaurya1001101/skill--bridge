import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, List, Download, CheckSquare, Square,
  Trophy, Zap, CheckCircle2, ChevronLeft, ChevronRight, Clock, X,
  TrendingUp, BarChart2, Layers, Sparkles, Target, Compass
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';

import useStore from '../store/useStore.js';
import { SKILL_ROLES, ROADMAPS, WAYPOINTS, PACING_MODES } from '../lib/data.js';
import { generateICSContent } from '../lib/storage.js';
import SkillResourceModules from '../components/ui/SkillResourceModules.jsx';

// ─── Trajectory Simulation Generator ─────────────────────────────────────────
function generateTrajectoryCurve(pacing = 'balanced', weeks = 12, baseline = 0) {
  const growthRate = { conservative: 4.8, balanced: 6.8, aggressive: 9.4 }[pacing] || 6.8;
  const points = [];

  for (let w = 0; w <= weeks; w++) {
    const projected = Math.min(100, Math.round(baseline + growthRate * w * (1 - (w / (weeks * 2.1)))));
    const targetBenchmark = Math.min(85, Math.round(30 + (55 / weeks) * w));

    let milestone = null;
    if (w === 3) milestone = 'Python & OOP';
    else if (w === 6) milestone = 'SQL & Pipelines';
    else if (w === 9) milestone = 'Docker & MLOps';
    else if (w === 12) milestone = 'Industry Ready';

    points.push({
      week: `Wk ${w}`,
      weekNum: w,
      projected,
      benchmark: targetBenchmark,
      threshold: 85,
      milestone,
    });
  }
  return points;
}

// ─── Visual Skill Trajectory & Mastery Graph Component ──────────────────────
function SkillTrajectoryGraph({ pacing, setPacing, roleName }) {
  const [graphMode, setGraphMode] = useState('curve'); // 'curve' | 'domains'
  const user = useStore(s => s.user);
  const userSkills = useStore(s => s.userSkills);
  const gapResults = useStore(s => s.gapResults);

  const isDemo = (user?.email === 'user@skillbridge.io' || user?.email === 'alex@skillbridge.io') && (user?.id === 1 || user?.id === '1') && Boolean(userSkills?.all?.length > 0 || gapResults);
  const hasUserSkills = Boolean((userSkills?.all && userSkills.all.length > 0) || gapResults);

  const baseline = isDemo ? 25 : (hasUserSkills ? 20 : 0);
  const weeks = PACING_MODES[pacing]?.totalWeeks || 12;
  const trajectoryData = useMemo(() => generateTrajectoryCurve(pacing, weeks, baseline), [pacing, weeks, baseline]);

  // Compute domain mastery: new users strictly start at 0%
  const domainCompetencies = useMemo(() => {
    if (!hasUserSkills && !isDemo) {
      return [
        { domain: 'Python & Algorithms', current: 0, target: 90 },
        { domain: 'SQL & Data Modeling', current: 0, target: 85 },
        { domain: 'Docker & Containers', current: 0, target: 80 },
        { domain: 'MLOps & CI/CD', current: 0, target: 80 },
        { domain: 'Cloud & Telemetry', current: 0, target: 75 },
        { domain: 'System Design', current: 0, target: 75 },
      ];
    }
    if (isDemo) {
      return [
        { domain: 'Python & Algorithms', current: 75, target: 90 },
        { domain: 'SQL & Data Modeling', current: 70, target: 85 },
        { domain: 'Docker & Containers', current: 35, target: 80 },
        { domain: 'MLOps & CI/CD', current: 25, target: 80 },
        { domain: 'Cloud & Telemetry', current: 20, target: 75 },
        { domain: 'System Design', current: 40, target: 75 },
      ];
    }
    const skillList = (userSkills?.all || []).map(s => String(s).toLowerCase());
    const scoreDomain = (matchArr, target) => {
      const hits = matchArr.filter(s => skillList.includes(s.toLowerCase())).length;
      return { current: Math.round((hits / matchArr.length) * 100), target };
    };
    return [
      { domain: 'Python & Algorithms', ...scoreDomain(['Python', 'Data Structures', 'Algorithms'], 90) },
      { domain: 'SQL & Data Modeling', ...scoreDomain(['SQL', 'PostgreSQL', 'Pandas'], 85) },
      { domain: 'Docker & Containers', ...scoreDomain(['Docker', 'Kubernetes'], 80) },
      { domain: 'MLOps & CI/CD', ...scoreDomain(['MLOps', 'CI/CD', 'Git'], 80) },
      { domain: 'Cloud & Telemetry', ...scoreDomain(['AWS', 'Cloud'], 75) },
      { domain: 'System Design', ...scoreDomain(['FastAPI', 'REST API', 'Architecture'], 75) },
    ];
  }, [hasUserSkills, isDemo, userSkills]);

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      {/* Graph Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="badge badge-brand" style={{ fontSize: 10 }}>PROJECTED GROWTH</span>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Target Role: {roleName}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            Career Milestone Trajectory Graph
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
            Simulate week-by-week skill progression toward industry entry-level benchmark standards.
          </p>
        </div>

        {/* View mode toggle & Pacing presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--bg-subtle)', padding: 3, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className={`btn-chip ${graphMode === 'curve' ? 'active' : ''}`}
              onClick={() => setGraphMode('curve')}
              style={{
                fontSize: 11,
                border: 'none',
                background: graphMode === 'curve' ? 'rgba(232, 130, 58, 0.2)' : 'transparent',
                color: graphMode === 'curve' ? 'var(--brand-light)' : 'var(--text-muted)'
              }}
            >
              <TrendingUp size={12} style={{ marginRight: 4 }} /> 12-Week Curve
            </button>
            <button
              type="button"
              className={`btn-chip ${graphMode === 'domains' ? 'active' : ''}`}
              onClick={() => setGraphMode('domains')}
              style={{
                fontSize: 11,
                border: 'none',
                background: graphMode === 'domains' ? 'rgba(232, 130, 58, 0.2)' : 'transparent',
                color: graphMode === 'domains' ? 'var(--brand-light)' : 'var(--text-muted)'
              }}
            >
              <BarChart2 size={12} style={{ marginRight: 4 }} /> Domain Mastery
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(PACING_MODES).map(([pk, p]) => (
              <button
                key={pk}
                type="button"
                className={`btn-chip ${pacing === pk ? 'active' : ''}`}
                onClick={() => setPacing(pk)}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  background: pacing === pk ? 'rgba(232, 130, 58, 0.2)' : undefined,
                  borderColor: pacing === pk ? 'var(--brand)' : undefined,
                  color: pacing === pk ? 'var(--brand-light)' : undefined,
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      {graphMode === 'curve' ? (
        <div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: 'var(--text-subtle)' }}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--text-subtle)' }}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '10px 12px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                          fontSize: 12
                        }}>
                          <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                            {data.week} ({PACING_MODES[pacing]?.hoursPerDay}h/day study)
                          </div>
                          <div style={{ color: 'var(--brand-light)', fontWeight: 600 }}>
                            Projected Mastery: {data.projected}%
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                            Benchmark Target: {data.benchmark}%
                          </div>
                          {data.milestone && (
                            <div style={{ color: 'var(--success)', fontWeight: 700, marginTop: 4, fontSize: 11 }}>
                              🎯 Milestone: {data.milestone}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={85}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  label={{ value: 'Entry-Level Threshold (85%)', fill: '#10B981', fontSize: 10, position: 'insideTopRight' }}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="var(--brand)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#curveGradient)"
                  dot={{ r: 3, fill: 'var(--brand)', strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: 'var(--brand-light)' }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone Waypoint Pills Below Chart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-subtle)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)' }} />
              <span>Projected Mastery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-subtle)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
              <span>Target Benchmark: 85%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-subtle)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
              <span>Estimated Trajectory Pace</span>
            </div>
          </div>
        </div>
      ) : (
        /* Domain Mastery Comparison Bar Breakdown */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {domainCompetencies.map((d) => (
            <div key={d.domain} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{d.domain}</span>
                <span style={{ color: 'var(--text-subtle)' }}>
                  Current: <strong style={{ color: d.current >= d.target ? 'var(--success)' : 'var(--brand-light)' }}>{d.current}%</strong> / Target: {d.target}%
                </span>
              </div>
              <div style={{ height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${d.current}%`,
                    background: d.current >= d.target ? 'var(--success)' : 'var(--brand)',
                    borderRadius: 4,
                    transition: 'width 0.5s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${d.target}%`,
                    width: 2,
                    height: '100%',
                    background: '#fff',
                    opacity: 0.6,
                  }}
                  title={`Target: ${d.target}%`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Waypoint Flowchart ───────────────────────────────────────────────────────
function WaypointFlowchart() {
  const completedWaypoints = useStore(s => s.completedWaypoints);
  const toggleWaypoint = useStore(s => s.toggleWaypoint);
  const addXP = useStore(s => s.addXP);
  const addToast = useStore(s => s.addToast);
  const [activeWaypoint, setActiveWaypoint] = useState(null);

  const pct = Math.round((completedWaypoints.length / WAYPOINTS.length) * 100);

  const handleToggle = (wp) => {
    const isCompleted = completedWaypoints.includes(wp.id);
    toggleWaypoint(wp.id);
    if (!isCompleted) {
      addXP(30);
      addToast(`🎉 ${wp.label} completed! +30 XP awarded!`, 'success');
    } else {
      addToast(`${wp.label} unchecked`, 'info');
    }
  };

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--brand-light)', textTransform: 'uppercase' }}>
            Visual Milestone Progression
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
            Career Waypoint Flowchart
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Click any milestone to inspect practical requirements. Complete waypoints to earn bonus XP.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-brand" style={{ fontSize: 12, padding: '4px 12px' }}>
            {pct}% Role Mastery
          </span>
        </div>
      </div>

      <div className="progress-track" style={{ marginBottom: 6 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--brand)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-subtle)', marginBottom: 16 }}>
        <span>{completedWaypoints.length} of {WAYPOINTS.length} Waypoints Mastered</span>
        <span>+30 XP per Completed Milestone</span>
      </div>

      {/* Waypoint Flow Nodes */}
      <div className="waypoint-flow">
        {WAYPOINTS.map((wp, i) => {
          const completed = completedWaypoints.includes(wp.id);
          const active = activeWaypoint === wp.id;
          return (
            <div key={wp.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div
                className={`waypoint-node ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}
                onClick={() => setActiveWaypoint(active ? null : wp.id)}
              >
                <div className="waypoint-circle">
                  {completed ? '✓' : wp.num}
                </div>
                <div className="waypoint-label">{wp.label}</div>
              </div>
              {i < WAYPOINTS.length - 1 && (
                <div className={`waypoint-connector ${completed ? 'done' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Waypoint Detail Panel */}
      {activeWaypoint && (() => {
        const wp = WAYPOINTS.find(w => w.id === activeWaypoint);
        if (!wp) return null;
        const completed = completedWaypoints.includes(wp.id);
        return (
          <div style={{ marginTop: 16, background: 'rgba(232,130,58,0.08)', border: '1px solid rgba(232,130,58,0.25)', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{wp.title}</h3>
                <span className="badge badge-brand" style={{ fontSize: 10, marginTop: 4 }}>Milestone {wp.num} of 6</span>
              </div>
              <button
                className={`btn btn-sm ${completed ? 'btn-secondary' : 'btn-success'}`}
                onClick={() => handleToggle(wp)}
              >
                {completed ? '✓ Milestone Completed' : 'Mark Milestone Done (+30 XP)'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{wp.desc}</p>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Key Verification Goals
            </div>
            <ul style={{ paddingLeft: 18, marginBottom: 14 }}>
              {wp.goals.map(g => (
                <li key={g} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Gamified Progress Bar ───────────────────────────────────────────────────
function GamificationBar() {
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const committedPath = useStore(s => s.committedPath);

  const completedCount = committedPath?.completedTaskIds?.length || 0;
  const totalTasks = committedPath?.tasks?.length || 18;
  const completionPct = Math.round((completedCount / totalTasks) * 100);
  const currentPacing = PACING_MODES[committedPath?.pacing] || PACING_MODES.balanced;

  return (
    <div className="cal-v2-gamification-bar">
      <div className="cal-v2-stat-card">
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={20} color="var(--warning)" />
        </div>
        <div>
          <div className="cal-v2-stat-val">{xp} XP</div>
          <div className="cal-v2-stat-label">Total Progress Points</div>
        </div>
      </div>

      <div className="cal-v2-stat-card">
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} color="#F59E0B" />
        </div>
        <div>
          <div className="cal-v2-stat-val">{streak} Days</div>
          <div className="cal-v2-stat-label">Active Learning Streak</div>
        </div>
        {streak >= 3 && <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: 10 }}>🔥 Active</span>}
      </div>

      <div className="cal-v2-stat-card">
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={20} color="var(--success)" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="cal-v2-stat-val">{completedCount} / {totalTasks}</div>
          <div className="cal-v2-stat-label">{completionPct}% Tasks Completed</div>
        </div>
      </div>

      <div className="cal-v2-stat-card">
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(232,130,58,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={20} color="var(--brand-light)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{currentPacing.name} Pace</div>
          <div className="cal-v2-stat-label">{currentPacing.hoursPerDay}h/day ({currentPacing.totalWeeks} wks)</div>
        </div>
      </div>
    </div>
  );
}

// ─── Dynamic Calendar Grid UI ────────────────────────────────────────────────
function RedesignedCalendarView({ committedPath, onSelectTask }) {
  const toggleTaskComplete = useStore(s => s.toggleTaskComplete);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDay + 6) % 7;
  const todayStr = new Date().toISOString().split('T')[0];

  const tasksByDate = useMemo(() => {
    const map = {};
    (committedPath?.tasks || []).forEach(task => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [committedPath]);

  const completedIds = committedPath?.completedTaskIds || [];
  const cells = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const d = new Date(year, month - 1, dayNum);
    cells.push({ date: d, dayNum, isCurrentMonth: false, dateStr: d.toISOString().split('T')[0] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    cells.push({ date: dateObj, dayNum: d, isCurrentMonth: true, dateStr: dateObj.toISOString().split('T')[0] });
  }
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const dateObj = new Date(year, month + 1, d);
    cells.push({ date: dateObj, dayNum: d, isCurrentMonth: false, dateStr: dateObj.toISOString().split('T')[0] });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const jumpToday = () => setCurrentDate(new Date());

  return (
    <div className="cal-v2-grid-wrapper">
      <div className="cal-v2-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h3 className="cal-v2-title">
            {monthNames[month]} {year}
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={jumpToday} style={{ fontSize: 11 }}>
            Today
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11, color: 'var(--text-subtle)', marginRight: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)' }} /> Scheduled
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> Completed
            </span>
          </div>
          <button className="topbar-icon-btn" onClick={prevMonth} title="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button className="topbar-icon-btn" onClick={nextMonth} title="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="cal-v2-day-names">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="cal-v2-day-name">{day}</div>
        ))}
      </div>

      <div className="cal-v2-days-grid">
        {cells.map((cell, idx) => {
          const isToday = cell.dateStr === todayStr;
          const dayTasks = tasksByDate[cell.dateStr] || [];

          return (
            <div
              key={idx}
              className={`cal-v2-cell ${!cell.isCurrentMonth ? 'outside-month' : ''} ${isToday ? 'today' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="cal-v2-date-num">{cell.dayNum}</span>
                {dayTasks.length > 0 && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--brand-light)' }}>
                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
                {dayTasks.map(task => {
                  const isDone = completedIds.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`cal-v2-task-pill ${isDone ? 'status-completed' : 'status-pending'} ${isToday ? 'status-today' : ''}`}
                      onClick={() => onSelectTask(task)}
                      title={`Click to view: ${task.title}`}
                    >
                      <div className="cal-v2-task-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskComplete(task.id);
                            }}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title={isDone ? 'Mark incomplete' : 'Mark complete (+25 XP)'}
                          >
                            {isDone ? (
                              <CheckSquare size={13} color="var(--success)" />
                            ) : (
                              <Square size={13} color="var(--text-subtle)" />
                            )}
                          </span>
                          <span className="cal-v2-task-title">{task.title}</span>
                        </div>
                        <span className="cal-v2-task-xp">+{task.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Task Detail Flyout Modal ─────────────────────────────────────────────────
function TaskDetailModal({ task, onClose, onToggleComplete, isCompleted }) {
  if (!task) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--border)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <span className={`badge ${task.type === 'practice' ? 'badge-warning' : task.type === 'learning' ? 'badge-brand' : 'badge-success'}`}>
                {task.type?.toUpperCase()}
              </span>
              <span className="badge badge-brand">{task.skill}</span>
              <span className="badge badge-info">{task.weekLabel}</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
              {task.title}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2 }}>
              Scheduled for: <strong style={{ color: 'var(--text)' }}>{task.date}</strong> · Duration: ~{task.hours} hours
            </div>
          </div>
          <button className="topbar-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', marginBottom: 4 }}>
            Task Objective
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {task.desc}
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Curated Resources for this Task:
          </div>
          <SkillResourceModules skillName={task.skill} compact={false} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning)' }}>Reward: +{task.xp} XP</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
            <button
              className={`btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-success'}`}
              onClick={() => {
                onToggleComplete(task.id);
                onClose();
              }}
            >
              {isCompleted ? 'Mark as Incomplete' : 'Complete Task (+25 XP)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap View with Embedded Resources ─────────────────────────────────────
function RoadmapViewWithResources({ role, level, completedWeeks, toggleWeek }) {
  const plan = ROADMAPS[role]?.[level] || [];
  const roleData = SKILL_ROLES[role];

  const items = useMemo(() => {
    if (plan.length > 0) return plan;
    const genericSkills = roleData.skills.slice(0, 6);
    const weeks = ['1–2', '3–4', '5–6', '7–8', '9–10', '11–12'];
    const priorities = ['critical', 'critical', 'high', 'high', 'medium', 'low'];
    return genericSkills.map((sk, i) => ({
      weeks: weeks[i],
      skill: typeof sk === 'string' ? sk : sk.name,
      desc: `Master ${typeof sk === 'string' ? sk : sk.name} concepts, practical drills, and production workflows for the ${roleData.name} role.`,
      tags: [typeof sk === 'string' ? sk : sk.name, 'Practice', 'Projects'],
      priority: priorities[i],
      hours: 16 + i * 2,
    }));
  }, [plan, roleData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((week, i) => {
        const key = `${week.skill}-${i}`;
        const done = completedWeeks.includes(key);

        return (
          <div key={key} className={`roadmap-week week-${week.priority}`} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="week-num">
                  <div className="week-num-label">WEEK</div>
                  <div className="week-num-val">{week.weeks}</div>
                </div>
                <div className="week-content">
                  <div className="week-skill" style={{ fontSize: 15 }}>{week.skill}</div>
                  <div className="week-desc">{week.desc}</div>
                  <div className="week-tags">
                    {week.tags.map(t => <span key={t} className="week-tag">{t}</span>)}
                  </div>
                </div>
              </div>

              <div className="week-meta" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <div className="week-hours">~{week.hours}h</div>
                <button
                  className={`btn btn-sm ${done ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => toggleWeek(key)}
                >
                  {done ? '✓ Completed' : 'Mark Done (+25 XP)'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <SkillResourceModules skillName={week.skill} compact={false} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Improvement Map Main Page ────────────────────────────────────────────────
export default function ImprovementMapPage() {
  const addToast = useStore(s => s.addToast);
  const committedPath = useStore(s => s.committedPath);
  const toggleTaskComplete = useStore(s => s.toggleTaskComplete);
  const setPacing = useStore(s => s.setPacing);
  const completedWeeks = useStore(s => s.completedWeeks);
  const toggleWeek = useStore(s => s.toggleWeek);
  const addXP = useStore(s => s.addXP);

  const role = committedPath?.role || 'ml-engineer';
  const roleName = SKILL_ROLES[role]?.name || 'Machine Learning Engineer';
  const currentPacing = committedPath?.pacing || 'balanced';
  const level = 'intermediate';

  // Active View Switcher: 'graph' | 'calendar' | 'roadmap'
  const [view, setView] = useState('graph');
  const [selectedTask, setSelectedTask] = useState(null);

  const handleToggleWeek = (key) => {
    const isDone = completedWeeks.includes(key);
    toggleWeek(key);
    if (!isDone) {
      addXP(25);
      addToast('Milestone mastered! +25 XP earned!', 'success');
    }
  };

  const exportICS = () => {
    const tasks = committedPath?.tasks || [];
    const content = generateICSContent(tasks, `${roleName} Study Calendar`);
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillbridge-${role}-schedule.ics`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Calendar (.ics) downloaded and ready to import!', 'success');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Improvement Map &amp; Trajectory</h1>
          <p className="page-subtitle">
            Visual milestone trajectory graphs, scheduled practice calendars, and curated learning roadmaps
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportICS} title="Download .ics for Google Calendar or Outlook">
            <Download size={14} /> Export .ics Calendar
          </button>
        </div>
      </div>

      {/* Gamification Status Bar */}
      <GamificationBar />

      {/* Visual Waypoint Flowchart */}
      <WaypointFlowchart />

      {/* ─── Trajectory Graph Component (Always Accessible) ─── */}
      <SkillTrajectoryGraph
        pacing={currentPacing}
        setPacing={setPacing}
        roleName={roleName}
      />

      {/* View Switcher Controls */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          {/* View Mode Toggle with Graph, Calendar & Roadmap */}
          <div className="cal-v2-view-switcher">
            <button
              className={`cal-v2-view-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Active Calendar ({committedPath?.tasks?.length || 0} Scheduled Tasks)
            </button>
            <button
              className={`cal-v2-view-btn ${view === 'roadmap' ? 'active' : ''}`}
              onClick={() => setView('roadmap')}
            >
              <List size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Milestone Roadmap &amp; Resource Drills
            </button>
          </div>

          {/* Quick Pacing Presets Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Pacing Preset:</span>
            {Object.entries(PACING_MODES).map(([key, mode]) => (
              <button
                key={key}
                className={`btn-chip ${currentPacing === key ? 'active' : ''}`}
                style={{
                  background: currentPacing === key ? 'rgba(232, 130, 58, 0.2)' : undefined,
                  borderColor: currentPacing === key ? 'var(--brand)' : undefined,
                  color: currentPacing === key ? 'var(--brand-light)' : undefined,
                }}
                onClick={() => setPacing(key)}
              >
                {mode.name} ({mode.totalWeeks}w)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active View Display */}
      {view === 'calendar' ? (
        <RedesignedCalendarView
          committedPath={committedPath}
          onSelectTask={task => setSelectedTask(task)}
        />
      ) : (
        <RoadmapViewWithResources
          role={role}
          level={level}
          completedWeeks={completedWeeks}
          toggleWeek={handleToggleWeek}
        />
      )}

      {/* Task Detail Flyout Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleComplete={toggleTaskComplete}
          isCompleted={(committedPath?.completedTaskIds || []).includes(selectedTask.id)}
        />
      )}
    </div>
  );
}
