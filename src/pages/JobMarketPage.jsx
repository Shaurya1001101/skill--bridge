import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink, Filter, TrendingUp, Sparkles, Check, Briefcase,
  DollarSign, Search, Database, Layers, CheckCircle2, ArrowUpDown,
  BookOpen, Award, Compass, BarChart3, MapPin, Building, ChevronRight, XCircle
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

import useStore from '../store/useStore.js';
import { SKILL_ROLES, ROLE_CATEGORIES } from '../lib/data.js';
import { apiUrl, apiFetch } from '../lib/api.js';
import {
  recommendJobs,
  searchJobs,
  getMarketInsights,
  getCourseRecommendations,
  extractSkills
} from '../lib/aiEngine.js';

export default function JobMarketPage() {
  const gapResults = useStore(s => s.gapResults);
  const userSkills = useStore(s => s.userSkills);
  const targetRole = useStore(s => s.targetRole) || 'ml-engineer';
  const setTargetRole = useStore(s => s.setTargetRole);

  // Active view: 'jobs' | 'analysis' | 'courses'
  const [activeTab, setActiveTab] = useState('jobs');
  const [sortMode, setSortMode] = useState('match'); // 'match' | 'recent'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedExp, setSelectedExp] = useState('All Experience');

  // Live telemetry from Supabase / Backend API
  const [datasetSummary, setDatasetSummary] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const targetRoleObj = SKILL_ROLES[targetRole] || SKILL_ROLES['ml-engineer'];
  const userSkillList = userSkills?.all || gapResults?.cats?.strong || [];

  // Fetch live backend metrics on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTelemetry() {
      try {
        const sumRes = await apiFetch('/api/dataset/summary').catch(() => null);
        if (sumRes && sumRes.ok) {
          const sumData = await sumRes.json();
          if (isMounted) {
            setDatasetSummary(sumData);
            setIsBackendConnected(true);
          }
        }
      } catch {
        // Graceful fallback
      }
    }
    loadTelemetry();
    return () => { isMounted = false; };
  }, []);

  // Compute live Dataset Graph Analysis metrics
  const marketInsights = useMemo(() => {
    return getMarketInsights(targetRoleObj.name);
  }, [targetRoleObj]);

  // AI Job Recommendations from dataset
  const recommendedJobsList = useMemo(() => {
    if (searchQuery.trim()) {
      return searchJobs(searchQuery, {
        location: selectedCity !== 'All Cities' ? selectedCity : '',
        experience: selectedExp !== 'All Experience' ? selectedExp : '',
        limit: 80,
      }).map(j => {
        // Compute match percentage
        const have = new Set((userSkillList || []).map(s => s.toLowerCase()));
        const jSkills = j.skills || [];
        const hit = jSkills.filter(s => have.has(s.toLowerCase()));
        const miss = jSkills.filter(s => !have.has(s.toLowerCase()));
        const pct = jSkills.length > 0 ? Math.round((hit.length / jSkills.length) * 100) : 0;
        return {
          ...j,
          match_percent: userSkillList.length === 0 ? 0 : pct,
          you_have: hit,
          you_miss: miss,
        };
      });
    }

    return recommendJobs(userSkillList, {
      location: selectedCity !== 'All Cities' ? selectedCity : '',
      limit: 80,
    }).filter(j => {
      if (selectedExp !== 'All Experience') {
        if (!j.experience || !j.experience.toLowerCase().includes(selectedExp.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [userSkillList, selectedCity, selectedExp, searchQuery]);

  // Sorted job results
  const sortedJobs = useMemo(() => {
    const list = [...recommendedJobsList];
    if (sortMode === 'match') {
      return list.sort((a, b) => (b.match_percent || 0) - (a.match_percent || 0));
    }
    return list;
  }, [recommendedJobsList, sortMode]);

  // Collect all missing skills across top recommended jobs
  const topMissingSkills = useMemo(() => {
    const counts = {};
    sortedJobs.slice(0, 20).forEach(j => {
      (j.you_miss || []).forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    // Add target role gaps if available
    (gapResults?.gaps || []).forEach(s => {
      counts[s] = (counts[s] || 0) + 3;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s);

    return sorted.length > 0 ? sorted.slice(0, 8) : ['PyTorch', 'Docker', 'Kubernetes', 'AWS', 'MLOps'];
  }, [sortedJobs, gapResults]);

  // Curated free courses recommended by AI for missing skills
  const courseRecommendations = useMemo(() => {
    return getCourseRecommendations(topMissingSkills);
  }, [topMissingSkills]);

  return (
    <div className="job-market-page">
      {/* Header Bar */}
      <div className="hello">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1>AI Job Market Intelligence</h1>
            <span
              className="badge"
              style={{
                background: 'rgba(232, 130, 58, 0.15)',
                color: 'var(--brand-light)',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 99,
              }}
            >
              ● 623 Real Indian Job Postings (LinkedIn Dataset)
            </span>
          </div>
          <p className="role">
            Live AI recommendation engine grounded in real postings across <strong>Bengaluru, Hyderabad, Pune, Mumbai & Delhi NCR</strong>. Match score is computed mathematically against your profile skills.
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
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
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

      {/* Main View Switcher Tabs */}
      <div style={{ display: 'flex', gap: 8, margin: '20px 0 16px 0', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn-chip ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            padding: '7px 16px',
            borderRadius: 8,
            fontWeight: 700,
            background: activeTab === 'jobs' ? 'rgba(232, 130, 58, 0.2)' : 'var(--bg-subtle)',
            color: activeTab === 'jobs' ? 'var(--brand-light)' : 'var(--text-muted)',
            border: activeTab === 'jobs' ? '1px solid var(--brand)' : '1px solid var(--border-subtle)',
          }}
        >
          <Briefcase size={15} />
          <span>AI Job Matches ({sortedJobs.length})</span>
        </button>

        <button
          type="button"
          className={`btn-chip ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            padding: '7px 16px',
            borderRadius: 8,
            fontWeight: 700,
            background: activeTab === 'analysis' ? 'rgba(232, 130, 58, 0.2)' : 'var(--bg-subtle)',
            color: activeTab === 'analysis' ? 'var(--brand-light)' : 'var(--text-muted)',
            border: activeTab === 'analysis' ? '1px solid var(--brand)' : '1px solid var(--border-subtle)',
          }}
        >
          <BarChart3 size={15} />
          <span>Dataset Graph Analysis</span>
        </button>

        <button
          type="button"
          className={`btn-chip ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            padding: '7px 16px',
            borderRadius: 8,
            fontWeight: 700,
            background: activeTab === 'courses' ? 'rgba(232, 130, 58, 0.2)' : 'var(--bg-subtle)',
            color: activeTab === 'courses' ? 'var(--brand-light)' : 'var(--text-muted)',
            border: activeTab === 'courses' ? '1px solid var(--brand)' : '1px solid var(--border-subtle)',
          }}
        >
          <BookOpen size={15} />
          <span>AI Course Recommendations ({courseRecommendations.length})</span>
        </button>
      </div>

      {/* ─── TAB 1: AI JOB RECOMMENDATIONS ────────────────────────────────────── */}
      {activeTab === 'jobs' && (
        <div className="card" style={{ padding: 20 }}>
          {/* Search & Filter Toolbar */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search job title, company, skills (e.g. Python, Amazon)..."
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
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text)',
                }}
              />
            </div>

            {/* City Filter */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{
                  padding: '7px 12px',
                  fontSize: 12.5,
                  borderRadius: 10,
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text)',
                }}
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
              >
                {['All Cities', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Noida', 'Gurugram', 'Delhi NCR', 'Chennai'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Experience Filter */}
              <select
                className="form-select"
                style={{
                  padding: '7px 12px',
                  fontSize: 12.5,
                  borderRadius: 10,
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text)',
                }}
                value={selectedExp}
                onChange={e => setSelectedExp(e.target.value)}
              >
                {['All Experience', 'Entry level', 'Associate', 'Mid-Senior level'].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              {/* Sort Switcher */}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSortMode(m => (m === 'match' ? 'recent' : 'match'))}
                title="Toggle sorting mode"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 14px' }}
              >
                <ArrowUpDown size={13} />
                {sortMode === 'match' ? 'Sort: Best AI Match %' : 'Sort: Default'}
              </button>
            </div>
          </div>

          {/* User skills status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={14} color="var(--brand-light)" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Your Profile Skills: {userSkillList.length > 0 ? <strong>{userSkillList.join(', ')}</strong> : <em style={{ color: 'var(--warning)' }}>No skills verified yet (showing 0% base fit). Run Skill Assessment to unlock high match % scores!</em>}
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
              Showing {sortedJobs.length} matching openings
            </span>
          </div>

          {/* Jobs List Grid */}
          {sortedJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Briefcase size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No job postings match your active filter.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => { setSearchQuery(''); setSelectedCity('All Cities'); setSelectedExp('All Experience'); }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sortedJobs.map((job) => (
                <div
                  key={job.job_id || `${job.title}-${job.company}`}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                          {job.title}
                        </h3>
                        {job.match_percent > 0 && (
                          <span
                            style={{
                              background: job.match_percent >= 60 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(232, 130, 58, 0.15)',
                              color: job.match_percent >= 60 ? '#10b981' : 'var(--brand-light)',
                              fontWeight: 700,
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 6,
                            }}
                          >
                            {job.match_percent}% AI Match
                          </span>
                        )}
                        {job.experience && (
                          <span style={{ fontSize: 11, background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: 6, color: 'var(--text-muted)' }}>
                            {job.experience}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: 'var(--text)' }}>
                          <Building size={13} /> {job.company}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} /> {job.city || job.location}
                        </span>
                        {job.min_years > 0 && (
                          <span>Min {job.min_years} Years Exp</span>
                        )}
                      </div>
                    </div>

                    <a
                      href={job.apply_link || `https://www.linkedin.com/jobs/view/${job.job_id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        textDecoration: 'none',
                        fontSize: 12,
                        padding: '6px 14px',
                        fontWeight: 700,
                      }}
                    >
                      <span>Apply on LinkedIn</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Skills Breakdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)' }}>Skills:</span>
                    {(job.skills || []).map(sk => {
                      const isOwned = (job.you_have || []).includes(sk);
                      return (
                        <span
                          key={sk}
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: isOwned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: isOwned ? '#10b981' : 'var(--text-muted)',
                            border: isOwned ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                            fontWeight: isOwned ? 600 : 400,
                          }}
                        >
                          {isOwned ? `✓ ${sk}` : sk}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: DATASET GRAPH ANALYSIS ────────────────────────────────────── */}
      {activeTab === 'analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Key Metric Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Verified Postings
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginTop: 4 }}>
                {marketInsights.jobs_considered}
              </div>
              <div style={{ fontSize: 11, color: 'var(--brand-light)', marginTop: 2 }}>
                Real Indian LinkedIn Tech Jobs Dataset
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>
                Fresher & Associate Roles
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981', marginTop: 4 }}>
                {marketInsights.entry_friendly_jobs}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                ≤ 1 year experience requirement
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>
                Leading Hiring Hub
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', marginTop: 4 }}>
                {marketInsights.top_cities[0]?.city || 'Bengaluru'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {marketInsights.top_cities[0]?.count || 140} active engineering openings
              </div>
            </div>
          </div>

          {/* Graph 1: Top Demanded Skills */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                Top In-Demand Skills Distribution (% of Postings Demanding Skill)
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Frequency of explicit skill requirements extracted via NLP from 620+ Indian tech job postings.
              </p>
            </div>

            <div style={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketInsights.top_skills} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="skill" stroke="var(--text-subtle)" fontSize={11} angle={-25} textAnchor="end" />
                  <YAxis stroke="var(--text-subtle)" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 }}
                    formatter={(val) => [`${val}% of jobs`, 'Demand Frequency']}
                  />
                  <Bar dataKey="demand_percent" fill="var(--brand)" radius={[4, 4, 0, 0]}>
                    {marketInsights.top_skills.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 3 ? 'var(--brand-light)' : 'var(--brand)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graph 2: City Tech Hub Cluster */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                Job Openings Distribution by Major Indian Tech Hubs
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Hiring volume concentration across metropolitan IT clusters.
              </p>
            </div>

            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketInsights.top_cities} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="var(--text-subtle)" fontSize={11} />
                  <YAxis type="category" dataKey="city" stroke="var(--text-subtle)" fontSize={12} width={90} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 }}
                    formatter={(val) => [`${val} postings`, 'Open Jobs']}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: AI COURSE & RESOURCE RECOMMENDATIONS ──────────────────────── */}
      {activeTab === 'courses' && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 18, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
              Curated Free Certified Courses & Practical Sandboxes
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Personalized based on skills demanded in your top matching job postings and target role ({targetRoleObj.name}). All resources are 100% free with verified industry value.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {courseRecommendations.map(c => (
              <div
                key={c.skill}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-light)' }}>
                      {c.skill}
                    </span>
                    <span style={{ fontSize: 10, background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-subtle)' }}>
                      {c.duration || '2-4 Weeks'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text)', lineHeight: 1.4 }}>
                    {c.title}
                  </h4>

                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    Provider: <strong>{c.provider}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                    Level: {c.level || 'All Levels'}
                  </span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      padding: '4px 10px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Start Free</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
