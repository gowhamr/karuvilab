"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type TestStatus = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

export interface TestResult {
  id: string;
  timestamp: number;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  loadedLatency?: number;
}

const DOWNLOAD_FILES = [
  "https://speed.cloudflare.com/__down?bytes=25000000",
  "https://cdn.jsdelivr.net/gh/fastly/fastly-test-files@master/50mb.bin",
];

const LATENCY_URLS = [
  "https://speed.cloudflare.com/__down?bytes=0",
  "https://www.google.com/generate_204",
];

export function useSpeedTest() {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const abortController = useRef<AbortController | null>(null);

  const runPingTest = async () => {
    setStatus('ping');
    const samples: number[] = [];
    for (let i = 0; i < 10; i++) {
      if (abortController.current?.signal.aborted) return;
      const start = performance.now();
      try {
        const url = LATENCY_URLS[0];
        if (!url) break;
        await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: abortController.current?.signal ?? null });
        samples.push(performance.now() - start);
      } catch (e) {
        // Fallback or ignore
      }
      const latestPing = samples.length ? samples[samples.length - 1] : 0;
      if (latestPing !== undefined) setPing(latestPing);
      setProgress((i + 1) * 10);
      await new Promise(r => setTimeout(r, 100));
      }

      if (samples.length > 1) {
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      setPing(avg);
      // Calc jitter
      let totalJitter = 0;
      for (let i = 1; i < samples.length; i++) {
        const s1 = samples[i];
        const s0 = samples[i - 1];
        if (s1 !== undefined && s0 !== undefined) {
          totalJitter += Math.abs(s1 - s0);
        }
      }
      setJitter(totalJitter / (samples.length - 1));
      }
  };

  const startTest = useCallback(async () => {
    abortController.current = new AbortController();
    setError(null);
    setProgress(0);
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);

    const runDownloadTest = async () => {
      setStatus('download');
      const url = DOWNLOAD_FILES[0] || "";
      const startTime = performance.now();
      let loadedBytes = 0;
      const durationLimit = 5000;
      
      try {
        const response = await fetch(url, {
          cache: 'no-store',
          signal: abortController.current?.signal ?? null
        });
        const reader = response.body?.getReader();
        if (!reader) throw new Error();
        
        while (true) {
          if (abortController.current?.signal.aborted) break;
          const { done, value } = await reader.read();
          if (done) break;
          
          loadedBytes += value.length;
          const elapsed = (performance.now() - startTime) / 1000;
          const speedMbps = (loadedBytes * 8) / (elapsed * 1000000);
          setDownload(speedMbps);
          setProgress(Math.min((elapsed / 5) * 100, 100));
          
          if (elapsed * 1000 >= durationLimit) {
            reader.cancel();
            break;
          }
        }
      } catch (e) {
        if (!abortController.current?.signal.aborted) {
          throw new Error("Download test failed. Network issue or CORS restriction.");
        }
      }
    };

    const runUploadTest = async () => {
      setStatus('upload');
      const url = "https://speed.cloudflare.com/__up";
      const size = 2 * 1024 * 1024; // 2MB upload payload
      const payload = new Uint8Array(size);
      const startTime = performance.now();
      
      try {
        await fetch(url, {
          method: 'POST',
          body: payload,
          cache: 'no-store',
          mode: 'cors',
          signal: abortController.current?.signal ?? null
        });
        const elapsed = (performance.now() - startTime) / 1000;
        const speedMbps = (size * 8) / (elapsed * 1000000);
        setUpload(speedMbps);
        setProgress(100);
      } catch (e) {
        if (!abortController.current?.signal.aborted) {
          throw new Error("Upload test failed. Network issue or CORS restriction.");
        }
      }
    };

    try {
      await runPingTest();
      await runDownloadTest();
      await runUploadTest();
      setStatus('completed');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Test failed');
        setStatus('error');
      }
    }
  }, []);

  const cancelTest = useCallback(() => {
    abortController.current?.abort();
    setStatus('idle');
  }, []);

  return {
    status,
    ping,
    jitter,
    download,
    upload,
    progress,
    error,
    startTest,
    cancelTest
  };
}
