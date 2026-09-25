import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, List, Download, CheckSquare, Square,
  Trophy, Zap, CheckCircle2, ChevronLeft, ChevronRight, Clock, X
} from 'lucide-react';
import useStore from '../store/useStore.js';
import { SKILL_ROLES, ROADMAPS, WAYPOINTS, PACING_MODES } from '../lib/data.js';
import { generateICSContent } from '../lib/storage.js';
import SkillResourceModules from '../components/ui/SkillResourceModules.jsx';

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
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#A78BFA', textTransform: 'uppercase' }}>
            Visual Milestone Progression
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
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
          <div style={{ marginTop: 16, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 8, padding: 16 }}>
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
  const setPacing = useStore(s => s.setPacing);

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
        {streak >= 3 && <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: 10 }}>🔥 Fire</span>}
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
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

// ─── Completely Redesigned Dynamic Calendar UI ────────────────────────────────
function RedesignedCalendarView({ committedPath, onSelectTask }) {
  const toggleTaskComplete = useStore(s => s.toggleTaskComplete);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month and total days
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Offset so Monday is day 0
  const startOffset = (firstDay + 6) % 7;

  const todayStr = new Date().toISOString().split('T')[0];

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map = {};
    (committedPath?.tasks || []).forEach(task => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [committedPath]);

  const completedIds = committedPath?.completedTaskIds || [];

  // Generate 35 or 42 grid cells
  const cells = [];
  // Previous month trailing days
  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const d = new Date(year, month - 1, dayNum);
    cells.push({ date: d, dayNum, isCurrentMonth: false, dateStr: d.toISOString().split('T')[0] });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    cells.push({ date: dateObj, dayNum: d, isCurrentMonth: true, dateStr: dateObj.toISOString().split('T')[0] });
  }
  // Next month leading days
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
      {/* Calendar Header */}
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
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} /> Scheduled
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

      {/* Weekday Names Header */}
      <div className="cal-v2-day-names">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="cal-v2-day-name">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
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

              {/* Task Pills */}
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
          border: '1px solid #475569',
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
            <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
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

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', marginBottom: 4 }}>
            Task Objective
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {task.desc}
          </p>
        </div>

        {/* Actionable Practice & Learning Resources */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Curated Resources for this Task:
          </div>
          <SkillResourceModules skillName={task.skill} compact={false} />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
      skill: sk.name,
      desc: `Master ${sk.name} concepts, practical drills, and production workflows for the ${roleData.name} role.`,
      tags: [sk.name, 'Practice', 'Projects'],
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

            {/* Embedded Actionable Practice & Learning Modules */}
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
  const level = 'intermediate';
  const [view, setView] = useState('calendar'); // 'calendar' | 'roadmap'
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
    const content = generateICSContent(tasks, `${SKILL_ROLES[role]?.name || 'SkillBridge'} Study Calendar`);
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
          <h1 className="page-title">Improvement Map & Calendar</h1>
          <p className="page-subtitle">
            Gamified learning milestones, scheduled calendar drills, and actionable LeetCode/Coursera resources
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportICS} title="Download .ics for Google Calendar or Outlook">
            <Download size={14} /> Export .ics Calendar
          </button>
        </div>
      </div>

      {/* Gamification Status Bar (Running Points, Daily Streak, Completed Ratio) */}
      <GamificationBar />

      {/* Visual Waypoint Flowchart */}
      <WaypointFlowchart />

      {/* View Switcher & Filter Controls */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          {/* View Mode Toggle */}
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
              Milestone Roadmap & Resource Drills
            </button>
          </div>

          {/* Quick Pacing Presets Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Pacing Preset:</span>
            {Object.entries(PACING_MODES).map(([key, mode]) => (
              <button
                key={key}
                className={`btn-chip ${committedPath?.pacing === key ? 'active' : ''}`}
                style={{
                  background: committedPath?.pacing === key ? 'rgba(37,99,235,0.2)' : undefined,
                  borderColor: committedPath?.pacing === key ? 'var(--brand)' : undefined,
                  color: committedPath?.pacing === key ? 'var(--brand-light)' : undefined,
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
