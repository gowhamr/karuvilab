"use client";

import { useCalendarStore } from "../store";
import { getUpcomingEvents } from "../event-resolver";
import { EventCategory, EventImportance, WorldEvent } from "../world-events-db";
import { format } from "date-fns";
import { Globe, Settings, Filter, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useShallow } from "zustand/react/shallow";

export function CalendarSidebar() {
  const worldEventsSettings = useCalendarStore(state => state.worldEventsSettings);
  const updateWorldEventsSettings = useCalendarStore(state => state.updateWorldEventsSettings);
  const setSelectedWorldEvent = useCalendarStore(state => state.setSelectedWorldEvent);

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
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
      {/* Upcoming Events Widget */}
      {worldEventsSettings.showUpcomingWidget && (
        <div className="bg-surface/40 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            Upcoming World Events
          </h3>
          <div className="space-y-3">
            {upcoming.map(({ event, date, daysUntil }) => (
              <div
                key={event.id}
                onClick={() => setSelectedWorldEvent({ event, date })}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2/30 hover:bg-hover border border-border/10 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span className="text-2xl" role="img" aria-label={event.name}>
                  {event.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-text truncate">
                    {event.name}
                  </p>
                  <p className="text-[10px] font-bold text-text-4">
                    {format(date, 'MMM d')} ·{' '}
                    {daysUntil === 0 ? 'Today' :
                     daysUntil === 1 ? 'Tomorrow' :
                     `In ${daysUntil} days`}
                  </p>
                </div>
                {daysUntil <= 7 && (
                  <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded-full border",
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
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-500" />
          Event Preferences
        </h3>

        {/* Master Toggle */}
        <button
          onClick={() => updateWorldEventsSettings({ showWorldEvents: !showWorldEvents })}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98]",
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
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Display Options</label>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Importance</label>
              <div className="flex flex-wrap gap-1.5">
                {IMPORTANCE_INFOS.map((imp) => {
                  const isActive = showImportance.includes(imp.id);
                  return (
                    <button
                      key={imp.id}
                      onClick={() => handleImportanceToggle(imp.id)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all active:scale-95",
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
            <div className="space-y-2.5 border-t border-border/20 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-500/80" />
                Categories
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 no-scrollbar">
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
          </div>
        )}
      </div>
    </aside>
  );
}
