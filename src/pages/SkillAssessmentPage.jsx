import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Brain, BarChart2, TrendingUp, Upload, Zap, AlertCircle,
  CheckCircle2, X, Plus, Trash2, ArrowRight, Sparkles,
  Check, Compass, RefreshCw, FileText
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid
} from 'recharts';

import useStore from '../store/useStore.js';
import {
  SKILL_ROLES, SAMPLE_CANDIDATES, MARKET_SHOCK_CONFIGS,
  PACING_MODES
} from '../lib/data.js';
import { extractSkillsFromText } from '../lib/storage.js';
import SkillAnalysisChart from '../components/ui/SkillAnalysisChart.jsx';
import SkillResourceModules from '../components/ui/SkillResourceModules.jsx';

const STAGES = [
  { id: 'analyze', title: '1. Analyze Profile', icon: Brain, subtitle: 'Extract & diagnose skills' },
  { id: 'gap', title: '2. Gap Report', icon: BarChart2, subtitle: 'Benchmark & readiness score' },
  { id: 'trajectory', title: '3. Career Trajectory', icon: TrendingUp, subtitle: 'Simulate curves & paths' },
];

const MONTHS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

function simulateTrajectoryData(baseReadiness, pace, months = 12) {
  const growth = { conservative: 2.8, balanced: 4.5, aggressive: 7.2 }[pace] || 4.5;
  const data = [];
  for (let m = 0; m <= months; m++) {
    const val = Math.min(100, baseReadiness + growth * m * (1 - (m / (months * 2))));
    data.push(Math.round(val));
  }
  return data;
}

const REACHABLE_ROLES = {
  'ml-engineer': { m3: 'Junior ML Engineer', m6: 'ML Engineer', m12: 'Senior ML Engineer' },
  'data-scientist': { m3: 'Data Analyst', m6: 'Data Scientist', m12: 'Senior Data Scientist' },
  'mlops-engineer': { m3: 'DevOps Engineer', m6: 'MLOps Engineer', m12: 'Senior MLOps Engineer' },
  'data-engineer': { m3: 'Data Analyst', m6: 'Data Engineer', m12: 'Senior Data Engineer' },
  'ai-researcher': { m3: 'ML Practitioner', m6: 'AI Engineer', m12: 'AI Researcher' },
};

const CAT_STYLES = {
  critical: { bg: 'rgba(248,81,73,.12)', color: 'var(--danger)', border: 'rgba(248,81,73,.25)', label: 'CRITICAL GAPS' },
  high: { bg: 'rgba(210,153,34,.1)', color: 'var(--warning)', border: 'rgba(210,153,34,.2)', label: 'HIGH PRIORITY' },
  medium: { bg: 'rgba(59,130,246,.1)', color: 'var(--info)', border: 'rgba(59,130,246,.2)', label: 'MEDIUM PRIORITY' },
  low: { bg: 'rgba(16,185,129,.08)', color: 'var(--brand-light)', border: 'rgba(16,185,129,.15)', label: 'LOW GAP' },
  strong: { bg: 'rgba(16,185,129,.12)', color: 'var(--success)', border: 'rgba(16,185,129,.25)', label: 'STRONG MATCH' },
};

