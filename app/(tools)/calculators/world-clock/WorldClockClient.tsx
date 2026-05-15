"use client";
import { useState, useEffect, useMemo } from "react";
import { useWorldClockStore, ClockItem } from "@/src/store/useWorldClockStore";
import { getAllTimezones, COMMON_CITIES } from "@/src/lib/timezone-data";
import { Plus, Trash2, Search, Globe, Clock, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

function getTimeInZone(tz: string, now: Date): { time: string; date: string; offset: string; ampm: string } {
  try {
    const timeParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).formatToParts(now);

    const h = timeParts.find((p) => p.type === "hour")?.value ?? "00";
    const m = timeParts.find((p) => p.type === "minute")?.value ?? "00";
    const s = timeParts.find((p) => p.type === "second")?.value ?? "00";

    const wday = dateParts.find((p) => p.type === "weekday")?.value ?? "";
    const month = dateParts.find((p) => p.type === "month")?.value ?? "";
    const day = dateParts.find((p) => p.type === "day")?.value ?? "";

    const hour24 = parseInt(h);
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? "12" : String(hour24 % 12).padStart(2, "0");

    // Offset calculation
    const nowLocal = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const diffMs = nowLocal.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const diffH = Math.floor(Math.abs(diffMs) / 3600000);
    const diffM = Math.floor((Math.abs(diffMs) % 3600000) / 60000);
    const sign = diffMs >= 0 ? "+" : "-";
    const offset = `UTC${sign}${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}`;

    return {
      time: `${hour12}:${m}:${s}`,
      date: `${wday}, ${month} ${day}`,
      offset,
      ampm,
    };
  } catch {
    return { time: "00:00:00", date: "Invalid TZ", offset: "UTC+0", ampm: "AM" };
  }
}

function isBusinessHours(tz: string, now: Date): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      weekday: "short",
      hour12: false,
    }).formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    const isWeekday = !["Sat", "Sun"].includes(weekday);
    return isWeekday && hour >= 9 && hour < 18;
  } catch {
    return false;
  }
}

export default function WorldClockClient() {
  const [now, setNow] = useState<Date | null>(null);
  const { clocks, addClock, removeClock } = useWorldClockStore();
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const allZones = useMemo(() => getAllTimezones(), []);
  
  const filteredZones = useMemo(() => {
    if (!search) return COMMON_CITIES;
    const q = search.toLowerCase();
    return allZones.filter(z => 
      z.city.toLowerCase().includes(q) || 
      (z.country || '').toLowerCase().includes(q) ||
      z.tz.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [search, allZones]);

  if (!now) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-5 h-[120px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Add Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface border border-border p-4 rounded-[24px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-text">World Clocks</h2>
            <p className="text-[10px] text-text-4 font-bold uppercase">{clocks.length} Active Timezones</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search city or timezone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsAdding(true);
            }}
            onFocus={() => setIsAdding(true)}
            className="w-full h-11 pl-10 pr-4 bg-bg border border-border rounded-xl text-xs font-bold focus:border-blue outline-none transition-all"
          />
          {isAdding && search && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto no-scrollbar py-2">
              <div className="px-3 pb-2 flex justify-between items-center border-b border-border mb-2">
                <span className="text-[10px] font-black uppercase text-text-4">Suggested Cities</span>
                <button onClick={() => setIsAdding(false)} className="text-text-4 hover:text-text">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {filteredZones.map((zone) => (
                <button
                  key={zone.tz}
                  onClick={() => {
                    addClock({ id: '', city: zone.city, country: zone.country || '', tz: zone.tz });
                    setSearch("");
                    setIsAdding(false);
                  }}
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-blue/5 transition-colors group"
                >
                  <div className="text-left">
                    <div className="text-xs font-black text-text group-hover:text-blue">{zone.city}</div>
                    <div className="text-[10px] text-text-4 font-medium capitalize">{(zone.country || '').replace(/_/g, ' ')}</div>
                  </div>
                  <div className="text-[9px] font-mono text-text-4">{zone.tz}</div>
                </button>
              ))}
              {filteredZones.length === 0 && (
                <div className="px-4 py-3 text-xs text-text-4 text-center italic">No zones found for "{search}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Clock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clocks.map(({ id, city, country, tz }) => {
          const t = getTimeInZone(tz, now);
          const biz = isBusinessHours(tz, now);
          return (
            <div
              key={id}
              className="bg-surface border border-border rounded-2xl p-5 space-y-3 group hover:border-blue/30 transition-all relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-bold text-text leading-tight">{city}</div>
                    <div className="text-[10px] text-text-4 font-bold uppercase truncate max-w-[120px]">{country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                      biz ? "bg-success/10 text-success" : "bg-text-4/10 text-text-4"
                    )}
                  >
                    {biz ? "Open" : "Closed"}
                  </div>
                  <button
                    onClick={() => removeClock(id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-error/10 hover:text-error rounded-lg transition-all"
                    title="Remove clock"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="font-mono flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-text tabular-nums">{t.time.split(':').slice(0,2).join(':')}</span>
                <span className="text-lg font-bold text-text-4 tabular-nums">:{t.time.split(':')[2]}</span>
                <span className="text-sm font-black text-blue ml-auto">{t.ampm}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/50">
                <span className="text-text-4 font-bold uppercase tracking-wider">{t.date}</span>
                <span className="text-text-4 font-mono">{t.offset}</span>
              </div>
            </div>
          );
        })}
          
          {/* Add Placeholder Card */}
          <button 
            onClick={() => setIsAdding(true)}
            className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-text-4 hover:border-blue/30 hover:text-blue transition-all group min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Timezone</span>
          </button>
      </div>

      <div className="flex items-center justify-center gap-6 text-[10px] text-text-4 font-bold uppercase tracking-widest bg-surface/50 border border-border py-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          Business Hours (9-6)
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Updates Live
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3" />
          Persistent Saves
        </div>
      </div>
    </div>
  );
}
