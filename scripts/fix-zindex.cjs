const fs = require('fs');
const path = require('path');

const zMap = {
  '-z-10': 'z-behind',
  'z-0': 'z-base',
  'z-10': 'z-content',
  'z-20': 'z-above',
  // Specific semantic overrides
  'fixed inset-4 z-50': 'fixed inset-4 z-modal',
  'bg-black/20 backdrop-blur-sm z-40': 'bg-black/20 backdrop-blur-sm z-backdrop', // SciCalc backdrop
  'fixed inset-0 z-50': 'fixed inset-0 z-modal', // ImageConverter modal
  'bg-black/20 backdrop-blur-[2px] md:hidden z-40': 'bg-black/20 backdrop-blur-[2px] md:hidden z-backdrop', // TimeZoneConverter backdrop
  'bg-black/20 backdrop-blur-[2px] z-40': 'bg-black/20 backdrop-blur-[2px] z-backdrop', // TimeZone fallback
  'fixed inset-0 z-40 bg-black/20': 'fixed inset-0 z-backdrop bg-black/20',
  'w-16 h-16 bg-blue text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue/40 z-50': 'w-16 h-16 bg-blue text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue/40 z-max', // Notes FAB
  'overflow-hidden z-30': 'overflow-hidden z-dropdown', // ConsoleDrawer
};

// General fallback for remaining z-50 etc
const fallbackMap = {
  'z-30': 'z-sidebar',
  'z-40': 'z-header',
  'z-50': 'z-modal',
};

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Pass 1: Specific overrides
      for (const [key, value] of Object.entries(zMap)) {
        content = content.replace(new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), value);
      }
      
      // Pass 2: Remaining z-10, z-20 etc
      content = content.replace(/\b(-z-10|z-0|z-10|z-20)\b/g, match => {
        const res = zMap[match];
        return res ? res : match;
      });

      // Pass 3: Remaining z-30, z-40, z-50
      content = content.replace(/\b(z-30|z-40|z-50)\b/g, match => {
        const res = fallbackMap[match];
        return res ? res : match;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

const root = process.cwd();
processDirectory(path.join(root, 'app'));
processDirectory(path.join(root, 'components'));
processDirectory(path.join(root, 'src'));
console.log('Done!');
