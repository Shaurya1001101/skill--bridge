import { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore.js';
import { LATEX_TEMPLATES } from '../lib/data.js';

import { executePython, loadSkulpt } from '../lib/pythonRunner.js';


// ─── Python Lab ───────────────────────────────────────────────────────────────
const PYTHON_PRESETS = {
  hello: `# Python 3: Hello World & Basics
print("hello world")
name = "Alex"
skills = ["Python", "SQL", "Machine Learning"]
print(f"Welcome to SkillBridge, {name}!")
print("Your active track has", len(skills), "key skills:")
for s in skills:
    print("  →", s)`,
  ml: `# ML: Sigmoid Function
import numpy as np

def sigmoid(x):
    return 1 / (1 + 2.718**(-x))

values = [-2, -1, 0, 1, 2]
print("Sigmoid values:")
for v in values:
    sig = sigmoid(v)
    print(f"  sigmoid({v}) = {sig:.4f}")`,
  pandas: `# Pandas-style operations (simulated)
data = {'name': ['Alice', 'Bob', 'Charlie'], 'score': [92, 78, 85]}
scores = data['score']
mean_score = sum(scores) / len(scores)
max_score = max(scores)
print(f"Mean: {mean_score:.1f}, Max: {max_score}")
above_avg = [n for n, s in zip(data['name'], scores) if s >= mean_score]
print(f"Above average: {above_avg}")`,
  algo: `# Binary Search Algorithm
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
result = binary_search(arr, target)
print(f"Searching for {target} in {arr}")
print(f"Found at index: {result}")`,
  knn: `# K-Nearest Neighbors (step by step)
def euclidean_dist(p1, p2):
    return sum([(a-b)**2 for a,b in zip(p1,p2)]) ** 0.5

X_train = [[1,1],[2,2],[3,1],[6,6],[7,7],[8,6]]
y_train = [0,0,0,1,1,1]
test_point = [2,1]
k = 3

dists = [[euclidean_dist(test_point, x), y] for x,y in zip(X_train, y_train)]
dists.sort()
k_nearest = dists[:k]
print("Query:", test_point)
for d, label in k_nearest:
    print(f"  distance={d:.2f}, class={label}")
votes = sum([1 for d, y in k_nearest if y==1])
pred = 1 if votes > k//2 else 0
print(f"Predicted class: {pred}")`,
};

function PythonLab() {
  const [code, setCode] = useState(PYTHON_PRESETS.hello);
  const [output, setOutput] = useState('# Output appears here\n# Click Run to execute');
  const [running, setRunning] = useState(false);
  const [preset, setPreset] = useState('hello');
  const addToast = useStore(s => s.addToast);

  // Pre-load Skulpt in background
  useEffect(() => {
    loadSkulpt();
  }, []);

  const run = async () => {
    setRunning(true);
    try {
      const result = await executePython(code);
      setOutput(result);
    } catch (err) {
      setOutput(`Execution error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const loadPreset = (key) => {
    setCode(PYTHON_PRESETS[key]);
    setPreset(key);
    setOutput('# Click Run to execute');
    addToast(`Loaded ${key} preset`, 'info');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {Object.keys(PYTHON_PRESETS).map(k => (
          <button key={k} className={`btn-chip ${preset === k ? 'active' : ''}`} onClick={() => loadPreset(k)}>
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="lab-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EC4899' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginLeft: 4 }}>python</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sm btn-secondary" onClick={() => setCode('')} style={{ gap: 4 }}>
                <RotateCcw size={11} /> Clear
              </button>
              <button id="python-run-btn" className="btn btn-sm btn-primary" onClick={run} disabled={running} style={{ gap: 4 }}>
                {running ? <Square size={11} /> : <Play size={11} />} {running ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
          <textarea
            className="lab-editor-area"
            style={{ flex: 1, minHeight: 320 }}
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Write Python code here..."
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)' }}>
          <div className="lab-toolbar">
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Output</span>
          </div>
          <div className="lab-terminal" style={{ flex: 1, minHeight: 320 }}>{output}</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 8 }}>
        Note: Browser-based Python simulation — supports print, loops, functions, basic math, and data structures.
      </div>
    </div>
  );
}

// ─── SQL Lab ──────────────────────────────────────────────────────────────────
const SQL_DATASETS = {
  employees: [
    { id: 1, name: 'Alice', dept: 'Engineering', salary: 95000, years: 4 },
    { id: 2, name: 'Bob', dept: 'Data', salary: 88000, years: 3 },
    { id: 3, name: 'Charlie', dept: 'Engineering', salary: 102000, years: 6 },
    { id: 4, name: 'Diana', dept: 'Product', salary: 78000, years: 2 },
    { id: 5, name: 'Eve', dept: 'Data', salary: 93000, years: 5 },
    { id: 6, name: 'Frank', dept: 'Engineering', salary: 115000, years: 8 },
    { id: 7, name: 'Grace', dept: 'HR', salary: 62000, years: 1 },
    { id: 8, name: 'Hank', dept: 'Data', salary: 97000, years: 4 },
  ],
  jobs: [
    { id: 1, title: 'ML Engineer', company: 'TechCo', salary: 105000, city: 'Bengaluru', skills: 'Python,PyTorch,Docker' },
    { id: 2, title: 'Data Scientist', company: 'DataCorp', salary: 92000, city: 'Mumbai', skills: 'Python,SQL,Statistics' },
    { id: 3, title: 'MLOps Engineer', company: 'CloudSys', salary: 98000, city: 'Hyderabad', skills: 'Docker,K8s,Python' },
    { id: 4, title: 'Data Engineer', company: 'Flipkart', salary: 88000, city: 'Bengaluru', skills: 'SQL,Spark,Python' },
    { id: 5, title: 'AI Researcher', company: 'DeepAI', salary: 130000, city: 'Bengaluru', skills: 'PyTorch,Mathematics,Research' },
  ],
};

function parseSQLQuery(query, datasets) {
  const q = query.trim().toUpperCase();
  try {
    // Determine table
    const fromMatch = query.match(/FROM\s+(\w+)/i);
    if (!fromMatch) return { error: 'No FROM clause found.' };
    const tableName = fromMatch[1].toLowerCase();
    let rows = datasets[tableName];
    if (!rows) return { error: `Table '${tableName}' not found. Available: ${Object.keys(datasets).join(', ')}` };

    // WHERE
    const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+GROUP BY|\s+ORDER BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const cond = whereMatch[1].trim();
      const [col, op, val] = cond.split(/\s*(=|>|<|!=|LIKE)\s*/i);
      const clean = col.trim().toLowerCase();
      const numVal = parseFloat(val?.replace(/['"]/g, ''));
      const strVal = val?.replace(/['"]/g, '');
      rows = rows.filter(r => {
        const rv = r[clean];
        if (op === '=') return String(rv) === strVal || rv === numVal;
        if (op === '>') return rv > numVal;
        if (op === '<') return rv < numVal;
        if (op === '!=') return rv !== strVal && rv !== numVal;
        if (op?.toUpperCase() === 'LIKE') return String(rv).toLowerCase().includes(strVal.replace(/%/g, '').toLowerCase());
        return true;
      });
    }

    // GROUP BY + AVG/COUNT/SUM
    const groupMatch = query.match(/GROUP BY\s+(\w+)/i);
    if (groupMatch) {
      const groupCol = groupMatch[1].toLowerCase();
      const groups = {};
      rows.forEach(r => {
        const k = r[groupCol];
        if (!groups[k]) groups[k] = [];
        groups[k].push(r);
      });
      const aggMatch = query.match(/(AVG|COUNT|SUM|MAX|MIN)\s*\(\s*(\w+|\*)\s*\)/i);
      rows = Object.entries(groups).map(([key, groupRows]) => {
        const res = { [groupCol]: key };
        if (aggMatch) {
          const fn = aggMatch[1].toUpperCase();
          const col = aggMatch[2].toLowerCase();
          const vals = col === '*' ? groupRows.map((_, i) => 1) : groupRows.map(r => r[col] || 0);
          if (fn === 'AVG') res[`avg_${col}`] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
          if (fn === 'COUNT') res[`count`] = vals.length;
          if (fn === 'SUM') res[`sum_${col}`] = vals.reduce((a, b) => a + b, 0);
          if (fn === 'MAX') res[`max_${col}`] = Math.max(...vals);
          if (fn === 'MIN') res[`min_${col}`] = Math.min(...vals);
        }
        return res;
      });
    }

    // ORDER BY
    const orderMatch = query.match(/ORDER BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const col = orderMatch[1].toLowerCase();
      const dir = orderMatch[2]?.toUpperCase() === 'DESC' ? -1 : 1;
      rows = [...rows].sort((a, b) => a[col] > b[col] ? dir : a[col] < b[col] ? -dir : 0);
    }

    // LIMIT
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]));

    // SELECT columns
    const selMatch = query.match(/SELECT\s+(.+?)\s+FROM/is);
    if (selMatch) {
      const selRaw = selMatch[1].trim();
      if (selRaw !== '*') {
        const cols = selRaw.split(',').map(c => c.trim().toLowerCase());
        rows = rows.map(r => {
          const out = {};
          cols.forEach(c => {
            const clean = c.replace(/\s+as\s+\w+/i, '').trim();
            if (r[clean] !== undefined) out[clean] = r[clean];
            else { const k = Object.keys(r).find(k => k.toLowerCase() === clean); if (k) out[k] = r[k]; }
          });
          return out;
        });
      }
    }

    return { rows, cols: rows.length ? Object.keys(rows[0]) : [] };
  } catch (e) {
    return { error: `Query error: ${e.message}` };
  }
}

function SQLLab() {
  const [query, setQuery] = useState(`SELECT dept, COUNT(*) as count, AVG(salary) as avg_salary
FROM employees
GROUP BY dept
ORDER BY avg_salary DESC`);
  const [result, setResult] = useState(null);
  const addToast = useStore(s => s.addToast);

  const PRESETS = [
    { label: 'Dept Stats', q: `SELECT dept, COUNT(*) as count, AVG(salary) as avg_salary\nFROM employees\nGROUP BY dept\nORDER BY avg_salary DESC` },
    { label: 'Senior Staff', q: `SELECT name, dept, salary\nFROM employees\nWHERE salary > 90000\nORDER BY salary DESC` },
    { label: 'Top Jobs', q: `SELECT title, company, salary, city\nFROM jobs\nORDER BY salary DESC\nLIMIT 3` },
    { label: 'High Earners', q: `SELECT name, salary, years\nFROM employees\nWHERE salary > 95000\nORDER BY salary DESC` },
  ];

  const runQuery = () => {
    const res = parseSQLQuery(query, SQL_DATASETS);
    setResult(res);
    if (res.error) addToast(res.error, 'error');
    else addToast(`${res.rows.length} rows returned`, 'success');
  };

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.07em', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: 8 }}>
        Tables: employees, jobs (use SELECT, WHERE, GROUP BY, ORDER BY, LIMIT)
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button key={p.label} className="btn-chip" onClick={() => setQuery(p.q)}>{p.label}</button>
        ))}
      </div>
      <textarea
        id="sql-editor"
        className="code-editor"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ minHeight: 120, marginBottom: 10 }}
        placeholder="SELECT * FROM employees WHERE salary > 90000 ORDER BY salary DESC"
      />
      <button id="sql-run-btn" className="btn btn-primary btn-sm" onClick={runQuery} style={{ marginBottom: 12 }}>
        <Play size={12} /> Run Query
      </button>
      {result && (
        result.error ? (
          <div style={{ color: 'var(--danger)', fontSize: 13, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>{result.error}</div>
        ) : (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginBottom: 6 }}>{result.rows.length} rows returned</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>{result.cols.map(c => <th key={c} style={{ textAlign: 'left', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {result.cols.map(c => <td key={c} style={{ padding: '7px 12px', color: 'var(--text)' }}>{String(row[c] ?? '-')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ─── LaTeX Lab ────────────────────────────────────────────────────────────────
function LatexLab() {
  const [code, setCode] = useState(LATEX_TEMPLATES.cv);
  const [activeTemplate, setActiveTemplate] = useState('cv');
  const addToast = useStore(s => s.addToast);

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'skillbridge_cv.tex'; a.click();
    URL.revokeObjectURL(url);
    addToast('.tex file downloaded — compile with pdflatex or Overleaf', 'success');
  };

  const openOverleaf = () => {
    window.open('https://www.overleaf.com/project', '_blank');
    addToast('Opening Overleaf — paste your .tex there', 'info');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Templates:</span>
        {Object.keys(LATEX_TEMPLATES).map(k => (
          <button key={k} className={`btn-chip ${activeTemplate === k ? 'active' : ''}`} onClick={() => { setCode(LATEX_TEMPLATES[k]); setActiveTemplate(k); }}>
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={openOverleaf}>Open Overleaf</button>
          <button id="latex-download-btn" className="btn btn-primary btn-sm" onClick={download}>Download .tex</button>
        </div>
      </div>
      <textarea
        id="latex-editor"
        className="code-editor"
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ minHeight: 360 }}
      />
      <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: 6, border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, color: 'var(--text-muted)' }}>
        LaTeX Preview coming soon. Download .tex and compile at <a href="https://overleaf.com" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-light)' }}>Overleaf</a> (free) or with pdflatex.
      </div>
    </div>
  );
}

// ─── Code Labs Page ───────────────────────────────────────────────────────────
export default function CodeLabsPage() {
  const [tab, setTab] = useState('python');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Interactive Code Labs</h1>
          <p className="page-subtitle">Browser-based Python execution · SQL sandbox with real data · Professional LaTeX resume builder</p>
        </div>
      </div>

      <div className="tab-list">
        {[
          { key: 'python', label: 'Python Lab' },
          { key: 'sql', label: 'SQL Playground' },
          { key: 'latex', label: 'LaTeX Resume Builder' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'python' && <PythonLab />}
        {tab === 'sql' && <SQLLab />}
        {tab === 'latex' && <LatexLab />}
      </div>
    </div>
  );
}
