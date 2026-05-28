const fs = require('fs');
const path = require('path');

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
    src: 'node_modules/mermaid/dist/mermaid.min.js',
    dest: 'public/lib/markdown/mermaid.min.js'
  }
];

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
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Synced: ${worker.src} -> ${worker.dest}`);
      } catch (err) {
        console.error(`❌ Failed to sync ${worker.src}:`, err);
      }
    } else {
      console.warn(`⚠️ Warning: Source worker not found: ${srcPath}`);
    }
  }
}

sync();
