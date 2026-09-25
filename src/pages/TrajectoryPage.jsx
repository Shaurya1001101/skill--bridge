import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Legend } from 'recharts';
import { Zap, Calendar, ArrowRight, CheckCircle2, Clock, BookOpen, Sparkles, Check, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore.js';
import { SKILL_ROLES, SAMPLE_CANDIDATES, MARKET_SHOCK_CONFIGS, PACING_MODES } from '../lib/data.js';
import { extractSkillsFromText, computeReadiness, generatePathSchedule } from '../lib/storage.js';
import SkillResourceModules from '../components/ui/SkillResourceModules.jsx';

const MONTHS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

function simulateTrajectory(baseReadiness, pace, months = 12) {
  const growth = { conservative: 2.8, balanced: 4.5, aggressive: 7.2 }[pace] || 4.5;
  const data = [];
  for (let m = 0; m <= months; m++) {
    const val = Math.min(100, baseReadiness + growth * m * (1 - (m / (months * 2))));
    data.push(Math.round(val));
  }
  return data;
}

function generateDependencyChain(gapSkills) {
  const DEPS = {
    'PyTorch': ['Python', 'Machine Learning'],
    'MLOps': ['Docker', 'Python'],
    'Deep Learning': ['PyTorch', 'Mathematics'],
    'NLP': ['Python', 'Deep Learning'],
    'AWS': ['Docker'],
    'Kubernetes': ['Docker'],
    'CI/CD': ['Git'],
    'Scikit-learn': ['Python', 'Statistics'],
  };
  const chain = [];
  const seen = new Set();
  const addSkill = (skill) => {
    if (seen.has(skill)) return;
    const prereqs = DEPS[skill] || [];
    prereqs.forEach(p => {
      if (!seen.has(p)) addSkill(p);
    });
    seen.add(skill);
    chain.push(skill);
  };
  gapSkills.forEach(s => addSkill(s));
  return chain;
}

const REACHABLE_ROLES = {
  'ml-engineer': { m3: 'Junior ML Engineer', m6: 'ML Engineer', m12: 'Senior ML Engineer' },
  'data-scientist': { m3: 'Data Analyst', m6: 'Data Scientist', m12: 'Senior Data Scientist' },
  'mlops-engineer': { m3: 'DevOps Engineer', m6: 'MLOps Engineer', m12: 'Senior MLOps Engineer' },
  'data-engineer': { m3: 'Data Analyst', m6: 'Data Engineer', m12: 'Senior Data Engineer' },
  'ai-researcher': { m3: 'ML Practitioner', m6: 'AI Engineer', m12: 'AI Researcher' },
};

export default function TrajectoryPage() {
  const navigate = useNavigate();
  const addToast = useStore(s => s.addToast);
  const savedGapResults = useStore(s => s.gapResults);
  const commitPath = useStore(s => s.commitPath);
  const committedPath = useStore(s => s.committedPath);

  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState(committedPath?.role || 'ml-engineer');
  const [shock, setShock] = useState('neutral');
  const [extractedSkills, setExtractedSkills] = useState(null);
  const [simData, setSimData] = useState(null);
  const [depChain, setDepChain] = useState([]);
  const [baseReadiness, setBaseReadiness] = useState(savedGapResults?.readiness || 45);
  const [dragOver, setDragOver] = useState(false);
  const [selectedPacing, setSelectedPacing] = useState(committedPath?.pacing || 'balanced');
  const [expandedMilestone, setExpandedMilestone] = useState(0);

  const loadCandidate = (key) => {
    const c = SAMPLE_CANDIDATES[key];
    if (!c) return;
    setResumeText(c.text);
    setTargetRole(c.targetRole);
    addToast(`${c.name}'s profile loaded`, 'success');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'txt' || ext === 'md') {
      const text = await file.text();
      setResumeText(text);
      addToast(`${file.name} loaded`, 'success');
    } else if (ext === 'docx') {
      try {
        const mammoth = await import('mammoth');
        const ab = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer: ab });
        setResumeText(value);
        addToast('DOCX extracted successfully', 'success');
      } catch {
        addToast('DOCX parsing failed — paste text manually', 'error');
      }
    } else if (ext === 'pdf') {
      addToast('PDF: Please use a txt or docx file, or paste text directly', 'info');
    }
  };

  const extractSkills = () => {
    if (!resumeText.trim()) { addToast('Please enter resume text first', 'warning'); return; }
    const skills = extractSkillsFromText(resumeText);
    setExtractedSkills(skills);
    const role = SKILL_ROLES[targetRole];
    const ratings = {};
    role.skills.forEach(sk => {
      const found = skills.all.some(f => f.toLowerCase().includes(sk.name.toLowerCase()) || sk.name.toLowerCase().includes(f.toLowerCase()));
      ratings[sk.name] = found ? 2 : 0;
    });
    const readiness = computeReadiness(ratings, role);
    setBaseReadiness(readiness);
    addToast(`${skills.all.length} skills extracted, readiness: ${readiness}%`, 'success');
  };

  const runSimulation = (showToast = false) => {
    const conservData = simulateTrajectory(baseReadiness, 'conservative');
    const balancedData = simulateTrajectory(baseReadiness, 'balanced');
    const aggressiveData = simulateTrajectory(baseReadiness, 'aggressive');

    const chartData = MONTHS.map((m, i) => ({
      month: m,
      Conservative: conservData[i],
      Balanced: balancedData[i],
      Aggressive: aggressiveData[i],
    }));

    setSimData({ chartData, conservData, balancedData, aggressiveData });

    const role = SKILL_ROLES[targetRole];
    const gapSkills = role.skills.filter(sk => (extractedSkills?.all || []).every(f => !f.toLowerCase().includes(sk.name.toLowerCase()))).map(s => s.name);
    setDepChain(generateDependencyChain(gapSkills.slice(0, 5)));
    if (showToast) {
      addToast('Simulation calculated!', 'success');
    }
  };

  useEffect(() => {
    // Auto-run simulation silently on mount/targetRole change
    runSimulation(false);
  }, [targetRole]);

  const shockCfg = MARKET_SHOCK_CONFIGS[shock];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Skill Trajectory Simulator</h1>
          <p className="page-subtitle">Simulate future career paths across 3, 6, and 12 months with skill dependency graphs and market shocks</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => loadCandidate('user')}>Load Sample Resume</button>
          <button className="btn btn-primary btn-sm" onClick={runSimulation}>Run Simulation</button>
        </div>
      </div>

      {/* Config Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Resume Upload */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">1. Resume & Skill Extraction</h2>
            <span className="badge badge-info">PDF / DOCX / TXT</span>
          </div>

          {/* Dropzone */}
          <div
            className={`dropzone ${dragOver ? 'drag-over' : ''}`}
            style={{ marginBottom: 12 }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('traj-file-input').click()}
          >
            <input id="traj-file-input" type="file" accept=".txt,.md,.docx" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files[0])} />
            <div className="dropzone-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div className="dropzone-title">Upload Resume (DOCX, TXT)</div>
            <div className="dropzone-subtitle">Click to browse or drag and drop</div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)', alignSelf: 'center' }}>Or load profile:</span>
            {Object.values(SAMPLE_CANDIDATES).map(c => (
              <button key={c.id} className="btn-chip" onClick={() => loadCandidate(c.id)}>{c.name}</button>
            ))}
          </div>

          <textarea
            className="form-textarea"
            style={{ minHeight: 100, fontFamily: 'inherit' }}
            placeholder="Extracted resume text appears here, or paste directly..."
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
          />
          <button className="btn btn-secondary btn-full" style={{ marginTop: 10 }} onClick={extractSkills}>
            Extract & Normalize Skills
          </button>

          {extractedSkills && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                {extractedSkills.all.length} skills extracted — baseline readiness: <strong style={{ color: 'var(--brand-light)' }}>{baseReadiness}%</strong>
              </div>
              <div className="skill-tags">
                {extractedSkills.all.slice(0, 12).map(s => (
                  <span key={s} className="skill-tag skill-tag-tech" style={{ fontSize: 10 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
                {extractedSkills.all.length > 12 && <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>+{extractedSkills.all.length - 12} more</span>}
              </div>
            </div>
          )}
        </div>

        {/* Target Role & Market Shock */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">2. Target Role & Simulation Engine</h2>
            <span className="badge badge-brand">3–12 Months</span>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Target Role</label>
            <select className="form-select" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
              {Object.entries(SKILL_ROLES).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Market Shock */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Market Shock Simulator</div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>How industry shifts affect your timeline</div>
              </div>
              <span className="badge badge-brand">{shockCfg.label}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {Object.entries(MARKET_SHOCK_CONFIGS).map(([key, cfg]) => (
                <button key={key} className={`shock-btn ${shock === key ? 'active' : ''}`} onClick={() => setShock(key)}>
                  <span className="shock-name">{cfg.label}</span>
                  <span className="shock-sub">{cfg.sub}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', background: 'rgba(37,99,235,0.06)', padding: '8px 10px', borderRadius: 6 }}>
              <strong>{shockCfg.label}:</strong> {shockCfg.desc}
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={() => runSimulation(true)}>
            Calculate Future Trajectories
          </button>
        </div>
      </div>

      {/* Simulation Results */}
      {simData && (
        <>
          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { pace: 'Conservative', hrs: '10h/wk', color: '#94A3B8', data: simData.conservData },
              { pace: 'Balanced (Recommended)', hrs: '18h/wk', color: '#3B82F6', data: simData.balancedData },
              { pace: 'Aggressive', hrs: '28h/wk', color: '#10B981', data: simData.aggressiveData },
            ].map(p => {
              const m6 = p.data[6];
              const m12 = p.data[12];
              const reachable = REACHABLE_ROLES[targetRole];
              return (
                <div key={p.pace} className="card">
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, marginBottom: 8 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{p.pace}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginBottom: 10 }}>{p.hrs}</div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: p.color, fontFamily: 'Outfit' }}>{m6}%</div>
                      <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Month 6</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: p.color, fontFamily: 'Outfit' }}>{m12}%</div>
                      <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Month 12</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    By M6: <strong style={{ color: 'var(--text)' }}>{m6 >= 75 ? reachable?.m6 : reachable?.m3}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <h2 className="card-title">Visual Trajectory Curves (Readiness % over 12 Months)</h2>
                <p style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2 }}>Compare Conservative, Balanced, and Aggressive learning paces</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={simData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-subtle)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-subtle)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={75} stroke="rgba(239,68,68,0.5)" strokeDasharray="5 5" label={{ value: '75% Job Ready', fontSize: 10, fill: 'var(--danger)' }} />
                <Line type="monotone" dataKey="Conservative" stroke="#94A3B8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Balanced" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Aggressive" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Dependency Chain */}
          {depChain.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recommended Skill Dependency Chain</h2>
                <span className="badge badge-success">Optimized Path</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                Topologically sorted learning order — you cannot skip prerequisites.
              </p>
              <div className="dep-chain">
                {depChain.map((skill, i) => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className={`dep-node ${i === 0 ? 'done' : ''}`}>
                      {i + 1}. {skill}
                    </div>
                    {i < depChain.length - 1 && <span className="dep-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== PATH RECOMMENDATIONS & NEXT ACTIONS (Immediately Following Trajectory Graph) ===== */}
          {(() => {
            const pathSchedule = generatePathSchedule(targetRole, selectedPacing);
            const isCommitted = committedPath?.role === targetRole && committedPath?.pacing === selectedPacing;
            const currentPacing = PACING_MODES[selectedPacing] || PACING_MODES.balanced;

            return (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-header" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-brand">Recommended Learning Path</span>
                      <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Target Role: {SKILL_ROLES[targetRole]?.name}</span>
                    </div>
                    <h2 className="card-title" style={{ fontSize: 18 }}>Structured Milestone Sequence & Pacing Presets</h2>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      Select a pacing preset below to restructure the same milestones, skill sequence, and daily workload without changing the underlying curriculum.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className={`btn btn-sm ${isCommitted ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => commitPath(targetRole, selectedPacing)}
                    >
                      {isCommitted ? (
                        <><Check size={14} /> Active Committed Path</>
                      ) : (
                        <><Sparkles size={14} /> Commit to This Path (+50 XP)</>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('/improvement-map')}
                    >
                      <Calendar size={14} /> Open in Calendar →
                    </button>
                  </div>
                </div>

                {/* 3 Selectable Pacing Presets for the SAME path */}
                <div className="pacing-selector" style={{ marginTop: 16 }}>
                  {Object.entries(PACING_MODES).map(([key, mode]) => {
                    const isSelected = selectedPacing === key;
                    return (
                      <div
                        key={key}
                        className={`pacing-card ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedPacing(key);
                          addToast(`Pacing mode set to ${mode.name}: ${mode.totalWeeks} weeks at ${mode.hoursPerDay}h/day`, 'info');
                        }}
                      >
                        <div className="pacing-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: mode.color }} />
                            <div className="pacing-title">{mode.name}</div>
                          </div>
                          <span className={`badge ${mode.badgeClass}`}>{mode.badge}</span>
                        </div>

                        <div className="pacing-metrics">
                          <div><strong>{mode.totalWeeks}</strong> Weeks</div>
                          <div>•</div>
                          <div><strong>{mode.hoursPerDay}h</strong> / day</div>
                          <div>•</div>
                          <div><strong>{mode.hoursPerWeek}h</strong> / wk</div>
                        </div>

                        <div className="pacing-desc">{mode.summary}</div>
                        <div style={{ marginTop: 10, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: isSelected ? 'var(--brand-light)' : 'var(--text-subtle)' }}>
                          {isSelected ? (
                            <><CheckCircle2 size={13} color="var(--brand-light)" /> Active Preset ({mode.totalWeeks} Wks)</>
                          ) : (
                            <>Click to switch to {mode.name} pace</>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Path Overview Banner */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Clock size={18} color="var(--brand-light)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                        {currentPacing.name} Schedule: {pathSchedule.milestones.length} Milestones · {pathSchedule.totalWeeks} Weeks Total
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Target daily commitment: <strong style={{ color: 'var(--brand-light)' }}>{currentPacing.hoursPerDay} hours/day</strong> (~{currentPacing.hoursPerWeek} hrs/week). Restructured for steady progression.
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-brand">{pathSchedule.tasks.length} Actionable Tasks</span>
                    <span className="badge badge-success">Practice & Video Resources Included</span>
                  </div>
                </div>

                {/* Restructured Milestone Sequence */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {pathSchedule.milestones.map((m, idx) => {
                    const isExpanded = expandedMilestone === idx;
                    const milestoneTasks = pathSchedule.tasks.filter(t => t.milestoneIdx === idx);

                    return (
                      <div
                        key={m.skill}
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          overflow: 'hidden',
                          transition: 'border-color 0.15s ease',
                        }}
                      >
                        {/* Milestone Header */}
                        <div
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent',
                          }}
                          onClick={() => setExpandedMilestone(isExpanded ? -1 : idx)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                background: 'rgba(37,99,235,0.15)',
                                color: 'var(--brand-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                            >
                              {m.index}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                                  {m.skill}
                                </span>
                                <span className="badge badge-brand" style={{ fontSize: 10 }}>
                                  {m.weekAlloc}
                                </span>
                                <span className="badge badge-info" style={{ fontSize: 10 }}>
                                  ~{currentPacing.hoursPerDay}h / day
                                </span>
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                {m.focus}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, color: 'var(--brand-light)', fontWeight: 600 }}>
                              {isExpanded ? 'Hide Resources ▲' : 'View Resources & Drills ▼'}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Resource & Action Details */}
                        {isExpanded && (
                          <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)', background: 'rgba(15,23,42,0.3)' }}>
                            {/* Milestone Tasks Breakdown */}
                            <div style={{ marginTop: 12, marginBottom: 12 }}>
                              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', marginBottom: 8 }}>
                                Scheduled Tasks for {m.weekAlloc}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                                {milestoneTasks.map(task => (
                                  <div
                                    key={task.id}
                                    style={{
                                      background: 'var(--bg-surface)',
                                      border: '1px solid var(--border)',
                                      borderRadius: 6,
                                      padding: '10px 12px',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <span className={`badge ${task.type === 'practice' ? 'badge-warning' : task.type === 'learning' ? 'badge-brand' : 'badge-success'}`} style={{ fontSize: 9 }}>
                                        {task.type.toUpperCase()}
                                      </span>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--warning)' }}>+{task.xp} XP</span>
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                                      {task.title}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                      {task.desc}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actionable Learning & Practice Modules */}
                            <SkillResourceModules skillName={m.skill} compact={false} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer Next Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Pacing mode: <strong style={{ color: 'var(--text)' }}>{currentPacing.name}</strong> ({currentPacing.totalWeeks} Weeks) · Committing will auto-fill your Calendar.
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('/code-labs')}
                    >
                      <BookOpen size={14} /> Open Code Labs
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        commitPath(targetRole, selectedPacing);
                        navigate('/improvement-map');
                      }}
                    >
                      Commit & Go to Calendar <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

