"use client";

import { useCalendarStore } from "../store";
import { getUpcomingEvents } from "../event-resolver";
import { EventCategory, EventImportance, WorldEvent } from "../world-events-db";
import { format } from "date-fns";
import { Globe, Settings, Filter, Check, Eye, EyeOff, ChevronDown, Database, Download, Upload, FileSpreadsheet, RotateCcw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/components/ui/Toast";
import { blobManager } from "@/src/lib/blob-manager";
import { exportToICS, parseICS } from "../utils/ics";

export function CalendarSidebar() {
  const worldEventsSettings = useCalendarStore(state => state.worldEventsSettings);
  const updateWorldEventsSettings = useCalendarStore(state => state.updateWorldEventsSettings);
  const setSelectedWorldEvent = useCalendarStore(state => state.setSelectedWorldEvent);
  const events = useCalendarStore(state => state.events);
  const addEvent = useCalendarStore(state => state.addEvent);
  const fetchEvents = useCalendarStore(state => state.fetchEvents);
  const { toast } = useToast();

  const handleExportICS = () => {
    try {
      const icsString = exportToICS(events);
      const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
      blobManager.download(blob, `karuvilab-calendar-${format(new Date(), 'yyyy-MM-dd')}.ics`);
      toast("Events exported successfully as ICS file", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to export ICS file", "error");
    }
  };

  const handleImportICS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseICS(text);
        if (parsed.length === 0) {
          toast("No valid calendar events found in this file.", "error");
          return;
        }

        for (const rawEvt of parsed) {
          await addEvent(rawEvt);
        }
        await fetchEvents();
        toast(`Successfully imported ${parsed.length} events!`, "success");
      } catch (err) {
        console.error(err);
        toast("Failed to parse ICS file.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleBackupJSON = () => {
    try {
      const dataStr = JSON.stringify(events, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      blobManager.download(blob, `karuvilab-calendar-backup-${format(new Date(), 'yyyy-MM-dd')}.json`);
      toast("Calendar backup downloaded successfully", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to backup calendar data", "error");
    }
  };

  const handleRestoreJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const restored = JSON.parse(text);
        if (!Array.isArray(restored)) {
          toast("Invalid backup format. Must be a JSON array of events.", "error");
          return;
        }

        for (const rawEvt of restored) {
          if (rawEvt.id && rawEvt.title && rawEvt.startDate && rawEvt.endDate) {
            await addEvent(rawEvt);
          }
        }
        await fetchEvents();
        toast("Calendar restored from backup successfully!", "success");
      } catch (err) {
        console.error(err);
        toast("Failed to restore calendar from backup.", "error");
      }
    };
    reader.readAsText(file);
  };

  const {
    showWorldEvents,
    showCategories,
    showImportance,
    highlightIndianEvents,
    compactBadges,
  } = worldEventsSettings;

  const upcoming = getUpcomingEvents(new Date(), 5);

  const CATEGORY_INFOS: { id: EventCategory; label: string; emoji: string }[] = [
    { id: 'global-holiday', label: 'Global Holidays', emoji: '🎉' },
    { id: 'un-observance', label: 'UN Days', emoji: '🕊️' },
    { id: 'environmental', label: 'Environment', emoji: '🌿' },
    { id: 'health', label: 'Health', emoji: '🏥' },
    { id: 'cultural', label: 'Cultural', emoji: '🎭' },
    { id: 'historical', label: 'Historical', emoji: '⏳' },
    { id: 'awareness', label: 'Awareness', emoji: '🎗️' },
    { id: 'science-tech', label: 'Science & Tech', emoji: '🧪' },
    { id: 'indian-national', label: 'India National', emoji: '🇮🇳' },
    { id: 'indian-festival', label: 'Indian Festivals', emoji: '🪔' },
    { id: 'sporting', label: 'Sporting', emoji: '🏆' },
    { id: 'professional', label: 'Professional', emoji: '💼' },
  ];

  const IMPORTANCE_INFOS: { id: EventImportance; label: string }[] = [
    { id: 'major', label: 'Major' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'minor', label: 'Minor' },
  ];

  const handleCategoryToggle = (category: EventCategory) => {
    if (showCategories.includes(category)) {
      updateWorldEventsSettings({
        showCategories: showCategories.filter(c => c !== category),
      });
    } else {
      updateWorldEventsSettings({
        showCategories: [...showCategories, category],
      });
    }
  };

  const handleImportanceToggle = (importance: EventImportance) => {
    if (showImportance.includes(importance)) {
      updateWorldEventsSettings({
        showImportance: showImportance.filter(i => i !== importance),
      });
    } else {
      updateWorldEventsSettings({
        showImportance: [...showImportance, importance],
      });
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Upcoming Events Widget */}
      {worldEventsSettings.showUpcomingWidget && (
        <div className="bg-surface/40 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            Upcoming World Events
          </h3>
          <div className="space-y-3">
            {upcoming.map(({ event, date, daysUntil }) => (
              <div
                key={event.id}
                onClick={() => setSelectedWorldEvent({ event, date })}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2/30 hover:bg-hover border border-border/10 cursor-pointer transition-all active:scale-98"
              >
                <span className="text-2xl" role="img" aria-label={event.name}>
                  {event.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-text truncate">
                    {event.name}
                  </p>
                  <p className="text-[11px] font-bold text-text-4">
                    {format(date, 'EEE, MMM d')} ·{' '}
                    {daysUntil === 0 ? 'Today' :
                     daysUntil === 1 ? 'Tomorrow' :
                     `In ${daysUntil} days`}
                  </p>
                </div>
                {daysUntil <= 7 && (
                  <span className={cn(
                    "text-micro font-black px-2 py-0.5 rounded-full border",
                    daysUntil === 0 
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  )}>
                    {daysUntil === 0 ? 'TODAY' : 'SOON'}
                  </span>
                )}
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-xs text-text-4 font-medium text-center py-4">No upcoming events found</p>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <div className="bg-surface/40 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-3xl p-5 shadow-sm space-y-5">
        <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-500" />
          Event Preferences
        </h3>

        {/* Master Toggle */}
        <button
          onClick={() => updateWorldEventsSettings({ showWorldEvents: !showWorldEvents })}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-98",
            showWorldEvents 
              ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
              : "bg-surface-2/30 border-border/20 text-text-4 hover:text-text-3"
          )}
        >
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
            {showWorldEvents ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showWorldEvents ? 'World Events On' : 'World Events Off'}
          </span>
          <div className={cn(
            "w-8 h-4 rounded-full p-0.5 transition-colors duration-200",
            showWorldEvents ? "bg-indigo-600" : "bg-zinc-700"
          )}>
            <div className={cn(
              "w-3 h-3 rounded-full bg-white transition-transform duration-200",
              showWorldEvents ? "translate-x-4" : "translate-x-0"
            )} />
          </div>
        </button>

        {showWorldEvents && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Visual Options */}
            <div className="space-y-2.5">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Display Options</label>
              <div className="space-y-2">
                <button
                  onClick={() => updateWorldEventsSettings({ highlightIndianEvents: !highlightIndianEvents })}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-text-3 hover:text-text py-1 px-1 transition-colors"
                >
                  <span>Highlight Indian Holidays</span>
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                    highlightIndianEvents ? "bg-indigo-600 border-indigo-500" : "border-border/50"
                  )}>
                    {highlightIndianEvents && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
                <button
                  onClick={() => updateWorldEventsSettings({ compactBadges: !compactBadges })}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-text-3 hover:text-text py-1 px-1 transition-colors"
                >
                  <span>Compact Grid Badges (Emoji Only)</span>
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                    compactBadges ? "bg-indigo-600 border-indigo-500" : "border-border/50"
                  )}>
                    {compactBadges && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Importance filters */}
            <div className="space-y-2.5 border-t border-border/20 pt-4">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Importance</label>
              <div className="flex flex-wrap gap-1.5">
                {IMPORTANCE_INFOS.map((imp) => {
                  const isActive = showImportance.includes(imp.id);
                  return (
                    <button
                      key={imp.id}
                      onClick={() => handleImportanceToggle(imp.id)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border transition-all active:scale-95",
                        isActive
                          ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                          : "bg-surface-2/10 border-border/20 text-text-4 hover:text-text-2"
                      )}
                    >
                      {imp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories checkbox list */}
            <div className="border-t border-border/20 pt-4">
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none">
                  <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-1.5 cursor-pointer">
                    <Filter className="w-3.5 h-3.5 text-indigo-500/80" />
                    Categories <span className="text-[10px] text-text-muted bg-surface-2 px-1.5 py-0.5 rounded-md">{showCategories.length} selected</span>
                  </label>
                  <ChevronDown className="w-4 h-4 text-text-4 group-open:rotate-180 transition-transform" />
                </summary>
                
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => updateWorldEventsSettings({ showCategories: CATEGORY_INFOS.map(c => c.id) })}
                      className="flex-1 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-xs font-bold text-text-3 transition-colors"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={() => updateWorldEventsSettings({ showCategories: [] })}
                      className="flex-1 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-xs font-bold text-text-3 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar pb-2">
                    {CATEGORY_INFOS.map((cat) => {
                  const isActive = showCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={cn(
                        "flex items-center justify-between text-left text-xs font-bold py-1.5 px-2 rounded-lg transition-all",
                        isActive 
                          ? "bg-surface-2/50 text-text" 
                          : "text-text-4 hover:text-text-3"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label={cat.label}>{cat.emoji}</span>
                        {cat.label}
                      </span>
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        isActive ? "bg-indigo-600 border-indigo-500" : "border-border/50"
                      )}>
                        {isActive && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>

      {/* Import / Export & Backup */}
      <div className="bg-surface/40 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500" />
          Data & Portability
        </h3>

        <div className="space-y-3 pt-1">
          {/* Export ICS */}
          <button
            onClick={handleExportICS}
            className="w-full py-2.5 bg-surface-2 hover:bg-hover border border-border/10 rounded-xl text-xs font-bold text-text-2 hover:text-text transition-all active:scale-98 text-left px-3 flex items-center justify-between"
          >
            <span>Export Events (.ics)</span>
            <Download className="w-3.5 h-3.5 text-text-4" />
          </button>

          {/* Import ICS */}
          <label className="w-full py-2.5 bg-surface-2 hover:bg-hover border border-border/10 rounded-xl text-xs font-bold text-text-2 hover:text-text transition-all active:scale-98 cursor-pointer px-3 flex items-center justify-between">
            <span>Import Events (.ics)</span>
            <Upload className="w-3.5 h-3.5 text-text-4" />
            <input
              type="file"
              accept=".ics"
              onChange={handleImportICS}
              className="hidden"
            />
          </label>

          {/* Backup JSON */}
          <button
            onClick={handleBackupJSON}
            className="w-full py-2.5 bg-surface-2 hover:bg-hover border border-border/10 rounded-xl text-xs font-bold text-text-2 hover:text-text transition-all active:scale-98 text-left px-3 flex items-center justify-between"
          >
            <span>Backup Data (JSON)</span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-text-4" />
          </button>

          {/* Restore JSON */}
          <label className="w-full py-2.5 bg-surface-2 hover:bg-hover border border-border/10 rounded-xl text-xs font-bold text-text-2 hover:text-text transition-all active:scale-98 cursor-pointer px-3 flex items-center justify-between">
            <span>Restore Backup (JSON)</span>
            <RotateCcw className="w-3.5 h-3.5 text-text-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
