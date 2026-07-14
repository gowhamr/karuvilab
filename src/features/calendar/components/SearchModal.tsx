"use client";

import { useState, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCalendarStore } from "../store";
import { ALL_WORLD_EVENTS, WorldEvent } from "../world-events-db";
import { CalendarEvent, EventColor } from "../types";
import { Search, X, SlidersHorizontal, History, Calendar, MapPin, Tag } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/src/lib/utils";
import { COLOR_MAP } from "../constants";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const events = useCalendarStore(state => state.events);
  const setSelectedEvent = useCalendarStore(state => state.setSelectedEvent);
  const setSelectedWorldEvent = useCalendarStore(state => state.setSelectedWorldEvent);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'world'>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'alphabetical'>('date-desc');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kv-calendar-recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  const saveSearchQuery = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(q => q !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('kv-calendar-recent-searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('kv-calendar-recent-searches');
  };

  // Perform search and filtering
  const results = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    // 1. Filter Personal Events
    const filteredPersonal = events.filter(evt => {
      const matchesText = 
        !normalizedQuery ||
        evt.title.toLowerCase().includes(normalizedQuery) ||
        (evt.description && evt.description.toLowerCase().includes(normalizedQuery)) ||
        (evt.location && evt.location.toLowerCase().includes(normalizedQuery));

      const matchesColor = !selectedColor || evt.color === selectedColor;

      return matchesText && matchesColor;
    });

    // 2. Filter World Events
    const filteredWorld = ALL_WORLD_EVENTS.filter(evt => {
      const matchesText = 
        !normalizedQuery ||
        evt.name.toLowerCase().includes(normalizedQuery) ||
        evt.description.short.toLowerCase().includes(normalizedQuery) ||
        evt.tags.some(t => t.toLowerCase().includes(normalizedQuery));

      const matchesColor = !selectedColor; // World events are not filtered by personal colors

      return matchesText && matchesColor;
    });

    // 3. Map both to a unified search result shape
    interface UnifiedResult {
      id: string;
      title: string;
      description: string | undefined;
      date: Date;
      location: string | undefined;
      type: 'personal' | 'world';
      color?: string;
      emoji?: string;
      rawPersonal?: CalendarEvent;
      rawWorld?: WorldEvent;
    }

    let unified: UnifiedResult[] = [];

    if (activeTab === 'all' || activeTab === 'personal') {
      unified = [...unified, ...filteredPersonal.map(evt => ({
        id: evt.id,
        title: evt.title,
        description: evt.description,
        date: parseISO(evt.startDate),
        location: evt.location,
        type: 'personal' as const,
        color: evt.color,
        rawPersonal: evt
      }))];
    }

    if (activeTab === 'all' || activeTab === 'world') {
      // Resolve world events for the current year
      const currentYear = new Date().getFullYear();
      unified = [...unified, ...filteredWorld.map(evt => {
        const date = new Date(currentYear, evt.date.month - 1, evt.date.day);
        return {
          id: evt.id,
          title: evt.name,
          description: evt.description.short,
          date,
          location: undefined,
          type: 'world' as const,
          emoji: evt.emoji,
          rawWorld: evt
        };
      })];
    }

    // 4. Sorting
    unified.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return a.date.getTime() - b.date.getTime();
      } else if (sortBy === 'date-desc') {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return unified;
  }, [query, activeTab, sortBy, selectedColor, events]);

  const handleResultClick = (item: typeof results[number]) => {
    saveSearchQuery(query);
    if (item.type === 'personal' && item.rawPersonal) {
      setSelectedEvent(item.rawPersonal.id);
    } else if (item.type === 'world' && item.rawWorld) {
      setSelectedWorldEvent({ event: item.rawWorld, date: item.date });
    }
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-modal-backdrop animate-in fade-in" />
        <Dialog.Content className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-surface border border-border rounded-4xl p-6 md:p-8 shadow-2xl z-modal animate-in zoom-in-95 duration-200 flex flex-col max-h-[70vh]">
          {/* Header Row */}
          <div className="flex items-center gap-3 mb-6 relative">
            <Search className="w-5 h-5 text-text-4 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search events"
              placeholder="Search title, description, location, or tag..."
              className="w-full h-12 pl-12 pr-12 bg-bg border border-border rounded-2xl text-sm font-bold focus:border-blue outline-none transition-all placeholder:text-text-4 text-text"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="p-1 hover:bg-surface-2 rounded-lg text-text-4 absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subheaders: Tabs and Advanced Filter Toggle */}
          <div className="flex items-center justify-between mb-4 border-b border-border/20 pb-3">
            <div className="flex gap-2">
              {(['all', 'personal', 'world'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                    activeTab === tab 
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                      : "text-text-4 hover:text-text-2 hover:bg-surface-2"
                  )}
                >
                  {tab === 'all' ? 'All' : tab === 'personal' ? 'Personal' : 'World Holidays'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-xs font-bold",
                showFilters 
                  ? "bg-surface-2 border-indigo-500/30 text-indigo-400" 
                  : "border-border/30 text-text-4 hover:text-text-3"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Collapsible Advanced Filters */}
          {showFilters && (
            <div className="p-4 bg-surface-2/30 border border-border/20 rounded-2xl mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-150">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-text-4">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full h-10 bg-bg border border-border/30 rounded-xl px-3 text-xs font-bold text-text outline-none focus:border-blue cursor-pointer"
                >
                  <option value="date-desc">Newest Date</option>
                  <option value="date-asc">Oldest Date</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              {activeTab !== 'world' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-text-4">Category Color</label>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedColor(null)}
                      className={cn(
                        "px-2.5 h-8 rounded-lg text-micro font-bold border transition-all",
                        !selectedColor 
                          ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                          : "border-border/30 text-text-4"
                      )}
                    >
                      ALL
                    </button>
                    {(Object.keys(COLOR_MAP) as string[]).map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-lg border-2 transition-all relative flex items-center justify-center",
                          selectedColor === color ? "border-text scale-105" : "border-transparent opacity-50 hover:opacity-100"
                        )}
                        style={{ backgroundColor: COLOR_MAP[color as EventColor].hex }}
                      >
                        {selectedColor === color && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {unifiedResultsContent()}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  function unifiedResultsContent() {
    if (query === "" && recentSearches.length > 0) {
      return (
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-text-4 px-2">
            <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Recent Searches</span>
            <button onClick={clearRecentSearches} className="hover:text-text-3 transition-colors text-[10px]">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(q => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="px-3 py-1.5 bg-surface-2 hover:bg-surface-2/80 text-xs font-bold text-text-2 rounded-xl transition-all border border-border/10 flex items-center gap-1.5"
              >
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12 space-y-3">
          <div className="text-3xl text-text-4">🔍</div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-text-3">No results found</h4>
            <p className="text-xs text-text-4 max-w-sm mx-auto">Try refining your search text or updating filters.</p>
          </div>
        </div>
      );
    }

    return results.map(item => (
      <div
        key={item.id + '-' + item.type + '-' + item.date.toISOString()}
        onClick={() => handleResultClick(item)}
        className="flex items-center justify-between p-4 bg-surface-2/20 hover:bg-hover border border-border/10 rounded-2xl cursor-pointer transition-all active:scale-99"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {item.type === 'personal' && item.color ? (
            <div 
              className="w-2.5 h-10 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: COLOR_MAP[item.color as EventColor].hex }}
            />
          ) : (
            <span className="text-2xl shrink-0" role="img" aria-hidden="true">
              {item.emoji || '📅'}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-text truncate group-hover:text-indigo-400 transition-colors">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-xs text-text-4 truncate mt-0.5 font-medium">
                {item.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 items-center mt-1.5">
              <span className="text-[10px] font-black text-text-4 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-500/50" /> {format(item.date, 'MMM d, yyyy')}
              </span>
              {item.location && (
                <span className="text-[10px] font-black text-text-4 uppercase flex items-center gap-1 truncate max-w-xs">
                  <MapPin className="w-3 h-3 text-indigo-500/50" /> {item.location}
                </span>
              )}
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border leading-none",
                item.type === 'personal' 
                  ? "bg-blue/10 border-blue/20 text-blue" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              )}>
                {item.type === 'personal' ? 'Personal' : 'Holiday'}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
  }
}
