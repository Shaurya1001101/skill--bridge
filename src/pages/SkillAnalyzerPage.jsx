import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Zap, AlertCircle, CheckCircle2, X, Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import useStore from '../store/useStore.js';
import { SKILL_ROLES, SAMPLE_CANDIDATES } from '../lib/data.js';
import { extractSkillsFromText } from '../lib/storage.js';

export default function SkillAnalyzerPage() {
  const navigate = useNavigate();
  const addToast = useStore(s => s.addToast);
  const setAnalyzerResults = useStore(s => s.setAnalyzerResults);
  const setUserSkills = useStore(s => s.setUserSkills);

  const [inputText, setInputText] = useState('');
  const [targetRole, setTargetRole] = useState('ml-engineer');
  const [loading, setLoading] = useState(false);
  const [parsingDoc, setParsingDoc] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [docError, setDocError] = useState('');
  const [docSuccess, setDocSuccess] = useState('');
  const [editableSkills, setEditableSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [matchResults, setMatchResults] = useState(null);
  const [avatarImgErrors, setAvatarImgErrors] = useState({});
  const [selectedCandidateId, setSelectedCandidateId] = useState('user');
  const fileInputRef = useRef(null);

  // Helper to re-calculate role match based on current editable skills
  const updateMatchScores = (skillsList, roleKey) => {
    const role = SKILL_ROLES[roleKey];
    if (!role) return;
    const lowerList = skillsList.map(s => s.toLowerCase());

    const strong = [], partial = [], missing = [];
    const userRatings = {};

    role.skills.forEach(sk => {
      const skLow = sk.name.toLowerCase();
      if (lowerList.some(f => f === skLow || f.includes(skLow) || skLow.includes(f))) {
        strong.push(sk.name);
        userRatings[sk.name] = 3;
      } else if (lowerList.some(f => skLow.split(' ').some(w => w.length > 3 && f.includes(w)))) {
        partial.push(sk.name);
        userRatings[sk.name] = 1;
      } else {
        missing.push(sk.name);
        userRatings[sk.name] = 0;
      }
    });

    const matchPct = Math.round((strong.length + partial.length * 0.5) / role.skills.length * 100);
    const results = { strong, partial, missing, matchPct };
    setMatchResults(results);
    setUserSkills(userRatings);
  };

  const loadSample = (type) => {
    setDocError('');
    setDocSuccess('');
    if (type === 'resume') {
      setInputText(SAMPLE_CANDIDATES.user.text);
    } else {
      setInputText('Machine Learning Engineer: 3+ years Python, PyTorch or TensorFlow, MLOps (MLflow, Kubeflow), Docker, Kubernetes, AWS SageMaker, SQL, model deployment to production, FastAPI for model serving. Nice to have: RAG pipelines, LLM fine-tuning.');
    }
    addToast(`Sample ${type === 'resume' ? 'resume' : 'job description'} loaded`, 'success');
  };

  const loadCandidate = (key) => {
    setDocError('');
    setDocSuccess('');
    const c = SAMPLE_CANDIDATES[key];
    if (!c) return;
    setSelectedCandidateId(key);
    setInputText(c.text);
    setTargetRole(c.targetRole);
    addToast(`${c.name}'s profile loaded`, 'success');
  };

  // Robust Client-side Document Parser (PDF, DOCX, TXT)
  const handleDocumentUpload = async (file) => {
    setDocError('');
    setDocSuccess('');
    if (!file) return;

    // 1. Validation: check empty file
    if (file.size === 0) {
      setDocError('Uploaded file is completely empty (0 bytes). Please upload a valid document.');
      return;
    }

    const fileName = file.name;
    const ext = fileName.split('.').pop().toLowerCase();
    const validExtensions = ['pdf', 'docx', 'txt', 'md'];

    // 2. Validation: check supported file extensions
    if (!validExtensions.includes(ext)) {
      setDocError(`Unsupported file format (.${ext}). SkillBridge accepts PDF (.pdf), Word (.docx), and plain text (.txt).`);
      return;
    }

    setParsingDoc(true);

    try {
      let extractedContent = '';

      if (ext === 'txt' || ext === 'md') {
        extractedContent = await file.text();
      } else if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const ab = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: ab });
        extractedContent = result.value || '';
      } else if (ext === 'pdf') {
        // PDF parser: Attempt pdfjs from CDN or fallback to binary token extraction
        try {
          let pdfjs = window.pdfjsLib;
          if (!pdfjs) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
              script.onload = () => {
                if (window.pdfjsLib) {
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                  resolve();
                } else reject(new Error('pdfjsLib not found on window'));
              };
              script.onerror = () => reject(new Error('Failed to load PDF library'));
              document.head.appendChild(script);
            });
            pdfjs = window.pdfjsLib;
          }

          const ab = await file.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: ab });
          const pdfDoc = await loadingTask.promise;
          let textAcc = '';

          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str).join(' ');
            textAcc += strings + '\n';
          }
          extractedContent = textAcc;
        } catch (_pdfErr) {
          // Robust client-side fallback for PDF stream extraction
          const ab = await file.arrayBuffer();
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const raw = decoder.decode(new Uint8Array(ab));
          const matches = raw.match(/\(([^()]{2,})\)/g) || [];
          const words = matches.map(m => m.slice(1, -1)).filter(s => /[a-zA-Z]{2,}/.test(s));
          if (words.length > 10) {
            extractedContent = words.join(' ');
          } else {
            throw new Error('PDF appears scanned or encrypted. No selectable text detected.');
          }
        }
      }

      const cleanText = (extractedContent || '').trim();

      // 3. Validation: check if readable text was extracted
      if (cleanText.length < 25) {
        setDocError(`Could not extract readable text from "${fileName}". The file may be image-scanned or password-protected. Please paste your resume text manually below.`);
        setParsingDoc(false);
        return;
      }

      setInputText(cleanText);
      const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
      setDocSuccess(`Successfully parsed "${fileName}" (${wordCount} words). Review and edit extracted skills below.`);
      addToast(`Extracted ${wordCount} words from ${fileName}`, 'success');

      // Auto-extract skills into editable list
      const skills = extractSkillsFromText(cleanText);
      setEditableSkills([...skills.all]);
      updateMatchScores(skills.all, targetRole);

    } catch (err) {
      setDocError(`Parsing error on "${fileName}": ${err.message || 'Unknown parsing failure'}. Please copy and paste your resume text directly into the box below.`);
    } finally {
      setParsingDoc(false);
    }
  };

  const runAnalysis = async () => {
    if (inputText.trim().length < 30) {
      addToast('Please enter at least 30 characters of text', 'warning');
      return;
    }
    setLoading(true);
    setDocError('');
    await new Promise(r => setTimeout(r, 600));

    const skills = extractSkillsFromText(inputText);
    setEditableSkills([...skills.all]);
    updateMatchScores(skills.all, targetRole);

    setAnalyzerResults(skills, targetRole, null);
    addToast(`Diagnostic complete: ${skills.all.length} skills identified.`, 'success');
    setLoading(false);
  };

  // Editable Skill Actions
  const handleRemoveSkill = (skillToRemove) => {
    const updated = editableSkills.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase());
    setEditableSkills(updated);
    updateMatchScores(updated, targetRole);
    addToast(`Removed "${skillToRemove}"`, 'info');
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const val = newSkillInput.trim();
    if (!val) return;
    if (editableSkills.some(s => s.toLowerCase() === val.toLowerCase())) {
      addToast(`"${val}" is already in your skills list`, 'warning');
      return;
    }
    const updated = [...editableSkills, val];
    setEditableSkills(updated);
    setNewSkillInput('');
    updateMatchScores(updated, targetRole);
    addToast(`Added "${val}" to your profile`, 'success');
  };

  const handleFeedToTrajectory = () => {
    updateMatchScores(editableSkills, targetRole);
    addToast('Skills fed to Career Trajectory!', 'success');
    navigate('/trajectory');
  };

  const matchColor = matchResults ? (matchResults.matchPct >= 70 ? 'var(--success)' : matchResults.matchPct >= 50 ? 'var(--warning)' : 'var(--danger)') : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Skill Extractor & Document Analyzer</h1>
          <p className="page-subtitle">Upload your resume (PDF, DOCX, TXT) or paste text to automatically parse and curate your verified skills</p>
        </div>
      </div>

      {/* Inline Document Error / Success Alert Messages */}
      {docError && (
        <div className="doc-alert doc-alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <strong>Document Upload Error:</strong> {docError}
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
                Click any pre-populated LinkedIn demo profile to pre-fill resumes and test role benchmarks
              </p>
            </div>
          </div>
          <div className="linkedin-header-right">
            <span className="linkedin-badge-pill">
              <span className="linkedin-pulse-dot" /> 5 Live Profiles
            </span>
          </div>
        </div>

        <div className="linkedin-profiles-grid">
          {Object.values(SAMPLE_CANDIDATES).map(c => {
            const isSelected = selectedCandidateId === c.id;
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

                  {/* Action Button */}
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

      {/* Main Analyzer Grid */}
      <div className="responsive-two-col-grid">
        {/* Left Column: Upload & Text Input */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">1. Upload Document or Paste Content</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-chip" onClick={() => loadSample('resume')}>Sample Resume</button>
              <button className="btn-chip" onClick={() => loadSample('jd')}>Sample JD</button>
            </div>
          </div>

          {/* Drag & Drop Zone */}
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
                <div style={{ width: 28, height: 28, border: '3px solid rgba(59,130,246,0.2)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <Upload size={28} color="var(--brand-light)" />
              )}
            </div>
            <div className="dropzone-title">
              {parsingDoc ? 'Parsing document content...' : 'Upload Resume / Portfolio (PDF, DOCX, TXT)'}
            </div>
            <div className="dropzone-subtitle">
              Drag & drop or click to browse · Parses client-side securely
            </div>
          </div>

          {/* Text Area */}
          <textarea
            id="analyzer-input"
            className="form-textarea"
            style={{ minHeight: 180, fontFamily: 'inherit' }}
            placeholder="Parsed document text will appear here automatically, or you can paste your resume or job description directly...&#10;&#10;Example: Senior Python Developer with 4 years building ML systems with PyTorch, Scikit-learn, Docker, and AWS."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />

          <div className="form-group" style={{ marginTop: 12, marginBottom: 0 }}>
            <label className="form-label">Target Role Evaluation</label>
            <select
              className="form-select"
              value={targetRole}
              onChange={e => {
                setTargetRole(e.target.value);
                if (editableSkills.length > 0) updateMatchScores(editableSkills, e.target.value);
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

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button
              id="run-analysis-btn"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={runAnalysis}
              disabled={loading || parsingDoc}
            >
              {loading ? 'Analyzing...' : <><Zap size={14} /> Extract & Diagnose Skills</>}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setInputText('');
                setExtracted(null);
                setEditableSkills([]);
                setMatchResults(null);
                setDocError('');
                setDocSuccess('');
              }}
              title="Clear all text"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Editable & Reviewable Extracted Skills */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">2. Review & Edit Extracted Skills</h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Correct misreads or add missing competencies before generating your path
              </p>
            </div>
            {editableSkills.length > 0 && (
              <span className="badge badge-info">{editableSkills.length} Verified</span>
            )}
          </div>

          {editableSkills.length === 0 ? (
            <div className="empty-state" style={{ padding: '48px 16px' }}>
              <Zap size={36} color="var(--text-subtle)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>No Skills Extracted Yet</div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Upload a PDF/DOCX resume or click "Sample Resume" to automatically detect skills.
              </p>
            </div>
          ) : (
            <div>
              {/* Add Missing Skill Input */}
              <form onSubmit={handleAddSkill} className="skill-add-input-row" style={{ marginBottom: 14 }}>
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

              {/* Editable Skills Tag Cloud */}
              <div className="editable-skills-box" style={{ maxHeight: 280, overflowY: 'auto' }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', marginBottom: 8 }}>
                  Click "×" to remove any false positives:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {editableSkills.map(skill => (
                    <span key={skill} className="editable-chip">
                      <span>{skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
                      <button
                        type="button"
                        className="editable-chip-del"
                        onClick={() => handleRemoveSkill(skill)}
                        title={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Feed to Path Generator Button */}
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleFeedToTrajectory}
                >
                  <Sparkles size={14} /> Feed Verified Skills to Trajectory & Path Generator <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Match Diagnostic Grid */}
      {matchResults && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <h2 className="card-title">Real-Time Role Readiness Match</h2>
            <span className="badge" style={{ background: `${matchColor}20`, color: matchColor, fontSize: 12 }}>
              {matchResults.matchPct}% Match · {SKILL_ROLES[targetRole].name}
            </span>
          </div>

          <div className="match-grid">
            <div className="match-col match-col-success">
              <div className="match-col-title">STRONG MATCH ({matchResults.strong.length})</div>
              {matchResults.strong.map(s => <div key={s} className="match-item">✓ {s}</div>)}
              {matchResults.strong.length === 0 && <div className="match-item" style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>None detected</div>}
            </div>

            <div className="match-col match-col-warning">
              <div className="match-col-title">PARTIAL MATCH ({matchResults.partial.length})</div>
              {matchResults.partial.map(s => <div key={s} className="match-item">~ {s}</div>)}
              {matchResults.partial.length === 0 && <div className="match-item" style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>None</div>}
            </div>

            <div className="match-col match-col-danger">
              <div className="match-col-title">IDENTIFIED GAPS ({matchResults.missing.length})</div>
              {matchResults.missing.map(s => <div key={s} className="match-item">! {s}</div>)}
              {matchResults.missing.length === 0 && <div className="match-item" style={{ color: 'var(--success)' }}>All skills met!</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/gap-analysis')}>
              Detailed Gap Analysis Breakdown →
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleFeedToTrajectory}>
              Simulate 3–12 Month Trajectory Curves →
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
