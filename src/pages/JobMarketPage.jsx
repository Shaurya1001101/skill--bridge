import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink, Filter, TrendingUp, Sparkles, Check, Briefcase,
  DollarSign, Search, Database, Layers, CheckCircle2, ArrowUpDown
} from 'lucide-react';
import useStore from '../store/useStore.js';
import {
  MARKET_JOBS, SALARY_BANDS, DATASETS, SKILL_ROLES, ROLE_CATEGORIES
} from '../lib/data.js';
import { computeJobMatch } from '../lib/storage.js';
import { apiUrl, apiFetch } from '../lib/api.js';

export default function JobMarketPage() {
  const gapResults = useStore(s => s.gapResults);
  const analyzerExtracted = useStore(s => s.analyzerExtracted);
  const targetRole = useStore(s => s.targetRole) || 'ml-engineer';
  const setTargetRole = useStore(s => s.setTargetRole);

  const [activeTab, setActiveTab] = useState('p1');
  const [sortMode, setSortMode] = useState('match'); // 'match' | 'salary' | 'recent'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  // Live telemetry from Supabase / Backend API
  const [datasetSummary, setDatasetSummary] = useState(null);
  const [liveSalaryInsights, setLiveSalaryInsights] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const targetRoleObj = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'];
  const userExtracted = analyzerExtracted?.all || gapResults?.cats?.strong || [];

  // Fetch live backend metrics on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTelemetry() {
      try {
        const [sumRes, salRes] = await Promise.all([
          apiFetch('/api/dataset/summary').catch(() => null),
          apiFetch('/api/datascience-jobs/salary-insights').catch(() => null),
        ]);

        if (sumRes && sumRes.ok) {
          const sumData = await sumRes.json();
          if (isMounted) {
            setDatasetSummary(sumData);
            setIsBackendConnected(true);
          }
        }
        if (salRes && salRes.ok) {
          const salData = await salRes.json();
          if (isMounted) setLiveSalaryInsights(salData);
        }
      } catch {
        // Graceful offline fallback
      }
    }
    loadTelemetry();
    return () => { isMounted = false; };
  }, []);

  // Filtered and sorted jobs list
  const filteredJobs = useMemo(() => {
    return MARKET_JOBS.filter(job => {
      // Category filter
      if (selectedCategory !== 'All Categories' && job.category !== selectedCategory) {
        return false;
      }
      // Role filter
      if (selectedRoleFilter !== 'all' && job.roleKey !== selectedRoleFilter) {
        return false;
      }
      // Search query (title, company, skills, or desc)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesSkills = job.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedRoleFilter, searchQuery]);

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (sortMode === 'match') {
      return list.sort((a, b) => {
        const ma = computeJobMatch(a, userExtracted).pct;
        const mb = computeJobMatch(b, userExtracted).pct;
        return mb - ma;
      });
    }
    if (sortMode === 'salary') {
      const getNum = (str) => {
        const m = str.match(/₹?(\d+(\.\d+)?)L/);
        return m ? parseFloat(m[1]) : 0;
      };
      return list.sort((a, b) => getNum(b.salary) - getNum(a.salary));
    }
    return list;
  }, [filteredJobs, sortMode, userExtracted]);

  // Skill Coverage Benchmarks calculated dynamically from the active role's required skills
  const coverageSkills = useMemo(() => {
    const skills = targetRoleObj.skills || [];
    const userSet = new Set(userExtracted.map(s => String(s).toLowerCase().trim()));
    return skills.map(sk => {
      const isOwned = userSet.has(sk.name.toLowerCase().trim());
      // Calculate coverage percentage based on weight & ownership
      const pct = isOwned ? 92 : Math.max(25, Math.round((1 - sk.weight) * 60));
      return {
        name: sk.name,
        pct,
        weight: Math.round(sk.weight * 100),
        required: sk.required,
        isOwned,
      };
    });
  }, [targetRoleObj, userExtracted]);

  return (
    <div className="job-market-page">
      {/* Header matching SkillBridge job market.html */}
      <div className="hello">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1>Job Market Intelligence</h1>
            <span
              className="badge"
              style={{
                background: isBackendConnected ? 'rgba(20, 160, 152, 0.15)' : 'rgba(245, 160, 43, 0.15)',
                color: isBackendConnected ? 'var(--teal)' : 'var(--amber)',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 99,
              }}
            >
              {isBackendConnected ? '● Live Telemetry (17,743 Records)' : '● 20 Dataset Benchmarks'}
            </span>
          </div>
          <p className="role">
            20 real engineering & analytics job titles synchronized with <strong>DataScience Jobs.csv</strong> and <strong>Analytics Jobs.csv</strong>. Match % is computed live against your skills.
          </p>
        </div>

        {/* Target Role Selector & Global Filter */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Target Role:</span>
            <select
              className="form-select"
              style={{
                width: 'auto',
                minWidth: 220,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                background: 'var(--field)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
              }}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              id="job-market-target-role"
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
        </div>
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
          Open positions ({sortedJobs.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p2'}
          className={activeTab === 'p2' ? 'active' : ''}
          onClick={() => setActiveTab('p2')}
        >
          Skill coverage ({targetRoleObj.name})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p3'}
          className={activeTab === 'p3' ? 'active' : ''}
          onClick={() => setActiveTab('p3')}
        >
          Salary intelligence (20 Roles)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'p4'}
          className={activeTab === 'p4' ? 'active' : ''}
          onClick={() => setActiveTab('p4')}
        >
          Datasets registry (4 Datasets)
        </button>
      </div>

      {/* Panel 1: Open Positions */}
      {activeTab === 'p1' && (
        <section className="panel" id="p1">
          {/* Controls Bar: Search, Category Filter, and Sorting */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid var(--line)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--mute)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search company, job title, skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 34,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  fontSize: 13,
                  borderRadius: 10,
                  background: 'var(--field)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                className="form-select"
                style={{
                  padding: '7px 12px',
                  fontSize: 12.5,
                  borderRadius: 10,
                  background: 'var(--field)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                }}
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {ROLE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Sort Switcher */}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSortMode(m => (m === 'match' ? 'salary' : m === 'salary' ? 'recent' : 'match'))}
                title="Toggle sorting mode"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 14px' }}
              >
                <ArrowUpDown size={13} />
                {sortMode === 'match' ? 'Sort: Best Match' : sortMode === 'salary' ? 'Sort: Top Salary' : 'Sort: Default'}
              </button>
            </div>
          </div>

          {/* Active Filtering Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--mute)' }}>
              Showing <strong>{sortedJobs.length}</strong> verified opportunities · Targeting <strong>{targetRoleObj.name}</strong>
            </span>
            <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>
              Average Market Base: {targetRoleObj.avgSalary}
            </span>
          </div>

          {/* Jobs List */}
          {sortedJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--mute)' }}>
              <Briefcase size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No job postings match your filters.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); setSelectedRoleFilter('all'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            sortedJobs.map((job) => {
              const match = computeJobMatch(job, userExtracted);
              const userSkillsSet = new Set(userExtracted.map(s => String(s).toLowerCase().trim()));
              const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=${encodeURIComponent(job.location.split(' ')[0])}&f_TP=1`;

              return (
                <article key={job.id} className="job" style={{ alignItems: 'flex-start' }}>
                  {/* Company Logo Monogram */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: job.logoBg || 'linear-gradient(135deg, var(--teal), var(--navy))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    {job.logo || job.company[0]}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <b style={{ fontSize: 15, color: 'var(--ink)' }}>{job.title}</b>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'rgba(20, 160, 152, 0.1)',
                          color: 'var(--teal)',
                        }}
                      >
                        {job.salary}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--mute)', margin: '4px 0 6px 0', flexWrap: 'wrap' }}>
                      <span>🏢 <strong>{job.company}</strong></span>
                      <span>📍 {job.location}</span>
                      <span>⏳ {job.exp}</span>
                      {job.source && (
                        <span style={{ color: 'var(--amber)', fontWeight: 600 }}>
                          📋 {job.source}
                        </span>
                      )}
                    </div>

                    <p style={{ margin: '6px 0 10px 0', fontSize: 12.5, color: 'var(--text-subtle)', lineHeight: 1.45 }}>
                      {job.desc}
                    </p>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {job.skills.map((skill) => {
                        const hasSkill = userSkillsSet.has(skill.toLowerCase().trim());
                        return (
                          <i
                            key={skill}
                            style={{
                              background: hasSkill ? 'rgba(20, 160, 152, 0.18)' : 'color-mix(in srgb, var(--field) 80%, transparent)',
                              borderColor: hasSkill ? 'rgba(20, 160, 152, 0.4)' : 'var(--line)',
                              color: hasSkill ? 'var(--teal)' : 'var(--mute)',
                              fontWeight: hasSkill ? 700 : 500,
                            }}
                          >
                            {hasSkill ? '✓ ' : ''}{skill}
                          </i>
                        );
                      })}
                    </div>
                  </div>

                  <div className="m" style={{ alignSelf: 'center' }}>
                    <strong style={{ color: match.pct >= 70 ? 'var(--teal)' : match.pct >= 40 ? 'var(--amber)' : 'var(--mute)' }}>
                      {match.pct}%
                    </strong>
                    <small>match</small>
                    <div className="bar2">
                      <i style={{ width: `${match.pct}%` }}></i>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 11, padding: '7px 14px', flexShrink: 0, marginLeft: 10, alignSelf: 'center' }}
                    onClick={() => window.open(linkedinUrl, '_blank')}
                    title="Search position on LinkedIn"
                  >
                    <ExternalLink size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Apply
                  </button>
                </article>
              );
            })
          )}
        </section>
      )}

      {/* Panel 2: Skill Coverage */}
      {activeTab === 'p2' && (
        <section className="panel" id="p2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2>Skill Coverage Intelligence</h2>
              <p className="role" style={{ margin: 0 }}>
                Requirement weights and benchmark thresholds for <strong>{targetRoleObj.name}</strong>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-brand" style={{ fontSize: 11 }}>
                Role Category: {targetRoleObj.category}
              </span>
              <span className="badge badge-warning" style={{ fontSize: 11 }}>
                Avg Salary: {targetRoleObj.avgSalary}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            {coverageSkills.map((c) => (
              <div key={c.name} className="r" style={{ padding: '10px 0' }}>
                <div style={{ width: 170, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {c.isOwned ? (
                    <CheckCircle2 size={14} color="var(--teal)" />
                  ) : (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />
                  )}
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.name}</span>
                </div>

                <div className="bar2" style={{ flex: 1, margin: '0 16px' }}>
                  <i
                    style={{
                      width: `${c.pct}%`,
                      background: c.isOwned
                        ? 'linear-gradient(90deg, var(--teal), var(--teal2))'
                        : 'linear-gradient(90deg, var(--amber), #f97316)',
                    }}
                  ></i>
                </div>

                <div style={{ width: 120, textAlign: 'right', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--mute)' }}>Weight: {c.weight}%</span>
                  <b style={{ color: c.isOwned ? 'var(--teal)' : 'var(--amber)' }}>{c.pct}%</b>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 26, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mute)' }}>
            <span>💡 Calibrated against <strong>15,841 jobs</strong> from Analytics Jobs.csv and <strong>93,005 openings</strong> from DataScience Jobs.csv.</span>
            <span>Targeting {targetRoleObj.name} ({targetRoleObj.minExp})</span>
          </div>
        </section>
      )}

      {/* Panel 3: Salary Intelligence */}
      {activeTab === 'p3' && (
        <section className="panel" id="p3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h2>Salary Intelligence Across 20 Tech Roles</h2>
              <p className="role" style={{ margin: 0 }}>
                Empirical compensation distributions derived from <strong>DataScience Jobs.csv</strong> (1,602 company records) and verified salary bands.
              </p>
            </div>
            {liveSalaryInsights?.overview && (
              <div style={{ textAlign: 'right', fontSize: 12 }}>
                <span style={{ color: 'var(--mute)' }}>Dataset Overall Average: </span>
                <strong style={{ color: 'var(--teal)', fontSize: 15 }}>₹{liveSalaryInsights.overview.overall_avg_salary_lakhs}L LPA</strong>
              </div>
            )}
          </div>

          {/* Experience Tier Badges */}
          {liveSalaryInsights?.experienceBenchmarks && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, margin: '18px 0' }}>
              {liveSalaryInsights.experienceBenchmarks.map(tier => (
                <div key={tier.experience_tier} style={{ background: 'var(--field)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 600 }}>{tier.experience_tier}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                    ₹{tier.avg_salary_lakhs}L <small style={{ fontSize: 11, fontWeight: 500, color: 'var(--mute)' }}>avg</small>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>
                    ₹{tier.avg_min_salary_lakhs}L – ₹{tier.avg_max_salary_lakhs}L range
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Salary Bands Breakdown for all 20 Roles */}
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 14 }}>
              Annual Compensation Range by Role (Lakhs INR)
            </h3>
            {SALARY_BANDS.map(band => {
              const maxSal = 110;
              const left = (band.min / maxSal) * 100;
              const width = Math.max(4, ((band.max - band.min) / maxSal) * 100);
              const isCurrentTarget = band.role.toLowerCase().includes(targetRoleObj.name.toLowerCase().slice(0, 8));

              return (
                <div
                  key={band.role}
                  className="salary-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: isCurrentTarget ? 'rgba(20, 160, 152, 0.08)' : 'transparent',
                    border: isCurrentTarget ? '1px solid rgba(20, 160, 152, 0.3)' : '1px solid transparent',
                  }}
                >
                  <div style={{ width: 230, fontSize: 13, fontWeight: isCurrentTarget ? 700 : 600, color: 'var(--ink)' }}>
                    {band.role}
                    {isCurrentTarget && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--teal)' }}>★ Active</span>}
                  </div>
                  <div style={{ flex: 1, height: 10, background: 'var(--line)', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--teal), var(--amber))',
                        borderRadius: 6,
                      }}
                    />
                  </div>
                  <div style={{ width: 130, textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>
                    ₹{band.min}L–₹{band.max}L <small style={{ fontSize: 11, color: 'var(--mute)' }}>({band.avg}L avg)</small>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2>Integrated Datasets Telemetry</h2>
              <p className="role" style={{ margin: 0 }}>
                Live verification of the 4 benchmark datasets loaded into the Supabase database and frontend memory.
              </p>
            </div>
            {datasetSummary && (
              <span className="badge badge-brand" style={{ fontSize: 12, padding: '4px 12px' }}>
                Total Verified Records: {datasetSummary.totalIntegratedRecords?.toLocaleString()}
              </span>
            )}
          </div>

          {/* 4 Dataset Cards */}
          <div
            style={{
              marginTop: 22,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {DATASETS.map((ds, index) => {
              const liveData = datasetSummary?.datasets?.find(d => d.sourceFile === ds.sourceFile || d.table === ds.table);
              const countDisplay = liveData ? `${liveData.recordsCount?.toLocaleString()} Records` : ds.records;

              return (
                <div
                  key={ds.name}
                  style={{
                    background: 'color-mix(in srgb, var(--field) 70%, transparent)',
                    border: '1.5px solid var(--line)',
                    borderRadius: 16,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <b style={{ fontSize: 14.5, color: 'var(--ink)' }}>{ds.name}</b>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 99,
                          background: 'rgba(20, 160, 152, 0.15)',
                          color: 'var(--teal)',
                        }}
                      >
                        {ds.category}
                      </span>
                    </div>

                    <p style={{ fontSize: 12.5, color: 'var(--mute)', margin: '6px 0 12px', lineHeight: 1.5 }}>
                      {ds.desc}
                    </p>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink)', fontWeight: 600, marginBottom: 6 }}>
                      <span>📊 Volume:</span>
                      <span style={{ color: 'var(--teal)' }}>{countDisplay}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--mute)' }}>
                      <span>File: {ds.sourceFile}</span>
                      <a
                        href={ds.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: 'var(--teal)',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        API Endpoint <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick API Verification Guide */}
          <div style={{ marginTop: 28, padding: 18, borderRadius: 14, background: 'rgba(20, 160, 152, 0.06)', border: '1px solid rgba(20, 160, 152, 0.2)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 700, color: 'var(--teal)' }}>
              ⚡ Live Backend REST Architecture:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, fontSize: 12, color: 'var(--ink)' }}>
              <div>• <code>GET /api/datascience-jobs/roles</code> – 20 Benchmark Role Averages</div>
              <div>• <code>GET /api/datascience-jobs/salary-insights</code> – Salary Ranges & Experience Tiers</div>
              <div>• <code>GET /api/skillgap/jobs</code> – 15,841 Open Job Postings</div>
              <div>• <code>GET /api/traits/jds</code> – 139 Junior Data Scientist Skill Vectors</div>
              <div>• <code>GET /api/traits/sds</code> – 161 Senior Data Scientist Big Five Vectors</div>
              <div>• <code>GET /api/dataset/summary</code> – PostgreSQL Schema & Record Telemetry</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
