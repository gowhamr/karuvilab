"use client";

import { useState, useCallback, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { FileSearch, Filter, AlertTriangle, Info, CheckCircle2, Search } from "lucide-react";

export interface LogEntry {
  id: number;
  raw: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "FATAL" | "UNKNOWN";
  ip?: string | undefined;
  timestamp?: string | undefined;
  message: string;
}

export const SAMPLE_LOGS = `2026-07-05 08:00:12 [INFO] 192.168.1.10 - User authentication successful for user_id=402
2026-07-05 08:01:45 [WARN] 192.168.1.15 - High CPU utilization detected: 88.5%
2026-07-05 08:02:10 [ERROR] 10.0.0.45 - Database connection timeout after 5000ms on pool_id=primary
2026-07-05 08:03:00 [INFO] 192.168.1.10 - GET /api/v1/health status=200 duration=4ms
2026-07-05 08:04:12 [FATAL] 10.0.0.45 - Out of memory error: Java heap space terminated worker-3
2026-07-05 08:05:30 [DEBUG] 127.0.0.1 - Cache invalidated for key=user_session_9921
2026-07-05 08:06:22 [ERROR] 192.168.1.15 - Failed to parse ISO 8583 message payload: invalid length`;

export default function LogAnalyzerClient() {
  const [logText, setLogText] = useState(SAMPLE_LOGS);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const parsedLogs = useMemo<LogEntry[]>(() => {
    const lines = logText.split("\n").filter((l) => l.trim().length > 0);
    return lines.map((line, idx) => {
      let level: LogEntry["level"] = "UNKNOWN";
      if (/ERROR/i.test(line)) level = "ERROR";
      else if (/WARN/i.test(line)) level = "WARN";
      else if (/FATAL/i.test(line)) level = "FATAL";
      else if (/INFO/i.test(line)) level = "INFO";
      else if (/DEBUG/i.test(line)) level = "DEBUG";

      const ipMatch = line.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
      const timeMatch = line.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/);

      return {
        id: idx + 1,
        raw: line,
        level,
        ip: ipMatch ? ipMatch[0] : undefined,
        timestamp: timeMatch ? timeMatch[0] : undefined,
        message: line,
      };
    });
  }, [logText]);

  const filteredLogs = useMemo(() => {
    return parsedLogs.filter((entry) => {
      if (filterLevel !== "ALL" && entry.level !== filterLevel) return false;
      if (searchQuery.trim()) {
        return entry.raw.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Log Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-sky-400" />
          Paste Server / Application Log Stream:
        </label>
        <textarea
          id="log-raw-input"
          rows={6}
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

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
      <div className="p-4 rounded-xl bg-surface border border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            id="log-search-input"
            type="text"
            placeholder="Search log messages, IPs, endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs focus:outline-none"
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

          <CopyButton text={filteredLogs.map((l) => l.raw).join("\n")} />
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
        {filteredLogs.map((entry) => {
          const levelColor =
            entry.level === "ERROR" || entry.level === "FATAL"
              ? "text-red-400 bg-red-500/10 border-red-500/20"
              : entry.level === "WARN"
              ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
              : entry.level === "INFO"
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-sky-400 bg-sky-500/10 border-sky-500/20";

          return (
            <div
              key={entry.id}
              className="p-3 rounded-lg bg-surface-2 border border-border text-xs font-mono flex items-start gap-3 hover:border-text-muted transition"
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${levelColor}`}>
                {entry.level}
              </span>
              <div className="flex-1 space-y-1 overflow-hidden">
                <p className="text-text break-all leading-relaxed">{entry.raw}</p>
                {(entry.timestamp || entry.ip) && (
                  <div className="flex gap-4 text-[11px] text-text-muted font-sans">
                    {entry.timestamp && <span>Time: {entry.timestamp}</span>}
                    {entry.ip && <span>IP: {entry.ip}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
