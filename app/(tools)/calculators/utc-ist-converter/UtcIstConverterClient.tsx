"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

const IST_OFFSET_MINUTES = 5 * 60 + 30; // UTC+5:30

function nowUTC(): string {
  return new Date().toISOString().slice(0, 16);
}

function utcToIst(utcDatetime: string): string {
  if (!utcDatetime) return "";
  try {
    const d = new Date(utcDatetime + "Z");
    if (isNaN(d.getTime())) return "";
    d.setMinutes(d.getMinutes() + IST_OFFSET_MINUTES);
    return d.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

function istToUtc(istDatetime: string): string {
  if (!istDatetime) return "";
  try {
    const d = new Date(istDatetime + "Z");
    if (isNaN(d.getTime())) return "";
    d.setMinutes(d.getMinutes() - IST_OFFSET_MINUTES);
    return d.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

function fmtDisplay(dt: string): string {
  if (!dt) return "—";
  try {
    const d = new Date(dt + ":00Z");
    return d.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });
  } catch {
    return dt;
  }
}

// IST business hours 9AM-6PM → UTC equivalents
const IST_BIZ_HOURS = [
  { istLabel: "IST 9:00 AM", utcLabel: "UTC 3:30 AM" },
  { istLabel: "IST 10:00 AM", utcLabel: "UTC 4:30 AM" },
  { istLabel: "IST 12:00 PM", utcLabel: "UTC 6:30 AM" },
  { istLabel: "IST 2:00 PM", utcLabel: "UTC 8:30 AM" },
  { istLabel: "IST 5:00 PM", utcLabel: "UTC 11:30 AM" },
  { istLabel: "IST 6:00 PM", utcLabel: "UTC 12:30 PM" },
];

export default function UtcIstConverterClient() {
  const [utcInput, setUtcInput] = useState("");
  const [istInput, setIstInput] = useState("");
  const [liveUtc, setLiveUtc] = useState("");
  const [liveIst, setLiveIst] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = nowUTC();
    setUtcInput(u);
    setIstInput(utcToIst(u));
    setLiveUtc(u);
    setLiveIst(utcToIst(u));
    setMounted(true);

    const id = setInterval(() => {
      const cur = nowUTC();
      setLiveUtc(cur);
      setLiveIst(utcToIst(cur));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleUtcChange = (val: string) => {
    setUtcInput(val);
    setIstInput(utcToIst(val));
  };

  const handleIstChange = (val: string) => {
    setIstInput(val);
    setUtcInput(istToUtc(val));
  };

  const summary = `UTC ↔ IST Conversion\n----------------------\nUTC: ${utcInput}\nIST: ${istInput}\n\nGenerated via KaruviLab`;

  if (!mounted) {
    return (
      <div className="bg-surface border border-border p-6 rounded-2xl min-h-80 animate-pulse" />
    );
  }

  return (
    <div className="space-y-8">
      {/* Live clocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Current UTC</div>
          <div className="text-2xl font-black font-mono text-text">{liveUtc.split("T")[1]}</div>
          <div className="text-sm text-text-3">{liveUtc.split("T")[0]}</div>
        </div>
        <div className="bg-surface border border-blue/30 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Current IST (UTC+5:30)</div>
          <div className="text-2xl font-black font-mono text-blue">{liveIst.split("T")[1]}</div>
          <div className="text-sm text-text-3">{liveIst.split("T")[0]}</div>
        </div>
      </div>

      {/* Converter inputs */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <h2 className="font-bold text-text-2">Convert a specific date & time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">UTC Date & Time</label>
            <input
              type="datetime-local"
              value={utcInput}
              onChange={(e) => handleUtcChange(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono"
            />
            <p className="text-xs text-text-muted">{fmtDisplay(utcInput)}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">IST Date & Time (UTC+5:30)</label>
            <input
              type="datetime-local"
              value={istInput}
              onChange={(e) => handleIstChange(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-blue/30 rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono"
            />
            <p className="text-xs text-text-muted">{fmtDisplay(istInput)}</p>
          </div>
        </div>
        <button
          onClick={() => { handleUtcChange(nowUTC()); }}
          className="px-4 py-2 text-sm font-bold border border-border rounded-xl hover:border-blue hover:text-blue transition-colors"
        >
          Use Current Time
        </button>
      </div>

      {/* Common IST business hours */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border font-bold text-text-2">
          Common IST Business Hours in UTC
        </div>
        <div className="divide-y divide-border">
          {IST_BIZ_HOURS.map((row) => (
            <div key={row.istLabel} className="flex justify-between px-4 py-3">
              <span className="text-sm font-medium text-text">{row.istLabel}</span>
              <span className="text-sm font-bold text-blue">{row.utcLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
        <span className="text-sm text-text-3">IST = UTC + 5 hours 30 minutes</span>
        <CopyButton text={summary} label="Copy Summary" />
      </div>
    </div>
  );
}
