import { useState } from 'react';
import { ExternalLink, Play, Newspaper, Film, Sparkles, Flame, Clock } from 'lucide-react';
import useStore from '../../store/useStore.js';

const CURATED_MEDIA_FEED = [
  {
    id: 'yt-1',
    type: 'video',
    title: 'Neural Networks & Deep Learning Visualized',
    channel: '3Blue1Brown',
    duration: '18:42',
    category: 'AI & Math',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
    desc: 'The fundamental calculus, matrix algebra, and backpropagation mechanics behind modern deep neural networks with elegant visual animations.',
  },
  {
    id: 'yt-2',
    type: 'video',
    title: 'Machine Learning Course for Beginners — Full Course',
    channel: 'freeCodeCamp',
    duration: '3:53:00',
    category: 'ML & Python',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    desc: 'End-to-end hands-on training on regression, classification, clustering, and decision trees using Python, Pandas, and Scikit-Learn.',
  },
  {
    id: 'yt-3',
    type: 'video',
    title: 'Complete Data Structures & Algorithms Roadmap',
    channel: 'GeeksforGeeks',
    duration: '42:15',
    category: 'DSA & Coding',
    image: 'https://images.unsplash.com/photo-1516116211227-bbc07b719460?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/',
    desc: 'Master array manipulation, trees, dynamic programming, and graph traversal patterns required for high-paying software engineering roles.',
  },
  {
    id: 'news-1',
    type: 'news',
    title: 'OpenAI Releases Frontier Autonomous Coding & Reasoning Benchmarks',
    channel: 'TechCrunch AI',
    duration: '3 min read',
    category: 'Frontier AI',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    url: 'https://news.ycombinator.com',
    desc: 'Next-generation reasoning models demonstrate 94.8% accuracy on competitive SWE-bench coding benchmarks, transforming automated software development.',
  },
  {
    id: 'yt-4',
    type: 'video',
    title: 'System Design Interview — High-Throughput Architecture',
    channel: 'ByteByteGo',
    duration: '26:50',
    category: 'System Design',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=i53Gi_K3o7I',
    desc: 'Learn how to architect scalable systems: load balancers, CDN caching, database sharding, and asynchronous message queues.',
  },
  {
    id: 'news-2',
    type: 'news',
    title: 'Python 3.13 Makes Free-Threaded Mode Production Ready (No GIL)',
    channel: 'Python Software Foundation',
    duration: '4 min read',
    category: 'Language Core',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    url: 'https://python.org',
    desc: 'Disabling the Global Interpreter Lock allows true multi-core parallel execution in CPU-bound AI, numeric, and data science workloads.',
  },
  {
    id: 'yt-5',
    type: 'video',
    title: 'Transformers & Self-Attention Explained Step-by-Step',
    channel: 'StatQuest',
    duration: '19:10',
    category: 'Generative AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=zxQyTK8quyY',
    desc: 'Josh Starmer demystifies query-key-value vectors, dot-product scoring, and multi-head attention that power modern LLMs.',
  },
  {
    id: 'news-3',
    type: 'news',
    title: 'PostgreSQL 17 Vector Extensions Accelerate RAG Pipelines by 4.2x',
    channel: 'Database Weekly',
    duration: '5 min read',
    category: 'Data & SQL',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    url: 'https://postgresql.org',
    desc: 'New SIMD AVX-512 distance indexing allows pgvector to compete head-to-head with dedicated vector databases for enterprise RAG.',
  },
  {
    id: 'yt-6',
    type: 'video',
    title: 'Docker & Kubernetes Full Practical Guide for Developers',
    channel: 'TechWorld with Nana',
    duration: '1:08:45',
    category: 'DevOps & Cloud',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    desc: 'Hands-on containerization, multi-stage Docker builds, Kubernetes Pod deployment, cluster networking, and cloud CI/CD best practices.',
  },
];

export default function CuratedLearningAndNewsFeed() {
  const [filter, setFilter] = useState('all');
  const addToast = useStore(s => s.addToast);

  const filteredItems = CURATED_MEDIA_FEED.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'videos') return item.type === 'video';
    if (filter === 'news') return item.type === 'news';
    return item.category.toLowerCase().includes(filter.toLowerCase());
  });

  const handleOpenItem = (item) => {
    window.open(item.url, '_blank');
    addToast(`Opening ${item.type === 'video' ? 'YouTube tutorial' : 'article'}: ${item.title.slice(0, 35)}...`, 'info');
  };

  return (
    <div className="card curated-feed-section" style={{ gridColumn: '1 / -1' }}>
      {/* Header */}
      <div className="card-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-brand">Curated Media</span>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Curated picks &bull; not a live feed</span>
          </div>
          <h2 className="card-title" style={{ fontSize: 18 }}>
            Featured Tech News & YouTube Learning Masterclasses
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Useful videos and articles curated by the team — not a live or automated feed.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="feed-filter-bar">
          {[
            { key: 'all', label: 'All Feeds', icon: Flame },
            { key: 'videos', label: 'YouTube Tutorials', icon: Film },
            { key: 'news', label: 'Tech News', icon: Newspaper },
            { key: 'dsa', label: 'DSA & Coding' },
            { key: 'system design', label: 'System Design' },
          ].map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                type="button"
                className={`feed-filter-pill ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {Icon && <Icon size={12} />}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards with Real Image Support */}
      <div className="yt-learning-grid">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="yt-learning-card"
            onClick={() => handleOpenItem(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenItem(item)}
          >
            {/* Image Thumbnail Container */}
            <div className="yt-thumbnail-wrapper">
              <img
                src={item.image}
                alt={item.title}
                className="yt-thumbnail-img"
                loading="lazy"
              />

              {/* Source/Type Chip */}
              <div className="yt-source-chip">
                {item.type === 'video' ? (
                  <><Film size={11} color="#FF0000" /> YouTube</>
                ) : (
                  <><Newspaper size={11} color="var(--brand)" /> Article</>
                )}
              </div>

              {/* Play Button Overlay for Videos */}
              {item.type === 'video' && (
                <div className="yt-play-overlay">
                  <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />
                </div>
              )}

              {/* Duration / Read Time Badge */}
              <div className="yt-duration-badge">
                <Clock size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                {item.duration}
              </div>
            </div>

            {/* Card Body */}
            <div className="yt-card-body">
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <span className="badge badge-brand" style={{ fontSize: 9 }}>{item.category}</span>
              </div>
              <h3 className="yt-card-title">{item.title}</h3>
              <p className="yt-card-desc">{item.desc}</p>

              {/* Footer */}
              <div className="yt-card-footer">
                <div className="yt-channel-meta">
                  <div className="yt-channel-avatar">
                    {item.channel.charAt(0)}
                  </div>
                  <span>{item.channel}</span>
                </div>
                <span className="yt-action-link">
                  {item.type === 'video' ? 'Watch on YouTube' : 'Read News'}
                  <ExternalLink size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
