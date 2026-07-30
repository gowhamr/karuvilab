import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const BUDGETS = {
  homepageGzipKb: 200,
  sharedChunkGzipKb: 100,
};

async function checkBudgets() {
  const manifestPath = path.resolve('.next/build-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Build manifest not found. Run next build first.');
    process.exit(1);
  }

  const buildManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const homeFiles = buildManifest.pages['/'] || [];
  const polyfills = buildManifest.polyfillFiles || [];
  const allHomeFiles = Array.from(new Set([...homeFiles, ...polyfills]));

  let totalHomeRaw = 0;
  let totalHomeGzip = 0;

  console.log('\n📊 === KARUVILAB BUNDLE BUDGET AUDIT ===');
  console.log('--------------------------------------------------');

  allHomeFiles.forEach(file => {
    const fullPath = path.join('.next', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath);
      totalHomeRaw += content.length;
      totalHomeGzip += zlib.gzipSync(content).length;
    }
  });

  const homeGzipKb = totalHomeGzip / 1024;
  console.log(`Homepage Initial JS (Gzipped): ${homeGzipKb.toFixed(1)} KB (Budget: < ${BUDGETS.homepageGzipKb} KB)`);

  let failed = false;

  if (homeGzipKb > BUDGETS.homepageGzipKb) {
    console.error(`❌ BUDGET FAIL: Homepage Gzipped JS (${homeGzipKb.toFixed(1)} KB) exceeds budget of ${BUDGETS.homepageGzipKb} KB`);
    failed = true;
  } else {
    console.log(`✅ BUDGET PASS: Homepage Gzipped JS is within target!`);
  }

  console.log('--------------------------------------------------\n');

  if (failed) {
    process.exit(1);
  } else {
    console.log('🎉 All bundle budgets passed successfully!');
  }
}

checkBudgets().catch(err => {
  console.error(err);
  process.exit(1);
});
