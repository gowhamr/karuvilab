/// <reference lib="webworker" />
/* ===== regex-worker.ts – Web Worker for regex matching ===== */

interface WorkerRegexRequest {
  pattern: string;
  flags: string;
  testStr: string;
}

interface WorkerRegexMatch {
  index: number;
  value: string;
}

self.onmessage = function (e: MessageEvent<WorkerRegexRequest>): void {
  const { pattern, flags, testStr } = e.data;
  try {
    const re      = new RegExp(pattern, flags);
    const matches: WorkerRegexMatch[] = [...testStr.matchAll(re)].map(m => ({
      index: m.index ?? 0,
      value: m[0],
    }));
    self.postMessage({ type: 'result', matches });
  } catch (err) {
    self.postMessage({ type: 'error', message: (err as Error).message });
  }
};
