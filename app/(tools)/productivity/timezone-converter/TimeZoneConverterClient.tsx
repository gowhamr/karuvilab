"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Plus, Trash2, Globe, Clock, Calendar } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const DEFAULT_TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Asia/Kolkata"
];

const ALL_TIMEZONES = typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl 
  ? (Intl as any).supportedValuesOf('timeZone') 
  : DEFAULT_TIMEZONES;

export default function TimeZoneConverterClient() {
  const [sourceDate, setSourceDate] = useState(new Date().toISOString().slice(0, 16));
  const [sourceTZ, setSourceTZ] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetTZs, setTargetTZs] = useState<string[]>(["UTC", "America/New_York", "Europe/London"]);
  const [newTZ, setNewTZ] = useState("");

  const addTZ = () => {
    if (newTZ && !targetTZs.includes(newTZ)) {
      setTargetTZs([...targetTZs, newTZ]);
      setNewTZ("");
    }
  };

  const removeTZ = (tz: string) => {
    setTargetTZs(targetTZs.filter(t => t !== tz));
  };

  const conversions = useMemo(() => {
    const date = new Date(sourceDate);
    if (isNaN(date.getTime())) return [];

    return targetTZs.map(tz => {
      try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        return { tz, value: formatter.format(date) };
      } catch (e) {
        return { tz, value: "Invalid Timezone" };
      }
    });
  }, [sourceDate, targetTZs]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface border border-border rounded-[32px]">
        <div className="space-y-4">
          <ToolInput
            label="Base Date & Time"
            type="date"
            value={sourceDate}
            onChange={setSourceDate}
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">Base Time Zone</label>
            <select
              value={sourceTZ}
              onChange={(e) => setSourceTZ(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl outline-none focus:ring-4 focus:ring-blue/10 focus:border-blue text-text"
            >
              {ALL_TIMEZONES.map((tz: string) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-end space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">Add Target Time Zone</label>
            <div className="flex gap-2">
              <select
                value={newTZ}
                onChange={(e) => setNewTZ(e.target.value)}
                className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl outline-none focus:ring-4 focus:ring-blue/10 focus:border-blue text-text"
              >
                <option value="">Select a timezone...</option>
                {ALL_TIMEZONES.map((tz: string) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <button
                onClick={addTZ}
                disabled={!newTZ}
                className="p-3 bg-blue text-white rounded-xl hover:bg-blue/90 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {conversions.map(({ tz, value }) => (
            <m.div
              key={tz}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-surface border border-border rounded-2xl space-y-4 relative group"
            >
              <button
                onClick={() => removeTZ(tz)}
                className="absolute top-4 right-4 p-2 text-text-4 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 text-blue">
                <Globe className="w-5 h-5" />
                <span className="font-bold text-sm truncate pr-6">{tz}</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black tracking-tight">{value.split(', ')[1]}</div>
                <div className="text-sm text-text-3 font-medium">{value.split(', ')[0]}</div>
              </div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
