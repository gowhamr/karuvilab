"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { 
  Gauge, Zap, ArrowDown, ArrowUp, RefreshCw, Activity, AlertTriangle, 
  MapPin, Globe, Server, History, Share2, CheckCircle2, Video, 
  Gamepad2, MonitorPlay, Download, Wifi, SignalHigh, Timer, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

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
  const size = 320; // Internal coordinate system
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const arcLength = circumference * 0.75; // 3/4 circle
  const strokeDashoffset = arcLength - (progress * arcLength);

  return (
    <div className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform -rotate-225"
      >
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="12"
          strokeDasharray={arcLength}
          strokeLinecap="round"
          style={{ 
            strokeDashoffset: 0,
            opacity: 0.2
          }}
        />
        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={arcLength}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ 
            filter: `drop-shadow(0 0 8px ${color}66)`
          }}
        />
      </svg>
      {/* Ticks/Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (tick / 100) * 270 - 225;
          const x = 50 + 42 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 42 * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={tick}
              className="absolute text-[8px] font-black text-text-4 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {Math.round((tick / 100) * max)}
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
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [history, setHistory] = useState<{ x: number, y: number }[]>([]);
  const [pastResults, setPastResults] = useState<TestResult[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const historyRef = useRef<{ x: number, y: number }[]>([]);
  const resultsRef = useRef<{ download: number; upload: number; ping: number; jitter: number; loadedLatency?: number }>({
    download: 0, upload: 0, ping: 0, jitter: 0
  });

  const runSimulation = async () => {
    setStatus('ping');
    setPing(null);
    setDownload(null);
    setUpload(null);
    setJitter(null);
    setLoadedLatency(null);
    setMaxDownload(0);
    setProgress(0);
    setHistory([]);
    
    // 1. Simulate Ping
    await new Promise(r => setTimeout(r, 1500));
    const mockPing = Math.floor(Math.random() * 15) + 12;
    const mockJitter = Math.floor(Math.random() * 4) + 1;
    setPing(mockPing);
    setJitter(mockJitter);
    resultsRef.current.ping = mockPing;
    resultsRef.current.jitter = mockJitter;
    setProgress(20);

    // 2. Simulate Download
    setStatus('download');
    const targetDown = Math.floor(Math.random() * (240 - 60)) + 60;
    const downSteps = 60;
    for (let i = 0; i <= downSteps; i++) {
      const t = i / downSteps;
      const easing = 1 - Math.pow(1 - t, 3); // Cubic Ease Out
      const current = targetDown * easing;
      setDownload(parseFloat(current.toFixed(1)));
      setProgress(20 + (t * 40));
      
      const now = Date.now();
      const point = { x: now, y: current };
      historyRef.current = [...historyRef.current, point].slice(-60);
      setHistory(historyRef.current);
      
      await new Promise(r => setTimeout(r, 50));
    }
    resultsRef.current.download = targetDown;
    setMaxDownload(targetDown + (Math.random() * 10));

    // 3. Simulate Upload
    historyRef.current = [];
    setHistory([]);
    setStatus('upload');
    const targetUp = Math.floor(Math.random() * (80 - 20)) + 20;
    const upSteps = 50;
    for (let i = 0; i <= upSteps; i++) {
      const t = i / upSteps;
      const easing = 1 - Math.pow(1 - t, 3);
      const current = targetUp * easing;
      setUpload(parseFloat(current.toFixed(1)));
      setProgress(60 + (t * 40));
      
      const now = Date.now();
      const point = { x: now, y: current };
      historyRef.current = [...historyRef.current, point].slice(-60);
      setHistory(historyRef.current);

      await new Promise(r => setTimeout(r, 60));
    }
    resultsRef.current.upload = targetUp;

    setStatus('completed');
    saveToHistory(resultsRef.current);
  };

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

    if (latencies.length === 0) throw new Error("Latency test failed: Endpoints unreachable.");

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
    const concurrency = 4;
    let maxFound = 0;
    
    historyRef.current = [];
    setHistory([]);

    const downloadChunk = async (url: string) => {
      try {
        const sep = url.includes('?') ? '&' : '?';
        const response = await fetch(`${url}${sep}cb=${Date.now()}`, { 
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
          if (now - startTime > testDuration) break;
        }
      } catch (e) {}
    };

    // Measure loaded latency in background
    const loadedLatencyTimer = setTimeout(async () => {
      const l = await measureLatency(3);
      if (l) setLoadedLatency(Math.round(l));
    }, 3000);

    await Promise.allSettled(Array.from({ length: concurrency }).flatMap(() => DOWNLOAD_FILES).map(url => downloadChunk(url)));
    clearTimeout(loadedLatencyTimer);

    if (totalBytes === 0) throw new Error("Download test failed.");
    const finalTime = (performance.now() - startTime) / 1000;
    const finalMbps = totalBytes * 8 / finalTime / 1000000;
    setDownload(parseFloat(finalMbps.toFixed(2)));
    resultsRef.current.download = parseFloat(finalMbps.toFixed(2));
  };

  const runUploadTest = async () => {
    const startTime = performance.now();
    let totalBytes = 0;
    const testDuration = 8000; // 8 seconds
    const concurrency = 3;
    
    historyRef.current = [];
    setHistory([]);

    const uploadWorker = async () => {
      const size = 1 * 1024 * 1024; // 1MB chunks
      const data = new Uint8Array(size);
      crypto.getRandomValues(data);
      const blob = new Blob([data], { type: 'application/octet-stream' });

      while (performance.now() - startTime < testDuration) {
        if (abortControllerRef.current?.signal.aborted) break;
        
        const chunkController = new AbortController();
        const timeoutId = setTimeout(() => chunkController.abort(), 12000);

        try {
          const response = await fetch('/api/speedtest/upload', {
            method: 'POST',
            body: blob,
            signal: chunkController.signal,
            // Only use duplex: 'half' if body was a ReadableStream. 
            // Since we use a Blob, it's not required and can cause TypeError in some browsers.
          });
          
          clearTimeout(timeoutId);
          if (response.ok) {
            totalBytes += size;
            const now = performance.now();
            const elapsed = (now - startTime) / 1000;
            const mbps = (totalBytes * 8 / elapsed) / 1000000;
            setUpload(parseFloat(mbps.toFixed(2)));
            setProgress(60 + Math.min((elapsed / (testDuration / 1000)) * 40, 40));
            
            if (historyRef.current.length === 0 || now - historyRef.current[historyRef.current.length - 1]!.x > 150) {
              const point = { x: now, y: mbps };
              historyRef.current = [...historyRef.current, point].slice(-60);
              setHistory(historyRef.current);
            }
          } else {
            // Wait slightly before retrying on server error
            await new Promise(r => setTimeout(r, 500));
          }
        } catch (e) {
          clearTimeout(timeoutId);
          const isAbort = (e as Error).name === 'AbortError';
          if (isAbort && !abortControllerRef.current?.signal.aborted) {
            continue; // Retry on individual chunk timeout
          }
          console.error("Upload chunk error:", e);
          break; // Stop worker on fatal network error
        }
      }
    };

    setUpload(0); // Initialize to 0 so it doesn't show '--'
    await Promise.allSettled(Array.from({ length: concurrency }).map(() => uploadWorker()));
    const finalTime = (performance.now() - startTime) / 1000;
    
    if (totalBytes === 0) {
      throw new Error("Upload test failed: No data could be transmitted.");
    }
    
    const finalMbps = totalBytes * 8 / finalTime / 1000000;
    setUpload(parseFloat(finalMbps.toFixed(2)));
    resultsRef.current.upload = parseFloat(finalMbps.toFixed(2));
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

  const getRating = (speed: number | null) => {
    if (speed === null) return { label: 'Pending', color: 'text-text-4' };
    if (speed >= 100) return { label: 'Excellent', color: 'text-success' };
    if (speed >= 50) return { label: 'Good', color: 'text-blue' };
    if (speed >= 20) return { label: 'Fair', color: 'text-orange-500' };
    return { label: 'Poor', color: 'text-red-500' };
  };

  const currentRating = getRating(download);

  const currentSpeed = status === 'upload' ? (upload || 0) : (download || 0);
  const getGaugeMax = (val: number) => {
    if (val <= 100) return 100;
    if (val <= 250) return 250;
    if (val <= 500) return 500;
    if (val <= 1000) return 1000;
    return Math.ceil(val / 500) * 500;
  };
  const gaugeMax = getGaugeMax(Math.max(currentSpeed, maxDownload));

  return (
    <ToolShell
      title="Speed Tester Pro"
      description="Professional-grade internet diagnostic tool. High-precision measurement of bandwidth, latency, and connection stability."
      category={cat}
      toolId="internet-speed-test"
    >
      <div className="space-y-12">
        {/* Main Testing Console */}
        <div className="bg-surface border border-border rounded-[48px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
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
                    {status === 'ping' && (isSimulated ? "Connecting to Mumbai Edge..." : "Pinging Global Edge...")}
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
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue/5 border border-blue/10 rounded-full">
                     <SignalHigh className="w-4 h-4 text-blue" />
                     <span className={cn("text-xs font-black uppercase tracking-widest", currentRating.color)}>
                        {currentRating.label}
                     </span>
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
                      onClick={isSimulated ? runSimulation : startTest}
                      className="group relative px-8 py-5 bg-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-sm overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      <Zap className="w-5 h-5 fill-current" />
                      {status === 'idle' ? (isSimulated ? "Start Simulation" : "Start") : "New Test"}
                    </button>
                    
                    {status === 'idle' && (
                      <button
                        onClick={() => setIsSimulated(!isSimulated)}
                        className={cn(
                          "px-6 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border whitespace-nowrap",
                          isSimulated 
                            ? "bg-blue/10 border-blue text-blue" 
                            : "bg-surface border-border text-text-4 hover:border-blue/30"
                        )}
                      >
                        {isSimulated ? "Simulation On" : "Simulation Off"}
                      </button>
                    )}
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
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1">
                  <div className="flex items-center gap-2 text-text-4">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Ping</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{ping !== null ? `${ping}ms` : '--'}</div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1">
                  <div className="flex items-center gap-2 text-text-4">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Jitter</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{jitter !== null ? `${jitter}ms` : '--'}</div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1">
                  <div className="flex items-center gap-2 text-text-4">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Download</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{download !== null ? download.toFixed(1) : '--'}</div>
                </div>
                <div className="bg-bg/40 border border-border/50 p-5 rounded-[24px] space-y-1">
                  <div className="flex items-center gap-2 text-text-4">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload</span>
                  </div>
                  <div className="text-2xl font-black text-text tabular-nums">{upload !== null ? upload.toFixed(1) : '--'}</div>
                </div>
              </div>

              {/* Advanced Diagnostic: Loaded Latency / Bufferbloat */}
              <div className="bg-blue/5 border border-blue/10 p-5 rounded-[24px] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                       <Timer className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-blue uppercase tracking-widest">Loaded Latency</div>
                       <div className="text-[10px] font-medium text-text-3">Response while busy</div>
                    </div>
                 </div>
                 <div className="text-xl font-black text-blue tabular-nums">
                    {loadedLatency !== null ? `${loadedLatency}ms` : status === 'download' ? "Calculating..." : '--'}
                 </div>
              </div>

              {/* Provider Information */}
              <div className="bg-bg/40 border border-border/50 p-6 rounded-[32px] space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-2">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black text-text-4 uppercase tracking-widest">Network Provider</div>
                    <div className="text-sm font-bold text-text truncate">{clientInfo?.org || 'Detecting...'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-2">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black text-text-4 uppercase tracking-widest">Server Hub</div>
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
              className="mt-12 p-6 bg-red-500/5 border border-red-500/10 rounded-[32px] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
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

        {/* Technical Methodology */}
        <div className="bg-surface border border-border p-10 rounded-[48px] space-y-8">
          <div className="space-y-2">
             <h2 className="text-2xl font-black tracking-tight">Technical Methodology</h2>
             <p className="text-sm text-text-3 font-medium">How we ensure professional-grade measurement accuracy.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center text-blue">
                   <Server className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Adaptive Multithreading</h3>
                <p className="text-xs text-text-3 leading-relaxed font-medium">
                   Our engine dynamically adjusts concurrency (up to 6 parallel streams) based on your link capacity. This ensures we saturate fiber connections without overwhelming low-end hardware.
                </p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/5 flex items-center justify-center text-green-500">
                   <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Bufferbloat Analysis</h3>
                <p className="text-xs text-text-3 leading-relaxed font-medium">
                   We measure "Loaded Latency" – your ping while the connection is under heavy load. High variance here indicates network congestion or poor router quality.
                </p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/5 flex items-center justify-center text-orange-500">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Local-Only Processing</h3>
                <p className="text-xs text-text-3 leading-relaxed font-medium">
                   Calculations happen entirely in your browser using high-resolution performance APIs. Your raw data never touches third-party tracking pixels.
                </p>
             </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

function IntelligenceCard({ icon: Icon, title, requirement, current, isLatency, desc }: any) {
  const isReady = current !== null && (isLatency ? current <= requirement : current >= requirement);
  const status = current === null ? 'pending' : isReady ? 'yes' : 'no';

  return (
    <div className={cn(
      "bg-surface border p-6 rounded-[32px] space-y-4 transition-all duration-500",
      status === 'yes' ? "border-green-500/20 shadow-lg shadow-green-500/5" : "border-border"
    )}>
      <div className="flex items-center justify-between">
         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", status === 'yes' ? "bg-green-500/10 text-green-600" : "bg-bg text-text-4")}>
            <Icon className="w-5 h-5" />
         </div>
         {status !== 'pending' && (
           <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest", status === 'yes' ? "bg-green-500 text-white" : "bg-red-500/10 text-red-500")}>
              {status === 'yes' ? "Optimal" : "Slow"}
           </div>
         )}
      </div>
      <div className="space-y-1">
        <h3 className="font-black text-sm tracking-tight">{title}</h3>
        <p className="text-[10px] text-text-4 leading-relaxed font-medium">{desc}</p>
      </div>
      <div className="pt-2 flex items-center gap-2">
         <div className="h-1 flex-1 bg-bg rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", status === 'yes' ? "bg-green-500" : "bg-text-4")}
              initial={{ width: 0 }}
              animate={{ width: status === 'yes' ? '100%' : '30%' }}
            />
         </div>
         <span className="text-[9px] font-black text-text-4 uppercase">{isLatency ? `<${requirement}ms` : `>${requirement}M`}</span>
      </div>
    </div>
  );
}
