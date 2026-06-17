const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-xs font-black uppercase tracking-widest/g, replacement: 'text-tiny font-bold uppercase tracking-widest-sm' },
  { regex: /text-xs font-black uppercase tracking-widest-lg/g, replacement: 'text-tiny font-bold uppercase tracking-widest-md' },
  { regex: /text-xs font-black uppercase tracking-widest-xl/g, replacement: 'text-tiny font-bold uppercase tracking-widest-lg' },
  { regex: /text-xs font-black uppercase tracking-widest-2xl/g, replacement: 'text-tiny font-bold uppercase tracking-widest-xl' },
  { regex: /text-xs font-black uppercase tracking-widest-3xl/g, replacement: 'text-tiny font-bold uppercase tracking-widest-2xl' },
  { regex: /text-xs font-black uppercase tracking-\[0\.2em\]/g, replacement: 'text-tiny font-bold uppercase tracking-widest-lg' },
  { regex: /text-xs font-black uppercase tracking-\[0\.15em\]/g, replacement: 'text-tiny font-bold uppercase tracking-widest-md' },
  { regex: /text-xs font-black uppercase tracking-\[0\.1em\]/g, replacement: 'text-tiny font-bold uppercase tracking-widest-sm' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
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
