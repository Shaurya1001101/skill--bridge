import { useState, useMemo } from 'react';
import { ExternalLink, MapPin, DollarSign, Briefcase, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useStore from '../store/useStore.js';
import { MARKET_JOBS, SALARY_BANDS, DEPT_READINESS, COVERAGE_MATRIX, TREND_DATA, DATASETS } from '../lib/data.js';
import { computeJobMatch } from '../lib/storage.js';

function JobCard({ job, userExtracted }) {
  const match = computeJobMatch(job, userExtracted || []);
  const matchColor = match.pct >= 80 ? 'var(--success)' : match.pct >= 60 ? 'var(--warning)' : 'var(--danger)';

  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=${encodeURIComponent(job.location.split(' ')[0])}&f_TP=1`;

  return (
    <div className="job-card">
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div className="job-logo" style={{ background: job.logoBg }}>{job.logo}</div>
        <div style={{ flex: 1 }}>
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: matchColor, fontFamily: 'Outfit' }}>{match.pct}%</div>
          <div style={{ fontSize: 9, color: 'var(--text-subtle)', fontWeight: 600 }}>Match</div>
        </div>
      </div>

      <div className="job-meta">
        <span className="job-meta-item"><MapPin size={10} /> {job.location}</span>
        <span className="job-meta-item"><DollarSign size={10} /> {job.salary}</span>
        <span className="job-meta-item"><Briefcase size={10} /> {job.exp}</span>
        <span className="badge badge-info" style={{ fontSize: 9 }}>{job.source}</span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{job.desc}</p>

      <div className="job-skills">
        {job.skills.map(s => {
          const isMatched = match.matched.includes(s);
          return (
            <span key={s} className="job-skill-tag" style={isMatched ? { background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)', color: 'var(--success)' } : {}}>
              {s}{isMatched ? ' ✓' : ''}
            </span>
          );
        })}
      </div>

      {match.missing.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 6 }}>
          Missing: <span style={{ color: 'var(--warning)' }}>{match.missing.join(', ')}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => window.open(linkedinUrl, '_blank')}
          style={{ flex: 1 }}
        >
          <ExternalLink size={12} /> Search on LinkedIn
        </button>
      </div>
    </div>
  );
}

function SalaryChart() {
  const maxSal = 110;
  return (
    <div>
      {SALARY_BANDS.map(band => {
        const left = (band.min / maxSal) * 100;
        const width = ((band.max - band.min) / maxSal) * 100;
        return (
          <div key={band.role} className="salary-row">
            <div className="salary-role">{band.role}</div>
            <div className="salary-band">
              <div style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, height: '100%', background: band.color + '40', borderRadius: 3, border: `1px solid ${band.color}60` }} />
              <div style={{ position: 'absolute', left: `${left}%`, width: 2, height: '100%', background: band.color }} />
              <div style={{ position: 'absolute', left: `${left + width}%`, width: 2, height: '100%', background: band.color }} />
            </div>
            <div className="salary-label" style={{ color: band.color, fontSize: 11, fontWeight: 700 }}>₹{band.min}L–{band.max}L</div>
          </div>
        );
      })}
    </div>
  );
}

function ReadinessChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={DEPT_READINESS} layout="vertical">
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--text-subtle)' }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} width={110} />
        <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }} />
        <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
          {DEPT_READINESS.map(d => <Cell key={d.name} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function JobMarketPage() {
  const gapResults = useStore(s => s.gapResults);
  const analyzerExtracted = useStore(s => s.analyzerExtracted);

  const [tab, setTab] = useState('jobs');
  const [sortByMatch, setSortByMatch] = useState(true);

  const userExtracted = analyzerExtracted?.all || gapResults?.cats?.strong || [];

  const sortedJobs = useMemo(() => {
    if (!sortByMatch) return MARKET_JOBS;
    return [...MARKET_JOBS].sort((a, b) => {
      const ma = computeJobMatch(a, userExtracted).pct;
      const mb = computeJobMatch(b, userExtracted).pct;
      return mb - ma;
    });
  }, [sortByMatch, userExtracted]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Market Intelligence</h1>
          <p className="page-subtitle">LinkedIn job listings re-ranked by your skill profile. Match % computed live from your gap analysis.</p>
        </div>
        <div className="header-actions">
          <button className={`btn btn-sm ${sortByMatch ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortByMatch(v => !v)}>
            <Filter size={13} /> {sortByMatch ? 'Sorted by Match' : 'Original Order'}
          </button>
        </div>
      </div>

      <div className="tab-list">
        {[
          { key: 'jobs', label: 'Open Positions' },
          { key: 'coverage', label: 'Skill Coverage' },
          { key: 'salary', label: 'Salary Intelligence' },
          { key: 'readiness', label: 'Org Readiness' },
          { key: 'datasets', label: 'Datasets Registry' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'jobs' && (
        <>
          {userExtracted.length > 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-brand">Match Active</span>
              Rankings based on your skill profile. Run Gap Analysis or Skill Analyzer to update.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 14 }}>
            {sortedJobs.map(job => <JobCard key={job.id} job={job} userExtracted={userExtracted} />)}
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-subtle)', fontStyle: 'italic' }}>
            Note: Live job data requires a LinkedIn Jobs API license. "Search on LinkedIn" opens a LinkedIn search for the role. Match % is computed from your skill profile.
          </div>
        </>
      )}

      {tab === 'coverage' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Skill Coverage Matrix</h2>
            <span className="badge badge-brand">vs ML Engineer benchmark</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COVERAGE_MATRIX.map(row => {
              const col = row.status === 'ok' ? 'var(--success)' : row.status === 'critical' ? 'var(--danger)' : row.status === 'high' ? 'var(--warning)' : 'var(--info)';
              return (
                <div key={row.skill} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{row.skill}</div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Required: {row.required}%</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{row.current}%</span>
                      <span className="badge" style={{ background: col + '20', color: col, fontSize: 9 }}>
                        {row.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${row.current}%`, background: col }} />
                    <div style={{ position: 'absolute', left: `${row.required}%`, top: '-3px', width: 2, height: 12, background: 'var(--text-muted)', borderRadius: 1, transform: 'translateX(-50%)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'salary' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Salary Intelligence — Indian Tech Market (LPA)</h2>
            <span className="badge badge-info">Illustrative</span>
          </div>
          <SalaryChart />
          <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontStyle: 'italic', marginTop: 14 }}>
            Data sourced from LinkedIn Economic Graph, Glassdoor, AmbitionBox, and Levels.fyi as of 2024. LPA = Lakhs Per Annum.
          </div>
        </div>
      )}

      {tab === 'readiness' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Department AI Readiness</h2>
            <span className="badge badge-info">Org-wide View</span>
          </div>
          <ReadinessChart />
        </div>
      )}

      {tab === 'datasets' && (
        <div>
          <div className="card-header" style={{ marginBottom: 12 }}>
            <h2 className="card-title">Datasets & Data Registry</h2>
            <span className="badge badge-brand">{DATASETS.length} Sources</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {DATASETS.map(ds => (
              <div key={ds.name} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{ds.name}</div>
                  <span className="badge badge-brand" style={{ fontSize: 9 }}>{ds.category}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>{ds.desc}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-subtle)', marginBottom: 10 }}>
                  <span>{ds.records}</span>
                  <span>{ds.dateRange}</span>
                  <span style={{ color: 'var(--success)' }}>{ds.license}</span>
                </div>
                <a href={ds.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={11} /> Visit Source
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
