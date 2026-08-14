"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";

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
    <ToolWorkspace
      layout="split"
      input={
        <>
          <h2 className="font-bold text-text-2 mb-4">Convert a specific date & time</h2>
          <div className="space-y-4">
            <ToolInput
              type="datetime-local"
              label="UTC Date & Time"
              value={utcInput}
              onChange={handleUtcChange}
              mono
              description={fmtDisplay(utcInput)}
            />
            <ToolInput
              type="datetime-local"
              label="IST Date & Time (UTC+5:30)"
              value={istInput}
              onChange={handleIstChange}
              mono
              description={fmtDisplay(istInput)}
            />
          </div>
          <button
            onClick={() => { handleUtcChange(nowUTC()); }}
            className="mt-6 px-4 py-2 text-sm font-bold border border-border rounded-xl hover:border-blue hover:text-blue transition-colors"
          >
            Use Current Time
          </button>
        </>
      }
      optionsPanel={
        <>
          <h2 className="font-bold text-text-2 mb-4">Live Clocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-bg border border-border p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Current UTC</div>
              <div className="text-2xl font-black font-mono text-text">{liveUtc.split("T")[1] || ""}</div>
              <div className="text-sm text-text-3">{liveUtc.split("T")[0] || ""}</div>
            </div>
            <div className="bg-bg border border-blue/30 p-5 rounded-2xl shadow-sm space-y-1">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Current IST</div>
              <div className="text-2xl font-black font-mono text-blue">{liveIst.split("T")[1] || ""}</div>
              <div className="text-sm text-text-3">{liveIst.split("T")[0] || ""}</div>
            </div>
          </div>
        </>
      }
      output={
        <>
          <h2 className="font-bold text-text-2 mb-4">Common IST Business Hours in UTC</h2>
          <div className="divide-y divide-border">
            {IST_BIZ_HOURS.map((row) => (
              <div key={row.istLabel} className="flex justify-between py-3">
                <span className="text-sm font-medium text-text">{row.istLabel}</span>
                <span className="text-sm font-bold text-blue">{row.utcLabel}</span>
              </div>
            ))}
          </div>
        </>
      }
      infoPanel={
        <div className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm text-text-3">IST = UTC + 5 hours 30 minutes</span>
          <CopyButton text={summary} label="Copy Summary" />
        </div>
      }
    />
  );
}
