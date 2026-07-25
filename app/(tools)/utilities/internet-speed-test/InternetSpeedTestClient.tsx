"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { StatusBadge } from "@/components/system/StatusBadge";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { 
  Gauge, Zap, ArrowDown, ArrowUp, RefreshCw, Activity, AlertTriangle, 
  MapPin, Globe, Server, History, Share2, CheckCircle2, Video, 
  Gamepad2, MonitorPlay, Wifi, SignalHigh, Timer, Info, X
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useSpeedTest, TestResult } from "./useSpeedTest";
import { SpeedGauge } from "./SpeedGauge";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const PulseRing = ({ active, color = "rgba(79, 70, 229, 0.4)" }: { active: boolean, color?: string }) => (
  <AnimatePresence>
    {active && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.4, 1.6], opacity: [0.6, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-full h-full rounded-full border"
          style={{ borderColor: color }}
        />
      </div>
    )}
  </AnimatePresence>
);

export default function InternetSpeedTestClient() {
  const { 
    status, ping, jitter, download, upload, progress, error, 
    startTest, cancelTest 
  } = useSpeedTest();
  
  const [results, setResults] = useState<TestResult[]>([]);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => setClientInfo(data))
      .catch(() => console.warn("Failed to fetch IP info"));
  }, []);

  const handleStart = async () => {
    await startTest();
  };

  useEffect(() => {
    if (status === 'completed') {
      const newResult: TestResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        download,
        upload,
        ping,
        jitter
      };
      setResults(prev => [newResult, ...prev].slice(0, 10));
      toast("Speed test completed!", "success");
    }
  }, [status, download, upload, ping, jitter, toast]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="bg-surface border border-border p-4 sm:p-8 md:p-12 rounded-4xl sm:rounded-6xl shadow-sm space-y-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue via-indigo-500 to-purple-500 opacity-20" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-sm font-black uppercase tracking-widest-2xl text-blue flex items-center justify-center md:justify-start gap-3">
                <Gauge className="w-4 h-4" />
                Network Diagnostic
              </h2>
              <p className="text-text-4 text-xs font-bold uppercase tracking-wider">
                Precision bandwidth measurement • {clientInfo?.country_name || 'Global'}
              </p>
           </div>
           
           <div className="flex items-center gap-3">
              <StatusBadge status={status === 'completed' ? 'complete' : status === 'error' ? 'error' : status === 'idle' ? 'idle' : 'processing'} />
              <PrivacyBadge />
           </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 space-y-10 relative">
          <div className="relative">
            <PulseRing active={status !== 'idle' && status !== 'completed' && status !== 'error'} />
            <SpeedGauge 
              value={status === 'upload' ? upload : download} 
              max={100}
              color={status === 'upload' ? "#10B981" : "#4F46E5"}
            />
          </div>

          <div className="flex items-center gap-12 md:gap-24">
            <MetricSmall label="Ping" value={ping ? `${Math.round(ping)}ms` : '--'} icon={Activity} />
            <MetricSmall label="Jitter" value={jitter ? `${Math.round(jitter)}ms` : '--'} icon={SignalHigh} />
            <MetricSmall label="Upload" value={upload ? `${upload.toFixed(1)}` : '--'} icon={ArrowUp} color="text-success" />
          </div>

          <div className="pt-4">
            {status === 'idle' || status === 'completed' || status === 'error' ? (
              <button
                onClick={handleStart}
                className="group relative px-10 py-5 bg-blue text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-4 overflow-hidden"
               aria-label="Refresh Cw">
                <RefreshCw className={cn("w-6 h-6 relative z-content", (status !== 'idle' && status !== 'completed' && status !== 'error') && "animate-spin")} />
                <span className="relative z-content">{status === 'idle' ? 'Start Test' : 'Run Again'}</span>
              </button>
            ) : (
              <button onClick={cancelTest} className="px-10 py-5 bg-error/10 text-error border border-error/20 rounded-2xl font-black text-xl hover:bg-error/20 transition-all active:scale-95 flex items-center gap-4">
                <X className="w-6 h-6" /> Stop Test
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-6 bg-error/5 border border-error/10 rounded-3xl space-y-2">
             <div className="flex items-center gap-3 text-error">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-black text-sm uppercase tracking-wider">Diagnostic Error</span>
             </div>
             <p className="text-sm text-text-3 font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IntelligenceCard icon={MonitorPlay} title="Streaming" requirement={25} current={download} desc="4K UHD quality." />
        <IntelligenceCard icon={Gamepad2} title="Gaming" requirement={50} current={ping} isLatency desc="Stability for competitive play." />
        <IntelligenceCard icon={Video} title="Video Calls" requirement={5} current={upload} desc="HD clarity." />
        <IntelligenceCard icon={Wifi} title="Multi-Device" requirement={100} current={download} desc="Shared bandwidth." />
      </div>

      {results.length > 0 && (
        <div className="bg-surface border border-border rounded-4xl sm:rounded-6xl p-4 sm:p-8 space-y-8">
           <h2 className="text-xl font-black tracking-tight flex items-center gap-3"><History className="w-5 h-5 text-text-4" /> Recent Diagnostic History</h2>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-micro font-black uppercase tracking-widest-lg text-text-4 border-b border-border">
                       <th className="py-4 px-4">Timestamp</th>
                       <th className="py-4 px-4">Download</th>
                       <th className="py-4 px-4">Upload</th>
                       <th className="py-4 px-4">Ping</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                    {results.map((res) => (
                       <tr key={res.id} className="group hover:bg-bg/50 transition-colors">
                          <td className="py-4 px-4 text-xs font-bold text-text-3">{new Date(res.timestamp).toLocaleTimeString()}</td>
                          <td className="py-4 px-4 font-mono text-sm text-blue">{res.download.toFixed(1)} <span className="text-micro font-bold opacity-60">Mbps</span></td>
                          <td className="py-4 px-4 font-mono text-sm text-success">{res.upload.toFixed(1)} <span className="text-micro font-bold opacity-60">Mbps</span></td>
                          <td className="py-4 px-4 font-mono text-sm text-text-2">{Math.round(res.ping)} <span className="text-micro font-bold opacity-60">ms</span></td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}

function MetricSmall({ label, value, icon: Icon, color = "text-text-2" }: any) {
  return (
    <div className="flex flex-col items-center space-y-2 group">
      <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-text-4 group-hover:text-blue transition-colors"><Icon className="w-5 h-5" /></div>
      <div className="text-center">
        <p className="text-micro font-black uppercase tracking-widest text-text-4">{label}</p>
        <p className={cn("text-xl font-black tracking-tight", color)}>{value}</p>
      </div>
    </div>
  );
}

function IntelligenceCard({ icon: Icon, title, requirement, current, isLatency, desc }: any) {
  const isReady = current !== null && (isLatency ? current <= requirement : current >= requirement);
  const status = current === null ? 'pending' : isReady ? 'yes' : 'no';

  return (
    <div className={cn(
      "bg-surface border p-6 rounded-4xl space-y-4 transition-all duration-500 relative overflow-hidden group",
      status === 'yes' ? "border-success/20 shadow-lg shadow-success/5" : "border-border"
    )}>
      <div className="flex items-center justify-between relative z-content">
         <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500", status === 'yes' ? "bg-success/10 text-success scale-110" : "bg-bg text-text-4")}><Icon className="w-6 h-6" /></div>
         {status !== 'pending' && (
           <div className={cn("px-3 py-1.5 rounded-xl text-micro font-black uppercase tracking-widest flex items-center gap-2", status === 'yes' ? "bg-success text-white shadow-lg shadow-success/20" : "bg-error/10 text-error")}>
              {status === 'yes' ? <><CheckCircle2 className="w-3 h-3" /><span>Optimal</span></> : <><AlertTriangle className="w-3 h-3" /><span>Limited</span></>}
           </div>
         )}
      </div>
      <div className="space-y-1 relative z-content"><h3 className="font-black text-sm tracking-tight text-text group-hover:text-blue transition-colors">{title}</h3><p className="text-xs text-text-4 leading-relaxed font-medium">{desc}</p></div>
      <div className="pt-2 flex items-center gap-3 relative z-content">
         <div className="h-1.5 flex-1 bg-bg rounded-full overflow-hidden">
            <m.div className={cn("h-full", status === 'yes' ? "bg-success" : "bg-text-4/30")} initial={{ width: 0 }} animate={{ width: status === 'yes' ? '100%' : status === 'no' ? '40%' : '0%' }} transition={{ duration: 1, ease: "easeOut" }} />
         </div>
         <span className="text-micro font-black text-text-3 tabular-nums">{isLatency ? `${requirement}ms` : `${requirement}Mbps`}</span>
      </div>
    </div>
  );
}
