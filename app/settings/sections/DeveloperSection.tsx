"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { 
  Terminal, Gauge, Cpu, CheckCircle2, XCircle, 
  Download, Copy, Check, RefreshCw, Layers, ShieldCheck, HardDrive
} from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";

export const DeveloperSection = memo(function DeveloperSection() {
  const developerMode = useSettingsStore(state => state.privacy.developerMode);
  const updatePrivacy = useSettingsStore(state => state.updatePrivacy);
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  const [isTestingWorker, setIsTestingWorker] = useState(false);
  const [workerPingMs, setWorkerPingMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Client Browser Capabilities Detection
  const capabilities = useMemo(() => {
    if (typeof window === "undefined") return [];
    return [
      { name: "Web Workers", supported: typeof Worker !== "undefined", detail: "Background Thread RPC Execution" },
      { name: "IndexedDB", supported: "indexedDB" in window, detail: "Local Offline Database Storage" },
      { name: "Origin Private File System (OPFS)", supported: "storage" in navigator && "getDirectory" in navigator.storage, detail: "High-Performance Local File Access" },
      { name: "Web Crypto API", supported: "crypto" in window && "subtle" in window.crypto, detail: "Hardware-Accelerated Local Cryptography" },
      { name: "File System Access API", supported: "showOpenFilePicker" in window, detail: "Direct Desktop File Editing" },
      { name: "WebAssembly (WASM)", supported: typeof WebAssembly !== "undefined", detail: "Near-Native Binary Engine Execution" },
      { name: "Service Worker", supported: "serviceWorker" in navigator, detail: "PWA Offline Caching & Precaching" },
    ];
  }, []);

  // Worker Spawn & Ping Benchmark
  const testWorkerLatency = useCallback(async () => {
    setIsTestingWorker(true);
    const start = performance.now();
    try {
      const workerBlob = new Blob([
        `self.onmessage = function(e) { self.postMessage('pong'); };`
      ], { type: 'application/javascript' });
      const blobUrl = createUrl(workerBlob);
      const testWorker = new Worker(blobUrl);
      
      await new Promise<void>((resolve) => {
        testWorker.onmessage = () => {
          const latency = Math.round(performance.now() - start);
          setWorkerPingMs(latency);
          testWorker.terminate();
          revokeUrl(blobUrl);
          resolve();
        };
        testWorker.postMessage('ping');
      });
      toast(`Worker spawned successfully in ${Math.round(performance.now() - start)} ms!`, "success");
    } catch {
      toast("Failed to spawn test worker.", "error");
      setWorkerPingMs(null);
    } finally {
      setIsTestingWorker(false);
    }
  }, [toast, createUrl, revokeUrl]);

  // Export Diagnostics
  const exportDiagnosticsJson = useCallback(() => {
    const payload = {
      app: "KaruviLab Developer Diagnostics v1.0",
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      developerModeActive: !!developerMode,
      workerSpawnTestMs: workerPingMs,
      browserCapabilities: capabilities,
      memoryInfo: typeof window !== "undefined" && (performance as any).memory ? {
        usedJSHeapSizeMb: Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024)),
        totalJSHeapSizeMb: Math.round((performance as any).memory.totalJSHeapSize / (1024 * 1024)),
      } : "V8 memory API not exposed in this browser",
      privacyNotice: "Zero telemetry collected. 100% local client diagnostic export.",
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `karuvilab-developer-diagnostics-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    revokeUrl(url);
    toast("Developer diagnostics exported successfully.", "success");
  }, [developerMode, workerPingMs, capabilities, createUrl, revokeUrl, toast]);

  const copyMarkdownDiagnostics = useCallback(() => {
    const markdown = `### 🛠️ KaruviLab Developer Diagnostics
- **Developer Mode:** ${developerMode ? "ENABLED 🟢" : "DISABLED ⚪"}
- **Worker Spawn Ping:** ${workerPingMs !== null ? `${workerPingMs} ms` : "Not benchmarked"}
- **Supported Capabilities:** ${capabilities.filter(c => c.supported).map(c => c.name).join(", ")}
- **Browser:** ${typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"}
- *Generated locally via KaruviLab Developer Settings*`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast("Diagnostics copied to clipboard as Markdown snippet.", "info");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [developerMode, workerPingMs, capabilities, toast]);

  return (
    <div className="space-y-10">
      {/* --- Developer Mode Main Toggle --- */}
      <SettingRow
        label="Developer Mode & Performance Inspector HUD"
        description="Enable developer controls and display real-time performance metrics (Worker RPC thread spawn latency, Dynamic Import timing, V8 Heap Memory, and architectural flow) across all KaruviLab tools."
        icon={Terminal}
        helpText="Designed for engineers, developers, and curious learners. When enabled, a floating Performance Inspector widget appears in the bottom right corner of all pages."
      >
        <SettingSwitch
          checked={!!developerMode}
          onChange={(val) => updatePrivacy({ developerMode: val })}
          ariaLabel="Toggle Developer Mode and Performance Inspector"
        />
      </SettingRow>

      {/* --- Browser Capability Inspection --- */}
      <section className="space-y-4 pt-6 border-t border-border/40">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-text uppercase tracking-widest flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue" />
            Browser Capabilities Matrix
          </h3>
          <span className="text-xs font-mono font-bold text-blue bg-blue/10 px-2.5 py-1 rounded-full border border-blue/20">
            {capabilities.filter(c => c.supported).length}/{capabilities.length} Supported
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {capabilities.map((cap) => (
            <div key={cap.name} className="p-4 bg-surface border border-border/60 rounded-2xl flex items-start gap-3 transition-colors hover:border-blue/30">
              {cap.supported ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-text-4 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-text truncate">{cap.name}</div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    cap.supported ? "bg-emerald-500/10 text-emerald-500" : "bg-surface-elevated text-text-4"
                  }`}>
                    {cap.supported ? "Active" : "Unavailable"}
                  </span>
                </div>
                <p className="text-[11px] text-text-4 font-medium mt-1 leading-normal">{cap.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Engine & Worker Diagnostic Tools --- */}
      <section className="space-y-4 pt-6 border-t border-border/40">
        <h3 className="text-sm font-black text-text uppercase tracking-widest flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue" />
          Engine & Worker Benchmarks
        </h3>

        <div className="p-6 bg-surface border border-border/60 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-text">Web Worker Thread Benchmark</h4>
              <p className="text-xs text-text-4 font-medium mt-1">
                Tests instantaneous Web Worker thread spawning and postMessage round-trip latency.
              </p>
            </div>
            <button
              onClick={testWorkerLatency}
              disabled={isTestingWorker}
              className="px-5 py-2.5 bg-blue text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingWorker ? "animate-spin" : ""}`} />
              {isTestingWorker ? "Testing..." : "Benchmark Worker"}
            </button>
          </div>

          {workerPingMs !== null && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Worker Spawn Ping Latency: {workerPingMs} ms</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={exportDiagnosticsJson}
            className="flex items-center justify-center gap-3 p-5 bg-surface border border-border/60 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue hover:text-blue hover:bg-blue/5 transition-all group"
          >
            <Download className="w-4 h-4 text-text-4 group-hover:text-blue" />
            Export Diagnostics (JSON)
          </button>

          <button
            onClick={copyMarkdownDiagnostics}
            className="flex items-center justify-center gap-3 p-5 bg-surface border border-border/60 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue hover:text-blue hover:bg-blue/5 transition-all group"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-text-4 group-hover:text-blue" />}
            {copied ? "Copied Markdown!" : "Copy Markdown Summary"}
          </button>
        </div>
      </section>

      {/* --- Data Flow & Privacy Verification --- */}
      <section className="p-6 bg-gradient-to-br from-blue/5 to-transparent border border-blue/10 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue">
          <Layers className="w-4 h-4" />
          Zero-Backend Architecture Guarantee
        </div>
        <p className="text-xs text-text-4 font-medium leading-relaxed">
          KaruviLab operates 100% offline inside your browser. No user input, processed files, or telemetry packets are ever sent to an external server. Enabling Developer Mode does not activate any remote tracking or network requests.
        </p>
      </section>
    </div>
  );
});
