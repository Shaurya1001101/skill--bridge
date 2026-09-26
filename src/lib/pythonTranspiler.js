/**
 * Clean, standard block-indentation transpiler for Python in the browser.
 */

export function transpilePythonToJS(code) {
  const lines = code.split('\n');
  const jsLines = [];
  const blockStack = []; // { indent, type }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;

    // Skip python imports
    if (/^\s*(import\s+|from\s+)/.test(rawLine)) continue;

    const indent = rawLine.search(/\S|$/);
    let trimmed = rawLine.trim();

    // Check for block openers / closers
    const isDef = /^def\s+(\w+)\s*\((.*?)\)\s*:/.test(trimmed);
    const isForIn = /^for\s+(.*?)\s+in\s+(.*?)\s*:/.test(trimmed);
    const isWhile = /^while\s+(.*?)\s*:/.test(trimmed);
    const isIf = /^if\s+(.*?)\s*:/.test(trimmed);
    const isElif = /^elif\s+(.*?)\s*:/.test(trimmed);
    const isElse = /^else\s*:/.test(trimmed);

    // If current line is at or below the block's indentation, close previous blocks
    while (blockStack.length > 0) {
      const top = blockStack[blockStack.length - 1];
      if (indent <= top.indent) {
        if ((isElif || isElse) && indent === top.indent) {
          blockStack.pop();
          break;
        }
        blockStack.pop();
        jsLines.push(' '.repeat(top.indent) + '}');
      } else {
        break;
      }
    }

    // Convert print(...) to __print(...)
    trimmed = trimmed.replace(/\bprint\s*\(/g, '__print(');

    // Python f-strings
    trimmed = trimmed.replace(/f"([^"]*)"/g, (_, s) => {
      const parsed = s.replace(/\{([^}]+)\}/g, (__, expr) => {
        const [varName, fmt] = expr.split(':');
        if (fmt && fmt.endsWith('f')) {
          const dec = parseInt(fmt.replace(/\.?f/, '')) || 2;
          return `\${Number(${varName}).toFixed(${dec})}`;
        }
        return `\${${varName}}`;
      });
      return '`' + parsed + '`';
    });

    trimmed = trimmed.replace(/f'([^']*)'/g, (_, s) => {
      const parsed = s.replace(/\{([^}]+)\}/g, (__, expr) => {
        const [varName, fmt] = expr.split(':');
        if (fmt && fmt.endsWith('f')) {
          const dec = parseInt(fmt.replace(/\.?f/, '')) || 2;
          return `\${Number(${varName}).toFixed(${dec})}`;
        }
        return `\${${varName}}`;
      });
      return '`' + parsed + '`';
    });

    // Python keywords and operators
    trimmed = trimmed
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\b/g, '!');

    // Handle integer division // first so ternary expressions can use it cleanly
    while (trimmed.includes('//')) {
      const prev = trimmed;
      trimmed = trimmed.replace(/(\(.*?\)|[a-zA-Z0-9_.]+)\s*\/\/\s*(\(.*?\)|[a-zA-Z0-9_.]+)/g, 'Math.floor(($1) / ($2))');
      if (trimmed === prev) {
        trimmed = trimmed.replace(/\/\//g, '/');
        break;
      }
    }

    // Python ternary with assignment: var = a if cond else b -> var = (cond ? a : b)
    if (/^[a-zA-Z_]\w*\s*=\s*(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/.test(trimmed)) {
      trimmed = trimmed.replace(/^([a-zA-Z_]\w*\s*=\s*)(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/, '$1(($3) ? ($2) : ($4))');
    } else if (/(.+?)\s+if\s+(.+?)\s+else\s+(.+)/.test(trimmed)) {
      trimmed = trimmed.replace(/(.+?)\s+if\s+(.+?)\s+else\s+(.+)/, '(($2) ? ($1) : ($3))');
    }

    // Python slices: arr[:k] -> arr.slice(0, k), arr[k:] -> arr.slice(k)
    trimmed = trimmed.replace(/\[\s*:\s*([a-zA-Z0-9_]+)\s*\]/g, '.slice(0, $1)');
    trimmed = trimmed.replace(/\[\s*([a-zA-Z0-9_]+)\s*:\s*\]/g, '.slice($1)');

    // Python sort key lambda: .sort(key=lambda d: d[0]) -> .sort((a,b) => a[0] - b[0])
    trimmed = trimmed.replace(/\.sort\(key=lambda\s+(\w+):\s*\1\[(\d+)\]\)/g, '.sort((a, b) => a[$2] - b[$2])');

    // Transform block headers
    if (isDef) {
      trimmed = trimmed.replace(/^def\s+(\w+)\s*\((.*?)\)\s*:/, 'function $1($2) {');
      blockStack.push({ indent, type: 'def' });
    } else if (isForIn) {
      const match = trimmed.match(/^for\s+(.*?)\s+in\s+(.*?)\s*:/);
      const it = match[1].trim();
      const iter = match[2].trim();
      if (it.includes(',')) {
        trimmed = `for (const [${it}] of ${iter}) {`;
      } else {
        trimmed = `for (const ${it} of ${iter}) {`;
      }
      blockStack.push({ indent, type: 'for' });
    } else if (isWhile) {
      trimmed = trimmed.replace(/^while\s+(.*?)\s*:/, 'while ($1) {');
      blockStack.push({ indent, type: 'while' });
    } else if (isIf) {
      trimmed = trimmed.replace(/^if\s+(.*?)\s*:$/, 'if ($1) {');
      blockStack.push({ indent, type: 'if' });
    } else if (isElif) {
      trimmed = trimmed.replace(/^elif\s+(.*?)\s*:$/, '} else if ($1) {');
      blockStack.push({ indent, type: 'elif' });
    } else if (isElse) {
      trimmed = '} else {';
      blockStack.push({ indent, type: 'else' });
    } else {
      // List comprehension with multiple variables: [expr for a, b in src if cond]
      trimmed = trimmed.replace(
        /\[\s*(.+?)\s+for\s+([a-zA-Z0-9_,\s]+)\s+in\s+(.+?)\s*(?:if\s+(.+?))?\s*\]/g,
        (_, expr, it, src, cond) => {
          const varParam = it.includes(',') ? `([${it}])` : it;
          if (cond) {
            return `(${src}).filter(${varParam} => ${cond}).map(${varParam} => ${expr})`;
          }
          return `(${src}).map(${varParam} => ${expr})`;
        }
      );

      // Add 'var ' for variable assignments
      if (/^[a-zA-Z_]\w*\s*=\s*[^=]/.test(trimmed)) {
        trimmed = 'var ' + trimmed;
      }
    }

    const suffix = trimmed.endsWith('{') || trimmed.endsWith('}') ? '' : ';';
    jsLines.push(' '.repeat(indent) + trimmed + suffix);
  }

  // Close remaining blocks
  while (blockStack.length > 0) {
    const top = blockStack.pop();
    jsLines.push(' '.repeat(top.indent) + '}');
  }

  return jsLines.join('\n');
}
