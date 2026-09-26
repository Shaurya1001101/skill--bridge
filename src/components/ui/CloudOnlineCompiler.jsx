import { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, RefreshCw, Terminal, Code2 } from 'lucide-react';
import useStore from '../../store/useStore.js';

const COMPILER_LANGUAGES = [
  { key: 'python', label: 'Python 3', icon: '🐍', embedKey: 'python' },
  { key: 'javascript', label: 'JavaScript / Node', icon: '⚡', embedKey: 'javascript' },
  { key: 'cpp', label: 'C++ 20', icon: '⚙️', embedKey: 'cpp' },
  { key: 'java', label: 'Java 17', icon: '☕', embedKey: 'java' },
  { key: 'c', label: 'C (GCC)', icon: '🔧', embedKey: 'c' },
  { key: 'go', label: 'Go (Golang)', icon: '🔷', embedKey: 'go' },
  { key: 'rust', label: 'Rust', icon: '🦀', embedKey: 'rust' },
];

const CODE_TEMPLATES = {
  python: `# Python 3 — Real Online Compiler with VS Code Tools
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

sample_nums = [2, 7, 11, 15]
target = 9
print(f"Input: {sample_nums}, Target: {target}")
print(f"Indices: {two_sum(sample_nums, target)}")
`,
  javascript: `// JavaScript (Node.js) — Real Cloud Execution
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

console.log("Fibonacci Sequence (first 10 terms):");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
`,
  cpp: `// C++ 20 — Real Compiler with Full STL Support
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    std::cout << "Original vector: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    std::sort(numbers.begin(), numbers.end());
    std::cout << "Sorted vector:   ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    return 0;
}
`,
  java: `// Java 17 — Standard Compilation Environment
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Java Cloud Compiler Execution:");
        Map<String, Integer> map = new HashMap<>();
        map.put("Python", 98);
        map.put("SQL", 92);
        map.put("Docker", 85);

        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println("Skill: " + entry.getKey() + " -> Score: " + entry.getValue());
        }
    }
}
`,
  c: `// C (GCC) — Low-Level Compilation
#include <stdio.h>

int main() {
    printf("C Execution in SkillBridge Cloud Compiler\\n");
    int arr[] = {10, 20, 30, 40, 50};
    int len = sizeof(arr) / sizeof(arr[0]);
    int sum = 0;
    for (int i = 0; i < len; i++) sum += arr[i];
    printf("Sum of array elements = %d\\n", sum);
    return 0;
}
`,
  go: `// Go (Golang) — Fast Concurrent Language
package main

import (
    "fmt"
    "time"
)

func worker(id int, ch chan string) {
    ch <- fmt.Sprintf("Worker %d completed at %s", id, time.Now().Format("15:04:05"))
}

func main() {
    ch := make(chan string, 3)
    for i := 1; i <= 3; i++ {
        go worker(i, ch)
    }
    for i := 1; i <= 3; i++ {
        fmt.Println(<-ch)
    }
}
`,
  rust: `// Rust — Memory-Safe Systems Language
fn main() {
    let skills = vec!["PyTorch", "Kubernetes", "Rust", "PostgreSQL"];
    println!("Compiled Rust Binary Output:");
    for (idx, skill) in skills.iter().enumerate() {
        println!("{}. Mastering {}", idx + 1, skill);
    }
}
`,
};

export default function CloudOnlineCompiler() {
  const [lang, setLang] = useState('python');
  const [copied, setCopied] = useState(false);
  const theme = useStore(s => s.theme);
  const addToast = useStore(s => s.addToast);

  const selectedLangObj = COMPILER_LANGUAGES.find(l => l.key === lang) || COMPILER_LANGUAGES[0];

  const handleCopyCode = () => {
    const code = CODE_TEMPLATES[lang] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    addToast(`${selectedLangObj.label} template copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenVSCode = () => {
    window.open('https://vscode.dev', '_blank');
    addToast('Opening VS Code Online (vscode.dev) in a new tab 🚀', 'info');
  };

  const handleOpenGitHubDev = () => {
    window.open('https://github.dev', '_blank');
    addToast('Opening GitHub Web Editor (github.dev) 🚀', 'info');
  };

  const handleOpenStackBlitz = () => {
    window.open('https://stackblitz.com', '_blank');
    addToast('Opening StackBlitz WebContainer IDE ⚡', 'info');
  };

  // OneCompiler embed URL with dark/light theme support
  const iframeSrc = `https://onecompiler.com/embed/${selectedLangObj.embedKey}?theme=${theme === 'light' ? 'light' : 'dark'}&listenToEvents=true&hideLanguageSelection=false&hideNew=true`;

  return (
    <div className="cloud-compiler-container">
      {/* Top Controls Toolbar */}
      <div className="cloud-compiler-toolbar">
        {/* Language Tabs */}
        <div className="compiler-lang-group">
          {COMPILER_LANGUAGES.map(l => (
            <button
              key={l.key}
              type="button"
              className={`compiler-lang-btn ${lang === l.key ? 'active' : ''}`}
              onClick={() => {
                setLang(l.key);
                addToast(`Switched to ${l.label} compiler`, 'info');
              }}
            >
              <span style={{ marginRight: 4 }}>{l.icon}</span>
              {l.label}
            </button>
          ))}
        </div>

        {/* Cloud & VS Code Launch Buttons */}
        <div className="compiler-tools-group">
          <button
            type="button"
            className="btn-chip"
            onClick={handleCopyCode}
            title="Copy starter code for this language"
            style={{ fontSize: 11 }}
          >
            {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            className="vscode-launch-btn"
            onClick={handleOpenVSCode}
            title="Open full Visual Studio Code in your browser (official vscode.dev)"
          >
            <Code2 size={13} />
            <span>Open in VS Code (Web) ↗</span>
          </button>

          <button
            type="button"
            className="btn-chip"
            onClick={handleOpenGitHubDev}
            title="Open in GitHub Codespaces Web Editor"
            style={{ fontSize: 11 }}
          >
            <ExternalLink size={11} />
            <span>github.dev</span>
          </button>

          <button
            type="button"
            className="btn-chip"
            onClick={handleOpenStackBlitz}
            title="Open in StackBlitz Cloud IDE"
            style={{ fontSize: 11 }}
          >
            <Sparkles size={11} />
            <span>StackBlitz</span>
          </button>
        </div>
      </div>

      {/* Feature notice banner */}
      <div style={{ padding: '8px 14px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
          <span>Real Server-Side Compiler & Terminal (OneCompiler Engine) &bull; Active Language: <strong style={{ color: 'var(--text)' }}>{selectedLangObj.label}</strong></span>
        </div>
        <span style={{ color: 'var(--text-subtle)' }}>Full stdin support, execution timing, and compiler error logs</span>
      </div>

      {/* Real Live Compiler Iframe */}
      <div className="compiler-iframe-wrapper">
        <iframe
          key={`${selectedLangObj.embedKey}-${theme}`}
          src={iframeSrc}
          className="compiler-iframe"
          title={`${selectedLangObj.label} Online Compiler`}
          allow="clipboard-write; clipboard-read"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
        />
      </div>
    </div>
  );
}
