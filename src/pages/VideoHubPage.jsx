import { useState, useMemo } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import useStore from '../store/useStore.js';
import { VIDEO_LIBRARY } from '../lib/data.js';
import { rankVideosForGaps } from '../lib/storage.js';

const CATEGORIES = [
  { key: 'all', label: 'All Videos' },
  { key: 'ml', label: 'AI / ML' },
  { key: 'python', label: 'Python & CS' },
  { key: 'sql', label: 'SQL & Data' },
  { key: 'devops', label: 'DevOps / Cloud' },
  { key: 'math', label: 'Math / Stats' },
  { key: 'latex', label: 'LaTeX & Docs' },
];

export default function VideoHubPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'duration' | 'alpha'
  const gapResults = useStore(s => s.gapResults);

  const gapSkills = gapResults?.gaps || [];

  const videos = useMemo(() => {
    let v = VIDEO_LIBRARY;
    if (activeCat !== 'all') v = v.filter(vid => vid.category === activeCat);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      v = v.filter(vid =>
        vid.title.toLowerCase().includes(term) ||
        vid.channel.toLowerCase().includes(term) ||
        vid.tags.some(t => t.toLowerCase().includes(term)) ||
        vid.desc.toLowerCase().includes(term)
      );
    }
    if (sortBy === 'relevance') return rankVideosForGaps(v, gapSkills);
    if (sortBy === 'alpha') return [...v].sort((a, b) => a.title.localeCompare(b.title));
    return v;
  }, [activeCat, searchTerm, sortBy, gapSkills]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Learning & Video Hub</h1>
          <p className="page-subtitle">Curated, free courses ranked by your skill gaps. All links open the official course page.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
            {CATEGORIES.map(c => (
              <button key={c.key} className={`btn-chip ${activeCat === c.key ? 'active' : ''}`} onClick={() => setActiveCat(c.key)}>
                {c.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            className="form-input"
            style={{ width: 180, marginBottom: 0 }}
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select className="form-select" style={{ width: 140, marginBottom: 0 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="relevance">Gap Ranked</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Gap-ranked notice */}
      {gapSkills.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-brand">Gap-Ranked</span>
          Sorted by relevance to your critical skill gaps: {gapSkills.slice(0, 3).join(', ')}
          {gapSkills.length > 3 && ` +${gapSkills.length - 3} more`}
        </div>
      )}

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="empty-state">
          <p>No videos match your search. Try a different filter.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => (
            <div key={v.id} className="video-card" onClick={() => window.open(v.url, '_blank')}>
              <div className="video-thumbnail" style={{ background: v.thumbnail }}>
                <span style={{ color: '#fff', fontSize: 20, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  {v.channel.split(' ')[0].charAt(0)}
                </span>
              </div>
              <div className="video-body">
                <div className="video-title">{v.title}</div>
                <div className="video-meta">{v.channel} · {v.duration}</div>
                <p style={{ fontSize: 11, color: 'var(--text-subtle)', lineHeight: 1.5, marginBottom: 10 }}>{v.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="video-tags">
                    {v.tags.map(t => <span key={t} className="video-tag">{t}</span>)}
                  </div>
                  <ExternalLink size={12} color="var(--text-subtle)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
