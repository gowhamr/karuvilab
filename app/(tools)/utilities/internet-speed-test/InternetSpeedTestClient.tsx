"use client";

import { useState, useCallback, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { Gauge, Zap, ArrowDown, ArrowUp, RefreshCw, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const ENDPOINTS = {
  download: "https://speed.cloudflare.com/__down",
  upload: "https://speed.cloudflare.com/__up",
  ping: "https://speed.cloudflare.com/__down?bytes=0"
};

type TestStatus = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

export default function InternetSpeedTestClient() {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null); // Mbps
  const [upload, setUpload] = useState<number | null>(null); // Mbps
  const [jitter, setJitter] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const runPingTest = async () => {
    const latencies: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      await fetch(ENDPOINTS.ping, { cache: 'no-store', mode: 'no-cors' });
      latencies.push(performance.now() - start);
    }
    const avg = latencies.reduce((a, b) => a + b) / latencies.length;
    const jit = Math.max(...latencies) - Math.min(...latencies);
    setPing(Math.round(avg));
    setJitter(Math.round(jit));
  };

  const runDownloadTest = async () => {
    const sizes = [1000000, 5000000, 10000000]; // 1MB, 5MB, 10MB
    let totalBits = 0;
    let totalTime = 0;

    for (const size of sizes) {
      if (status as any === 'error') break;
      const start = performance.now();
      const response = await fetch(`${ENDPOINTS.download}?bytes=${size}`, { 
        cache: 'no-store',
        signal: abortControllerRef.current?.signal ?? null
      });
      if (!response.ok) throw new Error("Download failed");
      await response.blob();
      const end = performance.now();
      
      const durationSeconds = (end - start) / 1000;
      const bits = size * 8;
      totalBits += bits;
      totalTime += durationSeconds;
      
      const currentMbps = (bits / durationSeconds) / 1000000;
      setDownload(parseFloat(currentMbps.toFixed(2)));
      setProgress(prev => Math.min(prev + 18, 75));
    }

    setDownload(parseFloat(((totalBits / totalTime) / 1000000).toFixed(2)));
  };

  const runUploadTest = () => {
    return new Promise<void>((resolve, reject) => {
      const size = 5000000; // 5MB is a good balance
      const data = new Uint8Array(size);
      crypto.getRandomValues(data);

      const xhr = new XMLHttpRequest();
      let startTime: number;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const now = performance.now();
          const durationSeconds = (now - startTime) / 1000;
          if (durationSeconds > 0) {
            const bits = event.loaded * 8;
            const mbps = (bits / durationSeconds) / 1000000;
            setUpload(parseFloat(mbps.toFixed(2)));
          }
          const progressBase = 75;
          const uploadProgress = (event.loaded / event.total) * 25;
          setProgress(progressBase + uploadProgress);
        }
      };

      xhr.onload = () => {
        const endTime = performance.now();
        const durationSeconds = (endTime - startTime) / 1000;
        const totalBits = size * 8;
        const avgMbps = (totalBits / durationSeconds) / 1000000;
        setUpload(parseFloat(avgMbps.toFixed(2)));
        setProgress(100);
        resolve();
      };

      xhr.onerror = () => {
        console.error("Upload test failed");
        setUpload(0);
        resolve(); // Don't crash the whole test
      };

      xhr.onabort = () => {
        resolve();
      };

      startTime = performance.now();
      xhr.open('POST', ENDPOINTS.upload, true);
      xhr.send(data);

      if (abortControllerRef.current) {
        abortControllerRef.current.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      }
    });
  };

  const startTest = useCallback(async () => {
    setStatus('ping');
    setPing(null);
    setDownload(null);
    setUpload(null);
    setJitter(null);
    setProgress(0);
    setError(null);
    
    abortControllerRef.current = new AbortController();

    try {
      await runPingTest();
      setProgress(20);
      
      setStatus('download');
      await runDownloadTest();
      
      setStatus('upload');
      await runUploadTest();
      
      setStatus('completed');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError("Test failed. Please check your connection and try again.");
        setStatus('error');
      }
    }
  }, []);

  const cancelTest = () => {
    abortControllerRef.current?.abort();
    setStatus('idle');
    setProgress(0);
  };

  return (
    <ToolShell
      title="Speed Tester"
      description="Private, browser-side internet speed test. Measure your download, upload, and latency without trackers."
      category={cat}
      toolId="internet-speed-test"
    >
      <div className="space-y-8">
        {/* Main Display */}
        <div className="bg-surface border border-border rounded-[40px] p-8 md:p-12 shadow-premium relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-bg overflow-hidden">
            <motion.div 
              className="h-full bg-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-8 p-6 rounded-full bg-blue/5 text-blue">
            {status === 'idle' || status === 'completed' ? (
              <Gauge className="w-16 h-16" />
            ) : (
              <RefreshCw className="w-16 h-16 animate-spin-slow" />
            )}
          </div>

          <div className="space-y-4 mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-4">
              {status === 'idle' && "Ready to test"}
              {status === 'ping' && "Measuring Latency..."}
              {status === 'download' && "Testing Download Speed..."}
              {status === 'upload' && "Testing Upload Speed..."}
              {status === 'completed' && "Test Completed"}
              {status === 'error' && "Error Occurred"}
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="text-7xl md:text-8xl font-black tracking-tighter text-text tabular-nums">
                {status === 'upload' ? (upload !== null ? upload : "00.0") : (download !== null ? download : "00.0")}
              </div>
              <div className="text-xl font-bold text-text-3 uppercase tracking-widest mt-2">Mbps</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 md:gap-16 w-full max-w-2xl">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-4">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Ping</span>
              </div>
              <div className="text-2xl font-black text-text tabular-nums">{ping !== null ? `${ping}ms` : '--'}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-4">
                <ArrowDown className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Download</span>
              </div>
              <div className="text-2xl font-black text-text tabular-nums">{download !== null ? `${download}` : '--'}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-4">
                <ArrowUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Upload</span>
              </div>
              <div className="text-2xl font-black text-text tabular-nums">{upload !== null ? `${upload}` : '--'}</div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            {status === 'idle' || status === 'completed' || status === 'error' ? (
              <button
                onClick={startTest}
                className="px-12 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                <Zap className="w-5 h-5 fill-current" />
                {status === 'idle' ? "Start Test" : "Retest"}
              </button>
            ) : (
              <button
                onClick={cancelTest}
                className="px-12 py-4 bg-surface border border-border text-text-2 font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all"
              >
                Cancel
              </button>
            )}
          </div>

          {error && (
            <div className="mt-8 text-red-500 text-sm font-bold bg-red-500/10 px-4 py-2 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border p-8 rounded-[32px] space-y-4">
            <h3 className="text-lg font-black flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                <Activity className="w-4 h-4" />
              </div>
              Understanding Ping & Jitter
            </h3>
            <p className="text-text-3 text-sm leading-relaxed font-medium">
              Ping measures the round-trip time for data to reach its destination. Lower is better for gaming and video calls. 
              <strong> Jitter</strong> ({jitter !== null ? jitter : '--'}ms) measures the variation in ping over time; high jitter can cause stuttering.
            </p>
          </div>
          <div className="bg-surface border border-border p-8 rounded-[32px] space-y-4">
            <h3 className="text-lg font-black flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                <ArrowDown className="w-4 h-4" />
              </div>
              Mbps vs MB/s
            </h3>
            <p className="text-text-3 text-sm leading-relaxed font-medium">
              Internet speeds are measured in <strong>Megabits per second (Mbps)</strong>. To find your download speed in Megabytes per second (MB/s), divide the Mbps by 8. 
              For example, 100 Mbps is roughly 12.5 MB/s.
            </p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
