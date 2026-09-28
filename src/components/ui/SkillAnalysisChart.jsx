import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { BarChart2, Radio, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * Custom Tooltip for the comparative skill chart.
 * Renders exact current level, required level, percentage, and gap status.
 */
function CustomSkillTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const isMet = data.currentLevel >= data.requiredLevel;
  const statusColor = isMet ? 'var(--success, #10B981)' : data.currentLevel > 0 ? 'var(--warning, #F59E0B)' : 'var(--danger, #EF4444)';

  return (
    <div
      style={{
        background: 'var(--bg-surface, #1e293b)',
        border: '1px solid var(--border, rgba(255,255,255,0.12))',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
        minWidth: 200,
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
        zIndex: 50,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text, #f8fafc)', marginBottom: 6 }}>
        {data.name}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
        <span style={{ color: 'var(--brand-light, #38bdf8)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand-light, #38bdf8)' }} />
          Current Proficiency:
        </span>
        <strong style={{ color: 'var(--text, #f8fafc)' }}>
          {data.currentLevel}/4 ({data.currentPct}%)
        </strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
        <span style={{ color: 'var(--brand-purple, #a855f7)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand-purple, #a855f7)' }} />
          Role Requirement:
        </span>
        <strong style={{ color: 'var(--text, #f8fafc)' }}>
          {data.requiredLevel}/4 ({data.requiredPct}%)
        </strong>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border, rgba(255,255,255,0.1))',
          paddingTop: 6,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
        }}
      >
        <span style={{ color: 'var(--text-muted, #94a3b8)' }}>Status:</span>
        <span style={{ color: statusColor, fontWeight: 700 }}>
          {isMet ? '✓ Benchmark Met' : `⚠️ -${data.gapPct}% Gap`}
        </span>
      </div>

      {data.weight !== undefined && (
        <div style={{ fontSize: 10, color: 'var(--text-subtle, #64748b)', marginTop: 4 }}>
          Role Weight: {Math.round(data.weight * 100)}% of total benchmark
        </div>
      )}
    </div>
  );
}

/**
 * Upgraded, highly reliable Skill Analysis Chart component.
 * Compares current extracted skills against required benchmark levels.
 */
export default function SkillAnalysisChart({
  role,
  ratings = {},
  initialMode = 'bars', // 'bars' | 'radar'
  containerHeight = 320,
}) {
  const [chartMode, setChartMode] = useState(initialMode);

  // Compute normalized, fully validated data items
  const chartData = useMemo(() => {
    if (!role?.skills || !Array.isArray(role.skills)) return [];

    return role.skills.map((sk) => {
      const currentLevel = Number(ratings[sk.name] ?? 0);
      const requiredLevel = Number(sk.required ?? 3);
      const currentPct = Math.round((currentLevel / 4) * 100);
      const requiredPct = Math.round((requiredLevel / 4) * 100);
      const gap = Math.max(0, requiredLevel - currentLevel);
      const gapPct = Math.max(0, requiredPct - currentPct);

      return {
        name: sk.name,
        current: currentPct,
        required: requiredPct,
        currentLevel,
        requiredLevel,
        currentPct,
        requiredPct,
        gap,
        gapPct,
        weight: sk.weight || 0.1,
      };
    });
  }, [role, ratings]);

  const stats = useMemo(() => {
    const total = chartData.length;
    const met = chartData.filter((d) => d.currentLevel >= d.requiredLevel).length;
    const gaps = total - met;
    return { total, met, gaps };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No skill benchmark data available for this role.
      </div>
    );
  }

  return (
    <div className="skill-analysis-chart-card" style={{ width: '100%', minHeight: containerHeight + 80 }}>
      {/* Chart Top Header & Mode Toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)', fontFamily: 'var(--font-display, inherit)' }}>
              Current vs. Target Competency Comparison
            </h3>
            <span className="badge badge-info" style={{ fontSize: 10 }}>
              {chartData.length} Skills
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Extracted proficiency (0–100%) mapped against {role?.name || 'target role'} industry standard
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-subtle, rgba(255,255,255,0.05))', padding: 3, borderRadius: 6, border: '1px solid var(--border)' }}>
          <button
            type="button"
            className={`btn-chip ${chartMode === 'bars' ? 'active' : ''}`}
            onClick={() => setChartMode('bars')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              background: chartMode === 'bars' ? 'var(--brand)' : 'transparent',
              color: chartMode === 'bars' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <BarChart2 size={13} /> Grouped Bars
          </button>
          <button
            type="button"
            className={`btn-chip ${chartMode === 'radar' ? 'active' : ''}`}
            onClick={() => setChartMode('radar')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              background: chartMode === 'radar' ? 'var(--brand)' : 'transparent',
              color: chartMode === 'radar' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Radio size={13} /> Radar Map
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          marginBottom: 14,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--brand-light, #38bdf8)' }} />
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>Your Extracted Proficiency</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--brand-purple, #a855f7)' }} />
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>Required Target Level</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, fontSize: 11 }}>
          <span style={{ color: 'var(--success)' }}>✓ {stats.met} Benchmark Met</span>
          <span style={{ color: stats.gaps > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            ⚠️ {stats.gaps} Gaps to Close
          </span>
        </div>
      </div>

      {/* Main Chart Container with guaranteed dimensions */}
      <div style={{ width: '100%', height: containerHeight, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'bars' ? (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
              barGap={4}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border, rgba(255,255,255,0.06))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'var(--text-subtle, #94a3b8)' }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-subtle, #94a3b8)' }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
              />
              <Tooltip content={<CustomSkillTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar
                name="Current Proficiency"
                dataKey="current"
                fill="var(--brand-light, #38bdf8)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                animationDuration={800}
              />
              <Bar
                name="Role Requirement"
                dataKey="required"
                fill="var(--brand-purple, #a855f7)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                animationDuration={800}
              />
            </BarChart>
          ) : (
            <RadarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="var(--border, rgba(255,255,255,0.08))" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'var(--text, #cbd5e1)', fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: 'var(--text-subtle, #64748b)' }}
                ticks={[25, 50, 75, 100]}
              />
              <Tooltip content={<CustomSkillTooltip />} />
              <Radar
                name="Role Requirement"
                dataKey="required"
                stroke="var(--brand-purple, #a855f7)"
                fill="var(--brand-purple, #a855f7)"
                fillOpacity={0.15}
                strokeWidth={2}
                animationDuration={800}
              />
              <Radar
                name="Current Proficiency"
                dataKey="current"
                stroke="var(--brand-light, #38bdf8)"
                fill="var(--brand-light, #38bdf8)"
                fillOpacity={0.35}
                strokeWidth={2.5}
                animationDuration={800}
              />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
