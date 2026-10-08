import { transpilePythonToJS } from './pythonTranspiler.js';

let skulptLoaded = false;
let skulptLoadingPromise = null;

// Dynamically load Skulpt scripts for full Python 3 execution in the browser
export function loadSkulpt() {
  if (skulptLoaded) return Promise.resolve(true);
  if (skulptLoadingPromise) return skulptLoadingPromise;

  skulptLoadingPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Sk) {
      skulptLoaded = true;
      return resolve(true);
    }

    const s1 = document.createElement('script');
    s1.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
    s1.async = true;

    const s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';
    s2.async = true;

    s1.onload = () => {
      document.head.appendChild(s2);
    };

    s2.onload = () => {
      skulptLoaded = true;
      resolve(true);
    };

    s1.onerror = () => resolve(false);
    s2.onerror = () => resolve(false);

    document.head.appendChild(s1);

    setTimeout(() => resolve(false), 3000);
  });

  return skulptLoadingPromise;
}

export function runBuiltinPython(code) {
  const output = [];
  const __print = (...args) => {
    output.push(
      args
        .map((a) => {
          if (a === null || a === undefined) return 'None';
          if (a === true) return 'True';
          if (a === false) return 'False';
          if (Array.isArray(a)) return '[' + a.map((x) => (typeof x === 'string' ? `'${x}'` : x)).join(', ') + ']';
          if (typeof a === 'object') return JSON.stringify(a);
          return String(a);
        })
        .join(' ')
    );
  };

  try {
    const transpiled = transpilePythonToJS(code);

    const runtimeHelpers = `
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
    `;

    const fn = new Function('__print', runtimeHelpers + '\n' + transpiled);
    fn(__print);

    return output.join('\n') || '(no output)';
  } catch (err) {
    return `Execution error: ${err.message}`;
  }
}

export async function executePython(code) {
  if (typeof window !== 'undefined' && window.Sk) {
    return new Promise((resolve) => {
      const output = [];
      const Sk = window.Sk;

      Sk.configure({
        output: (text) => output.push(text),
        read: (x) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined) {
            throw new Error(`File not found: '${x}'`);
          }
          return Sk.builtinFiles['files'][x];
        },
      });

      const promise = Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody('<stdin>', false, code, true)
      );

      promise
        .then(() => {
          resolve(output.join('') || '(no output)');
        })
        .catch((err) => {
          const fallbackRes = runBuiltinPython(code);
          if (!fallbackRes.startsWith('Execution error')) {
            resolve(fallbackRes);
          } else {
            resolve(err.toString());
          }
        });
    });
  }

  return runBuiltinPython(code);
}
