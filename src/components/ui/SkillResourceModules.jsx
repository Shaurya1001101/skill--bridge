import { ExternalLink, Code, Terminal, Cpu, PlayCircle, BookOpen, Award } from 'lucide-react';
import { getSkillResources } from '../../lib/data.js';

export default function SkillResourceModules({ skillName, showPractice = true, showLearning = true, compact = false }) {
  if (!skillName) return null;
  const res = getSkillResources(skillName);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'LeetCode': return <Code size={14} color="#FFA116" />;
      case 'HackerRank': return <Terminal size={14} color="#00EA64" />;
      case 'CodeChef': return <Cpu size={14} color="#C084FC" />;
      case 'YouTube': return <PlayCircle size={14} color="#F87171" />;
      case 'LinkedIn Learning': return <Award size={14} color="#38BDF8" />;
      case 'Coursera': return <BookOpen size={14} color="#60A5FA" />;
      default: return <ExternalLink size={14} color="var(--brand-light)" />;
    }
  };

  const getBadgeClass = (platform) => {
    switch (platform) {
      case 'LeetCode': return 'badge-leetcode';
      case 'HackerRank': return 'badge-hackerrank';
      case 'CodeChef': return 'badge-codechef';
      case 'YouTube': return 'badge-youtube';
      case 'LinkedIn Learning': return 'badge-linkedin';
      case 'Coursera': return 'badge-coursera';
      default: return 'badge-brand';
    }
  };

  return (
    <div className="res-container">
      {showPractice && res.practice?.length > 0 && (
        <div>
          <div className="res-group-title">Interactive Coding & Practice Drills</div>
          <div className="res-grid">
            {res.practice.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="res-card"
                title={`Open ${item.title} on ${item.platform}`}
              >
                <div className="res-icon-wrap">
                  {getPlatformIcon(item.platform)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`res-badge ${getBadgeClass(item.platform)}`}>
                      {item.platform}
                    </span>
                    <ExternalLink size={11} color="var(--text-subtle)" />
                  </div>
                  <div className="res-title">{item.title}</div>
                  {!compact && <div className="res-desc">{item.desc}</div>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {showLearning && res.learning?.length > 0 && (
        <div style={{ marginTop: showPractice ? 8 : 0 }}>
          <div className="res-group-title">Curated Video Masterclasses & Specializations</div>
          <div className="res-grid">
            {res.learning.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="res-card"
                title={`Open ${item.title} on ${item.platform}`}
              >
                <div className="res-icon-wrap">
                  {getPlatformIcon(item.platform)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`res-badge ${getBadgeClass(item.platform)}`}>
                      {item.platform}
                    </span>
                    <ExternalLink size={11} color="var(--text-subtle)" />
                  </div>
                  <div className="res-title">{item.title}</div>
                  {!compact && <div className="res-desc">{item.desc}</div>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
