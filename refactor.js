const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /tracking-\[0\.1em\]/g, replacement: 'tracking-widest-sm' },
  { regex: /tracking-\[0\.15em\]/g, replacement: 'tracking-widest-md' },
  { regex: /tracking-\[0\.2em\]/g, replacement: 'tracking-widest-lg' },
  { regex: /tracking-\[0\.20em\]/g, replacement: 'tracking-widest-lg' },
  { regex: /tracking-\[0\.25em\]/g, replacement: 'tracking-widest-xl' },
  { regex: /tracking-\[0\.3em\]/g, replacement: 'tracking-widest-2xl' },
  { regex: /tracking-\[0\.4em\]/g, replacement: 'tracking-widest-3xl' },
  { regex: /z-\[100\]/g, replacement: 'z-dropdown' },
  { regex: /z-\[300\]/g, replacement: 'z-fixed' },
  { regex: /z-\[301\]/g, replacement: 'z-fixed' },
  { regex: /z-\[490\]/g, replacement: 'z-modalBackdrop' },
  { regex: /z-\[500\]/g, replacement: 'z-modal' },
  { regex: /z-\[60\]/g, replacement: 'z-nav' },
  { regex: /z-\[90\]/g, replacement: 'z-backdrop' },
  { regex: /scale-\[1\.02\]/g, replacement: 'scale-102' },
  { regex: /scale-\[0\.98\]/g, replacement: 'scale-98' },
  { regex: /md:ml-\[280px\]/g, replacement: 'md:ml-sidebar' },
  { regex: /bg-\[--kv-mat-surface\]/g, replacement: 'bg-mat-surface' },
  { regex: /bg-\[--kv-mat-hover\]/g, replacement: 'bg-mat-hover' },
  { regex: /bg-\[--kv-mat-base\]/g, replacement: 'bg-mat-base' },
  { regex: /border-\[--kv-mat-border\]/g, replacement: 'border-mat-border' },
  { regex: /border-\[--kv-mat-border-focus\]/g, replacement: 'border-mat-border-focus' },
  { regex: /text-\[--kv-text-muted\]/g, replacement: 'text-text-muted' },
  { regex: /text-\[--kv-text\]/g, replacement: 'text-text' },
  { regex: /text-\[--kv-brand-primary\]/g, replacement: 'text-brand-primary' },
  { regex: /pb-\[env\\(safe-area-inset-bottom,0px\\)\]/g, replacement: 'pb-safe-bottom' },
  { regex: /pb-\[env\\(safe-area-inset-bottom\\)\]/g, replacement: 'pb-safe-bottom' },
  { regex: /bottom-\[calc\\(60px\+env\\(safe-area-inset-bottom,0px\\)\\)\]/g, replacement: 'bottom-nav-action' },
  { regex: /pb-\[136px\]/g, replacement: 'pb-[136px] ' }
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
