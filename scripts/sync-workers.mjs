import fs from 'fs';
import path from 'path';

/**
 * KaruviLab Unified Worker Asset Sync
 * Copies required worker/WASM files from node_modules to public/
 */

const WORKERS = [
  {
    src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
    dest: 'public/pdf.worker.min.mjs'
  },
  {
    src: 'node_modules/pdfjs-dist/build/pdf.min.mjs',
    dest: 'public/pdf.min.mjs'
  },
  {
    src: 'node_modules/monaco-editor/min/vs',
    dest: 'public/lib/monaco/vs',
    isDir: true
  },
  {
    src: 'node_modules/dictionary-en/index.aff',
    dest: 'public/lib/dictionary/en.aff'
  },
  {
    src: 'node_modules/dictionary-en/index.dic',
    dest: 'public/lib/dictionary/en.dic'
  },
  {
    src: 'node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf',
    dest: 'public/lib/monaco/vs/base/browser/ui/codicons/codicon/codicon.ttf'
  }
];

function updateCacheNames() {
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  if (fs.existsSync(swPath)) {
    try {
      let content = fs.readFileSync(swPath, 'utf8');
      const buildHash = Date.now().toString();
      const updated = content.replace(/karuvilab-(static|images|pages)-(v\d+|[a-f0-9]+|\d+)/g, 'karuvilab-$1-' + buildHash);
      fs.writeFileSync(swPath, updated, 'utf8');
      console.log(`✅ Automatically updated sw.js cache names with build hash: ${buildHash}`);
    } catch (err) {
      console.error('❌ Failed to update sw.js cache names:', err);
    }
  }
}

function sync() {
  console.log('🚀 Syncing KaruviLab worker assets...');
  
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const worker of WORKERS) {
    const srcPath = path.join(process.cwd(), worker.src);
    const destPath = path.join(process.cwd(), worker.dest);

    if (fs.existsSync(srcPath)) {
      try {
        if (worker.isDir) {
          if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true, force: true });
          }
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.cpSync(srcPath, destPath, { recursive: true });
          
          // Clean sourceMappingURL from copied scripts to prevent 404 HTML map fetches
          const cleanMaps = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const full = path.join(dir, entry.name);
              if (entry.isDirectory()) cleanMaps(full);
              else if (entry.name.endsWith('.js')) {
                const content = fs.readFileSync(full, 'utf8');
                if (content.includes('sourceMappingURL=')) {
                  fs.writeFileSync(full, content.replace(/\/\/#\s*sourceMappingURL=[^\r\n]+/g, ''), 'utf8');
                }
              }
            }
          };
          cleanMaps(destPath);
          console.log(`✅ Synced Directory: ${worker.src} -> ${worker.dest}`);
        } else {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(srcPath, destPath);
          if (destPath.endsWith('.js') || destPath.endsWith('.mjs')) {
            const content = fs.readFileSync(destPath, 'utf8');
            if (content.includes('sourceMappingURL=')) {
              fs.writeFileSync(destPath, content.replace(/\/\/#\s*sourceMappingURL=[^\r\n]+/g, ''), 'utf8');
            }
          }
          console.log(`✅ Synced: ${worker.src} -> ${worker.dest}`);
        }
      } catch (err) {
        console.error(`❌ Failed to sync ${worker.src}:`, err);
      }
    } else {
      console.warn(`⚠️ Warning: Source worker not found: ${srcPath}`);
    }
  }

  updateCacheNames();
}

sync();
