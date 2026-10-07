import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{y as t}from"./vendor-charts-5HiVfdAA.js";import{t as n}from"./vendor-react-BPqjFRnB.js";import{B as r,C as i,K as a,U as o,f as s,m as c,nt as l,y as u}from"./vendor-icons-DG8fX4E9.js";import{b as d,o as f}from"./index-BrL2Tydc.js";var p=e(t(),1);function m(e){let t=e.split(`
`),n=[],r=[];for(let e=0;e<t.length;e++){let i=t[e];if(!i.trim()||i.trim().startsWith(`#`)||/^\s*(import\s+|from\s+)/.test(i))continue;let a=i.search(/\S|$/),o=i.trim(),s=/^def\s+(\w+)\s*\((.*?)\)\s*:/.test(o),c=/^for\s+(.*?)\s+in\s+(.*?)\s*:/.test(o),l=/^while\s+(.*?)\s*:/.test(o),u=/^if\s+(.*?)\s*:/.test(o),d=/^elif\s+(.*?)\s*:/.test(o),f=/^else\s*:/.test(o);for(;r.length>0;){let e=r[r.length-1];if(a<=e.indent){if((d||f)&&a===e.indent){r.pop();break}r.pop(),n.push(` `.repeat(e.indent)+`}`)}else break}for(o=o.replace(/\bprint\s*\(/g,`__print(`),o=o.replace(/f"([^"]*)"/g,(e,t)=>"`"+t.replace(/\{([^}]+)\}/g,(e,t)=>{let[n,r]=t.split(`:`);return r&&r.endsWith(`f`)?`\${Number(${n}).toFixed(${parseInt(r.replace(/\.?f/,``))||2})}`:`\${${n}}`})+"`"),o=o.replace(/f'([^']*)'/g,(e,t)=>"`"+t.replace(/\{([^}]+)\}/g,(e,t)=>{let[n,r]=t.split(`:`);return r&&r.endsWith(`f`)?`\${Number(${n}).toFixed(${parseInt(r.replace(/\.?f/,``))||2})}`:`\${${n}}`})+"`"),o=o.replace(/\bTrue\b/g,`true`).replace(/\bFalse\b/g,`false`).replace(/\bNone\b/g,`null`).replace(/\band\b/g,`&&`).replace(/\bor\b/g,`||`).replace(/\bnot\b/g,`!`);o.includes(`//`);){let e=o;if(o=o.replace(/(\(.*?\)|[a-zA-Z0-9_.]+)\s*\/\/\s*(\(.*?\)|[a-zA-Z0-9_.]+)/g,`Math.floor(($1) / ($2))`),o===e){o=o.replace(/\/\//g,`/`);break}}if(/^[a-zA-Z_]\w*\s*=\s*(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/.test(o)?o=o.replace(/^([a-zA-Z_]\w*\s*=\s*)(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/,`$1(($3) ? ($2) : ($4))`):/(.+?)\s+if\s+(.+?)\s+else\s+(.+)/.test(o)&&(o=o.replace(/(.+?)\s+if\s+(.+?)\s+else\s+(.+)/,`(($2) ? ($1) : ($3))`)),o=o.replace(/\[\s*:\s*([a-zA-Z0-9_]+)\s*\]/g,`.slice(0, $1)`),o=o.replace(/\[\s*([a-zA-Z0-9_]+)\s*:\s*\]/g,`.slice($1)`),o=o.replace(/\.sort\(key=lambda\s+(\w+):\s*\1\[(\d+)\]\)/g,`.sort((a, b) => a[$2] - b[$2])`),s)o=o.replace(/^def\s+(\w+)\s*\((.*?)\)\s*:/,`function $1($2) {`),r.push({indent:a,type:`def`});else if(c){let e=o.match(/^for\s+(.*?)\s+in\s+(.*?)\s*:/),t=e[1].trim(),n=e[2].trim();o=t.includes(`,`)?`for (const [${t}] of ${n}) {`:`for (const ${t} of ${n}) {`,r.push({indent:a,type:`for`})}else l?(o=o.replace(/^while\s+(.*?)\s*:/,`while ($1) {`),r.push({indent:a,type:`while`})):u?(o=o.replace(/^if\s+(.*?)\s*:$/,`if ($1) {`),r.push({indent:a,type:`if`})):d?(o=o.replace(/^elif\s+(.*?)\s*:$/,`} else if ($1) {`),r.push({indent:a,type:`elif`})):f?(o=`} else {`,r.push({indent:a,type:`else`})):(o=o.replace(/\[\s*(.+?)\s+for\s+([a-zA-Z0-9_,\s]+)\s+in\s+(.+?)\s*(?:if\s+(.+?))?\s*\]/g,(e,t,n,r,i)=>{let a=n.includes(`,`)?`([${n}])`:n;return i?`(${r}).filter(${a} => ${i}).map(${a} => ${t})`:`(${r}).map(${a} => ${t})`}),/^[a-zA-Z_]\w*\s*=\s*[^=]/.test(o)&&(o=`var `+o));let p=o.endsWith(`{`)||o.endsWith(`}`)?``:`;`;n.push(` `.repeat(a)+o+p)}for(;r.length>0;){let e=r.pop();n.push(` `.repeat(e.indent)+`}`)}return n.join(`
`)}var h=!1,g=null;function _(){return h?Promise.resolve(!0):g||(g=new Promise(e=>{if(typeof window>`u`)return e(!1);if(window.Sk)return h=!0,e(!0);let t=document.createElement(`script`);t.src=`https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js`,t.async=!0;let n=document.createElement(`script`);n.src=`https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js`,n.async=!0,t.onload=()=>{document.head.appendChild(n)},n.onload=()=>{h=!0,e(!0)},t.onerror=()=>e(!1),n.onerror=()=>e(!1),document.head.appendChild(t),setTimeout(()=>e(!1),3e3)}),g)}function v(e){let t=[],n=(...e)=>{t.push(e.map(e=>e==null?`None`:e===!0?`True`:e===!1?`False`:Array.isArray(e)?`[`+e.map(e=>typeof e==`string`?`'${e}'`:e).join(`, `)+`]`:typeof e==`object`?JSON.stringify(e):String(e)).join(` `))};try{let r=m(e);return Function(`__print`,`
      const __output = [];
      const print = (...args) => __print(...args);
      const len = (x) => (x ? (x.length !== undefined ? x.length : Object.keys(x).length) : 0);
      const sum = (arr) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0);
      const max = (...args) => {
        const arr = Array.isArray(args[0]) ? args[0] : args;
        return Math.max(...arr);
      };
      const min = (...args) => {
        const arr = Array.isArray(args[0]) ? args[0] : args;
        return Math.min(...arr);
      };
      const abs = Math.abs;
      const round = (val, dec = 0) => Number(Math.round(val + 'e' + dec) + 'e-' + dec);
      const range = (start, stop, step = 1) => {
        if (stop === undefined) { stop = start; start = 0; }
        const res = [];
        for (let i = start; step > 0 ? i < stop : i > stop; i += step) res.push(i);
        return res;
      };
      const zip = (...arrays) => {
        const minLen = Math.min(...arrays.map(a => a.length));
        const res = [];
        for (let i = 0; i < minLen; i++) res.push(arrays.map(a => a[i]));
        return res;
      };
      const sorted = (arr, keyFn) => {
        const copy = [...arr];
        return keyFn ? copy.sort((a, b) => (keyFn(a) > keyFn(b) ? 1 : -1)) : copy.sort((a,b) => (a > b ? 1 : -1));
      };
      const math = {
        sqrt: Math.sqrt,
        exp: Math.exp,
        log: Math.log,
        sin: Math.sin,
        cos: Math.cos,
        pi: Math.PI,
        e: Math.E,
        floor: Math.floor,
        ceil: Math.ceil
      };
      const np = {
        array: (data) => data,
        zeros: (n) => new Array(n).fill(0),
        ones: (n) => new Array(n).fill(1),
        sum: (arr) => sum(arr),
        mean: (arr) => sum(arr) / (arr.length || 1),
        max: (arr) => max(arr),
        min: (arr) => min(arr),
        sqrt: (val) => (Array.isArray(val) ? val.map(Math.sqrt) : Math.sqrt(val)),
        exp: (val) => (Array.isArray(val) ? val.map(Math.exp) : Math.exp(val)),
        dot: (a, b) => a.reduce((acc, val, i) => acc + val * b[i], 0),
        random: {
          seed: () => {},
          randn: () => Math.random() * 2 - 1,
          rand: () => Math.random()
        }
      };
    
`+r)(n),t.join(`
`)||`(no output)`}catch(e){return`Execution error: ${e.message}`}}async function y(e){return typeof window<`u`&&window.Sk?new Promise(t=>{let n=[],r=window.Sk;r.configure({output:e=>n.push(e),read:e=>{if(r.builtinFiles===void 0||r.builtinFiles.files[e]===void 0)throw Error(`File not found: '${e}'`);return r.builtinFiles.files[e]}}),r.misceval.asyncToPromise(()=>r.importMainWithBody(`<stdin>`,!1,e,!0)).then(()=>{t(n.join(``)||`(no output)`)}).catch(n=>{let r=v(e);r.startsWith(`Execution error`)?t(n.toString()):t(r)})}):v(e)}var b=n(),x=[{key:`python`,label:`Python 3`,icon:`🐍`,embedKey:`python`},{key:`javascript`,label:`JavaScript / Node`,icon:`⚡`,embedKey:`javascript`},{key:`cpp`,label:`C++ 20`,icon:`⚙️`,embedKey:`cpp`},{key:`java`,label:`Java 17`,icon:`☕`,embedKey:`java`},{key:`c`,label:`C (GCC)`,icon:`🔧`,embedKey:`c`},{key:`go`,label:`Go (Golang)`,icon:`🔷`,embedKey:`go`},{key:`rust`,label:`Rust`,icon:`🦀`,embedKey:`rust`}],S={python:`# Python 3 — Real Online Compiler with VS Code Tools
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
`,javascript:`// JavaScript (Node.js) — Real Cloud Execution
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
`,cpp:`// C++ 20 — Real Compiler with Full STL Support
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
`,java:`// Java 17 — Standard Compilation Environment
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
`,c:`// C (GCC) — Low-Level Compilation
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
`,go:`// Go (Golang) — Fast Concurrent Language
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
`,rust:`// Rust — Memory-Safe Systems Language
fn main() {
    let skills = vec!["PyTorch", "Kubernetes", "Rust", "PostgreSQL"];
    println!("Compiled Rust Binary Output:");
    for (idx, skill) in skills.iter().enumerate() {
        println!("{}. Mastering {}", idx + 1, skill);
    }
}
`};function C(){let[e,t]=(0,p.useState)(`python`),[n,i]=(0,p.useState)(!1),s=d(e=>e.theme),u=d(e=>e.addToast),f=x.find(t=>t.key===e)||x[0],m=()=>{let t=S[e]||``;navigator.clipboard.writeText(t),i(!0),u(`${f.label} template copied to clipboard!`,`success`),setTimeout(()=>i(!1),2e3)},h=()=>{window.open(`https://vscode.dev`,`_blank`),u(`Opening VS Code Online (vscode.dev) in a new tab 🚀`,`info`)},g=()=>{window.open(`https://github.dev`,`_blank`),u(`Opening GitHub Web Editor (github.dev) 🚀`,`info`)},_=()=>{window.open(`https://stackblitz.com`,`_blank`),u(`Opening StackBlitz WebContainer IDE ⚡`,`info`)},v=`https://onecompiler.com/embed/${f.embedKey}?theme=${s===`light`?`light`:`dark`}&listenToEvents=true&hideLanguageSelection=false&hideNew=true`;return(0,b.jsxs)(`div`,{className:`cloud-compiler-container`,children:[(0,b.jsxs)(`div`,{className:`cloud-compiler-toolbar`,children:[(0,b.jsx)(`div`,{className:`compiler-lang-group`,children:x.map(n=>(0,b.jsxs)(`button`,{type:`button`,className:`compiler-lang-btn ${e===n.key?`active`:``}`,onClick:()=>{t(n.key),u(`Switched to ${n.label} compiler`,`info`)},children:[(0,b.jsx)(`span`,{style:{marginRight:4},children:n.icon}),n.label]},n.key))}),(0,b.jsxs)(`div`,{className:`compiler-tools-group`,children:[(0,b.jsxs)(`button`,{type:`button`,className:`btn-chip`,onClick:m,title:`Copy starter code for this language`,style:{fontSize:11},children:[n?(0,b.jsx)(l,{size:12,color:`var(--success)`}):(0,b.jsx)(o,{size:12}),(0,b.jsx)(`span`,{children:n?`Copied!`:`Copy Code`})]}),(0,b.jsxs)(`button`,{type:`button`,className:`vscode-launch-btn`,onClick:h,title:`Open full Visual Studio Code in your browser (official vscode.dev)`,children:[(0,b.jsx)(a,{size:13}),(0,b.jsx)(`span`,{children:`Open in VS Code (Web) ↗`})]}),(0,b.jsxs)(`button`,{type:`button`,className:`btn-chip`,onClick:g,title:`Open in GitHub Codespaces Web Editor`,style:{fontSize:11},children:[(0,b.jsx)(r,{size:11}),(0,b.jsx)(`span`,{children:`github.dev`})]}),(0,b.jsxs)(`button`,{type:`button`,className:`btn-chip`,onClick:_,title:`Open in StackBlitz Cloud IDE`,style:{fontSize:11},children:[(0,b.jsx)(c,{size:11}),(0,b.jsx)(`span`,{children:`StackBlitz`})]})]})]}),(0,b.jsxs)(`div`,{style:{padding:`8px 14px`,background:`var(--bg-subtle)`,borderBottom:`1px solid var(--border)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,flexWrap:`wrap`,gap:6,fontSize:11},children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:6,color:`var(--text-muted)`},children:[(0,b.jsx)(`span`,{style:{width:8,height:8,borderRadius:`50%`,background:`var(--success)`}}),(0,b.jsxs)(`span`,{children:[`Real Server-Side Compiler & Terminal (OneCompiler Engine) • Active Language: `,(0,b.jsx)(`strong`,{style:{color:`var(--text)`},children:f.label})]})]}),(0,b.jsx)(`span`,{style:{color:`var(--text-subtle)`},children:`Full stdin support, execution timing, and compiler error logs`})]}),(0,b.jsx)(`div`,{className:`compiler-iframe-wrapper`,children:(0,b.jsx)(`iframe`,{src:v,className:`compiler-iframe`,title:`${f.label} Online Compiler`,allow:`clipboard-write; clipboard-read`,sandbox:`allow-scripts allow-same-origin allow-popups allow-forms allow-modals`},`${f.embedKey}-${s}`)})]})}var w={hello:`# Python 3: Hello World & Basics
print("hello world")
name = "Alex"
skills = ["Python", "SQL", "Machine Learning"]
print(f"Welcome to SkillBridge, {name}!")
print("Your active track has", len(skills), "key skills:")
for s in skills:
    print("  →", s)`,ml:`# ML: Sigmoid Function
import numpy as np

def sigmoid(x):
    return 1 / (1 + 2.718**(-x))

values = [-2, -1, 0, 1, 2]
print("Sigmoid values:")
for v in values:
    sig = sigmoid(v)
    print(f"  sigmoid({v}) = {sig:.4f}")`,pandas:`# Pandas-style operations (simulated)
data = {'name': ['Alice', 'Bob', 'Charlie'], 'score': [92, 78, 85]}
scores = data['score']
mean_score = sum(scores) / len(scores)
max_score = max(scores)
print(f"Mean: {mean_score:.1f}, Max: {max_score}")
above_avg = [n for n, s in zip(data['name'], scores) if s >= mean_score]
print(f"Above average: {above_avg}")`,algo:`# Binary Search Algorithm
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
print(f"Found at index: {result}")`,knn:`# K-Nearest Neighbors (step by step)
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
print(f"Predicted class: {pred}")`};function T(){let[e,t]=(0,p.useState)(w.hello),[n,r]=(0,p.useState)(`# Output appears here
# Click Run to execute`),[a,o]=(0,p.useState)(!1),[c,l]=(0,p.useState)(`hello`),f=d(e=>e.addToast);(0,p.useEffect)(()=>{_()},[]);let m=async()=>{o(!0);try{let t=await y(e);r(t)}catch(e){r(`Execution error: ${e.message}`)}finally{o(!1)}},h=e=>{t(w[e]),l(e),r(`# Click Run to execute`),f(`Loaded ${e} preset`,`info`)};return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{style:{display:`flex`,gap:8,marginBottom:12,flexWrap:`wrap`},children:Object.keys(w).map(e=>(0,b.jsx)(`button`,{className:`btn-chip ${c===e?`active`:``}`,onClick:()=>h(e),children:e.charAt(0).toUpperCase()+e.slice(1)},e))}),(0,b.jsxs)(`div`,{className:`lab-split-pane`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`},children:[(0,b.jsxs)(`div`,{className:`lab-toolbar`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,b.jsx)(`span`,{style:{width:8,height:8,borderRadius:`50%`,background:`#EC4899`}}),(0,b.jsx)(`span`,{style:{width:8,height:8,borderRadius:`50%`,background:`#F59E0B`}}),(0,b.jsx)(`span`,{style:{width:8,height:8,borderRadius:`50%`,background:`#10B981`}}),(0,b.jsx)(`span`,{style:{fontSize:11,color:`var(--text-subtle)`,marginLeft:4},children:`python`})]}),(0,b.jsxs)(`div`,{style:{display:`flex`,gap:6},children:[(0,b.jsxs)(`button`,{className:`btn btn-sm btn-secondary`,onClick:()=>t(``),style:{gap:4},children:[(0,b.jsx)(u,{size:11}),` Clear`]}),(0,b.jsxs)(`button`,{id:`python-run-btn`,className:`btn btn-sm btn-primary`,onClick:m,disabled:a,style:{gap:4},children:[a?(0,b.jsx)(s,{size:11}):(0,b.jsx)(i,{size:11}),` `,a?`Running...`:`Run`]})]})]}),(0,b.jsx)(`textarea`,{className:`lab-editor-area`,style:{flex:1,minHeight:300},value:e,onChange:e=>t(e.target.value),spellCheck:!1,placeholder:`Write Python code here...`})]}),(0,b.jsxs)(`div`,{className:`lab-output-pane`,children:[(0,b.jsx)(`div`,{className:`lab-toolbar`,children:(0,b.jsx)(`span`,{style:{fontSize:11,color:`var(--text-subtle)`},children:`Output Console`})}),(0,b.jsx)(`div`,{className:`lab-terminal`,style:{flex:1,minHeight:300},children:n})]})]}),(0,b.jsx)(`div`,{style:{fontSize:10,color:`var(--text-subtle)`,marginTop:8},children:`Note: Browser-based Python simulation — supports print, loops, functions, basic math, and data structures.`})]})}var E={employees:[{id:1,name:`Alice`,dept:`Engineering`,salary:95e3,years:4},{id:2,name:`Bob`,dept:`Data`,salary:88e3,years:3},{id:3,name:`Charlie`,dept:`Engineering`,salary:102e3,years:6},{id:4,name:`Diana`,dept:`Product`,salary:78e3,years:2},{id:5,name:`Eve`,dept:`Data`,salary:93e3,years:5},{id:6,name:`Frank`,dept:`Engineering`,salary:115e3,years:8},{id:7,name:`Grace`,dept:`HR`,salary:62e3,years:1},{id:8,name:`Hank`,dept:`Data`,salary:97e3,years:4}],jobs:[{id:1,title:`ML Engineer`,company:`TechCo`,salary:105e3,city:`Bengaluru`,skills:`Python,PyTorch,Docker`},{id:2,title:`Data Scientist`,company:`DataCorp`,salary:92e3,city:`Mumbai`,skills:`Python,SQL,Statistics`},{id:3,title:`MLOps Engineer`,company:`CloudSys`,salary:98e3,city:`Hyderabad`,skills:`Docker,K8s,Python`},{id:4,title:`Data Engineer`,company:`Flipkart`,salary:88e3,city:`Bengaluru`,skills:`SQL,Spark,Python`},{id:5,title:`AI Researcher`,company:`DeepAI`,salary:13e4,city:`Bengaluru`,skills:`PyTorch,Mathematics,Research`}]};function D(e,t){e.trim().toUpperCase();try{let n=e.match(/FROM\s+(\w+)/i);if(!n)return{error:`No FROM clause found.`};let r=n[1].toLowerCase(),i=t[r];if(!i)return{error:`Table '${r}' not found. Available: ${Object.keys(t).join(`, `)}`};let a=e.match(/WHERE\s+(.+?)(?:\s+GROUP BY|\s+ORDER BY|\s+LIMIT|$)/i);if(a){let[e,t,n]=a[1].trim().split(/\s*(=|>|<|!=|LIKE)\s*/i),r=e.trim().toLowerCase(),o=parseFloat(n?.replace(/['"]/g,``)),s=n?.replace(/['"]/g,``);i=i.filter(e=>{let n=e[r];return t===`=`?String(n)===s||n===o:t===`>`?n>o:t===`<`?n<o:t===`!=`?n!==s&&n!==o:t?.toUpperCase()!==`LIKE`||String(n).toLowerCase().includes(s.replace(/%/g,``).toLowerCase())})}let o=e.match(/GROUP BY\s+(\w+)/i);if(o){let t=o[1].toLowerCase(),n={};i.forEach(e=>{let r=e[t];n[r]||(n[r]=[]),n[r].push(e)});let r=e.match(/(AVG|COUNT|SUM|MAX|MIN)\s*\(\s*(\w+|\*)\s*\)/i);i=Object.entries(n).map(([e,n])=>{let i={[t]:e};if(r){let e=r[1].toUpperCase(),t=r[2].toLowerCase(),a=t===`*`?n.map((e,t)=>1):n.map(e=>e[t]||0);e===`AVG`&&(i[`avg_${t}`]=Math.round(a.reduce((e,t)=>e+t,0)/a.length)),e===`COUNT`&&(i.count=a.length),e===`SUM`&&(i[`sum_${t}`]=a.reduce((e,t)=>e+t,0)),e===`MAX`&&(i[`max_${t}`]=Math.max(...a)),e===`MIN`&&(i[`min_${t}`]=Math.min(...a))}return i})}let s=e.match(/ORDER BY\s+(\w+)(?:\s+(ASC|DESC))?/i);if(s){let e=s[1].toLowerCase(),t=s[2]?.toUpperCase()===`DESC`?-1:1;i=[...i].sort((n,r)=>n[e]>r[e]?t:n[e]<r[e]?-t:0)}let c=e.match(/LIMIT\s+(\d+)/i);c&&(i=i.slice(0,parseInt(c[1])));let l=e.match(/SELECT\s+(.+?)\s+FROM/is);if(l){let e=l[1].trim();if(e!==`*`){let t=e.split(`,`).map(e=>e.trim().toLowerCase());i=i.map(e=>{let n={};return t.forEach(t=>{let r=t.replace(/\s+as\s+\w+/i,``).trim();if(e[r]!==void 0)n[r]=e[r];else{let t=Object.keys(e).find(e=>e.toLowerCase()===r);t&&(n[t]=e[t])}}),n})}}return{rows:i,cols:i.length?Object.keys(i[0]):[]}}catch(e){return{error:`Query error: ${e.message}`}}}function O(){let[e,t]=(0,p.useState)(`SELECT dept, COUNT(*) as count, AVG(salary) as avg_salary
FROM employees
GROUP BY dept
ORDER BY avg_salary DESC`),[n,r]=(0,p.useState)(null),a=d(e=>e.addToast);return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{style:{fontSize:10,fontWeight:800,letterSpacing:`0.07em`,color:`var(--text-subtle)`,textTransform:`uppercase`,marginBottom:8},children:`Tables: employees, jobs (use SELECT, WHERE, GROUP BY, ORDER BY, LIMIT)`}),(0,b.jsx)(`div`,{style:{display:`flex`,gap:6,marginBottom:10,flexWrap:`wrap`},children:[{label:`Dept Stats`,q:`SELECT dept, COUNT(*) as count, AVG(salary) as avg_salary
FROM employees
GROUP BY dept
ORDER BY avg_salary DESC`},{label:`Senior Staff`,q:`SELECT name, dept, salary
FROM employees
WHERE salary > 90000
ORDER BY salary DESC`},{label:`Top Jobs`,q:`SELECT title, company, salary, city
FROM jobs
ORDER BY salary DESC
LIMIT 3`},{label:`High Earners`,q:`SELECT name, salary, years
FROM employees
WHERE salary > 95000
ORDER BY salary DESC`}].map(e=>(0,b.jsx)(`button`,{className:`btn-chip`,onClick:()=>t(e.q),children:e.label},e.label))}),(0,b.jsx)(`textarea`,{id:`sql-editor`,className:`code-editor`,value:e,onChange:e=>t(e.target.value),style:{minHeight:120,marginBottom:10},placeholder:`SELECT * FROM employees WHERE salary > 90000 ORDER BY salary DESC`}),(0,b.jsxs)(`button`,{id:`sql-run-btn`,className:`btn btn-primary btn-sm`,onClick:()=>{let t=D(e,E);r(t),t.error?a(t.error,`error`):a(`${t.rows.length} rows returned`,`success`)},style:{marginBottom:12},children:[(0,b.jsx)(i,{size:12}),` Run Query`]}),n&&(n.error?(0,b.jsx)(`div`,{style:{color:`var(--danger)`,fontSize:13,padding:`10px 14px`,background:`rgba(239,68,68,0.1)`,borderRadius:6},children:n.error}):(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{style:{fontSize:11,color:`var(--text-subtle)`,marginBottom:6},children:[n.rows.length,` rows returned`]}),(0,b.jsx)(`div`,{style:{overflowX:`auto`},children:(0,b.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:12},children:[(0,b.jsx)(`thead`,{children:(0,b.jsx)(`tr`,{children:n.cols.map(e=>(0,b.jsx)(`th`,{style:{textAlign:`left`,padding:`6px 12px`,background:`rgba(255,255,255,0.05)`,borderBottom:`1px solid var(--border)`,color:`var(--text-muted)`,fontWeight:700,fontSize:11,letterSpacing:`0.04em`,textTransform:`uppercase`},children:e},e))})}),(0,b.jsx)(`tbody`,{children:n.rows.map((e,t)=>(0,b.jsx)(`tr`,{style:{borderBottom:`1px solid rgba(255,255,255,0.04)`},children:n.cols.map(t=>(0,b.jsx)(`td`,{style:{padding:`7px 12px`,color:`var(--text)`},children:String(e[t]??`-`)},t))},t))})]})})]}))]})}function k(){let[e,t]=(0,p.useState)(f.cv),[n,r]=(0,p.useState)(`cv`),i=d(e=>e.addToast);return(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{style:{display:`flex`,gap:6,marginBottom:12,flexWrap:`wrap`,alignItems:`center`},children:[(0,b.jsx)(`span`,{style:{fontSize:11,fontWeight:700,color:`var(--text-subtle)`,textTransform:`uppercase`},children:`Templates:`}),Object.keys(f).map(e=>(0,b.jsx)(`button`,{type:`button`,className:`btn-chip ${n===e?`active`:``}`,onClick:()=>{t(f[e]),r(e)},children:e.charAt(0).toUpperCase()+e.slice(1)},e)),(0,b.jsxs)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:6,flexWrap:`wrap`},children:[(0,b.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>{window.open(`https://www.overleaf.com/project`,`_blank`),i(`Opening Overleaf — paste your .tex there`,`info`)},children:`Open in Overleaf ↗`}),(0,b.jsx)(`button`,{type:`button`,id:`latex-download-btn`,className:`btn btn-primary btn-sm`,onClick:()=>{let t=new Blob([e],{type:`text/plain`}),r=URL.createObjectURL(t),a=document.createElement(`a`);a.href=r,a.download=`skillbridge_${n}.tex`,a.click(),URL.revokeObjectURL(r),i(`.tex file downloaded — compile with pdflatex or Overleaf`,`success`)},children:`Download .tex`})]})]}),(0,b.jsxs)(`div`,{className:`lab-split-pane`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`},children:[(0,b.jsxs)(`div`,{className:`lab-toolbar`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,b.jsx)(`span`,{style:{width:8,height:8,borderRadius:`50%`,background:`#3B82F6`}}),(0,b.jsxs)(`span`,{style:{fontSize:11,color:`var(--text-subtle)`},children:[`LaTeX Source (`,n,`.tex)`]})]}),(0,b.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>{t(f[n]),i(`Template reset`,`info`)},style:{fontSize:10,padding:`2px 8px`},children:`Reset`})]}),(0,b.jsx)(`textarea`,{id:`latex-editor`,className:`lab-editor-area`,value:e,onChange:e=>t(e.target.value),style:{minHeight:380},spellCheck:!1})]}),(0,b.jsxs)(`div`,{className:`lab-output-pane`,children:[(0,b.jsxs)(`div`,{className:`lab-toolbar`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,b.jsx)(`span`,{style:{width:8,height:8,borderRadius:`50%`,background:`var(--success)`}}),(0,b.jsx)(`span`,{style:{fontSize:11,fontWeight:600,color:`var(--text)`},children:`Document Preview (Typeset View)`})]}),(0,b.jsx)(`span`,{className:`badge badge-brand`,style:{fontSize:9},children:`A4 Layout`})]}),(0,b.jsx)(`div`,{className:`latex-preview-container`,children:(0,b.jsxs)(`div`,{className:`latex-document-sheet`,children:[(0,b.jsxs)(`div`,{className:`latex-doc-header`,children:[(0,b.jsx)(`h1`,{className:`latex-doc-title`,children:`Alex Mercer`}),(0,b.jsx)(`div`,{className:`latex-doc-contact`,children:`alex.mercer@email.com • +91 98765 43210 • Bengaluru, India`})]}),(0,b.jsxs)(`div`,{className:`latex-doc-section`,children:[(0,b.jsx)(`div`,{className:`latex-doc-heading`,children:`Professional Summary`}),(0,b.jsx)(`p`,{className:`latex-doc-p`,children:`Software & Machine Learning Engineer with 4+ years building high-throughput ML systems and automated pipelines. Experienced in PyTorch, Docker, Kubernetes, and AWS deployment.`})]}),(0,b.jsxs)(`div`,{className:`latex-doc-section`,children:[(0,b.jsx)(`div`,{className:`latex-doc-heading`,children:`Technical Competencies`}),(0,b.jsxs)(`ul`,{className:`latex-doc-list`,children:[(0,b.jsxs)(`li`,{children:[(0,b.jsx)(`strong`,{children:`Languages:`}),` Python, SQL, C++, Bash`]}),(0,b.jsxs)(`li`,{children:[(0,b.jsx)(`strong`,{children:`Machine Learning:`}),` PyTorch, Scikit-learn, MLOps, Transformers`]}),(0,b.jsxs)(`li`,{children:[(0,b.jsx)(`strong`,{children:`Cloud & DevOps:`}),` Docker, Kubernetes, AWS (S3, EC2, SageMaker), CI/CD`]}),(0,b.jsxs)(`li`,{children:[(0,b.jsx)(`strong`,{children:`Data Engineering:`}),` Apache Spark, Kafka, PostgreSQL, Redis`]})]})]}),(0,b.jsxs)(`div`,{className:`latex-doc-section`,children:[(0,b.jsx)(`div`,{className:`latex-doc-heading`,children:`Professional Experience`}),(0,b.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,fontSize:12,fontWeight:700,marginTop:4},children:[(0,b.jsx)(`span`,{children:`Senior ML Platform Engineer • Tech Corp`}),(0,b.jsx)(`span`,{style:{color:`var(--text-subtle)`},children:`2022 – Present`})]}),(0,b.jsxs)(`ul`,{className:`latex-doc-list`,children:[(0,b.jsx)(`li`,{children:`Architected real-time feature retrieval serving 20M daily queries with p99 latency < 25ms.`}),(0,b.jsx)(`li`,{children:`Reduced training compute costs by 34% through mixed-precision PyTorch distributed training.`})]})]})]})})]})]}),(0,b.jsxs)(`div`,{style:{marginTop:10,fontSize:11,color:`var(--text-subtle)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,flexWrap:`wrap`,gap:6},children:[(0,b.jsxs)(`span`,{children:[`Tip: Export as `,(0,b.jsx)(`code`,{children:`.tex`}),` and paste into Overleaf to compile with official pdflatex or XeLaTeX engines.`]}),(0,b.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>{navigator.clipboard.writeText(e),i(`LaTeX source copied to clipboard!`,`success`)},style:{fontSize:11},children:`Copy .tex Code`})]})]})}function A(){let[e,t]=(0,p.useState)(`cloud-compiler`);return(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{className:`page-header`,children:(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h1`,{className:`page-title`,children:`Interactive Code Labs & Cloud IDE`}),(0,b.jsx)(`p`,{className:`page-subtitle`,children:`Real multi-language online compiler · VS Code Web integration · In-browser Python & SQL engines · LaTeX studio`})]})}),(0,b.jsx)(`div`,{className:`tab-list`,children:[{key:`cloud-compiler`,label:`⚡ VS Code & Real Compiler`},{key:`python`,label:`Python Lab`},{key:`sql`,label:`SQL Playground`},{key:`latex`,label:`LaTeX Resume Builder`}].map(n=>(0,b.jsx)(`button`,{className:`tab-btn ${e===n.key?`active`:``}`,onClick:()=>t(n.key),children:n.label},n.key))}),(0,b.jsxs)(`div`,{className:`card`,style:{padding:e===`cloud-compiler`?0:void 0,overflow:`hidden`},children:[e===`cloud-compiler`&&(0,b.jsx)(C,{}),e===`python`&&(0,b.jsx)(T,{}),e===`sql`&&(0,b.jsx)(O,{}),e===`latex`&&(0,b.jsx)(k,{})]})]})}export{A as default};