"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { FileSearch, Filter, AlertTriangle, Info, CheckCircle2, Search, Loader2 } from "lucide-react";
import { workerManager } from "@/src/workers/manager";
import { useToast } from "@/components/ui/Toast";

export interface LogEntry {
  id: number;
  raw: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "FATAL" | "UNKNOWN";
  ip?: string;
  timestamp?: string;
  message: string;
  isJson?: boolean;
  jsonData?: any;
  keyValues?: Record<string, string>;
  exceptions?: string[];
}

export const SAMPLE_LOGS = `2026-07-05 08:00:12 [INFO] 192.168.1.10 - User authentication successful for user_id=402
2026-07-05 08:01:45 [WARN] 192.168.1.15 - High CPU utilization detected: 88.5%
2026-07-05 08:02:10 [ERROR] 10.0.0.45 - Database connection timeout after 5000ms on pool_id=primary
{"level": "info", "timestamp": "2026-07-05T08:03:00Z", "ip": "192.168.1.10", "message": "GET /api/v1/health", "status": 200, "duration": 4}
2026-07-05 08:04:12 [FATAL] 10.0.0.45 - OutOfMemoryError: Java heap space terminated worker-3
{"level": "debug", "message": "Cache invalidated", "key": "user_session_9921", "ip": "127.0.0.1"}
2026-07-05 08:06:22 [ERROR] 192.168.1.15 - Failed to parse ISO 8583 message payload error="invalid length"
2026-07-05 08:07:05 [ERROR] 10.0.1.10 - Exception in thread "main" java.lang.NullPointerException
2026-07-05 08:08:12 [WARN] 10.0.1.10 - Database query failed: ORA-01403: No data found`;

