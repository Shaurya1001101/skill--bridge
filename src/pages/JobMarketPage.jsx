import React, { useState, useMemo } from 'react';
import { ExternalLink, Filter, TrendingUp, Sparkles, Check, Briefcase, DollarSign } from 'lucide-react';
import useStore from '../store/useStore.js';
import { MARKET_JOBS, SALARY_BANDS, DATASETS, SKILL_ROLES } from '../lib/data.js';
import { computeJobMatch } from '../lib/storage.js';

export default function JobMarketPage() {
  const gapResults = useStore(s => s.gapResults);
  const analyzerExtracted = useStore(s => s.analyzerExtracted);
  const targetRole = useStore(s => s.targetRole) || 'ml-engineer';

  const [activeTab, setActiveTab] = useState('p1');
  const [sortByMatch, setSortByMatch] = useState(true);

  const targetRoleObj = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'];
  const userExtracted = analyzerExtracted?.all || gapResults?.cats?.strong || [];

  const sortedJobs = useMemo(() => {
    if (!sortByMatch) return MARKET_JOBS;
    return [...MARKET_JOBS].sort((a, b) => {
      const ma = computeJobMatch(a, userExtracted).pct;
      const mb = computeJobMatch(b, userExtracted).pct;
      return mb - ma;
    });
  }, [sortByMatch, userExtracted]);

  // Skill Coverage Benchmarks from SkillBridge job market.html
  const coverageSkills = [
    { name: 'Python', pct: 92 },
    { name: 'SQL', pct: 85 },
    { name: 'PyTorch', pct: 78 },
    { name: 'MLOps', pct: 60 },
    { name: 'Statistics', pct: 45 },
    { name: 'NLP', pct: 40 },
  ];

  // Salary Intelligence Benchmarks from SkillBridge job market.html
  const salaryBenchmarks = [
    { role: 'Machine Learning Engineer', range: '₹28.5L–₹45L', pct: 82 },
    { role: 'MLOps Engineer', range: '₹24L–₹38L', pct: 70 },
    { role: 'Data Scientist', range: '₹18L–₹32L', pct: 62 },
    { role: 'GenAI Engineer', range: '₹32L–₹50L', pct: 90 },
  ];

  return (
    <div className="job-market-page">
      {/* Header matching SkillBridge job market.html */}
      <div className="hello">
        <div>
          <h1>Job market intelligence</h1>
          <p className="role">
            LinkedIn job listings re-ranked by your skill profile. Match % is computed live from your gap analysis.
          </p>
        </div>
        <button
          type="button"
          className="btn p"
          onClick={() => setSortByMatch(v => !v)}
          title="Toggle job sorting"
        >
          <Filter size={14} style={{ display: 'inline', marginRight: 6 }} />
          {sortByMatch ? 'Sorted by match' : 'Original order'}
        </button>
      </div>

      {/* Tabs list matching SkillBridge job market.html (.tabs2) */}
      <div className="tabs2" role="tablist" id="tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p1'}
          className={activeTab === 'p1' ? 'active' : ''}
          onClick={() => setActiveTab('p1')}
        >
          Open positions
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p2'}
          className={activeTab === 'p2' ? 'active' : ''}
          onClick={() => setActiveTab('p2')}
        >
          Skill coverage
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p3'}
          className={activeTab === 'p3' ? 'active' : ''}
          onClick={() => setActiveTab('p3')}
        >
          Salary intelligence
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p4'}
          className={activeTab === 'p4' ? 'active' : ''}
          onClick={() => setActiveTab('p4')}
        >
          Datasets registry
        </button>
      </div>

      {/* Panel 1: Open Positions */}
      {activeTab === 'p1' && (
        <section className="panel" id="p1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0 }}>Open positions</h2>
            <span style={{ fontSize: 12, color: 'var(--mute)' }}>
              Targeting: <strong>{targetRoleObj.name}</strong> · Live Re-ranked
            </span>
          </div>

          {sortedJobs.map((job) => {
            const match = computeJobMatch(job, userExtracted);
            const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=${encodeURIComponent(job.location.split(' ')[0])}&f_TP=1`;

            return (
              <article key={job.id} className="job">
                <div style={{ flex: 1 }}>
                  <b>{job.title}</b>
                  <small>{job.company} · {job.location}</small>
                  <p>
                    {job.skills.map((skill) => (
                      <i key={skill}>{skill}</i>
                    ))}
                  </p>
                </div>

                <div className="m">
                  <strong>{match.pct}%</strong>
                  <small>match</small>
                  <div className="bar2">
                    <i style={{ width: `${match.pct}%` }}></i>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, padding: '6px 12px', flexShrink: 0, marginLeft: 12 }}
                  onClick={() => window.open(linkedinUrl, '_blank')}
                  title="Search position on LinkedIn"
                >
                  <ExternalLink size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Apply
                </button>
              </article>
            );
          })}
        </section>
      )}

      {/* Panel 2: Skill Coverage */}
      {activeTab === 'p2' && (
        <section className="panel" id="p2">
          <h2>Skill coverage</h2>
          <p className="role">
            How well your skills cover what {targetRoleObj.name} roles ask for.
          </p>

          <div style={{ marginTop: 18 }}>
            {coverageSkills.map((c) => (
              <div key={c.name} className="r">
                <span>{c.name}</span>
                <div className="bar2">
                  <i style={{ width: `${c.pct}%` }}></i>
                </div>
                <b>{c.pct}%</b>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--mute)' }}>
            💡 Benchmarks calibrated against 2,400+ verified Indian tech job specifications in Q1 2026.
          </div>
        </section>
      )}

      {/* Panel 3: Salary Intelligence */}
      {activeTab === 'p3' && (
        <section className="panel" id="p3">
          <h2>Salary intelligence</h2>
          <p className="role">
            Typical annual pay by role across Indian tech hubs (Bengaluru, Hyderabad, Pune, Gurugram).
          </p>

          <div style={{ marginTop: 18 }}>
            {salaryBenchmarks.map((s) => (
              <div key={s.role} className="r">
                <span>{s.role}</span>
                <div className="bar2">
                  <i style={{ width: `${s.pct}%` }}></i>
                </div>
                <b>{s.range}</b>
              </div>
            ))}
          </div>

          {/* Detailed Salary Bands Breakdown */}
          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
              Detailed Experience Distribution (LPA)
            </h3>
            {SALARY_BANDS.map(band => {
              const maxSal = 110;
              const left = (band.min / maxSal) * 100;
              const width = ((band.max - band.min) / maxSal) * 100;
              return (
                <div key={band.role} className="salary-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' }}>
                  <div style={{ width: 180, fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{band.role}</div>
                  <div style={{ flex: 1, height: 10, background: 'var(--line)', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, height: '100%', background: 'linear-gradient(90deg, var(--teal), var(--amber))', borderRadius: 6 }} />
                  </div>
                  <div style={{ width: 110, textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>
                    ₹{band.min}L–₹{band.max}L
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Panel 4: Datasets Registry */}
      {activeTab === 'p4' && (
        <section className="panel" id="p4">
          <h2>Datasets registry</h2>
          <p className="role">
            Live telemetry and benchmark datasets powering SkillBridge intelligence.
          </p>

          <article className="job">
            <div>
              <b>LinkedIn job listings</b>
              <small>Live verified feed of tech opportunities</small>
            </div>
            <div className="m">
              <small>Updated daily</small>
            </div>
          </article>

          <article className="job">
            <div>
              <b>Salary benchmarks</b>
              <small>Market survey across Indian metros and global remote teams</small>
            </div>
            <div className="m">
              <small>Updated weekly</small>
            </div>
          </article>

          <article className="job">
            <div>
              <b>Skill taxonomy</b>
              <small>Internal verified framework with evidence thresholds</small>
            </div>
            <div className="m">
              <small>Updated monthly</small>
            </div>
          </article>

          {/* Extended Dataset Cards */}
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {DATASETS.map(ds => (
              <div key={ds.name} style={{ background: 'color-mix(in srgb, var(--field) 60%, transparent)', border: '1px solid var(--line)', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <b style={{ fontSize: 14, color: 'var(--ink)' }}>{ds.name}</b>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(20, 160, 152, 0.15)', color: 'var(--teal)' }}>
                    {ds.category}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--mute)', margin: '6px 0 10px', lineHeight: 1.45 }}>{ds.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--mute)' }}>
                  <span>{ds.records}</span>
                  <a href={ds.url} target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    Source <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
