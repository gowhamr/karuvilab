import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

function findTestFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findTestFiles(fullPath));
    } else if (file.endsWith('.test.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

function buildTests() {
  console.log('📦 Compiling TypeScript test suite to .test-dist...');
  try {
    execSync("npx 'tsc' --project tsconfig.test.json --outDir .test-dist --module esnext --target es2022 --skipLibCheck --noEmit false", {
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('❌ TypeScript compilation failed for test suite.');
    process.exit(1);
  }
}

async function run() {
  buildTests();

  const testDistDir = path.resolve('./.test-dist');
  if (!fs.existsSync(testDistDir)) {
    console.error(`❌ Test output directory does not exist: ${testDistDir}`);
    process.exit(1);
  }

  const files = findTestFiles(testDistDir);
  console.log(`\n🚀 Executing ${files.length} compiled unit test suite files...\n`);

  let passed = 0;
  let failed = 0;

  const failedSuites = [];

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    try {
      console.log(`\n📄 Testing: ${rel}`);
      const mod = await import(`file://${file}?v=${Date.now()}`);
      if (typeof mod.waitForTestSuite === 'function') {
        await mod.waitForTestSuite();
      } else if (typeof mod.default?.waitForTestSuite === 'function') {
        await mod.default.waitForTestSuite();
      }
      if (process.exitCode === 1) {
        failed++;
        failedSuites.push(rel);
        process.exitCode = 0;
      } else {
        passed++;
      }
    } catch (err) {
      console.error(`❌ Suite Error in ${rel}:`, err.message);
      failed++;
      failedSuites.push(`${rel} (${err.message})`);
      process.exitCode = 0;
    }
  }

  console.log(`\n========================================`);
  console.log(`Unit Test Execution Summary: ${passed} Passed, ${failed} Failed`);
  if (failedSuites.length > 0) {
    console.log(`Failed Suites:\n${failedSuites.map(s => ` - ${s}`).join('\n')}`);
  }
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