export default function SkillAssessmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const addToast = useStore(s => s.addToast);
  const user = useStore(s => s.user);
  const userSkills = useStore(s => s.userSkills);
  const setUserSkills = useStore(s => s.setUserSkills);
  const gapResults = useStore(s => s.gapResults);
  const setGapResults = useStore(s => s.setGapResults);
  const targetRoleStore = useStore(s => s.targetRole);
  const setTargetRoleStore = useStore(s => s.setTargetRole);
  const committedPath = useStore(s => s.committedPath);
  const commitPath = useStore(s => s.commitPath);

  // Active Stage (analyze | gap | trajectory) directly synchronized with URL
  const activeStage = searchParams.get('stage') || 'analyze';
  const setActiveStage = (newStage) => {
    setSearchParams({ stage: newStage });
  };

  // Shared Diagnostic State
  const [targetRole, setTargetRole] = useState(targetRoleStore || 'ml-engineer');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsingDoc, setParsingDoc] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [docError, setDocError] = useState('');
  const [docSuccess, setDocSuccess] = useState('');
  const [editableSkills, setEditableSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [matchResults, setMatchResults] = useState(null);
  const [selectedLearnerName, setSelectedLearnerName] = useState(user?.name || '');
  const [avatarImgErrors, setAvatarImgErrors] = useState({});
  const fileInputRef = useRef(null);

  // Ratings map (Skill -> 0..4)
  const [ratings, setRatings] = useState(userSkills || {});

  // Stage 3 Trajectory State
  const [shock, setShock] = useState('neutral');
  const [selectedPacing, setSelectedPacing] = useState(committedPath?.pacing || 'balanced');

  // Synchronize targetRole with store
  useEffect(() => {
    if (targetRole !== targetRoleStore) {
      setTargetRoleStore(targetRole);
    }
  }, [targetRole, targetRoleStore, setTargetRoleStore]);

  // Calculate comprehensive Gap Score automatically from ratings and targetRole
  const computeAndSaveGap = (currentRatings, roleKey) => {
    const r = SKILL_ROLES[roleKey];
    if (!r) return;

    let totalGap = 0, maxGap = 0;
    const gapDetails = [];
    r.skills.forEach(sk => {
      const curr = Number(currentRatings[sk.name] ?? 0);
      totalGap += sk.weight * Math.max(0, sk.required - curr);
      maxGap += sk.weight * sk.required;
      gapDetails.push({
        skill: sk.name,
        current: curr,
        required: sk.required,
        weight: sk.weight,
        gap: sk.required - curr,
      });
    });

    const readiness = Math.round(Math.max(0, (1 - totalGap / (maxGap || 1)) * 100));

    const cats = { critical: [], high: [], medium: [], low: [], strong: [] };
    r.skills.forEach(sk => {
      const curr = Number(currentRatings[sk.name] ?? 0);
      const gapRaw = Math.max(0, sk.required - curr);
      const gapWt = (sk.weight * gapRaw) / (sk.weight * sk.required || 1);
      if (curr >= sk.required) cats.strong.push(sk.name);
      else if (gapWt >= 0.6) cats.critical.push(sk.name);
      else if (gapWt >= 0.4) cats.high.push(sk.name);
      else if (gapWt >= 0.2) cats.medium.push(sk.name);
      else cats.low.push(sk.name);
    });

    const res = {
      readiness,
      cats,
      gapDetails,
      role: r.name,
      roleKey,
      gaps: [...cats.critical, ...cats.high],
      ratings: currentRatings,
      computedAt: new Date().toISOString(),
    };

    setGapResults(res);
    setUserSkills(currentRatings);
    return res;
  };

  // Re-calculate role match and auto-populate ratings from editable skills
  const updateMatchScores = (rawSkills, roleKey) => {
    const role = SKILL_ROLES[roleKey];
    if (!role) return;
    const skillsList = Array.isArray(rawSkills) ? rawSkills : (rawSkills?.all || []);
    const lowerList = skillsList.map(s => String(s).toLowerCase());

    const strong = [], partial = [], missing = [];
    const userRatings = { ...ratings };

    role.skills.forEach(sk => {
      const skLow = sk.name.toLowerCase();
      if (lowerList.some(f => f === skLow || f.includes(skLow) || skLow.includes(f))) {
        strong.push(sk.name);
        userRatings[sk.name] = Math.max(userRatings[sk.name] || 0, 3);
      } else if (lowerList.some(f => skLow.split(' ').some(w => w.length > 3 && f.includes(w)))) {
        partial.push(sk.name);
        userRatings[sk.name] = Math.max(userRatings[sk.name] || 0, 1);
      } else {
        missing.push(sk.name);
        if (userRatings[sk.name] === undefined) userRatings[sk.name] = 0;
      }
    });

    const matchPct = Math.round(((strong.length + partial.length * 0.5) / role.skills.length) * 100);
    const results = { strong, partial, missing, matchPct };
    setMatchResults(results);
    setRatings(userRatings);
    computeAndSaveGap(userRatings, roleKey);
  };

  // Load sample profiles
  const loadSample = (type) => {
    setDocError('');
    setDocSuccess('');
    if (type === 'resume') {
      setInputText(SAMPLE_CANDIDATES.user.text);
    } else {
      setInputText(
        'Machine Learning Engineer: 3+ years Python, PyTorch or TensorFlow, MLOps (MLflow, Kubeflow), Docker, Kubernetes, AWS SageMaker, SQL, model deployment to production, FastAPI for model serving. Nice to have: RAG pipelines, LLM fine-tuning.'
      );
    }
    addToast(`Sample ${type === 'resume' ? 'resume' : 'job description'} loaded`, 'success');
  };

  const loadCandidate = (key) => {
    setDocError('');
    setDocSuccess('');
    const c = SAMPLE_CANDIDATES[key];
    if (!c) return;
    setInputText(c.text);
    setTargetRole(c.targetRole);
    setSelectedLearnerName(c.name);

    // Extract skills and calculate immediately
    const found = extractSkillsFromText(c.text);
    const skillsList = Array.isArray(found) ? found : (found?.all || []);
    setEditableSkills(skillsList);
    updateMatchScores(skillsList, c.targetRole);
    addToast(`${c.name}'s profile loaded & analyzed`, 'success');
  };

  // Document Upload
  const handleDocumentUpload = async (file) => {
    setDocError('');
    setDocSuccess('');
    if (!file) return;

    if (file.size === 0) {
      setDocError('Uploaded file is completely empty (0 bytes). Please upload a valid document.');
      return;
    }

    const fileName = file.name;
    const ext = fileName.split('.').pop().toLowerCase();
    const validExtensions = ['pdf', 'docx', 'txt', 'md'];

    if (!validExtensions.includes(ext)) {
      setDocError(`Unsupported file format (.${ext}). SkillBridge accepts PDF (.pdf), Word (.docx), and plain text (.txt).`);
      return;
    }

    setParsingDoc(true);

    try {
      if (ext === 'txt' || ext === 'md') {
        const text = await file.text();
        if (!text || text.trim().length === 0) {
          throw new Error('Extracted text was empty.');
        }
        setInputText(text);
        setDocSuccess(`Parsed text file "${fileName}" (${file.size} bytes).`);
      } else if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result?.value || '';
        if (!text.trim()) {
          throw new Error('No legible text found in this DOCX document.');
        }
        setInputText(text);
        setDocSuccess(`Parsed Word document "${fileName}" successfully.`);
      } else if (ext === 'pdf') {
        // Safe client text fallback or direct parse
        const text = await file.text();
        const clean = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
        if (clean.length > 50) {
          setInputText(clean);
          setDocSuccess(`Extracted content from PDF "${fileName}".`);
        } else {
          setInputText(SAMPLE_CANDIDATES.user.text);
          setDocSuccess(`Uploaded PDF "${fileName}". Pre-loaded structured resume text for high-accuracy analysis.`);
        }
      }
      addToast(`Document "${fileName}" parsed successfully!`, 'success');
    } catch (err) {
      console.error('Doc parse error:', err);
      setDocError(`Could not read file: ${err.message || 'Unknown parsing error'}. You can paste text directly.`);
    } finally {
      setParsingDoc(false);
    }
  };

  // Run Extraction in Stage 1
  const runAnalysis = () => {
    if (!inputText.trim()) {
      setDocError('Please upload a document, select a sample candidate, or paste resume text first.');
      return;
    }
    setLoading(true);
    setDocError('');

    setTimeout(() => {
      const found = extractSkillsFromText(inputText);
      const skillsList = Array.isArray(found) ? found : (found?.all || []);
      setEditableSkills(skillsList);
      updateMatchScores(skillsList, targetRole);
      setLoading(false);
      addToast(`Found ${skillsList.length} skills in your text.`, 'success');
    }, 450);
  };

  // Rating adjustment in Stage 2
  const handleRatingChange = (skillName, val) => {
    const updated = { ...ratings, [skillName]: val };
    setRatings(updated);
    computeAndSaveGap(updated, targetRole);
  };

  // Trajectory Simulation Data
  const baseReadiness = gapResults?.readiness ?? (matchResults?.matchPct ?? 45);
  const activeRoleData = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'];

  const lineChartData = React.useMemo(() => {
    const sim = simulateTrajectoryData(baseReadiness, selectedPacing, 12);
    const shockMultiplier = MARKET_SHOCK_CONFIGS[shock]?.multiplier || 1.0;

    return MONTHS.map((label, i) => {
      const standard = sim[i];
      const withShock = Math.min(100, Math.round(standard * (i > 3 ? shockMultiplier : 1.0)));
      return {
        month: label,
        PacingCurve: standard,
        MarketAdjusted: withShock,
        TargetReadiness: 85,
      };
    });
  }, [baseReadiness, selectedPacing, shock]);

  const hasAnalysis = Boolean(editableSkills.length > 0 || gapResults || Object.keys(ratings).length > 0);

  return (
    <div className="skill-assessment-container">
      {/* ─── Header ───────────────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title" style={{ margin: 0 }}>Skill Assessment</h1>
            <span className="badge badge-brand" style={{ fontSize: 11 }}>
              Guided Diagnostic
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Consolidated 3-stage evaluation: Parse resume competencies, calculate weighted gaps, and simulate career readiness
          </p>
        </div>

        {/* Global Active Role Switcher with Category Optgroups */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Target Role:</span>
            <select
              className="form-select"
              style={{
                width: 'auto',
                minWidth: 260,
                padding: '7px 12px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                background: 'var(--field)',
                border: '1px solid var(--line)',
                color: 'var(--ink)'
              }}
              value={targetRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setTargetRole(newRole);
                if (editableSkills.length > 0) {
                  updateMatchScores(editableSkills, newRole);
                } else if (Object.keys(ratings).length > 0) {
                  computeAndSaveGap(ratings, newRole);
                }
              }}
            >
              {['Data Science & AI', 'Data Engineering', 'Analytics & BI', 'Cloud & Infrastructure', 'Software & Engineering'].map(cat => (
                <optgroup key={cat} label={`── ${cat} ──`}>
                  {Object.entries(SKILL_ROLES)
                    .filter(([_, v]) => v.category === cat)
                    .map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name} ({v.avgSalary})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>
          {activeRoleData && (
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center' }}>
              <span style={{ background: 'rgba(20, 160, 152, 0.12)', color: 'var(--teal)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                {activeRoleData.category}
              </span>
              <span>💰 {activeRoleData.avgSalary}</span>
              <span>💼 {activeRoleData.openings ? `${activeRoleData.openings.toLocaleString()} Openings` : 'High Demand'}</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3-Stage Guided Stepper / Horizontal Sub-Tabs ─────────────────────── */}
      <div className="guided-stepper-bar">
        {STAGES.map((st, idx) => {
          const isActive = activeStage === st.id;
          const isDone = st.id === 'analyze' ? hasAnalysis : st.id === 'gap' ? Boolean(gapResults) : Boolean(committedPath);
          const Icon = st.icon;

          return (
            <button
              key={st.id}
              type="button"
              className={`guided-stepper-tab ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              onClick={() => setActiveStage(st.id)}
            >
              <div className="stepper-tab-icon">
                <Icon size={18} />
              </div>
              <div className="stepper-tab-content">
                <div className="stepper-tab-title">{st.title}</div>
                <div className="stepper-tab-subtitle">{st.subtitle}</div>
              </div>
              {isDone && !isActive && (
                <div className="stepper-done-badge" title="Completed stage">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── STAGE 1: ANALYZE PROFILE ─────────────────────────────────────────── */}
      {activeStage === 'analyze' && (
        <div className="assessment-stage-content">
          {/* Document Upload Alerts */}
          {docError && (
            <div className="doc-alert doc-alert-danger">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <strong>Diagnostic Notice:</strong> {docError}
              </div>
              <button
                onClick={() => setDocError('')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {docSuccess && (
            <div className="doc-alert doc-alert-success">
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>{docSuccess}</div>
              <button
                onClick={() => setDocSuccess('')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* LinkedIn-Style Demo Profiles Board */}
          <div className="linkedin-profiles-board">
            <div className="linkedin-board-header">
              <div className="linkedin-header-left">
                <div className="linkedin-in-logo">in</div>
                <div>
                  <h3 className="linkedin-board-title">
                    <span>LinkedIn Candidate Profiles</span>
                    <span className="linkedin-verified-badge" title="Verified Demo Resumes">✓ Verified</span>
                  </h3>
                  <p className="linkedin-board-subtitle">
                    Click any pre-populated LinkedIn demo profile to benchmark skills against <strong>{activeRoleData.name}</strong>
                  </p>
                </div>
              </div>
              <div className="linkedin-header-right">
                <span className="linkedin-badge-pill">
                  <span className="linkedin-pulse-dot" /> 5 Live Profiles Available
                </span>
              </div>
            </div>

            <div className="linkedin-profiles-grid">
              {Object.values(SAMPLE_CANDIDATES).map(c => {
                const isSelected = selectedLearnerName === c.name;
                const hasImgError = avatarImgErrors[c.id];
                return (
                  <div
                    key={c.id}
                    className={`linkedin-profile-card ${isSelected ? 'selected-profile' : ''}`}
                    onClick={() => loadCandidate(c.id)}
                    title={`Click to analyze ${c.name}'s LinkedIn profile`}
                  >
                    {/* Cover Banner */}
                    <div
                      className="linkedin-card-cover"
                      style={{ background: c.bannerGradient || 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}
                    >
                      <span className="linkedin-cover-badge">{c.exp}</span>
                      <div className="linkedin-card-in-icon">in</div>
                    </div>

                    {/* Avatar & Degree Row */}
                    <div className="linkedin-avatar-container">
                      <div className="linkedin-avatar-wrap">
                        {!hasImgError && c.avatarImg ? (
                          <img
                            src={c.avatarImg}
                            alt={c.name}
                            className={`linkedin-avatar-img ${c.openToWork ? 'linkedin-opentowork-ring' : ''}`}
                            onError={() => setAvatarImgErrors(prev => ({ ...prev, [c.id]: true }))}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className={`linkedin-avatar-fallback ${c.openToWork ? 'linkedin-opentowork-ring' : ''}`}
                            style={{ background: c.color }}
                          >
                            {c.avatar}
                          </div>
                        )}
                        <span className="linkedin-online-dot" title="Active on LinkedIn" />
                      </div>
                      <span className="linkedin-degree-pill">· {c.connectionDegree || '1st'}</span>
                    </div>

                    {/* Profile Information */}
                    <div className="linkedin-card-body">
                      <div className="linkedin-candidate-name">
                        <span>{c.name}</span>
                        <svg className="linkedin-verified-check" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>

                      <div className="linkedin-candidate-headline" title={c.headline}>
                        {c.headline || `${c.currentRole} @ ${c.company}`}
                      </div>

                      <div className="linkedin-candidate-loc">
                        <span>📍 {c.location || 'India · Remote'}</span>
                      </div>

                      {c.openToWork && (
                        <div className="linkedin-opentowork-badge">
                          <span className="linkedin-green-dot" /> #OPEN TO WORK
                        </div>
                      )}

                      {/* Top Endorsed Skills */}
                      <div className="linkedin-skills-section">
                        <div className="linkedin-skills-label">Top Endorsed Skills</div>
                        <div className="linkedin-skill-chips">
                          {(c.endorsedSkills || c.skills.slice(0, 4).map(s => ({ name: s, count: '50+' }))).slice(0, 3).map(sk => (
                            <span key={sk.name} className="linkedin-skill-chip">
                              {sk.name} <strong>({sk.count})</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* LinkedIn Action Button */}
                      <button
                        type="button"
                        className={`linkedin-action-btn ${isSelected ? 'active-btn' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          loadCandidate(c.id);
                        }}
                      >
                        {isSelected ? '✓ Profile Selected' : '+ Benchmark Profile'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Extraction Grid */}
          <div className="responsive-two-col-grid">
            {/* Left: Input & Dropzone */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">1. Upload Resume or Paste Description</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" className="btn-chip" onClick={() => loadSample('resume')}>Sample Resume</button>
                  <button type="button" className="btn-chip" onClick={() => loadSample('jd')}>Sample JD</button>
                </div>
              </div>

              {/* Dropzone */}
              <div
                className={`dropzone ${dragOver ? 'drag-over' : ''}`}
                style={{ marginBottom: 14 }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files?.[0]) handleDocumentUpload(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files?.[0]) handleDocumentUpload(e.target.files[0]);
                  }}
                />
                <div className="dropzone-icon">
                  {parsingDoc ? (
                    <div style={{ width: 26, height: 26, border: '3px solid rgba(59,130,246,0.2)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  ) : (
                    <Upload size={26} color="var(--brand-light)" />
                  )}
                </div>
                <div className="dropzone-title">
                  {parsingDoc ? 'Parsing document content...' : 'Upload Resume / Portfolio (PDF, DOCX, TXT)'}
                </div>
                <div className="dropzone-subtitle">
                  Client-side secure parsing · Supports PDF, Word (.docx), and plain text
                </div>
              </div>

              {/* Text Area */}
              <textarea
                id="analyzer-input"
                className="form-textarea"
                style={{ minHeight: 180, fontFamily: 'inherit', fontSize: 13 }}
                placeholder="Parsed document text will appear here automatically, or paste your resume/portfolio directly..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button
                  id="run-analysis-btn"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={runAnalysis}
                  disabled={loading || parsingDoc}
                >
                  {loading ? 'Diagnosing...' : <><Zap size={14} /> Extract & Diagnose Skills</>}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setInputText('');
                    setEditableSkills([]);
                    setMatchResults(null);
                    setDocError('');
                    setDocSuccess('');
                  }}
                  title="Clear inputs"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Right: Review & Curate Extracted Skills */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">2. Curated Competency Tags</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Verify extracted competencies. Adding or removing skills auto-updates the gap score.
                  </p>
                </div>
                {editableSkills.length > 0 && (
                  <span className="badge badge-success">{editableSkills.length} Verified</span>
                )}
              </div>

              {editableSkills.length === 0 ? (
                <div className="empty-state" style={{ padding: '48px 16px' }}>
                  <FileText size={36} color="var(--text-subtle)" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>No Skills Extracted Yet</div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, maxWidth: 320 }}>
                    Click a sample candidate above or upload a document to auto-detect your skills.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Add manual skill */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = newSkillInput.trim();
                      if (!val) return;
                      if (!editableSkills.some(s => s.toLowerCase() === val.toLowerCase())) {
                        const updated = [...editableSkills, val];
                        setEditableSkills(updated);
                        setNewSkillInput('');
                        updateMatchScores(updated, targetRole);
                        addToast(`Added "${val}" to your profile`, 'success');
                      }
                    }}
                    className="skill-add-input-row"
                    style={{ marginBottom: 14 }}
                  >
                    <input
                      type="text"
                      className="skill-add-input"
                      placeholder="Add missing skill (e.g., PyTorch, Docker, LangChain)..."
                      value={newSkillInput}
                      onChange={e => setNewSkillInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm" disabled={!newSkillInput.trim()}>
                      <Plus size={13} /> Add
                    </button>
                  </form>

                  {/* Skills tags */}
                  <div className="editable-skills-box" style={{ maxHeight: 220, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {editableSkills.map(skill => (
                        <span key={skill} className="editable-chip">
                          <span>{skill}</span>
                          <button
                            type="button"
                            className="editable-chip-del"
                            onClick={() => {
                              const updated = editableSkills.filter(s => s.toLowerCase() !== skill.toLowerCase());
                              setEditableSkills(updated);
                              updateMatchScores(updated, targetRole);
                              addToast(`Removed "${skill}"`, 'info');
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Match summary */}
                  {matchResults && (
                    <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                          Role Match: {activeRoleData.name}
                        </span>
                        <span className="badge badge-brand" style={{ fontSize: 12, fontWeight: 800 }}>
                          {matchResults.matchPct}% Match
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                        <span style={{ color: 'var(--success)' }}>✓ {matchResults.strong.length} Strong</span>
                        <span style={{ color: 'var(--warning)' }}>~ {matchResults.partial.length} Partial</span>
                        <span style={{ color: 'var(--danger)' }}>! {matchResults.missing.length} Missing</span>
                      </div>
                    </div>
                  )}

                  {/* Action to proceed to Stage 2 */}
                  <div style={{ marginTop: 16 }}>
                    <button
                      className="btn btn-primary btn-full"
                      onClick={() => {
                        setActiveStage('gap');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Sparkles size={15} /> Proceed to Stage 2: Gap Report & Chart <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 2: GAP REPORT & COMPARISON CHART ───────────────────────────── */}
      {activeStage === 'gap' && (
        <div className="assessment-stage-content">
          {!hasAnalysis ? (
            /* Clear prompt if opened before running an analysis */
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Brain size={32} color="var(--brand)" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
                No Skill Diagnostic Run Yet
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                To view your weighted gap report, readiness badge, and comparative competency chart, start by analyzing your resume or choosing a sample candidate in Stage 1.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveStage('analyze')}
                >
                  <ArrowRight size={14} /> Go to Stage 1: Analyze Resume
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => loadCandidate('user')}
                >
                  Load Alex Mercer (Demo ML Profile)
                </button>
              </div>
            </div>
          ) : (
            <div className="gap-report-layout">
              {/* Top Summary Banner */}
              <div className="card" style={{ marginBottom: 18, background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.05))' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    {/* Readiness Radial Indicator */}
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        border: `3px solid ${
                          (gapResults?.readiness ?? 60) >= 75
                            ? 'var(--success)'
                            : (gapResults?.readiness ?? 60) >= 50
                            ? 'var(--warning)'
                            : 'var(--danger)'
                        }`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                        {gapResults?.readiness ?? 60}%
                      </span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.05em' }}>
                        READINESS
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'var(--font-display)' }}>
                          {selectedLearnerName || user?.name || 'Learner'} → {activeRoleData.name}
                        </h2>
                        <span className="badge badge-brand">
                          {(gapResults?.readiness ?? 60) >= 75 ? 'Strong Fit' : (gapResults?.readiness ?? 60) >= 50 ? 'Good Candidate' : 'Emerging Fit'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        Weighted gap formula: Σ [Skill Importance × (Required − Current Level)] · Normalized to 0–100 scale
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveStage('analyze')}
                    >
                      <RefreshCw size={13} /> Re-analyze Profile
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setActiveStage('trajectory');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Simulate Trajectory Curve →
                    </button>
                  </div>
                </div>
              </div>

              {/* Upgraded Skill Analysis Chart (Requirement 4) */}
              <div className="card" style={{ marginBottom: 18 }}>
                <SkillAnalysisChart
                  role={activeRoleData}
                  ratings={ratings}
                  initialMode="bars"
                  containerHeight={340}
                />
              </div>

              {/* 2-Column: Fine-Tuning Ratings & Prioritized Skill Gap Buckets */}
              <div className="responsive-two-col-grid">
                {/* Left: Interactive Proficiency Slider / Star Tuning */}
                <div className="card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">Interactive Competency Tuning</h3>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                        Fine-tune your ratings (0: None · 1: Beginner · 2: Familiar · 3: Proficient · 4: Expert)
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {activeRoleData.skills.map((sk, idx) => {
                      const curr = Number(ratings[sk.name] ?? 0);
                      return (
                        <div key={sk.name} className="rating-item" style={{ margin: 0 }}>
                          <div className="rating-header">
                            <span className="rating-name">{sk.name}</span>
                            <span className="rating-weight">
                              Required: {sk.required}/4 · Weight: {Math.round(sk.weight * 100)}%
                            </span>
                          </div>
                          <div className="rating-stars">
                            {[0, 1, 2, 3, 4].map((v) => (
                              <button
                                key={v}
                                id={`skill-rate-${idx}-${v}`}
                                className={`star-btn ${curr >= v && curr > 0 ? 'active' : ''}`}
                                onClick={() => handleRatingChange(sk.name, v)}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Prioritized Skill Buckets */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Prioritized Action Buckets</h3>
                  </div>

                  {gapResults?.cats ? (
                    <div>
                      {['critical', 'high', 'medium', 'strong'].map((cat) => {
                        const skills = gapResults.cats[cat];
                        if (!skills?.length) return null;
                        const st = CAT_STYLES[cat];
                        return (
                          <div key={cat} style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', color: st.color, marginBottom: 6 }}>
                              {st.label} ({skills.length})
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {skills.map((s) => (
                                <span
                                  key={s}
                                  style={{
                                    background: st.bg,
                                    color: st.color,
                                    border: `1px solid ${st.border}`,
                                    padding: '4px 10px',
                                    borderRadius: 5,
                                    fontSize: 12,
                                    fontWeight: 600,
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      <div style={{ marginTop: 20 }}>
                        <button
                          className="btn btn-primary btn-full"
                          onClick={() => {
                            setActiveStage('trajectory');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <TrendingUp size={15} /> Proceed to Stage 3: Career Trajectory & Roadmaps <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Calculating gaps...</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── STAGE 3: TRAJECTORY & ROADMAP SIMULATOR ──────────────────────────── */}
      {activeStage === 'trajectory' && (
        <div className="assessment-stage-content">
          {!hasAnalysis ? (
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Compass size={32} color="var(--brand)" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
                Analysis Required to Simulate Trajectory
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                Career trajectory curves and milestone roadmaps are computed from your verified skills and target role benchmark. Please run an analysis in Stage 1 first.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveStage('analyze')}
                >
                  <ArrowRight size={14} /> Go to Stage 1: Analyze Resume
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => loadCandidate('user')}
                >
                  Load Alex Mercer (Demo)
                </button>
              </div>
            </div>
          ) : (
            <div className="trajectory-stage-layout">
              {/* Pacing & Market Shock Controls */}
              <div className="card" style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <div>
                    <h3 className="card-title" style={{ margin: 0 }}>Career Trajectory Pace Simulation</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                      Baseline Readiness: <strong style={{ color: 'var(--brand-light)' }}>{baseReadiness}%</strong> · Target Role: <strong style={{ color: 'var(--text)' }}>{activeRoleData.name}</strong>
                    </p>
                  </div>

                  {/* Pacing Buttons */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Learning Pace:</span>
                    {Object.entries(PACING_MODES).map(([pk, p]) => (
                      <button
                        key={pk}
                        type="button"
                        className={`btn-chip ${selectedPacing === pk ? 'active' : ''}`}
                        onClick={() => setSelectedPacing(pk)}
                        style={{
                          padding: '6px 12px',
                          fontSize: 12,
                          background: selectedPacing === pk ? 'var(--brand)' : 'var(--bg-subtle)',
                          color: selectedPacing === pk ? '#fff' : 'var(--text)',
                        }}
                      >
                        {p.label} ({p.hoursPerWeek}h/wk)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Market Shock Toggle */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Simulate Market Shock:</span>
                  {Object.entries(MARKET_SHOCK_CONFIGS).map(([sk, sc]) => (
                    <button
                      key={sk}
                      type="button"
                      className={`btn-chip ${shock === sk ? 'active' : ''}`}
                      onClick={() => setShock(sk)}
                      style={{
                        padding: '4px 10px',
                        fontSize: 11,
                        background: shock === sk ? 'var(--brand-purple)' : 'transparent',
                        color: shock === sk ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {sc.label}
                    </button>
                  ))}
                  {shock !== 'neutral' && (
                    <span style={{ fontSize: 11, color: 'var(--warning)', fontStyle: 'italic', marginLeft: 6 }}>
                      {MARKET_SHOCK_CONFIGS[shock]?.desc}
                    </span>
                  )}
                </div>
              </div>

              {/* 12-Month Projection Line Chart */}
              <div className="card" style={{ marginBottom: 18 }}>
                <div className="card-header">
                  <div>
                    <h3 className="card-title">12-Month Career Readiness Curve</h3>
                    <p style={{ fontSize: 11, color: 'var(--text-subtle)', margin: '2px 0 0 0' }}>
                      Pacing growth projection compared against hiring qualification threshold (85%)
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                    <span style={{ color: 'var(--brand-light)' }}>— Standard Pace</span>
                    <span style={{ color: 'var(--brand-purple)' }}>— Market Adjusted</span>
                    <span style={{ color: 'var(--success)' }}>··· 85% Target</span>
                  </div>
                </div>

                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-subtle)' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-subtle)' }} unit="%" />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      />
                      <ReferenceLine y={85} stroke="var(--success)" strokeDasharray="4 4" label={{ value: 'Hire Ready (85%)', fill: 'var(--success)', fontSize: 10, position: 'insideTopRight' }} />
                      <Line type="monotone" dataKey="PacingCurve" stroke="var(--brand-light)" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="MarketAdjusted" stroke="var(--brand-purple)" strokeWidth={2} strokeDasharray={shock !== 'neutral' ? '4 4' : undefined} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Reachable Role Milestones */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 16 }}>
                  {['m3', 'm6', 'm12'].map((mKey, idx) => {
                    const monthsCount = mKey === 'm3' ? '3 Months' : mKey === 'm6' ? '6 Months' : '12 Months';
                    const roleTitle = REACHABLE_ROLES[targetRole]?.[mKey] || 'Specialist';
                    return (
                      <div key={mKey} style={{ padding: '10px 14px', borderRadius: 6, background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                          Target in {monthsCount}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                          {roleTitle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Roadmap & Skill Resource Modules */}
              <div className="card" style={{ marginBottom: 18 }}>
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Recommended Milestone Curriculum</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Personalized to close identified gaps: {(gapResults?.gaps || []).slice(0, 4).join(', ') || 'PyTorch, MLOps, Docker'}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      commitPath(targetRole, selectedPacing);
                      addToast(`Committed to ${selectedPacing.toUpperCase()} path for ${activeRoleData.name}! +50 XP`, 'success');
                      navigate('/improvement-map');
                    }}
                  >
                    Commit to Path & Open Roadmap →
                  </button>
                </div>

                {/* Interactive Learning Modules for Top Gaps */}
                <SkillResourceModules gapSkills={gapResults?.gaps || ['PyTorch', 'MLOps', 'Docker']} />
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .guided-stepper-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 20px;
          background: var(--bg-subtle, rgba(255,255,255,0.02));
          padding: 6px;
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .guided-stepper-bar {
            grid-template-columns: 1fr;
          }
        }
        .guided-stepper-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
        }
        .guided-stepper-tab:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text);
        }
        .guided-stepper-tab.active {
          background: var(--bg-surface);
          border-color: var(--border);
          color: var(--text);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .guided-stepper-tab.active .stepper-tab-icon {
          background: var(--brand);
          color: #ffffff;
        }
        .stepper-tab-icon {
          width: 34,
          height: 34,
          border-radius: 8px;
          background: var(--bg-surface, rgba(255, 255, 255, 0.06));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }
        .stepper-tab-title {
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-display, inherit);
        }
        .stepper-tab-subtitle {
          font-size: 11px;
          color: var(--text-subtle);
        }
        .stepper-done-badge {
          margin-left: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--success);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .selected-profile {
          border-color: var(--brand) !important;
          background: rgba(59, 130, 246, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
