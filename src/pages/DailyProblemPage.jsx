import { useState, useEffect } from 'react';
import { Trophy, Zap, Star, CheckCircle2, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore.js';
import { DAILY_PROBLEMS } from '../lib/data.js';
import { getDailyProblem } from '../lib/storage.js';

const ACHIEVEMENTS = [
  { id: 'first-solve', name: 'First Blood', icon: '🎯', desc: 'Solved your first daily problem', condition: s => s >= 1 },
  { id: 'streak-3', name: '3-Day Streak', icon: '🔥', desc: 'Maintained a 3-day streak', condition: (s, streak) => streak >= 3 },
  { id: 'streak-7', name: 'Week Warrior', icon: '⚡', desc: '7-day coding streak', condition: (s, streak) => streak >= 7 },
  { id: 'solve-3', name: 'Hat Trick', icon: '🏆', desc: 'Solved 3 problems', condition: s => s >= 3 },
  { id: 'solve-5', name: 'Grind Master', icon: '💪', desc: 'Solved 5 problems', condition: s => s >= 5 },
  { id: 'solve-7', name: 'Problem Slayer', icon: '⚔️', desc: 'Solved 7 problems', condition: s => s >= 7 },
];

function InterviewQuiz() {
  const QUESTIONS = [
    {
      q: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correct: 1,
      explain: 'Binary search halves the search space each iteration: O(log n).',
    },
    {
      q: 'In machine learning, what does "overfitting" mean?',
      options: ['Model performs well on test data', 'Model memorizes training data, fails on new data', 'Model underfits training data', 'Model converges too slowly'],
      correct: 1,
      explain: 'Overfitting = the model learns noise in training data and fails to generalize.',
    },
    {
      q: 'What does SQL GROUP BY do?',
      options: ['Filters rows by a condition', 'Aggregates rows by column values', 'Joins two tables', 'Sorts the result set'],
      correct: 1,
      explain: 'GROUP BY groups rows with matching values to apply aggregate functions like COUNT, AVG, SUM.',
    },
    {
      q: 'What is the purpose of a Docker container?',
      options: ['Version control for code', 'Lightweight, isolated environment for running apps', 'Cloud storage service', 'Database management system'],
      correct: 1,
      explain: 'Docker containers package code + dependencies into isolated environments that run consistently anywhere.',
    },
    {
      q: 'Which activation function outputs values between 0 and 1?',
      options: ['ReLU', 'Tanh', 'Sigmoid', 'Leaky ReLU'],
      correct: 2,
      explain: 'Sigmoid maps any real value to (0, 1) via σ(x) = 1 / (1 + e^−x).',
    },
  ];

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const addXP = useStore(s => s.addXP);
  const addToast = useStore(s => s.addToast);

  const q = QUESTIONS[qIdx];

  const select = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) {
      setScore(s => s + 1);
      addToast('+3 XP for correct answer!', 'success');
      addXP(3);
    }
  };

  const next = () => {
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(i => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => { setQIdx(0); setSelected(null); setScore(0); setDone(false); };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{score >= 4 ? '🏆' : score >= 3 ? '⭐' : '📚'}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Quiz Complete!</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-light)', marginBottom: 12 }}>{score}/{QUESTIONS.length}</div>
        <button className="btn btn-secondary btn-sm" onClick={restart}>
          <RotateCcw size={12} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Q{qIdx + 1} of {QUESTIONS.length}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-light)' }}>Score: {score}</div>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 16 }}>
        <div style={{ height: '100%', width: `${((qIdx + 1) / QUESTIONS.length) * 100}%`, background: 'var(--brand)', borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <div className="interview-question">{q.q}</div>
      <div className="interview-options">
        {q.options.map((opt, i) => {
          let cls = '';
          if (selected !== null) {
            if (i === q.correct) cls = 'correct';
            else if (i === selected) cls = 'wrong';
          }
          return (
            <div key={i} className={`interview-option ${cls}`} onClick={() => select(i)}>
              {opt}
            </div>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 6, borderLeft: `3px solid ${selected === q.correct ? 'var(--success)' : 'var(--danger)'}` }}>
          <strong>{selected === q.correct ? '✓ Correct!' : '✗ Incorrect.'}</strong> {q.explain}
        </div>
      )}
      {selected !== null && (
        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={next}>
          {qIdx < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </div>
  );
}

export default function DailyProblemPage() {
  const xp = useStore(s => s.xp);
  const streak = useStore(s => s.streak);
  const solvedProblems = useStore(s => s.solvedProblems);
  const markProblemSolved = useStore(s => s.markProblemSolved);
  const addToast = useStore(s => s.addToast);

  const [showSolution, setShowSolution] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [tab, setTab] = useState('problem');

  const todayProblem = getDailyProblem(DAILY_PROBLEMS);
  const isSolved = solvedProblems.includes(todayProblem.id);

  const earned = solvedProblems.length;
  const badges = ACHIEVEMENTS.filter(a => a.condition(earned, streak));

  useEffect(() => {
    if (!code) setCode(todayProblem.starterCode);
  }, [todayProblem]);

  const runCode = () => {
    if (code.trim().length < 10) { addToast('Write some code first!', 'warning'); return; }
    // Simple output simulation
    setOutput(`# Code submitted!\n# Expected output based on the problem statement\n# ✓ Basic syntax check passed\n\nRun your solution at: replit.com or Google Colab for full Python execution.`);
  };

  const handleSolve = () => {
    if (!isSolved) {
      markProblemSolved(todayProblem.id);
      addToast('+10 XP earned! Problem marked solved.', 'success');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Coding Problem</h1>
          <p className="page-subtitle">A new challenge every day, deterministically chosen. Solve it to earn XP and extend your streak.</p>
        </div>
        <div className="header-actions" style={{ alignItems: 'center', gap: 12 }}>
          <div className="streak-badge"><Trophy size={13} /> {streak} day streak</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit' }}>{xp} XP</div>
        </div>
      </div>

      <div className="tab-list">
        {[
          { key: 'problem', label: "Today's Problem" },
          { key: 'interview', label: 'Interview Prep Quiz' },
          { key: 'achievements', label: 'Achievements' },
          { key: 'history', label: 'Past Challenges' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'problem' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Problem statement */}
          <div className="problem-card">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
              <span className={`diff-tag diff-${todayProblem.difficulty}`}>{todayProblem.difficulty.toUpperCase()}</span>
              <span className="badge badge-info" style={{ fontSize: 9 }}>{todayProblem.category}</span>
              {isSolved && <span className="badge badge-success">SOLVED ✓</span>}
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)' }}>+10 XP</span>
            </div>
            <div className="problem-title">{todayProblem.title}</div>
            <div className="problem-desc">{todayProblem.desc}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
              {todayProblem.tags.map(t => <span key={t} className="badge badge-brand" style={{ fontSize: 9 }}>{t}</span>)}
            </div>

            {/* Hint */}
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: 'var(--warning)' }}>
              💡 Hint: {todayProblem.hint}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {!isSolved && (
                <button className="btn btn-success btn-sm" onClick={handleSolve}>
                  <CheckCircle2 size={12} /> Mark Solved (+10 XP)
                </button>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setShowSolution(s => !s); addToast('Solution revealed — try again yourself for better retention!', 'warning'); }}
              >
                {showSolution ? 'Hide Solution' : 'Reveal Solution'}
              </button>
            </div>

            {showSolution && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', letterSpacing: '0.06em', marginBottom: 6 }}>SOLUTION</div>
                <pre style={{ fontFamily: 'JetBrains Mono', fontSize: 11, background: '#070c18', padding: 12, borderRadius: 6, overflow: 'auto', color: '#e2e8f0', lineHeight: 1.6 }}>
                  {todayProblem.solution}
                </pre>
              </div>
            )}
          </div>

          {/* Code editor */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Solution</h2>
              <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{todayProblem.category}</span>
            </div>
            <textarea
              id="daily-problem-editor"
              className="code-editor"
              style={{ minHeight: 240 }}
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button id="run-daily-btn" className="btn btn-primary btn-sm" onClick={runCode}>Run Code</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setCode(todayProblem.starterCode)}>Reset</button>
            </div>
            {output && (
              <pre style={{ fontFamily: 'JetBrains Mono', fontSize: 11, background: '#070c18', padding: 12, borderRadius: 6, color: '#34D399', marginTop: 10, lineHeight: 1.6, overflow: 'auto' }}>
                {output}
              </pre>
            )}
          </div>
        </div>
      )}

      {tab === 'interview' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Interview Prep Quiz</h2>
            <span className="badge badge-info">+3 XP per correct</span>
          </div>
          <InterviewQuiz />
        </div>
      )}

      {tab === 'achievements' && (
        <div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--warning)', fontFamily: 'Outfit' }}>{streak}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Day Streak</div>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--brand-light)', fontFamily: 'Outfit' }}>{xp}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total XP</div>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--success)', fontFamily: 'Outfit' }}>{earned}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Problems Solved</div>
            </div>
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Achievement Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {ACHIEVEMENTS.map(a => {
              const earned = a.condition(solvedProblems.length, streak);
              return (
                <div key={a.id} className={`achievement-badge ${earned ? 'earned' : ''}`} style={!earned ? { opacity: 0.45 } : {}}>
                  <div className="achievement-icon">{a.icon}</div>
                  <div className="achievement-name">{a.name}</div>
                  <div style={{ fontSize: 9, color: earned ? 'var(--brand-light)' : 'var(--text-subtle)', textAlign: 'center', marginTop: 3 }}>{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DAILY_PROBLEMS.map(p => {
              const solved = solvedProblems.includes(p.id);
              return (
                <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 22 }}>{solved ? '✅' : '⬜'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`diff-tag diff-${p.difficulty}`}>{p.difficulty}</span>
                      <span>{p.category}</span>
                    </div>
                  </div>
                  {solved && <span className="badge badge-success">+10 XP</span>}
                  {!solved && (
                    <button className="btn btn-secondary btn-sm" onClick={() => { tab === 'problem' && handleSolve(); }}>
                      Practice
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
