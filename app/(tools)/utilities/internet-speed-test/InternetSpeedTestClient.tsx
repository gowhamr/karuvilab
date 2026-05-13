"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { Gauge, Zap, ArrowDown, ArrowUp, RefreshCw, Activity, AlertTriangle, MapPin, Globe, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const DOWNLOAD_FILES = [
  "https://cdn.jsdelivr.net/gh/fastly/fastly-test-files@master/10mb.bin",
  "https://cdn.jsdelivr.net/gh/leandromoreira/digital-video-benchmark@master/static/10mb.bin",
  "https://cdn.jsdelivr.net/gh/fastly/fastly-test-files@master/50mb.bin"
];

const LATENCY_URLS = [
  "https://www.google.com/generate_204",
  "https://cdn.jsdelivr.net/gh/fastly/fastly-test-files@master/10mb.bin"
];

type TestStatus = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

interface ClientInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
}

export default function InternetSpeedTestClient() {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [history, setHistory] = useState<{ x: number, y: number }[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const historyRef = useRef<{ x: number, y: number }[]>([]);

  useEffect(() => {
    // Fetch client info on mount
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => setClientInfo(data))
      .catch(() => console.warn("Failed to fetch IP info"));
  }, []);

  const runPingTest = async () => {
    const latencies: number[] = [];
    const samples = 6;
    
    // Try primary and fallback
    for (const url of LATENCY_URLS) {
      if (latencies.length > 0) break;

      for (let i = 0; i < samples; i++) {
        if (abortControllerRef.current?.signal.aborted) return;
        
        const start = performance.now();
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          
          await fetch(url + `?cb=${Date.now()}`, { 
            cache: 'no-store', 
            mode: 'no-cors',
            signal: controller.signal
          });
          clearTimeout(timeout);
          latencies.push(performance.now() - start);
        } catch (e) {
          // Continue to next sample or URL
        }
        await new Promise(r => setTimeout(r, 50));
      }
    }

    if (latencies.length === 0) {
      // Last resort: use current domain
      const start = performance.now();
      try {
        await fetch(`/?cb=${Date.now()}`, { cache: 'no-store' });
        latencies.push(performance.now() - start);
      } catch (e) {
        throw new Error("Latency test failed: All endpoints unreachable.");
      }
    }

    const avg = latencies.reduce((a, b) => a + b) / latencies.length;
    const sorted = [...latencies].sort((a, b) => a - b);
    const jit = sorted[sorted.length - 1]! - sorted[0]!;
    
    setPing(Math.round(avg));
    setJitter(Math.round(jit));
  };

  const runDownloadTest = async () => {
    const startTime = performance.now();
    let totalBytes = 0;
    const testDuration = 8000; // 8 seconds test
    
    historyRef.current = [];
    setHistory([]);

    const downloadChunk = async (url: string) => {
      try {
        const response = await fetch(url + `?cb=${Date.now()}`, { 
          cache: 'no-store',
          signal: abortControllerRef.current?.signal ?? null
        });
        if (!response.ok) return;
        
        const reader = response.body?.getReader();
        if (!reader) return;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          totalBytes += value.length;
          
          const now = performance.now();
          const elapsed = (now - startTime) / 1000;
          if (elapsed > 0) {
            const mbps = (totalBytes * 8 / elapsed) / 1000000;
            setDownload(parseFloat(mbps.toFixed(2)));
            setProgress(20 + (elapsed / (testDuration / 1000)) * 40);
            
            // Update history for chart
            if (historyRef.current.length === 0 || now - historyRef.current[historyRef.current.length - 1]!.x > 200) {
              const point = { x: now, y: mbps };
              historyRef.current = [...historyRef.current, point].slice(-50);
              setHistory(historyRef.current);
            }
          }
          
          if (now - startTime > testDuration) {
            break;
          }
        }
      } catch (e) {
        // Silently handle chunk failure if some chunks succeeded
      }
    };

    // Run multiple downloads in parallel to saturate the link
    await Promise.allSettled(DOWNLOAD_FILES.map(url => downloadChunk(url)));

    if (totalBytes === 0) throw new Error("Download test failed: Could not receive data.");

    const finalTime = (performance.now() - startTime) / 1000;
    setDownload(parseFloat((totalBytes * 8 / finalTime / 1000000).toFixed(2)));
  };

  const runUploadTest = async () => {
    const startTime = performance.now();
    let totalBytes = 0;
    const testDuration = 6000; // 6 seconds
    
    historyRef.current = [];
    setHistory([]);

    const uploadData = async () => {
      const size = 5 * 1024 * 1024; // 5MB chunks
      const data = new Uint8Array(size);
      crypto.getRandomValues(data);

      try {
        const response = await fetch('/api/speedtest/upload', {
          method: 'POST',
          body: data,
          signal: abortControllerRef.current?.signal ?? null
        });
        if (response.ok) {
          totalBytes += size;
          const now = performance.now();
          const elapsed = (now - startTime) / 1000;
          const mbps = (totalBytes * 8 / elapsed) / 1000000;
          setUpload(parseFloat(mbps.toFixed(2)));
          setProgress(60 + (elapsed / (testDuration / 1000)) * 40);
          
          if (historyRef.current.length === 0 || now - historyRef.current[historyRef.current.length - 1]!.x > 200) {
            const point = { x: now, y: mbps };
            historyRef.current = [...historyRef.current, point].slice(-50);
            setHistory(historyRef.current);
          }

          if (now - startTime < testDuration) {
            await uploadData(); // Repeat for duration
          }
        }
      } catch (e) {
         if ((e as Error).name !== 'AbortError') throw e;
      }
    };

    await uploadData();
    const finalTime = (performance.now() - startTime) / 1000;
    setUpload(parseFloat((totalBytes * 8 / finalTime / 1000000).toFixed(2)));
  };

  const startTest = useCallback(async () => {
    setStatus('ping');
    setPing(null);
    setDownload(null);
    setUpload(null);
    setJitter(null);
    setProgress(0);
    setError(null);
    setHistory([]);
    
    abortControllerRef.current = new AbortController();

    try {
      await runPingTest();
      setProgress(20);
      
      setStatus('download');
      await runDownloadTest();
      setProgress(60);
      
      // Reset controller for upload because we might have aborted download to stop it
      abortControllerRef.current = new AbortController();
      setStatus('upload');
      await runUploadTest();
      
      setProgress(100);
      setStatus('completed');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Test Error:", err);
        setError("Network Error: Could not reach speed test servers. Please check your internet connection.");
        setStatus('error');
      }
    }
  }, []);

  const cancelTest = () => {
    abortControllerRef.current?.abort();
    setStatus('idle');
    setProgress(0);
    setHistory([]);
  };

  const chartPoints = history.length > 1 
    ? history.map((p, i) => `${(i / (history.length - 1)) * 100},${100 - (Math.min(p.y, 200) / 200) * 100}`).join(' ')
    : "0,100 100,100";

  return (
    <ToolShell
      title="Speed Tester"
      description="Professional-grade internet speed test. Measure your download, upload, and latency with real-time feedback."
      category={cat}
      toolId="internet-speed-test"
    >
      <div className="space-y-8">
        {/* Main Display */}
        <div className="bg-surface border border-border rounded-[40px] p-8 md:p-12 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-bg overflow-hidden">
            <motion.div 
              className="h-full bg-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Speed Visual */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-2">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-4">
                  {status === 'idle' && "Ready to test"}
                  {status === 'ping' && "Measuring Latency..."}
                  {status === 'download' && "Testing Download Speed..."}
                  {status === 'upload' && "Testing Upload Speed..."}
                  {status === 'completed' && "Test Completed"}
                  {status === 'error' && "Test Interrupted"}
                </h2>
                
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-7xl md:text-9xl font-black tracking-tighter text-text tabular-nums flex items-baseline gap-2">
                    {status === 'upload' 
                      ? (upload !== null ? upload.toFixed(1) : "0.0") 
                      : (download !== null ? download.toFixed(1) : "0.0")}
                    <span className="text-2xl md:text-3xl font-bold text-text-3 uppercase tracking-widest">Mbps</span>
                  </div>
                </div>
              </div>

              {/* Real-time Chart */}
              <div className="h-32 w-full bg-bg/50 rounded-2xl overflow-hidden relative group border border-border/50">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M 0 100 L ${chartPoints} L 100 100 Z`} 
                    fill="url(#gradient)" 
                    className="transition-all duration-300"
                  />
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    points={chartPoints}
                    className="transition-all duration-300"
                  />
                </svg>
                {status !== 'idle' && status !== 'completed' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue rounded-full animate-ping" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {status === 'idle' || status === 'completed' || status === 'error' ? (
                  <button
                    onClick={startTest}
                    className="px-12 py-5 bg-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-sm"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    {status === 'idle' ? "Start Speed Test" : "Retest Connection"}
                  </button>
                ) : (
                  <button
                    onClick={cancelTest}
                    className="px-12 py-5 bg-surface border border-border text-text-2 font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all text-sm"
                  >
                    Cancel Test
                  </button>
                )}
              </div>
            </div>

            {/* Right: Metrics Grid */}
            <div className="w-full lg:w-80 grid grid-cols-1 gap-4">
              <div className="bg-bg/50 border border-border/50 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div className="flex items-center gap-2 text-text-4">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Latency</span>
                  </div>
                  <div className="text-xl font-black text-text tabular-nums">{ping !== null ? `${ping}ms` : '--'}</div>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div className="flex items-center gap-2 text-text-4">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Download</span>
                  </div>
                  <div className="text-xl font-black text-text tabular-nums">{download !== null ? `${download}` : '--'}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-4">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Upload</span>
                  </div>
                  <div className="text-xl font-black text-text tabular-nums">{upload !== null ? `${upload}` : '--'}</div>
                </div>
              </div>

              <div className="bg-bg/50 border border-border/50 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-text-4 uppercase tracking-widest">Your Network</div>
                    <div className="text-sm font-bold text-text truncate">{clientInfo?.org || 'Detecting...'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-text-4 uppercase tracking-widest">Location</div>
                    <div className="text-sm font-bold text-text truncate">{clientInfo ? `${clientInfo.city}, ${clientInfo.country_name}` : 'Detecting...'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-red-500 text-sm font-bold bg-red-500/10 px-6 py-4 rounded-2xl border border-red-500/20 text-center"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border p-8 rounded-[32px] space-y-4">
             <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                <Activity className="w-5 h-5" />
              </div>
            <h3 className="text-lg font-black tracking-tight">How it works</h3>
            <p className="text-text-3 text-sm leading-relaxed font-medium">
              We download binary chunks from high-speed CDNs like Fastly and jsDelivr to measure your maximum bandwidth. Latency is measured against Google's global infrastructure.
            </p>
          </div>
          <div className="bg-surface border border-border p-8 rounded-[32px] space-y-4">
             <div className="w-10 h-10 rounded-xl bg-green-500/5 flex items-center justify-center text-green-500">
                <Server className="w-5 h-5" />
              </div>
            <h3 className="text-lg font-black tracking-tight">Private Upload</h3>
            <p className="text-text-3 text-sm leading-relaxed font-medium">
              Unlike other tests that use public "echo" servers, our upload test goes directly to our private edge API, ensuring your data never touches third-party tracking endpoints.
            </p>
          </div>
          <div className="bg-surface border border-border p-8 rounded-[32px] space-y-4">
             <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500">
                <Globe className="w-5 h-5" />
              </div>
            <h3 className="text-lg font-black tracking-tight">Accurate Jitter</h3>
            <p className="text-text-3 text-sm leading-relaxed font-medium">
              We measure jitter ({jitter !== null ? jitter : '--'}ms) by analyzing the variance in multiple latency samples, giving you a better idea of your connection stability for VoIP and gaming.
            </p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
