import { useState, useMemo } from 'react';
import { MessageCircle, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore.js';
import { FAQ_DATA } from '../lib/data.js';

import { SKILL_ROLES, PACING_MODES, getSkillResources } from '../lib/data.js';

export { default as AIAssistant, contextualAIResponse } from '../components/ui/AIAssistant.jsx';

// ─── Help Page ────────────────────────────────────────────────────────────────
function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: open ? 'rgba(255,255,255,0.04)' : 'transparent' }} onClick={() => setOpen(v => !v)}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.q}</div>
        {open ? <ChevronUp size={14} color="var(--text-subtle)" /> : <ChevronDown size={14} color="var(--text-subtle)" />}
      </div>
      {open && (
        <div style={{ padding: '10px 16px 14px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border)' }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const toggleChat = useStore(s => s.toggleChat);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Help & Guide</h1>
          <p className="page-subtitle">Platform walkthrough, FAQ, and AI assistant for instant answers to any question.</p>
        </div>
        <button className="btn btn-primary" onClick={toggleChat}>
          <Bot size={14} /> Open AI Assistant
        </button>
      </div>

      {/* Platform Walkthrough */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h2 className="card-title">Platform Walkthrough</h2>
          <span className="badge badge-brand">8 Steps</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { num: '01', title: 'Run Gap Analysis', desc: 'Start in Gap Analysis — rate your skills 0–4, select your target role, and click Calculate Gap Score.', badge: 'Start Here' },
            { num: '02', title: 'Skill Analyzer', desc: 'Paste your resume or job description in Skill Analyzer to auto-extract and normalize your skill profile using NLP.', badge: 'AI Powered' },
            { num: '03', title: 'Trajectory Simulator', desc: 'Upload your resume and run the Skill Trajectory Simulator to project your readiness at 3, 6, and 12 months.', badge: 'Projection' },
            { num: '04', title: 'Improvement Map', desc: 'Visit Improvement Map for your personalized weekly roadmap. Export it as .ics to sync with your calendar.', badge: 'Roadmap' },
            { num: '05', title: 'Code Labs', desc: 'Practice in the browser: Python Lab, SQL Playground, and LaTeX Resume Builder — no installs needed.', badge: 'Practice' },
            { num: '06', title: 'Daily Problem', desc: 'Solve today\'s coding challenge to earn +10 XP and extend your learning streak.', badge: '+10 XP' },
            { num: '07', title: 'Learning Hub', desc: 'Browse the curated video library — sorted by relevance to your skill gaps. All resources are free.', badge: 'Free' },
            { num: '08', title: 'Job Market', desc: 'Explore job listings with your skill match % computed live. Deep links go directly to LinkedIn search.', badge: 'Jobs' },
          ].map(step => (
            <div key={step.num} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.12)' }}>{step.num}</span>
                <span className="badge badge-brand" style={{ fontSize: 9 }}>{step.badge}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h2 className="card-title">Frequently Asked Questions</h2>
        </div>
        {FAQ_DATA.map((item, i) => <FAQItem key={i} item={item} />)}
      </div>

      {/* AI Assistant CTA */}
      <div className="card" style={{ background: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bot size={24} color="var(--brand-light)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Still have questions?</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>The SkillBridge AI assistant answers questions about any platform feature, skill gaps, or career strategy.</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={toggleChat}>
            <MessageCircle size={14} /> Chat with Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
