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
import { useToast } from "@/components/ui/Toast";

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
  const [searchTerm, setSearchTerm] = useState("");

  const allZones = useMemo(() => getAllTimezones(), []);

  const filteredZones = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return COMMON_CITIES;
    return allZones
      .filter(z => 
        z.city.toLowerCase().includes(q) || 
        z.country?.toLowerCase().includes(q) || 
        z.tz.toLowerCase().replace(/_/g, ' ').includes(q)
      )
      .slice(0, 10);
  }, [searchTerm, allZones]);

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
    setSearchTerm("");
  };

  const removeTargetTZ = (tz: string) => {
    setTargetTZs(targetTZs.filter(t => t !== tz));
  };

  const clearTargets = () => {
    setTargetTZs([]);
  };

  const conversions = useMemo(() => {
    const baseDateObj = new Date(sourceDate);
    if (isNaN(baseDateObj.getTime())) return [];

    // To correctly interpret the sourceDate in the sourceTZ:
    // We need to use Intl.DateTimeFormat to find the offset of sourceTZ at that moment
    // and adjust. But simpler: use the format with timeZone option.
    
    return targetTZs.map(tz => {
      try {
        const targetFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        
        const sourceInTarget = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }).format(baseDateObj);

        const sourceInSource = new Intl.DateTimeFormat('en-US', {
            timeZone: sourceTZ,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }).format(baseDateObj);

        // This is a bit tricky with just Intl. Let's use a simpler approach for offsets.
        // We'll calculate the difference in minutes between the two zones for the given date.
        
        const getOffset = (date: Date, timeZone: string) => {
          const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
          const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
          return (tzDate.getTime() - utcDate.getTime()) / 60000;
        };

        const baseOffset = getOffset(baseDateObj, sourceTZ);
        const targetOffset = getOffset(baseDateObj, tz);
        const diffMinutes = targetOffset - baseOffset;
        const diffHours = diffMinutes / 60;
        
        const offsetLabel = diffHours === 0 ? "Same time" : 
                            diffHours > 0 ? `+${diffHours}h` : `${diffHours}h`;

        // Relative Day
        const baseDay = new Date(baseDateObj.toLocaleString('en-US', { timeZone: sourceTZ })).getDate();
        const targetDay = new Date(baseDateObj.toLocaleString('en-US', { timeZone: tz })).getDate();
        
        let relativeDay = "";
        if (targetDay > baseDay) relativeDay = "Next Day";
        else if (targetDay < baseDay) relativeDay = "Previous Day";

        const formatted = targetFormatter.format(baseDateObj);
        const [datePart, timePart] = formatted.split(', ');

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
      <div className="bg-surface border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 space-y-8">
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
                
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-text-2">Base Time Zone</label>
                  <button
                    onClick={() => setIsSearchingSource(!isSearchingSource)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-bg border border-border rounded-xl text-left hover:border-blue transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-text-4 group-hover:text-blue" />
                      <span className="font-medium text-text">{sourceTZ}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-4 transition-transform ${isSearchingSource ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSearchingSource && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-border bg-bg/50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
                            <input
                              type="text"
                              placeholder="Search timezone..."
                              className="w-full pl-9 pr-4 py-2 bg-transparent outline-none text-sm font-medium"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                          {filteredZones.map(zone => (
                            <button
                              key={zone.tz}
                              onClick={() => {
                                setSourceTZ(zone.tz);
                                setIsSearchingSource(false);
                                setSearchTerm("");
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue/10 text-sm flex justify-between items-center group"
                            >
                              <span className="font-bold text-text group-hover:text-blue">{zone.city}</span>
                              <span className="text-xs text-text-4">{zone.tz}</span>
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
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Type to search city..."
                      className="w-full pl-11 pr-4 py-3 bg-bg border border-border rounded-xl outline-none focus:ring-4 focus:ring-blue/10 focus:border-blue text-text font-medium"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsSearchingTarget(true);
                      }}
                      onFocus={() => setIsSearchingTarget(true)}
                    />
                  </div>

                  <AnimatePresence>
                    {isSearchingTarget && searchTerm && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                          {filteredZones.map(zone => (
                            <button
                              key={zone.tz}
                              onClick={() => addTargetTZ(zone.tz)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue/10 text-sm flex justify-between items-center group"
                            >
                              <div>
                                <p className="font-bold text-text group-hover:text-blue">{zone.city}</p>
                                <p className="text-[10px] text-text-4">{zone.country}</p>
                              </div>
                              <Plus className="w-4 h-4 text-text-4 group-hover:text-blue" />
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
        <div className="bg-bg/50 px-8 py-3 border-t border-border flex items-center justify-between text-[10px] font-bold text-text-4 uppercase tracking-[0.2em]">
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
              className="group bg-surface border border-border rounded-[24px] p-6 hover:shadow-xl hover:border-blue/30 transition-all relative overflow-hidden"
            >
              {/* Decorative Background Icon */}
              <Globe className="absolute -right-4 -bottom-4 w-24 h-24 text-blue/5 group-hover:text-blue/10 transition-colors pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        {conv.tz.split('/').pop()?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-4 font-bold truncate max-w-[150px]">
                      {conv.tz}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <CopyButton 
                      text={conv.full} 
                      className="p-2 text-text-4 hover:text-blue hover:bg-blue/10 rounded-lg transition-all"
                    />
                    <button
                      onClick={() => removeTargetTZ(conv.tz)}
                      className="p-2 text-text-4 hover:text-error hover:bg-error/10 rounded-lg transition-all"
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
                      <span className="text-[10px] bg-blue/10 text-blue px-2 py-0.5 rounded-full font-black uppercase">
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
                    <span className="text-[10px] font-black text-text-4 uppercase tracking-wider">Offset:</span>
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
             setSearchTerm("");
             setIsSearchingTarget(true);
             window.scrollTo({ top: 0, behavior: 'smooth' });
           }}
           className="border-2 border-dashed border-border rounded-[24px] p-8 flex flex-col items-center justify-center gap-4 hover:border-blue hover:bg-blue/5 transition-all group"
         >
           <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-blue group-hover:text-white transition-all">
             <Plus className="w-6 h-6" />
           </div>
           <div className="text-center">
             <p className="font-bold text-text">Add another zone</p>
             <p className="text-xs text-text-4">Compare more cities</p>
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
              setSearchTerm("");
            }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

