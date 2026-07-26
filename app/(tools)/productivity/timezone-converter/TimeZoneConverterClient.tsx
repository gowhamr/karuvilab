"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { 
  Plus, 
  Trash2, 
  Globe, 
  Clock, 
  Calendar, 
  Search, 
  X, 
  Copy, 
  Check, 
  ArrowRightLeft,
  ChevronDown,
  Info
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { getAllTimezones, COMMON_CITIES } from "@/src/lib/timezone-data";
import { CopyButton } from "@/components/ui/CopyButton";
import { SliderField } from "@/components/ui/SliderField";

interface TimezoneInfo {
  city: string;
  country: string | undefined;
  tz: string;
}

export default function TimeZoneConverterClient() {
  const [sourceDate, setSourceDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [sourceTZ, setSourceTZ] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetTZs, setTargetTZs] = useState<string[]>(["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]);
  
  const [isSearchingSource, setIsSearchingSource] = useState(false);
  const [isSearchingTarget, setIsSearchingTarget] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");

  
  const timeInMinutes = useMemo(() => {
    if (!sourceDate) return 0;
    const tPart = sourceDate.split('T')[1];
    if (!tPart) return 0;
    const [h, m] = tPart.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }, [sourceDate]);

  const handleTimeScrub = (mins: number) => {
    if (!sourceDate) return;
    const dPart = sourceDate.split('T')[0];
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    setSourceDate(`${dPart}T${h}:${m}`);
  };

  const allZones = useMemo(() => getAllTimezones(), []);

  const filteredSourceZones = useMemo(() => {
    const q = sourceSearch.toLowerCase().trim();
    if (!q) return COMMON_CITIES;
    return allZones
      .filter(z => 
        z.city.toLowerCase().includes(q) || 
        z.country?.toLowerCase().includes(q) || 
        z.tz.toLowerCase().replace(/_/g, ' ').includes(q)
      )
      .slice(0, 10);
  }, [sourceSearch, allZones]);

  const filteredTargetZones = useMemo(() => {
    const q = targetSearch.toLowerCase().trim();
    if (!q) return COMMON_CITIES;
    return allZones
      .filter(z => 
        z.city.toLowerCase().includes(q) || 
        z.country?.toLowerCase().includes(q) || 
        z.tz.toLowerCase().replace(/_/g, ' ').includes(q)
      )
      .slice(0, 10);
  }, [targetSearch, allZones]);

  const handleSetNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setSourceDate(now.toISOString().slice(0, 16));
  };

  const addTargetTZ = (tz: string) => {
    if (!targetTZs.includes(tz)) {
      setTargetTZs([...targetTZs, tz]);
    }
    setIsSearchingTarget(false);
    setTargetSearch("");
  };

  const removeTargetTZ = (tz: string) => {
    setTargetTZs(targetTZs.filter(t => t !== tz));
  };

  const clearTargets = () => {
    setTargetTZs([]);
  };

const formatCache = new Map<string, Intl.DateTimeFormat>();
const getFormatter = (tz: string, type: 'date' | 'time' | 'full') => {
  const key = `${tz}-${type}`;
  if (!formatCache.has(key)) {
    formatCache.set(key, new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      ...(type === 'date' ? { dateStyle: 'medium' } : type === 'time' ? { timeStyle: 'short' } : { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    }));
  }
  return formatCache.get(key)!;
};

const getOffsetMinutes = (date: Date, timeZone: string) => {
  try {
    const fmt = getFormatter(timeZone, 'full');
    const parts = fmt.formatToParts(date);
    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    const tzDate = new Date(Date.UTC(
      getPart('year'), getPart('month') - 1, getPart('day'),
      getPart('hour'), getPart('minute'), getPart('second')
    ));
    return (tzDate.getTime() - date.getTime()) / 60000;
  } catch { return 0; }
};

  const conversions = useMemo(() => {
    if (!sourceDate) return [];
    
    const [dPart, tPart] = sourceDate.split('T');
    if (!dPart || !tPart) return [];
    const dateParts = dPart.split('-').map(Number);
    const timeParts = tPart.split(':').map(Number);
    const year = dateParts[0] || 0;
    const month = dateParts[1] || 1;
    const day = dateParts[2] || 1;
    const hour = timeParts[0] || 0;
    const minute = timeParts[1] || 0;

    // 1. Calculate the actual UTC timestamp for the given "Wall Time" in "Source TZ"
    const getActualUTC = () => {
      try {
        const wallTimeAsUTC = new Date(Date.UTC(year, month - 1, day, hour, minute));
        const fmt = getFormatter(sourceTZ, 'full');
        const parts = fmt.formatToParts(wallTimeAsUTC);
        const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
        const tzDate = new Date(Date.UTC(
          getPart('year'), getPart('month') - 1, getPart('day'),
          getPart('hour'), getPart('minute'), getPart('second')
        ));
        const offset = tzDate.getTime() - wallTimeAsUTC.getTime();
        return new Date(wallTimeAsUTC.getTime() - offset);
      } catch (e) {
        return new Date(NaN);
      }
    };

    const baseUTC = getActualUTC();
    if (isNaN(baseUTC.getTime())) return [];

    const baseOffset = getOffsetMinutes(baseUTC, sourceTZ);
    const baseDateOnly = new Date(getFormatter(sourceTZ, 'full').format(baseUTC).split(',')[0] || '');
    
    return targetTZs.map(tz => {
      try {
        const targetOffset = getOffsetMinutes(baseUTC, tz);
        const diffMinutes = targetOffset - baseOffset;
        
        let offsetLabel = "Same time";
        if (diffMinutes !== 0) {
          const sign = diffMinutes > 0 ? "+" : "-";
          const absMin = Math.abs(diffMinutes);
          const hrs = Math.floor(absMin / 60);
          const mins = Math.floor(absMin % 60);
          if (mins === 0) {
            offsetLabel = `${sign}${hrs}h`;
          } else if (hrs === 0) {
            offsetLabel = `${sign}${mins}m`;
          } else {
            offsetLabel = `${sign}${hrs}h ${mins}m`;
          }
        }

        const targetDateOnly = new Date(getFormatter(tz, 'full').format(baseUTC).split(',')[0] || '');
        const dayDiff = (targetDateOnly.getTime() - baseDateOnly.getTime()) / (1000 * 60 * 60 * 24);
        
        let relativeDay = "";
        if (dayDiff >= 0.5) relativeDay = "Next Day";
        else if (dayDiff <= -0.5) relativeDay = "Previous Day";

        const datePart = getFormatter(tz, 'date').format(baseUTC);
        const timePart = getFormatter(tz, 'time').format(baseUTC);
        const formatted = `${datePart}, ${timePart}`;

        return { 
          tz, 
          date: datePart, 
          time: timePart, 
          offsetLabel, 
          relativeDay,
          full: formatted
        };
      } catch (e) {
        return { tz, date: "Error", time: "Invalid TZ", offsetLabel: "", relativeDay: "", full: "" };
      }
    });
  }, [sourceDate, sourceTZ, targetTZs]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Configuration Panel */}
      <div className="bg-surface border border-border rounded-4xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Source Time & Zone */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue mb-2">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Base Time</h3>
              </div>
              
              <div className="space-y-4">
                
                <ToolInput
                  label="Select Date & Time"
                  type={"datetime-local" as any}
                  value={sourceDate}
                  onChange={setSourceDate}
                />
                
                <div className="pt-2">
                  <SliderField
                    id="time-scrubber"
                    label="Scrub Time (Hours)"
                    min={0}
                    max={1439}
                    step={15}
                    value={timeInMinutes}
                    onChange={handleTimeScrub}
                    format={(v) => {
                      const h = Math.floor(v / 60);
                      const m = v % 60;
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const h12 = h % 12 || 12;
                      return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                    }}
                  />
                </div>

                
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-text-2">Base Time Zone</label>
                  <button
                    onClick={() => setIsSearchingSource(!isSearchingSource)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-bg border border-border rounded-xl text-left hover:border-blue transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-text-muted group-hover:text-blue" />
                      <span className="font-medium text-text">{sourceTZ}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isSearchingSource ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSearchingSource && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 z-dropdown mt-2 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-border bg-bg/50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              placeholder="Search timezone..."
                              className="w-full pl-9 pr-4 py-2 bg-transparent outline-none text-sm font-medium"
                              value={sourceSearch}
                              onChange={(e) => setSourceSearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                          {filteredSourceZones.map(zone => (
                            <button
                              key={zone.tz}
                              onClick={() => {
                                setSourceTZ(zone.tz);
                                setIsSearchingSource(false);
                                setSourceSearch("");
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue/10 text-sm flex justify-between items-center group"
                            >
                              <span className="font-bold text-text group-hover:text-blue">{zone.city}</span>
                              <span className="text-xs text-text-muted">{zone.tz}</span>
                            </button>
                          ))}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Quick Actions & Add Target */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue mb-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-xs">Target Zones</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleSetNow}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue/10 text-blue font-bold rounded-xl hover:bg-blue/20 transition-all border border-blue/20"
                  >
                    <Clock className="w-4 h-4" />
                    Set to Now
                  </button>
                  <button
                    onClick={clearTargets}
                    className="px-4 py-3 bg-error/10 text-error font-bold rounded-xl hover:bg-error/20 transition-all border border-error/20"
                    title="Clear All"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-text-2">Add Time Zone</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Type to search city..."
                      className="w-full pl-11 pr-4 py-3 bg-bg border border-border rounded-xl outline-none focus:ring-4 focus:ring-blue/10 focus:border-blue text-text font-medium"
                      value={targetSearch}
                      onChange={(e) => {
                        setTargetSearch(e.target.value);
                        setIsSearchingTarget(true);
                      }}
                      onFocus={() => setIsSearchingTarget(true)}
                    />
                  </div>

                  <AnimatePresence>
                    {isSearchingTarget && targetSearch && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 z-dropdown mt-2 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                          {filteredTargetZones.map(zone => (
                            <button
                              key={zone.tz}
                              onClick={() => addTargetTZ(zone.tz)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue/10 text-sm flex justify-between items-center group"
                            >
                              <div>
                                <p className="font-bold text-text group-hover:text-blue">{zone.city}</p>
                                <p className="text-xs text-text-muted">{zone.country}</p>
                              </div>
                              <Plus className="w-4 h-4 text-text-muted group-hover:text-blue" />
                            </button>
                          ))}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-bg/50 px-8 py-3 border-t border-border flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-widest-lg">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3" />
            Comparing {targetTZs.length} zones to {sourceTZ}
          </div>
          <div>Browser Native • 100% Private</div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {conversions.map((conv) => (
            <m.div
              key={conv.tz}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-surface border border-border rounded-2xl p-6 hover:shadow-xl hover:border-blue/30 transition-all relative overflow-hidden"
            >
              {/* Decorative Background Icon */}
              <Globe className="absolute -right-4 -bottom-4 w-24 h-24 text-blue/5 group-hover:text-blue/10 transition-colors pointer-events-none" />
              
              <div className="relative z-content space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        {conv.tz.split('/').pop()?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted font-bold truncate max-w-40">
                      {conv.tz}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <CopyButton 
                      text={conv.full} 
                      className="p-2 text-text-muted hover:text-blue hover:bg-blue/10 rounded-lg transition-all"
                    />
                    <button
                      onClick={() => removeTargetTZ(conv.tz)}
                      className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-text tracking-tighter">
                      {conv.time}
                    </h2>
                    {conv.relativeDay && (
                      <span className="text-xs bg-blue/10 text-blue px-2 py-0.5 rounded-full font-black uppercase">
                        {conv.relativeDay}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-3 font-medium">
                    <Calendar className="w-3 h-3" />
                    {conv.date}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-text-muted uppercase tracking-wider">Offset:</span>
                    <span className={`text-xs font-bold ${conv.offsetLabel.startsWith('+') ? 'text-success' : conv.offsetLabel.startsWith('-') ? 'text-error' : 'text-blue'}`}>
                      {conv.offsetLabel}
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </AnimatePresence>

        {/* Empty State / Add New Card */}
        {targetTZs.length < 6 && (
           <button
           onClick={() => {
             setTargetSearch("");
             setIsSearchingTarget(true);
             window.scrollTo({ top: 0, behavior: 'smooth' });
           }}
           className="border-2 border-dashed border-border rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center gap-4 hover:border-blue hover:bg-blue/5 transition-all group"
         >
           <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-blue group-hover:text-white transition-all">
             <Plus className="w-6 h-6" />
           </div>
           <div className="text-center">
             <p className="font-bold text-text">Add another zone</p>
             <p className="text-xs text-text-muted">Compare more cities</p>
           </div>
         </button>
        )}
      </div>

      {/* Backdrop for mobile search */}
      <AnimatePresence>
        {(isSearchingSource || isSearchingTarget) && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsSearchingSource(false);
              setIsSearchingTarget(false);
              setSourceSearch("");
              setTargetSearch("");
            }}
            className="fixed inset-0 z-backdrop bg-black/20 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