export default function LogAnalyzerClient() {
  const { toast } = useToast();
  const [logText, setLogText] = useState(SAMPLE_LOGS);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [parsedLogs, setParsedLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  
  const abortController = useRef<AbortController | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const parseWorker = useCallback(async (text: string) => {
    if (!text.trim()) {
      setParsedLogs([]);
      return;
    }

    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    setIsProcessing(true);
    setProgressMsg("Parsing logs...");
    
    try {
      const result = await workerManager.parseLogs(
        text,
        (p) => setProgressMsg(p.message || "Parsing logs..."),
        abortController.current.signal
      );
      setParsedLogs(result);
    } catch (e: any) {
      if (e.message !== "Task cancelled") {
        toast("Failed to parse logs: " + e.message, "error");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      parseWorker(logText);
    }, 500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [logText, parseWorker]);

  const filteredLogs = useMemo(() => {
    return parsedLogs.filter((entry) => {
      if (filterLevel !== "ALL" && entry.level !== filterLevel) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (entry.raw.toLowerCase().includes(query)) return true;
        if (entry.isJson && JSON.stringify(entry.jsonData).toLowerCase().includes(query)) return true;
        return false;
      }
      return true;
    });
  }, [parsedLogs, filterLevel, searchQuery]);

  const metrics = useMemo(() => {
    const counts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0, FATAL: 0, UNKNOWN: 0 };
    parsedLogs.forEach((l) => counts[l.level]++);
    return counts;
  }, [parsedLogs]);

  return (
    <ToolWorkspace
      input={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-sky-400" />
              Paste Server / Application Log Stream:
            </label>
            {isProcessing && (
              <span className="text-xs text-primary flex items-center gap-1 font-medium animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                {progressMsg}
              </span>
            )}
          </div>
          <ToolInput
            id="log-raw-input"
            rows={6}
            value={logText}
            onChange={setLogText}
            mono
            placeholder="Paste millions of lines of logs here..."
          />
        </div>
      }
      optionsPanel={
        <div className="space-y-4">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-surface-2 border border-border text-center">
              <span className="text-xs font-sans text-text-muted block">TOTAL LOGS</span>
              <span className="text-lg font-bold font-mono text-text">{parsedLogs.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-sans text-emerald-400 block">INFO</span>
              <span className="text-lg font-bold font-mono text-emerald-300">{metrics.INFO}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs font-sans text-amber-400 block">WARN</span>
              <span className="text-lg font-bold font-mono text-amber-300">{metrics.WARN}</span>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <span className="text-xs font-sans text-red-400 block">ERROR / FATAL</span>
              <span className="text-lg font-bold font-mono text-red-300">{metrics.ERROR + metrics.FATAL}</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
              <span className="text-xs font-sans text-sky-400 block">DEBUG</span>
              <span className="text-lg font-bold font-mono text-sky-300">{metrics.DEBUG}</span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <input
                id="log-search-input"
                type="text"
                placeholder="Search log messages, IPs, JSON keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-muted" />
              <select
                id="log-level-filter"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs"
              >
                <option value="ALL">All Levels</option>
                <option value="ERROR">ERROR Only</option>
                <option value="WARN">WARN Only</option>
                <option value="INFO">INFO Only</option>
                <option value="DEBUG">DEBUG Only</option>
                <option value="FATAL">FATAL Only</option>
              </select>

              <CopyButton text={filteredLogs.map((l) => l.raw).join("\\n")} />
            </div>
          </div>
        </div>
      }
      output={
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 && (
          <div className="text-center py-10 text-text-muted text-sm border border-dashed border-border rounded-xl">
            No logs matched your criteria.
          </div>
        )}
        {filteredLogs.map((entry) => {
          const levelColor =
            entry.level === "ERROR" || entry.level === "FATAL"
              ? "text-red-400 bg-red-500/10 border-red-500/20"
              : entry.level === "WARN"
              ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
              : entry.level === "INFO"
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : entry.level === "DEBUG"
              ? "text-sky-400 bg-sky-500/10 border-sky-500/20"
              : "text-text-muted bg-surface-2 border-border";

          return (
            <div
              key={entry.id}
              className="p-3 rounded-xl bg-surface-2 border border-border text-xs font-mono flex flex-col md:flex-row items-start gap-3 hover:border-text-muted transition"
            >
              <div className="flex gap-2 items-center md:flex-col md:items-start shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${levelColor}`}>
                  {entry.level}
                </span>
                {entry.isJson && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border text-primary bg-primary/10 border-primary/20">
                    JSON
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-2 overflow-hidden w-full">
                {/* Main Raw Line */}
                <p className="text-text break-all leading-relaxed whitespace-pre-wrap">{entry.raw}</p>
                
                {/* Meta Extracted */}
                {(entry.timestamp || entry.ip) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-muted font-sans bg-bg p-1.5 rounded-lg border border-border/50 inline-flex">
                    {entry.timestamp && <span><strong className="text-text-4 font-semibold">Time:</strong> {entry.timestamp}</span>}
                    {entry.ip && <span><strong className="text-text-4 font-semibold">IP:</strong> {entry.ip}</span>}
                  </div>
                )}

                {/* Key Values */}
                {entry.keyValues && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(entry.keyValues).map(([k, v], i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border text-[10px]">
                        <span className="text-text-muted">{k}=</span>
                        <span className="text-sky-300 font-semibold max-w-[200px] truncate" title={v}>{v}</span>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Exceptions */}
                {entry.exceptions && entry.exceptions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {entry.exceptions.map((exc, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold shadow-sm">
                        <AlertTriangle className="w-3 h-3" />
                        {exc}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* JSON Data Prettified */}
                {entry.isJson && entry.jsonData && (
                  <details className="group mt-2">
                    <summary className="text-[10px] text-blue hover:text-blue/80 cursor-pointer list-none select-none font-sans font-semibold inline-flex items-center gap-1 bg-blue/10 px-2 py-1 rounded-md transition-colors">
                      View Structured Data
                    </summary>
                    <div className="mt-2 p-3 bg-[#0d1117] border border-border/50 rounded-lg overflow-x-auto">
                      <pre className="text-[11px] text-emerald-300 leading-relaxed">
                        {JSON.stringify(entry.jsonData, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}
        </div>
      }
    />
  );
}
