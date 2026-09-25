import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useStore from '../store/useStore.js';
import { SKILL_ROLES, PEER_PROFILES } from '../lib/data.js';
import { computeReadiness } from '../lib/storage.js';

export default function GapAnalysisPage() {
  const navigate = useNavigate();
  const addToast = useStore(s => s.addToast);
  const setGapResults = useStore(s => s.setGapResults);
  const setUserSkills = useStore(s => s.setUserSkills);
  const savedGapResults = useStore(s => s.gapResults);
  const savedUserSkills = useStore(s => s.userSkills);
  const setTargetRoleStore = useStore(s => s.setTargetRole);

  const [targetRole, setTargetRole] = useState('ml-engineer');
  const [currentRole, setCurrentRole] = useState('Software Engineer');
  const [learnerId, setLearnerId] = useState('');
  const [ratings, setRatings] = useState({});
  const [results, setResults] = useState(savedGapResults || null);
  const [showChart, setShowChart] = useState(!!savedGapResults);

  const role = SKILL_ROLES[targetRole];

  useEffect(() => {
    // Reset ratings when role changes
    setRatings({});
  }, [targetRole]);

  const setRating = (skillName, val) => {
    setRatings(prev => ({ ...prev, [skillName]: val }));
  };

  const loadDemoProfile = () => {
    const emp = PEER_PROFILES[0];
    setLearnerId('E-101');
    setCurrentRole('Software Engineer');
    setTargetRole('ml-engineer');
    const newRatings = {};
    SKILL_ROLES['ml-engineer'].skills.forEach(sk => {
      newRatings[sk.name] = emp.skills[sk.name] || 0;
    });
    setRatings(newRatings);
    addToast('E-101 profile loaded', 'success');
  };

  const calculateGap = () => {
    const r = SKILL_ROLES[targetRole];
    let totalGap = 0, maxGap = 0;
    const gapDetails = [];
    r.skills.forEach(sk => {
      const curr = ratings[sk.name] || 0;
      totalGap += sk.weight * Math.max(0, sk.required - curr);
      maxGap += sk.weight * sk.required;
      gapDetails.push({ skill: sk.name, current: curr, required: sk.required, weight: sk.weight, gap: sk.required - curr });
    });
    const readiness = Math.round(Math.max(0, (1 - totalGap / maxGap) * 100));

    const cats = { critical: [], high: [], medium: [], low: [], strong: [] };
    r.skills.forEach(sk => {
      const curr = ratings[sk.name] || 0;
      const gapRaw = Math.max(0, sk.required - curr);
      const gapWt = sk.weight * gapRaw / (sk.weight * sk.required || 1);
      if (curr >= sk.required) cats.strong.push(sk.name);
      else if (gapWt >= 0.6) cats.critical.push(sk.name);
      else if (gapWt >= 0.4) cats.high.push(sk.name);
      else if (gapWt >= 0.2) cats.medium.push(sk.name);
      else cats.low.push(sk.name);
    });

    const res = { readiness, cats, gapDetails, role: r.name, gaps: cats.critical, ratings };
    setResults(res);
    setGapResults(res);
    setUserSkills(ratings);
    setTargetRoleStore(targetRole);
    setShowChart(true);
    addToast(`Gap score calculated: ${readiness}% readiness`, 'success');
  };

  const radarData = role.skills.map(sk => ({
    skill: sk.name,
    current: ((ratings[sk.name] || 0) / 4) * 100,
    required: (sk.required / 4) * 100,
  }));

  const readinessColor = results
    ? results.readiness >= 75 ? 'var(--success)'
      : results.readiness >= 55 ? 'var(--warning)'
      : results.readiness >= 35 ? 'var(--info)' : 'var(--danger)'
    : 'var(--text-muted)';

  const readinessLabel = results
    ? results.readiness >= 75 ? 'Strong Fit'
      : results.readiness >= 55 ? 'Good Fit'
      : results.readiness >= 35 ? 'Moderate Fit' : 'Needs Development'
    : '';

  const CAT_STYLES = {
    critical: { bg: 'rgba(248,81,73,.12)', color: 'var(--danger)', border: 'rgba(248,81,73,.25)', label: 'CRITICAL GAPS' },
    high: { bg: 'rgba(210,153,34,.1)', color: 'var(--warning)', border: 'rgba(210,153,34,.2)', label: 'HIGH PRIORITY' },
    medium: { bg: 'rgba(59,130,246,.1)', color: 'var(--info)', border: 'rgba(59,130,246,.2)', label: 'MEDIUM PRIORITY' },
    low: { bg: 'rgba(16,185,129,.08)', color: 'var(--brand-light)', border: 'rgba(16,185,129,.15)', label: 'LOW GAP' },
    strong: { bg: 'rgba(16,185,129,.12)', color: 'var(--success)', border: 'rgba(16,185,129,.25)', label: 'STRONG MATCH' },
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Skill Gap Analysis</h1>
          <p className="page-subtitle">Weighted scoring: Σ [Skill Importance × (Required − Current Level)] · Normalized to 0–100</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={loadDemoProfile}>Load Demo Profile</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: Profile Input */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <h2 className="card-title">Learner Profile</h2>
            </div>
            <div className="form-group">
              <label className="form-label">Learner ID / Username</label>
              <input id="learner-id" className="form-input" placeholder="e.g. E-101" value={learnerId} onChange={e => setLearnerId(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Current Role</label>
              <select id="current-role" className="form-select" value={currentRole} onChange={e => setCurrentRole(e.target.value)}>
                {['Software Engineer','Data Analyst','Backend Engineer','QA Engineer','DevOps Engineer','Frontend Developer','Product Manager'].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select id="target-role-gap" className="form-select" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                {Object.entries(SKILL_ROLES).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
              Rate your current skill level: 0 = None · 1 = Beginner · 2 = Familiar · 3 = Proficient · 4 = Expert
            </div>

            <div>
              {role.skills.map((sk, idx) => {
                const curr = ratings[sk.name] ?? 0;
                return (
                  <div key={sk.name} className="rating-item">
                    <div className="rating-header">
                      <span className="rating-name">{sk.name}</span>
                      <span className="rating-weight">Weight: {Math.round(sk.weight * 100)}% · Required: {sk.required}/4</span>
                    </div>
                    <div className="rating-stars">
                      {[0,1,2,3,4].map(v => (
                        <button
                          key={v}
                          id={`star-${idx}-${v}`}
                          className={`star-btn ${curr >= v && curr > 0 ? 'active' : ''}`}
                          onClick={() => setRating(sk.name, v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button id="calculate-gap-btn" className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={calculateGap}>
              Calculate Gap Score
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {/* Gap Score Results */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <h2 className="card-title">Gap Score Results</h2>
              {results && (
                <span style={{ fontSize: 20, fontWeight: 800, color: readinessColor, fontFamily: 'Outfit' }}>
                  {results.readiness}%
                </span>
              )}
            </div>
            {!results ? (
              <div className="empty-state">
                <BarChart2 size={32} color="var(--text-subtle)" />
                <p>Fill in your profile and click Calculate Gap Score</p>
              </div>
            ) : (
              <div>
                {/* Score circle + label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${readinessColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: readinessColor, fontFamily: 'Outfit' }}>{results.readiness}%</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.05em' }}>READINESS</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      {learnerId || 'You'} → {role.name}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: readinessColor, marginTop: 4 }}>{readinessLabel}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{currentRole} → {role.name}</div>
                  </div>
                </div>

                {/* Skill category chips */}
                {['critical','high','medium','strong'].map(cat => {
                  const skills = results.cats[cat];
                  if (!skills?.length) return null;
                  const st = CAT_STYLES[cat];
                  return (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', color: st.color, marginBottom: 6 }}>
                        {st.label}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {skills.map(s => (
                          <span key={s} style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '3px 9px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <p style={{ fontSize: 11, color: 'var(--text-subtle)', fontStyle: 'italic', marginTop: 8 }}>
                  Readiness % is a model-derived indicator, not an objective qualification measure.
                </p>

                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/improvement-map')}>View Roadmap</button>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/trajectory')}>Simulate Trajectory</button>
                </div>
              </div>
            )}
          </div>

          {/* Skill Proficiency Chart */}
          {showChart && results && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Skill Proficiency Chart</h2>
                <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Blue = current · Red = required</span>
              </div>
              {results.gapDetails.map(d => {
                const currPct = Math.round((d.current / 4) * 100);
                const reqPct = Math.round((d.required / 4) * 100);
                const col = d.current >= d.required ? 'var(--success)' : d.current >= d.required * 0.6 ? 'var(--warning)' : 'var(--danger)';
                return (
                  <div key={d.skill} className="gap-bar-row">
                    <div className="gap-bar-label">
                      <span className="gap-bar-name">{d.skill}</span>
                      <span className="gap-bar-nums">{d.current}/{d.required} · w:{Math.round(d.weight*100)}%</span>
                    </div>
                    <div className="gap-bar-track">
                      <div className="gap-bar-current" style={{ width: `${currPct}%`, background: col }} />
                      <div className="gap-bar-required-marker" style={{ left: `${reqPct}%` }} />
                    </div>
                  </div>
                );
              })}

              {/* Radar chart */}
              <div style={{ marginTop: 16 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} />
                    <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }} />
                    <Radar name="Required" dataKey="required" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.08} strokeWidth={1.5} />
                    <Radar name="Current" dataKey="current" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BarChart2({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="18" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="2" y="13" width="4" height="8" rx="1"/></svg>;
}
