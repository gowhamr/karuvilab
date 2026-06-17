const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /h-\[70vh\]/g, replacement: 'h-tool-viewport' },
  { regex: /max-h-\[70vh\]/g, replacement: 'max-h-tool-viewport' },
  { regex: /h-\[75vh\]/g, replacement: 'h-tool-viewport' },
  { regex: /max-h-\[75vh\]/g, replacement: 'max-h-tool-viewport' },
  { regex: /max-h-\[80vh\]/g, replacement: 'max-h-tool-viewport-lg' },
  { regex: /h-\[80vh\]/g, replacement: 'h-tool-viewport-lg' },
  { regex: /shadow-\[0_0_12px_rgba\(239,68,68,0\.6\)\]/g, replacement: 'shadow-glow-error' },
  { regex: /shadow-\[0_0_20px_rgba\(79,70,229,0\.5\)\]/g, replacement: 'shadow-glow-primary' },
  { regex: /shadow-\[0_0_20px_rgba\(79,70,229,1\)\]/g, replacement: 'shadow-glow-primary' },
  { regex: /w-\[calc\(100\%\+2rem\)\] -ml-4/g, replacement: '-mx-4 w-auto px-4' },
  { regex: /md:w-\[calc\(100\%\+4rem\)\] md:-ml-8/g, replacement: 'md:-mx-8 md:w-auto md:px-8' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let original = content;
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./components');
processDirectory('./src');
