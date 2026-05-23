"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { 
  Gauge, Zap, ArrowDown, ArrowUp, RefreshCw, Activity, AlertTriangle, 
  MapPin, Globe, Server, History, Share2, CheckCircle2, Video, 
  Gamepad2, MonitorPlay, Download, Wifi, SignalHigh, Timer, Send, Info,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useSupportStore } from "@/src/store/useSupportStore";

const cat = CATEGORIES.find(c => c.id === "utilities")!;
// ... (omitting lines for brevity in thought, but I must provide full new_string in real replace)

const DOWNLOAD_FILES = [
  "https://speed.cloudflare.com/__down?bytes=25000000",
  "https://cdn.jsdelivr.net/gh/fastly/fastly-test-files@master/50mb.bin",
  "https://speed.cloudflare.com/__down?bytes=50000000",
  "https://speed.cloudflare.com/__down?bytes=100000000",
];

const LATENCY_URLS = [
  "https://speed.cloudflare.com/__down?bytes=0",
  "https://www.google.com/generate_204",
];

type TestStatus = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

interface ClientInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType: string;
  };
}

interface TestResult {
  id: string;
  timestamp: number;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  loadedLatency?: number;
}

const PulseRing = ({ active, color = "rgba(79, 70, 229, 0.4)" }: { active: boolean, color?: string }) => (
  <AnimatePresence>
    {active && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.4, 1.6], 
            opacity: [0.6, 0.3, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeOut" 
          }}
          className="absolute w-full h-full rounded-full border-2"
          style={{ borderColor: color }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1.4], 
            opacity: [0.4, 0.2, 0] 
          }}
          transition={{ 
            duration: 2, 
            delay: 0.5,
            repeat: Infinity,
            ease: "easeOut" 
          }}
          className="absolute w-full h-full rounded-full border"
          style={{ borderColor: color }}
        />
      </div>
    )}
  </AnimatePresence>
);

