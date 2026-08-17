const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const assert = require('assert');
const Module = require('module');

/**
 * KaruviLab CommonJS Unit Test Runner
 * Solves ARM64/Termux glibc binding issue in Vitest by compiling tests to CommonJS
 * and running them with Node's native assert engine and path alias resolution.
 */

// Hook module resolution for @/ path aliases
const origResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const rel = request.slice(2);
    const inDist = path.resolve('./.test-dist', rel);
    try { return origResolve.call(this, inDist, parent, isMain, options); } catch(e) {}
    try { return origResolve.call(this, path.resolve(process.cwd(), rel), parent, isMain, options); } catch(e) {}
  }
  return origResolve.call(this, request, parent, isMain, options);
};

function buildTests() {
  console.log('📦 Compiling TypeScript test suite to CommonJS (.test-dist)...');
  execSync('npx tsc --project tsconfig.test.json --outDir .test-dist --module commonjs --target es2022 --skipLibCheck --noEmit false', {
    stdio: 'inherit'
  });
}

function findTestFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      findTestFiles(res, files);
    } else if (entry.name.endsWith('.test.js') || entry.name.endsWith('.spec.js')) {
      files.push(res);
    }
  }
  return files;
}

// Global Vitest compatibility shims
function createExpect(actual) {
  const matchers = {
    toBe(expected) { assert.strictEqual(actual, expected); },
    toEqual(expected) { assert.deepStrictEqual(actual, expected); },
    toContain(item) {
      if (Array.isArray(actual) || typeof actual === 'string') {
        assert.ok(actual.includes(item), `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
      } else if (actual instanceof Set || actual instanceof Map) {
        assert.ok(actual.has(item));
      } else {
        assert.fail(`Cannot check toContain on type ${typeof actual}`);
      }
    },
    toBeTruthy() { assert.ok(!!actual); },
    toBeFalsy() { assert.ok(!actual); },
    toBeDefined() { assert.notStrictEqual(actual, undefined); },
    toBeUndefined() { assert.strictEqual(actual, undefined); },
    toBeGreaterThan(expected) { assert.ok(actual > expected); },
    toBeGreaterThanOrEqual(expected) { assert.ok(actual >= expected); },
    toBeLessThan(expected) { assert.ok(actual < expected); },
    toBeLessThanOrEqual(expected) { assert.ok(actual <= expected); },
    toThrow(expectedError) {
      assert.throws(() => { if (typeof actual === 'function') actual(); }, expectedError);
    },
    not: {
      toBe(expected) { assert.notStrictEqual(actual, expected); },
      toEqual(expected) { assert.notDeepStrictEqual(actual, expected); },
      toContain(item) { if (Array.isArray(actual) || typeof actual === 'string') assert.ok(!actual.includes(item)); },
      toBeTruthy() { assert.ok(!actual); },
      toBeFalsy() { assert.ok(!!actual); }
    }
  };
  return matchers;
}

global.describe = function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  fn();
};

global.it = function it(name, fn) {
  try {
    const res = fn();
    if (res && typeof res.then === 'function') {
      return res.then(() => console.log(`  ✓ ${name}`))
                .catch(err => { console.error(`  ❌ ${name}:`, err.message); process.exitCode = 1; });
    }
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name}:`, err.message);
    process.exitCode = 1;
  }
};

global.expect = createExpect;
global.test = global.it;

async function run() {
  buildTests();

  const testDistDir = path.resolve('./.test-dist/src');
  const files = findTestFiles(testDistDir);
  console.log(`\n🚀 Executing ${files.length} compiled unit test suite files...`);

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    try {
      console.log(`\n📄 Testing: ${rel}`);
      delete require.cache[require.resolve(file)];
      require(file);
      passed++;
    } catch (err) {
      console.error(`❌ Suite Failure in ${rel}:`, err.message);
      failed++;
      process.exitCode = 1;
    }
  }

  console.log(`\n========================================`);
  console.log(`Unit Test Audit Summary: ${passed} Suites Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

run();
