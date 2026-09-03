"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Target, Check, ChevronUp, Clock } from "lucide-react";
import { calculateReadability } from "../utils/readability";

interface StatBarProps {
  stats: {
    lines: number;
    words: number;
    chars: number;
    readMin: number;
  };
  rawText?: string;
  goal?: number;
  onGoalChange?: (newGoal: number) => void;
  lastSaved?: number | null;
}

const PRESET_GOALS = [
  { label: "250 (Quick Note)", value: 250 },
  { label: "500 (Standard)", value: 500 },
  { label: "1,000 (Article)", value: 1000 },
  { label: "1,500 (Essay)", value: 1500 },
  { label: "2,500 (Long-form)", value: 2500 },
  { label: "5,000 (Chapter)", value: 5000 },
];

export function StatBar({ stats, rawText = "", goal = 500, onGoalChange, lastSaved }: StatBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const progress = Math.min(100, Math.round((stats.words / goal) * 100));
  const metrics = useMemo(() => calculateReadability(rawText), [rawText]);

  useEffect(() => {
    if (!isOpen && !isMetricsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (metricsRef.current && !metricsRef.current.contains(e.target as Node)) {
        setIsMetricsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMetricsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isMetricsOpen]);

  const handleSelectGoal = (val: number) => {
    if (val > 0 && onGoalChange) {
      onGoalChange(val);
    }
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customInput, 10);
    if (!isNaN(num) && num > 0) {
      handleSelectGoal(num);
      setCustomInput("");
    }
  };

  return (
    <div className="relative flex flex-wrap items-center gap-4 px-4 py-2 bg-bg/50 border-t border-border text-xs font-bold text-text-4 uppercase tracking-widest">
      <div className="flex items-center gap-1">
        Lines: <span className="text-text">{stats.lines.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        Words: <span className="text-text">{stats.words.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        Chars: <span className="text-text">{stats.chars.toLocaleString()}</span>
      </div>
      
      {/* Readability & Time Insights Popover */}
      <div ref={metricsRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMetricsOpen(!isMetricsOpen)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-text-4 hover:text-blue transition-all cursor-pointer"
          title="Click to view Speaking Time & Readability Grade"
          aria-label="View Readability and Timing Insights"
          aria-expanded={isMetricsOpen}
        >
          <Clock className="w-3 h-3 text-blue shrink-0" />
          <span>Read: <strong className="text-text">{stats.readMin}m</strong></span>
          <span className="text-[10px] text-text-4 lowercase font-mono">/ speak {metrics.speakingTimeMin}m</span>
          <ChevronUp className={`w-2.5 h-2.5 transition-transform duration-150 ${isMetricsOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isMetricsOpen && (
            <m.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-0 mb-2 w-64 bg-surface border border-border rounded-2xl shadow-xl p-3 z-dropdown flex flex-col gap-2.5 normal-case"
            >
              <div className="flex items-center justify-between text-xs font-bold border-b border-border pb-1.5 uppercase tracking-wider text-text-4 text-[10px]">
                <span>Document Insights</span>
                <span className="text-blue font-mono">{metrics.words.toLocaleString()} words</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-bg/70 rounded-xl border border-border flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-4 uppercase font-bold tracking-wider">Reading Time</span>
                  <span className="text-sm font-bold text-text font-mono">{metrics.readingTimeMin} min</span>
                  <span className="text-[10px] text-text-4">~200 words/min</span>
                </div>
                <div className="p-2 bg-bg/70 rounded-xl border border-border flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-4 uppercase font-bold tracking-wider">Speaking Time</span>
                  <span className="text-sm font-bold text-blue font-mono">{metrics.speakingTimeMin} min</span>
                  <span className="text-[10px] text-text-4">~130 words/min</span>
                </div>
              </div>

              {/* Readability Score */}
              <div className="p-2 bg-bg/70 rounded-xl border border-border flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-4 uppercase font-bold tracking-wider">Readability Ease</span>
                  <span className="text-xs font-bold font-mono text-text">{metrics.fleschScore}/100</span>
                </div>
                <div className="text-xs font-semibold text-blue">
                  {metrics.fleschGrade}
                </div>
                <div className="text-[10px] text-text-4 flex items-center justify-between pt-1 border-t border-border/50">
                  <span>Grade Level: {metrics.gradeLevel}</span>
                  <span>Sentences: {metrics.sentences}</span>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {lastSaved && (
        <div className="hidden sm:flex items-center gap-1 text-tiny font-normal text-text-4 lowercase tracking-normal">
          <span>•</span>
          <span>Saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
      
      {/* Goal Tracker Container */}
      <div ref={popoverRef} className="relative flex-1 min-w-36 flex items-center gap-2 max-w-xs ml-auto">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg hover:bg-surface border border-transparent hover:border-border text-tiny text-text-3 hover:text-blue transition-all cursor-pointer select-none"
          title="Click to change word count goal"
          aria-label={`Current writing goal: ${goal} words. Click to change`}
          aria-expanded={isOpen}
        >
          <Target className="w-3 h-3 text-blue shrink-0" />
          <span>Goal ({goal.toLocaleString()})</span>
          <ChevronUp className={`w-2.5 h-2.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <m.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full transition-colors duration-300 ${progress >= 100 ? 'bg-success' : 'bg-blue'}`}
          />
        </div>
        <span className="min-w-6 text-right text-text-3 font-mono">{progress}%</span>

        {/* Goal Preset Popover */}
        <AnimatePresence>
          {isOpen && (
            <m.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full right-0 mb-2 w-56 bg-surface border border-border rounded-2xl shadow-xl p-2.5 z-dropdown flex flex-col gap-2"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-4 px-1 flex items-center justify-between">
                <span>Set Word Target</span>
                <span className="text-blue font-mono">{goal.toLocaleString()} w</span>
              </div>

              <div className="flex flex-col gap-0.5">
                {PRESET_GOALS.map((preset) => {
                  const isSelected = preset.value === goal;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleSelectGoal(preset.value)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue/10 text-blue font-bold' 
                          : 'text-text-3 hover:bg-hover hover:text-text'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Target Input */}
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 pt-1.5 border-t border-border">
                <input
                  type="number"
                  min="10"
                  max="100000"
                  placeholder="Custom target..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full px-2.5 py-1 bg-bg border border-border rounded-xl text-xs text-text placeholder:text-text-4 focus:outline-none focus:border-blue"
                />
                <button
                  type="submit"
                  disabled={!customInput || parseInt(customInput, 10) <= 0}
                  className="px-2.5 py-1 bg-blue text-white rounded-xl text-xs font-bold hover:bg-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                >
                  Set
                </button>
              </form>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
