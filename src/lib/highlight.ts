/**
 * Simple Regex-based Syntax Highlighter
 * Optimized for performance and bundle size.
 */

export function highlightCode(code: string, lang: string): string {
  if (!code) return '';
  if (lang === 'text' || lang === 'txt' || lang === 'csv') {
    return escapeHtml(code);
  }

  let html = escapeHtml(code);

  // Common patterns
  const patterns: Record<string, RegExp> = {
    comment: /\/\*[\s\S]*?\*\/|\/\/.*/g,
    string: /(["'])(?:(?=(\\?))\2.)*?\1/g,
    number: /\b\d+(\.\d+)?\b/g,
    keyword: /\b(await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|let|static|async|from|as|get|set|type|interface|public|private|protected|readonly)\b/g,
    operator: /[+\-*\/=<>!&|%^~]/g,
    function: /\b\w+(?=\()/g,
  };

  if (lang === 'json') {
    patterns.keyword = /\b(true|false|null)\b/g;
    patterns.key = /"(?:\\.|[^"\\])*"(?=\s*:)/g;
  } else if (lang === 'html' || lang === 'xml') {
    patterns.tag = /&lt;\/?[a-z][a-z0-9]*.*?&gt;/gi;
    patterns.attr = /\s[a-z0-9\-]+(?==)/gi;
  } else if (lang === 'css') {
    patterns.property = /[a-z\-]+(?=\s*:)/gi;
    patterns.value = /:\s*.*?;/gi;
    patterns.selector = /[.#\w\-\[\]"']+(?=\s*\{)/gi;
  }

  // Apply patterns (simplified)
  // This is a naive implementation; for real usage we'd use a better approach
  // to avoid overlapping matches.
  
  // For now, let's just do keywords and strings as a baseline
  html = html.replace(patterns.string!, '<span class="text-yellow-600 dark:text-yellow-400">$&</span>');
  html = html.replace(patterns.keyword!, '<span class="text-blue-600 dark:text-blue-400 font-bold">$&</span>');
  html = html.replace(patterns.comment!, '<span class="text-text-4 italic">$&</span>');
  if (patterns.tag) html = html.replace(patterns.tag, '<span class="text-indigo-600 dark:text-indigo-400">$&</span>');
  
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