const SpeedGauge = ({ value, max = 100, color = "#4F46E5" }: { value: number, max?: number, color?: string }) => {
  const size = 320; 
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const arcLength = circumference * 0.75; 
  const strokeDashoffset = arcLength - (progress * arcLength);

  return (
    <div className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform -rotate-225"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="16"
          strokeDasharray={arcLength}
          strokeLinecap="round"
          style={{ 
            strokeDashoffset: 0,
            opacity: 0.1
          }}
        />
        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeDasharray={arcLength}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ filter: "url(#glow)" }}
        />
      </svg>
      {/* Ticks/Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
          const angle = (tick / 100) * 270 - 225;
          const x = 50 + 44 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 44 * Math.sin((angle * Math.PI) / 180);
          const isMajor = tick % 25 === 0;
          return (
            <div
              key={tick}
              className={cn(
                "absolute font-black transform -translate-x-1/2 -translate-y-1/2 transition-colors",
                isMajor ? "text-[10px] text-text-3" : "text-[7px] text-text-4/40"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {isMajor ? Math.round((tick / 100) * max) : "•"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function InternetSpeedTestClient() {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [loadedLatency, setLoadedLatency] = useState<number | null>(null);
  const [maxDownload, setMaxDownload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [history, setHistory] = useState<{ x: number, y: number }[]>([]);
  const [pastResults, setPastResults] = useState<TestResult[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const historyRef = useRef<{ x: number, y: number }[]>([]);
  const resultsRef = useRef<{ download: number; upload: number; ping: number; jitter: number; loadedLatency?: number }>({
    download: 0, upload: 0, ping: 0, jitter: 0
  });

  useEffect(() => {
    // Fetch client info
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => setClientInfo(data))
      .catch(() => console.warn("Failed to fetch IP info"));

    // Load history
    const saved = localStorage.getItem('karuvi_speed_history');
    if (saved) {
      try {
        setPastResults(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Failed to load history");
      }
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const saveToHistory = (res: Omit<TestResult, 'id' | 'timestamp'>) => {
    const newResult: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ...res
    };
    const updated = [newResult, ...pastResults].slice(0, 5);
    setPastResults(updated);
    localStorage.setItem('karuvi_speed_history', JSON.stringify(updated));
  };

  const measureLatency = async (count = 6) => {
    const latencies: number[] = [];
    for (const url of LATENCY_URLS) {
      if (latencies.length > 0) break;
      for (let i = 0; i < count; i++) {
        if (abortControllerRef.current?.signal.aborted) break;
        const start = performance.now();
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          const sep = url.includes('?') ? '&' : '?';
          await fetch(`${url}${sep}cb=${Date.now()}`, { 
            cache: 'no-store', 
            mode: 'no-cors',
            signal: controller.signal
          });
          clearTimeout(timeout);
          latencies.push(performance.now() - start);
        } catch (e) {}
        await new Promise(r => setTimeout(r, 40));
      }
    }
    if (latencies.length === 0) return null;
    return latencies.reduce((a, b) => a + b) / latencies.length;
  };

  const runPingTest = async () => {
    const latencies: number[] = [];
    const samples = 10;
    
    for (const url of LATENCY_URLS) {
      if (latencies.length > 0) break;
      for (let i = 0; i < samples; i++) {
        if (abortControllerRef.current?.signal.aborted) return;
        const start = performance.now();
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1500);
          const sep = url.includes('?') ? '&' : '?';
          await fetch(`${url}${sep}cb=${Date.now()}`, { 
            cache: 'no-store', 
            mode: 'no-cors',
            signal: controller.signal
          });
          clearTimeout(timeout);
          latencies.push(performance.now() - start);
        } catch (e) {}
        await new Promise(r => setTimeout(r, 30));
      }
    }

    if (latencies.length === 0) {
      setErrorDetails(`All latency endpoints failed: ${LATENCY_URLS.join(', ')}`);
      throw new Error("Latency test failed: Endpoints unreachable.");
    }

    const avg = latencies.reduce((a, b) => a + b) / latencies.length;
    const sorted = [...latencies].sort((a, b) => a - b);
    const jit = sorted[sorted.length - 1]! - sorted[0]!;
    
    setPing(Math.round(avg));
    setJitter(Math.round(jit));
    resultsRef.current.ping = Math.round(avg);
    resultsRef.current.jitter = Math.round(jit);
  };

  const runDownloadTest = async () => {
    const startTime = performance.now();
    let totalBytes = 0;
    const testDuration = 10000; // 10 seconds
    const concurrency = 2; // Reduced from 4 to avoid clogging
    let maxFound = 0;
    
    historyRef.current = [];
    setHistory([]);

    const downloadChunk = async (url: string) => {
      const chunkController = new AbortController();
      const timeoutId = setTimeout(() => chunkController.abort(), testDuration + 2000);
      
      try {
        const sep = url.includes('?') ? '&' : '?';
        const response = await fetch(`${url}${sep}cb=${Date.now()}`, { 
          cache: 'no-store',
          signal: chunkController.signal
        });
        
        if (!response.ok) return;
        const reader = response.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            totalBytes += value.length;
            
            const now = performance.now();
            const elapsed = (now - startTime) / 1000;
            if (elapsed > 0) {
              const mbps = (totalBytes * 8 / elapsed) / 1000000;
              if (mbps > maxFound) {
                maxFound = mbps;
                setMaxDownload(mbps);
              }
              setDownload(parseFloat(mbps.toFixed(2)));
              setProgress(20 + Math.min((elapsed / (testDuration / 1000)) * 40, 40));
              
              if (historyRef.current.length === 0 || now - historyRef.current[historyRef.current.length - 1]!.x > 150) {
                const point = { x: now, y: mbps };
                historyRef.current = [...historyRef.current, point].slice(-60);
                setHistory(historyRef.current);
              }
            }
            if (performance.now() - startTime > testDuration) {
              chunkController.abort();
              break;
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (e) {
        // Silently handle chunk failures
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Measure loaded latency in background
    const loadedLatencyTimer = setTimeout(async () => {
      const l = await measureLatency(3);
      if (l) setLoadedLatency(Math.round(l));
    }, 3000);

    const streams = Array.from({ length: concurrency }).flatMap(() => DOWNLOAD_FILES);
    await Promise.allSettled(streams.map(url => downloadChunk(url)));
    clearTimeout(loadedLatencyTimer);

    if (totalBytes === 0) {
      setErrorDetails(`Failed to receive any data from ${DOWNLOAD_FILES.length} stream sources.`);
      throw new Error("Download test failed: No data received.");
    }
    const finalTime = (performance.now() - startTime) / 1000;
    const finalMbps = totalBytes * 8 / finalTime / 1000000;
    setDownload(parseFloat(finalMbps.toFixed(2)));
    resultsRef.current.download = parseFloat(finalMbps.toFixed(2));
  };

  const runUploadTest = async () => {
    if (!navigator.onLine) {
      throw new Error("Upload test requires an internet connection.");
    }

    const { testUpload } = await import('@onlyrex/pulse');
    
    historyRef.current = [];
    setHistory([]);
    setUpload(0);
    const startTime = performance.now();

    try {
      const result = await testUpload({
        // @ts-ignore - sizeMB is supported by @onlyrex/pulse but missing from its type definitions
        sizeMB: 5,
        url: 'https://httpbin.org/post',
        onProgress: (mbps) => {
          if (abortControllerRef.current?.signal.aborted) return;
          const currentMbps = parseFloat(mbps);
          setUpload(currentMbps);
          
          const now = performance.now();
          const elapsed = (now - startTime) / 1000;
          // Estimate progress: 60% -> 95% over the test duration
          setProgress(60 + Math.min((elapsed / 8) * 35, 35));

          if (historyRef.current.length === 0 || now - historyRef.current[historyRef.current.length - 1]!.x > 150) {
            const point = { x: now, y: currentMbps };
            historyRef.current = [...historyRef.current, point].slice(-60);
            setHistory(historyRef.current);
          }
        }
      });

      if (abortControllerRef.current?.signal.aborted) return;

      const finalMbps = parseFloat(result);
      setUpload(finalMbps);
      resultsRef.current.upload = finalMbps;
      setProgress(100);
    } catch (e: any) {
      if (e.name === 'AbortError' || abortControllerRef.current?.signal.aborted) return;
      throw e;
    }
  };

  const startTest = useCallback(async () => {
    setStatus('ping');
    setPing(null);
    setDownload(null);
    setUpload(null);
    setJitter(null);
    setLoadedLatency(null);
    setMaxDownload(0);
    setProgress(0);
    setError(null);
    setErrorDetails(null);
    setShowDetails(false);
    setHistory([]);
    
    abortControllerRef.current = new AbortController();

    try {
      await runPingTest();
      setProgress(20);
      setStatus('download');
      await runDownloadTest();
      setProgress(60);
      abortControllerRef.current = new AbortController();
      setStatus('upload');
      await runUploadTest();
      setProgress(100);
      setStatus('completed');
      saveToHistory(resultsRef.current);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || "Network Error: Speed test interrupted.");
        if (!errorDetails) setErrorDetails(err.stack || err.toString());
        setStatus('error');
      }
    }
  }, [pastResults]);

  const cancelTest = () => {
    abortControllerRef.current?.abort();
    setStatus('idle');
    setProgress(0);
  };

  const shareResults = () => {
    const text = `🚀 My KaruviLab Speed Test Result:
    
⬇️ Download: ${download} Mbps
⬆️ Upload: ${upload} Mbps
⏱️ Ping: ${ping} ms
〰️ Jitter: ${jitter} ms

Test your speed at: ${window.location.origin}/utilities/internet-speed-test/`;

    if (navigator.share) {
      navigator.share({ title: 'Internet Speed Test Result', text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  // Generate Smooth Path for Chart
  const getPath = (points: { x: number, y: number }[]) => {
    if (points.length < 2) return "";
    const maxY = Math.max(...points.map(p => p.y), 100) * 1.1;
    const mapped = points.map((p, i) => ({
      x: (i / (points.length - 1)) * 100,
      y: 100 - (p.y / maxY) * 100
    }));

    let d = `M ${mapped[0]!.x} ${mapped[0]!.y}`;
    for (let i = 0; i < mapped.length - 1; i++) {
      const curr = mapped[i]!;
      const next = mapped[i + 1]!;
      const cpX = (curr.x + next.x) / 2;
      d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const pathD = getPath(history);

  const getGrade = (down: number | null, up: number | null, ping: number | null, jitter: number | null) => {
    if (down === null || up === null || ping === null || jitter === null) 
      return { label: '--', color: 'text-text-4', sub: 'Pending' };
    
    let score = 0;
    // Download (Max 40)
    if (down >= 500) score += 40;
    else if (down >= 250) score += 35;
    else if (down >= 100) score += 30;
    else if (down >= 50) score += 20;
    else if (down >= 20) score += 10;
    else score += 5;

    // Upload (Max 30)
    if (up >= 100) score += 30;
    else if (up >= 50) score += 25;
    else if (up >= 20) score += 15;
    else if (up >= 10) score += 10;
    else score += 5;

    // Latency (Max 30)
    if (ping <= 15) score += 30;
    else if (ping <= 30) score += 25;
    else if (ping <= 60) score += 15;
    else if (ping <= 100) score += 5;

    // Jitter Penalty
    if (jitter > 20) score -= 10;
    else if (jitter > 10) score -= 5;

    if (score >= 90) return { label: 'A+', color: 'text-green-400', sub: 'Elite' };
    if (score >= 80) return { label: 'A', color: 'text-green-500', sub: 'Excellent' };
    if (score >= 70) return { label: 'B', color: 'text-blue-500', sub: 'Good' };
    if (score >= 50) return { label: 'C', color: 'text-orange-500', sub: 'Fair' };
    return { label: 'D', color: 'text-red-500', sub: 'Poor' };
  };

  const stability = jitter !== null && ping !== null 
    ? Math.max(0, Math.min(100, 100 - (jitter / (ping || 1) * 100)))
    : 100;

  const currentGrade = getGrade(download, upload, ping, jitter);

  // Big gauge shows upload speed during upload phase, and remains showing it if completed
  // unless we're in the download phase.
  const currentSpeed = status === 'upload' || (status === 'completed' && upload !== null)
    ? (upload || 0) 
    : (download || 0);
  const getGaugeMax = (val: number) => {
    if (val <= 100) return 100;
    if (val <= 250) return 250;
    if (val <= 500) return 500;
    if (val <= 1000) return 1000;
    return Math.ceil(val / 500) * 500;
  };
  const gaugeMax = getGaugeMax(Math.max(currentSpeed, maxDownload));

  return (
    <div className="space-y-12">
      {/* Main Testing Console */}
      <div className="bg-surface border border-border rounded-[48px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          {/* Global Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-bg/50 overflow-hidden">
            <motion.div 
              className="h-full bg-blue shadow-[0_0_10px_rgba(79,70,229,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex flex-col xl:flex-row gap-16 items-start">
            {/* Left Column: Primary Visualization */}
            <div className="flex-1 w-full space-y-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue">
                    {status === 'idle' && "System Ready"}
                    {status === 'ping' && "Pinging Global Edge..."}
                    {status === 'download' && "Stream Download Active"}
                    {status === 'upload' && "Encrypted Upload Active"}
                    {status === 'completed' && "Diagnostic Complete"}
                    {status === 'error' && "Diagnostic Failure"}
                  </h2>
                  <div className="flex items-center gap-3">
                     <div className={cn("w-2 h-2 rounded-full", status !== 'idle' && status !== 'completed' ? "bg-blue animate-pulse shadow-[0_0_8px_#4F46E5]" : "bg-text-4")} />
                     <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight">
                           {status === 'completed' ? "Connection Profile" : (status === 'idle' ? "Ready" : "In Progress...")}
                        </span>
                        {status === 'idle' && (
                          <span className="text-[9px] text-text-4 font-bold uppercase tracking-widest mt-1">
                            ■ Mumbai Edge · HTTPS · TLS 1.3
                          </span>
                        )}
                     </div>
                  </div>
                </div>
                
                {status === 'completed' && (
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-text-4 uppercase tracking-widest">Connection Grade</span>
                        <span className={cn("text-3xl font-black leading-none", currentGrade.color)}>
                           {currentGrade.label}
                        </span>
                     </div>
                     <div className="h-10 w-px bg-border" />
                     <div className="px-4 py-2 bg-blue/5 border border-blue/10 rounded-2xl flex flex-col">
                        <span className="text-[8px] font-black text-blue uppercase tracking-widest">Status</span>
                        <span className={cn("text-xs font-bold uppercase tracking-tight", currentGrade.color)}>
                           {currentGrade.sub}
                        </span>
                     </div>
                  </div>
                )}
              </div>

              {/* Central Speed Gauge */}
              <div className="relative py-8 flex flex-col items-center xl:items-start">
                <div className="relative flex items-center justify-center">
                   <PulseRing active={status !== 'idle' && status !== 'completed' && status !== 'error'} />
                   
                   <SpeedGauge 
                     value={currentSpeed} 
                     max={gaugeMax} 
                   />

                   <div className="absolute flex flex-col items-center justify-center text-center pt-8">
                      <div className="text-5xl md:text-7xl font-black tracking-tighter text-text tabular-nums flex items-baseline gap-2 leading-none">
                        <motion.span 
                          key={status === 'upload' ? 'up' : 'down'}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          {currentSpeed > 0 ? currentSpeed.toFixed(1) : "0.0"}
                        </motion.span>
                        <span className="text-sm md:text-xl font-black text-text-4 uppercase tracking-[0.1em] opacity-40">Mbps</span>
                      </div>
                      
                      <div className="mt-2 text-[10px] font-black text-text-4 uppercase tracking-[0.2em]">
                        {status === 'upload' ? '↑ Uploading' : status === 'download' ? '↓ Downloading' : 'Bandwidth'}
                      </div>
                   </div>

                   {/* Peak Indicator Overlay */}
                   {status === 'download' && maxDownload > 0 && (
                     <div className="absolute top-12 right-0 bg-blue/5 border border-blue/10 backdrop-blur-sm px-3 py-1.5 rounded-full hidden md:block">
                        <div className="text-[8px] font-black text-blue uppercase tracking-widest opacity-60">Peak Speed</div>
                        <div className="text-sm font-bold text-blue tabular-nums">{maxDownload.toFixed(1)} <span className="text-[10px]">Mbps</span></div>
                     </div>
                   )}
                </div>

                {/* Smooth Bézier Chart */}
                <div className="w-full h-32 mt-12 bg-bg/40 rounded-[32px] overflow-hidden relative border border-border/50 group">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d={pathD ? `${pathD} L 100 100 L 0 100 Z` : ""} 
                      fill="url(#chartGradient)" 
                      className="transition-all duration-700 ease-out"
                    />
                    <path
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={pathD}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  
                  {status !== 'idle' && status !== 'completed' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="px-4 py-2 bg-surface/80 backdrop-blur-md border border-border rounded-full flex items-center gap-2 shadow-xl">
                          <RefreshCw className="w-3 h-3 text-blue animate-spin" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Collecting Samples...</span>
                       </div>
                    </div>
                  )}
                </div>
              </div>

            {/* Action Area */}
              <div className="flex flex-wrap items-center gap-4">
                {status === 'idle' || status === 'completed' || status === 'error' ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={startTest}
                      className="group relative px-8 py-5 bg-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-sm overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      <Zap className="w-5 h-5 fill-current" />
                      {status === 'idle' ? "Start" : "New Test"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={cancelTest}
                    className="px-10 py-5 bg-surface border border-border text-text-2 font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 active:scale-95 transition-all text-sm"
                  >
                    Stop
                  </button>
                )}

                {status === 'completed' && (
                  <button 
                    onClick={shareResults}
                    className="p-5 bg-surface border border-border text-text-3 rounded-2xl hover:text-blue hover:border-blue/20 transition-all"
                  >
                     <Share2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Secondary Metrics & Info */}
            <div className="w-full xl:w-96 space-y-6">
              {/* Essential Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1 group hover:border-blue/30 transition-colors">
                  <div className="flex items-center gap-2 text-text-4">
                    <ArrowDown className="w-3.5 h-3.5 group-hover:text-blue transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Download</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">
                    {download !== null ? download.toFixed(1) : '--'}
                    {download !== null && <span className="text-[10px] ml-1 opacity-40">Mbps</span>}
                  </div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1 group hover:border-blue/30 transition-colors">
                  <div className="flex items-center gap-2 text-text-4">
                    <ArrowUp className="w-3.5 h-3.5 group-hover:text-blue transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">
                    {upload !== null ? upload.toFixed(1) : '--'}
                    {upload !== null && <span className="text-[10px] ml-1 opacity-40">Mbps</span>}
                  </div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1 group hover:border-blue/30 transition-colors">
                  <div className="flex items-center gap-2 text-text-4">
                    <Activity className="w-3.5 h-3.5 group-hover:text-blue transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Latency (Idle)</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{ping !== null ? `${ping}ms` : '--'}</div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1 group hover:border-blue/30 transition-colors">
                  <div className="flex items-center gap-2 text-text-4">
                    <RefreshCw className="w-3.5 h-3.5 group-hover:text-blue transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Jitter</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{jitter !== null ? `${jitter}ms` : '--'}</div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1 group hover:border-blue/30 transition-colors">
                  <div className="flex items-center gap-2 text-text-4">
                    <ShieldCheck className="w-3.5 h-3.5 group-hover:text-blue transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Stability</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{status === 'completed' ? `${stability.toFixed(0)}%` : status === 'idle' ? '--' : 'Calc...'}</div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1 group hover:border-blue/30 transition-colors">
                  <div className="flex items-center gap-2 text-text-4">
                    <Timer className="w-3.5 h-3.5 group-hover:text-blue transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Loaded Latency</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">
                    {loadedLatency !== null ? `${loadedLatency}ms` : status === 'download' ? "..." : '--'}
                  </div>
                </div>
              </div>

              {/* Provider Information */}
              <div className="bg-bg/40 border border-border/50 p-6 rounded-[32px] space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-2">
                    <Server className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black text-text-4 uppercase tracking-widest">ISP / AS Name</div>
                    <div className="text-sm font-bold text-text truncate">{clientInfo?.org || 'Detecting...'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-2">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-black text-text-4 uppercase tracking-widest">Public IP</div>
                    <div className="text-sm font-bold text-text tabular-nums">{clientInfo?.ip || '0.0.0.0'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-2">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black text-text-4 uppercase tracking-widest">Node Location</div>
                    <div className="text-sm font-bold text-text truncate">{clientInfo ? `${clientInfo.city}, ${clientInfo.country_name}` : 'Detecting...'}</div>
                  </div>
                </div>
              </div>

              {/* Persistence: Recent History */}
              <AnimatePresence>
                {pastResults.length > 0 && (status === 'idle' || status === 'completed') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between px-1">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-text-4">Recent Tests</h3>
                       <button onClick={() => { setPastResults([]); localStorage.removeItem('karuvi_speed_history'); }} className="text-[9px] font-bold text-red-500/60 uppercase">Clear</button>
                    </div>
                    <div className="space-y-2">
                       {pastResults.map((r, i) => (
                         <div key={r.id} className="bg-surface border border-border px-4 py-3 rounded-2xl flex items-center justify-between group hover:border-blue/20 transition-all">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                               <span className="text-[10px] font-bold text-text-3">{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex gap-4 text-xs font-black tabular-nums">
                               <span className="text-text">{r.download.toFixed(0)} <span className="text-[9px] text-text-4 font-bold">DN</span></span>
                               <span className="text-text">{r.upload.toFixed(0)} <span className="text-[9px] text-text-4 font-bold">UP</span></span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-6 bg-red-500/5 border border-red-500/10 rounded-[32px] flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
                   <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
                </div>
                <button
                  onClick={() => useSupportStore.getState().openFeedback('bug', {
                    toolId: 'internet-speed-test',
                    toolName: 'Speed Tester',
                    error: error,
                    metadata: { details: errorDetails }
                  })}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                >                  Report Issue
                </button>
              </div>

              {errorDetails && (
                <div className="pt-4 border-t border-red-500/10">
                   <button 
                     onClick={() => setShowDetails(!showDetails)}
                     className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                   >
                     <Info className="w-3 h-3" />
                     {showDetails ? "Hide Diagnostic Info" : "View Error Details"}
                   </button>
                   {showDetails && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="mt-3"
                     >
                       <pre className="p-4 bg-bg/50 rounded-2xl text-[10px] font-mono text-red-400/80 overflow-x-auto whitespace-pre-wrap break-all border border-red-500/5">
                          {errorDetails}
                       </pre>
                     </motion.div>
                   )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Intelligence: Connection Utility Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IntelligenceCard 
            icon={MonitorPlay}
            title="4K Streaming"
            requirement={25}
            current={download}
            desc="Sustained bandwidth for Ultra HD."
          />
          <IntelligenceCard 
            icon={Gamepad2}
            title="Gaming"
            requirement={50}
            current={ping}
            isLatency
            desc="Stability for competitive play."
          />
          <IntelligenceCard 
            icon={Video}
            title="Video Calls"
            requirement={5}
            current={upload}
            desc="HD clarity for conferencing."
          />
          <IntelligenceCard 
            icon={Wifi}
            title="Multi-Device"
            requirement={100}
            current={download}
            desc="Shared bandwidth capacity."
          />
        </div>

        {/* Professional Technical Analysis */}
        {status === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border p-10 rounded-[48px] space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">Professional Technical Analysis</h2>
                  <p className="text-sm text-text-3 font-medium">Deep-packet inspection and connection stability metrics.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-blue/5 border border-blue/10 rounded-2xl flex flex-col items-center">
                     <span className="text-[8px] font-black text-blue uppercase tracking-widest">Network Type</span>
                     <span className="text-xs font-bold text-text uppercase">
                        {(navigator as NavigatorWithConnection).connection?.effectiveType || 'Broadband'}
                     </span>
                  </div>
                  <div className="px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-2xl flex flex-col items-center">
                     <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Bufferbloat</span>
                     <span className="text-xs font-bold text-text uppercase">
                        {loadedLatency && ping ? (loadedLatency - ping < 20 ? 'Grade A' : loadedLatency - ping < 50 ? 'Grade B' : 'Grade C') : 'N/A'}
                     </span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-6 bg-bg/40 border border-border/50 rounded-[32px] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
                     <Zap className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-black text-sm uppercase tracking-wider mb-1">Burst Capacity</h3>
                     <p className="text-[11px] text-text-3 font-medium leading-relaxed">
                        Measured peak bandwidth of {maxDownload.toFixed(1)} Mbps suggests a sustained link capacity for large binary transfers and 8K video streams.
                     </p>
                  </div>
               </div>
               <div className="p-6 bg-bg/40 border border-border/50 rounded-[32px] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-black text-sm uppercase tracking-wider mb-1">Jitter Variance</h3>
                     <p className="text-[11px] text-text-3 font-medium leading-relaxed">
                        A jitter of {jitter}ms indicates a {(jitter || 0) < 5 ? 'highly stable' : 'variable'} packet delivery rhythm, essential for real-time VOIP and competitive gaming.
                     </p>
                  </div>
               </div>
               <div className="p-6 bg-bg/40 border border-border/50 rounded-[32px] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/5 flex items-center justify-center text-green-500">
                     <MonitorPlay className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-black text-sm uppercase tracking-wider mb-1">Streaming Score</h3>
                     <p className="text-[11px] text-text-3 font-medium leading-relaxed">
                        The connection supports up to {Math.floor((download || 0) / 25)} concurrent 4K streams based on Netflix's Ultra HD bandwidth requirements.
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </div>
  );
}

function IntelligenceCard({ icon: Icon, title, requirement, current, isLatency, desc }: any) {
  const isReady = current !== null && (isLatency ? current <= requirement : current >= requirement);
  const status = current === null ? 'pending' : isReady ? 'yes' : 'no';

  return (
    <div className={cn(
      "bg-surface border p-6 rounded-[32px] space-y-4 transition-all duration-500 relative overflow-hidden group",
      status === 'yes' ? "border-green-500/20 shadow-lg shadow-green-500/5" : "border-border"
    )}>
      {status === 'yes' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
      )}
      
      <div className="flex items-center justify-between relative z-10">
         <div className={cn(
           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
           status === 'yes' ? "bg-green-500/10 text-green-600 scale-110" : "bg-bg text-text-4"
         )}>
            <Icon className="w-6 h-6" />
         </div>
         {status !== 'pending' && (
           <div className={cn(
             "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
             status === 'yes' ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-red-500/10 text-red-500"
           )}>
              {status === 'yes' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Optimal</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Limited</span>
                </>
              )}
           </div>
         )}
      </div>
      
      <div className="space-y-1 relative z-10">
        <h3 className="font-black text-sm tracking-tight text-text group-hover:text-blue transition-colors">{title}</h3>
        <p className="text-[10px] text-text-4 leading-relaxed font-medium">{desc}</p>
      </div>
      
      <div className="pt-2 flex items-center gap-3 relative z-10">
         <div className="h-1.5 flex-1 bg-bg rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", status === 'yes' ? "bg-green-500" : "bg-text-4/30")}
              initial={{ width: 0 }}
              animate={{ width: status === 'yes' ? '100%' : status === 'no' ? '40%' : '0%' }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
         </div>
         <span className="text-[9px] font-black text-text-3 tabular-nums">
           {isLatency ? `${requirement}ms` : `${requirement}Mbps`}
         </span>
      </div>
    </div>
  );
}
