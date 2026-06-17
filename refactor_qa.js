const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /rounded-t-\[32px\]/g, replacement: 'rounded-t-4xl' },
  { regex: /rounded-r-\[32px\]/g, replacement: 'rounded-r-4xl' },
  { regex: /rounded-t-\[48px\]/g, replacement: 'rounded-t-6xl' },
  { regex: /mt-\[-40px\]/g, replacement: '-mt-10' },
  { regex: /min-w-\[4rem\]/g, replacement: 'min-w-16' },
  { regex: /min-w-\[50\%\]/g, replacement: 'min-w-1/2' },
  { regex: /-ml-\[2px\]/g, replacement: '-ml-0.5' },
  { regex: /bottom-\[calc\\(60px\+env\\(safe-area-inset-bottom,0px\\)\\)\]/g, replacement: 'bottom-nav-action' },
  { regex: /pb-\[env\\(safe-area-inset-bottom,0px\\)\]/g, replacement: 'pb-safe-bottom' },
  { regex: /w-\[90\%\]/g, replacement: 'w-11/12' },
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
