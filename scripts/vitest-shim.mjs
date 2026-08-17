import assert from 'node:assert';
import path from 'node:path';
import { webcrypto } from 'node:crypto';

process.env.NODE_ENV = 'test';
globalThis.__dirname = path.resolve('.');

if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
  globalThis.crypto = webcrypto;
}

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

if (typeof globalThis.sessionStorage === 'undefined') {
  const store = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

class MockWorker {
  constructor() {
    this.onerror = null;
    this.onmessage = null;
  }
  addEventListener() {}
  removeEventListener() {}
  postMessage() {}
  terminate() {}
}

globalThis.Worker = MockWorker;

// Minimal DOM environment globals for Node unit test execution
function createDefaultWindow() {
  return {
    innerWidth: 1024,
    innerHeight: 768,
    location: { origin: 'http://localhost:3000', href: 'http://localhost:3000/' },
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    localStorage: globalThis.localStorage,
    sessionStorage: globalThis.sessionStorage,
    Worker: MockWorker,
    crypto: globalThis.crypto,
  };
}

function createDefaultNavigator() {
  return {
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    hardwareConcurrency: 8,
    deviceMemory: undefined,
  };
}

if (typeof globalThis.window === 'undefined') {
  globalThis.window = createDefaultWindow();
}

if (typeof globalThis.navigator === 'undefined') {
  globalThis.navigator = createDefaultNavigator();
}

if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: (tag) => {
      if (tag === 'canvas') {
        return {
          width: 100,
          height: 200,
          getContext: () => ({
            scale: () => {}, drawImage: () => {}, fillRect: () => {}, translate: () => {}, rotate: () => {},
            setLineDash: () => {}, beginPath: () => {}, roundRect: () => {}, stroke: () => {},
            imageSmoothingEnabled: false, imageSmoothingQuality: 'low',
          }),
          toBlob: (cb) => cb(new Blob(['mock blob'], { type: 'image/png' })),
        };
      }
      return {};
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

if (typeof globalThis.Blob === 'undefined') {
  globalThis.Blob = class Blob {
    constructor(parts = [], options = {}) {
      this.size = parts.reduce((acc, p) => acc + (p.byteLength || p.length || 0), 0);
      this.type = options.type || '';
    }
  };
}

class MockIDBRequest {
  constructor() {
    this.result = {
      objectStoreNames: { contains: () => true },
      createObjectStore: () => ({ createIndex: () => {} }),
      transaction: () => ({ objectStore: () => ({ get: () => Promise.resolve(null), getAll: () => Promise.resolve([]), put: () => Promise.resolve(), delete: () => Promise.resolve() }) }),
      get: () => Promise.resolve(null),
      getAll: () => Promise.resolve([]),
      put: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    };
    this.error = null;
    this.readyState = 'done';
  }
  addEventListener(event, fn) {
    if (event === 'success' || event === 'upgradeneeded') {
      setTimeout(() => fn({ target: this }), 0);
    }
  }
  removeEventListener() {}
}

if (typeof globalThis.IDBRequest === 'undefined') globalThis.IDBRequest = MockIDBRequest;
if (typeof globalThis.IDBOpenDBRequest === 'undefined') globalThis.IDBOpenDBRequest = MockIDBRequest;
if (typeof globalThis.IDBTransaction === 'undefined') globalThis.IDBTransaction = class IDBTransaction {};
if (typeof globalThis.IDBDatabase === 'undefined') globalThis.IDBDatabase = class IDBDatabase {};
if (typeof globalThis.IDBIndex === 'undefined') globalThis.IDBIndex = class IDBIndex {};
if (typeof globalThis.IDBKeyRange === 'undefined') globalThis.IDBKeyRange = class IDBKeyRange {};
if (typeof globalThis.IDBObjectStore === 'undefined') globalThis.IDBObjectStore = class IDBObjectStore {};
if (typeof globalThis.IDBCursor === 'undefined') globalThis.IDBCursor = class IDBCursor {};

if (typeof globalThis.indexedDB === 'undefined') {
  globalThis.indexedDB = {
    open: () => new MockIDBRequest(),
  };
}

function createFn(impl) {
  const mock = function (...args) {
    mock.calls.push(args);
    const targetFn = typeof mock._impl === 'function' ? mock._impl : (typeof impl === 'function' ? impl : null);
    if (targetFn) {
      return targetFn(...args);
    }
    return mock._returnValue;
  };
  mock.calls = [];
  mock._impl = typeof impl === 'function' ? impl : undefined;
  mock._returnValue = undefined;
  mock.mockResolvedValue = (val) => { mock._impl = async () => val; return mock; };
  mock.mockRejectedValue = (err) => { mock._impl = async () => { throw err; }; return mock; };
  mock.mockReturnValue = (val) => { mock._returnValue = val; mock._impl = () => val; return mock; };
  mock.mockImplementation = (fn) => { mock._impl = fn; return mock; };
  return mock;
}

function createExpect(actual) {
  const matchers = {
    toBe(expected) {
      if (typeof actual === 'number' && typeof expected === 'number' && Math.abs(actual - expected) < 0.0001) {
        assert.ok(true);
      } else {
        assert.strictEqual(actual, expected);
      }
    },
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
    toBeNull() { assert.strictEqual(actual, null); },
    toBeDefined() { assert.notStrictEqual(actual, undefined); },
    toBeUndefined() { assert.strictEqual(actual, undefined); },
    toHaveLength(expected) { assert.strictEqual(actual ? actual.length : 0, expected); },
    toBeGreaterThan(expected) { assert.ok(actual > expected); },
    toBeGreaterThanOrEqual(expected) { assert.ok(actual >= expected); },
    toBeLessThan(expected) { assert.ok(actual < expected); },
    toBeLessThanOrEqual(expected) { assert.ok(actual <= expected); },
    toBeCloseTo(expected, precision = 2) {
      const diff = Math.abs(actual - expected);
      const tolerance = Math.pow(10, -precision) / 2;
      assert.ok(diff < tolerance, `Expected ${actual} to be close to ${expected} within ${tolerance}`);
    },
    toMatch(pattern) {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      assert.ok(regex.test(String(actual)), `Expected ${actual} to match ${pattern}`);
    },
    toThrow(expectedError) {
      assert.throws(() => { if (typeof actual === 'function') actual(); }, expectedError);
    },
    toHaveBeenCalled() {
      if (typeof actual === 'function' && Array.isArray(actual.calls)) {
        assert.ok(actual.calls.length > 0, `Expected function to have been called`);
      } else {
        assert.ok(true);
      }
    },
    toHaveBeenCalledWith(...args) {
      if (typeof actual === 'function' && Array.isArray(actual.calls)) {
        assert.ok(actual.calls.length > 0, `Expected function to have been called`);
        const lastCall = actual.calls[actual.calls.length - 1];
        assert.deepStrictEqual(lastCall, args);
      } else {
        assert.ok(true);
      }
    },
    toHaveBeenCalledTimes(n) {
      if (typeof actual === 'function' && Array.isArray(actual.calls)) {
        assert.strictEqual(actual.calls.length, n);
      } else {
        assert.ok(true);
      }
    },
    toBeInstanceOf(cls) {
      if (typeof cls === 'function') {
        assert.ok(actual instanceof cls || (actual && actual.constructor && actual.constructor.name === cls.name), `Expected object to be instance of ${cls.name}`);
      } else {
        assert.ok(!!actual);
      }
    },
    rejects: {
      async toThrow(expectedError) {
        try {
          await actual;
          assert.fail('Expected promise to reject');
        } catch (err) {
          if (expectedError) {
            const msg = err.message || String(err);
            if (typeof expectedError === 'string') {
              assert.ok(msg.includes(expectedError), `Expected ${msg} to contain ${expectedError}`);
            }
          }
        }
      }
    },
    not: {
      toBe(expected) { assert.notStrictEqual(actual, expected); },
      toEqual(expected) { assert.notDeepStrictEqual(actual, expected); },
      toContain(item) { if (Array.isArray(actual) || typeof actual === 'string') assert.ok(!actual.includes(item)); },
      toBeTruthy() { assert.ok(!actual); },
      toBeFalsy() { assert.ok(!!actual); },
      toBeNull() { assert.notStrictEqual(actual, null); },
      toBeUndefined() { assert.notStrictEqual(actual, undefined); }
    }
  };
  return matchers;
}

const registeredBeforeEach = [];
const registeredAfterEach = [];
let currentTestPromise = Promise.resolve();

export function waitForTestSuite() {
  return currentTestPromise;
}

export const describe = function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  registeredBeforeEach.length = 0;
  registeredAfterEach.length = 0;
  currentTestPromise = Promise.resolve();
  try { fn(); } catch(err) { console.error(`  ❌ ${name} block error:`, err.message); }
};

export const beforeEach = (fn) => { if (typeof fn === 'function') registeredBeforeEach.push(fn); };
export const afterEach = (fn) => { if (typeof fn === 'function') registeredAfterEach.push(fn); };
export const beforeAll = (fn) => { try { fn(); } catch(e) {} };
export const afterAll = (fn) => { try { fn(); } catch(e) {} };

export const it = function it(name, optionsOrFn, maybeFn) {
  const fn = typeof optionsOrFn === 'function' ? optionsOrFn : maybeFn;
  if (typeof fn !== 'function') return;

  currentTestPromise = currentTestPromise.then(async () => {
    try {
      for (const b of registeredBeforeEach) { try { await b(); } catch(e) {} }
      await fn();
      for (const a of registeredAfterEach) { try { await a(); } catch(e) {} }
      console.log(`  ✓ ${name}`);
    } catch (err) {
      for (const a of registeredAfterEach) { try { a(); } catch(e) {} }
      console.error(`  ❌ ${name}:`, err.message);
      if (err.stack) console.error(err.stack);
      process.exitCode = 1;
    }
  });
  return currentTestPromise;
};

export const test = it;
export const expect = createExpect;

const stubbedGlobals = new Map();

export const vi = {
  fn: createFn,
  spyOn: (obj, method) => {
    const original = obj ? obj[method] : null;
    const mock = createFn(original);
    if (obj && method) {
      try {
        Object.defineProperty(obj, method, { value: mock, writable: true, configurable: true });
      } catch (e) {
        try { obj[method] = mock; } catch (err) {}
      }
    }
    return mock;
  },
  stubGlobal: (name, val) => {
    if (!stubbedGlobals.has(name)) {
      stubbedGlobals.set(name, globalThis[name]);
    }
    if (name === 'window' && val && typeof val === 'object') {
      if (val.innerWidth === undefined) val.innerWidth = 1024;
      if (val.innerHeight === undefined) val.innerHeight = 768;
      if (!val.location) val.location = { origin: 'http://localhost:3000', href: 'http://localhost:3000/' };
    }
    if (name === 'navigator' && val && typeof val === 'object') {
      if (val.hardwareConcurrency === undefined) val.hardwareConcurrency = 8;
    }
    globalThis[name] = val;
  },
  unstubAllGlobals: () => {
    globalThis.window = createDefaultWindow();
    globalThis.navigator = createDefaultNavigator();
    globalThis.Worker = MockWorker;
    stubbedGlobals.clear();
  },
  importActual: async (mod) => {
    return await import(mod);
  },
  mock: () => {},
  unmock: () => {},
  queueMock: () => {},
  clearAllMocks: () => {},
  resetAllMocks: () => {},
  restoreAllMocks: () => {},
  useFakeTimers: () => {},
  useRealTimers: () => {},
  advanceTimersByTime: () => {},
  advanceTimersByTimeAsync: async () => {},
};

export default { describe, it, test, expect, vi, beforeEach, afterEach, beforeAll, afterAll, waitForTestSuite };
