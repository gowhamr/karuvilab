"use client";

import { WorldEvent } from "../world-events-db";
import { X, Globe, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

interface WorldEventPanelProps {
  event: WorldEvent;
  date: Date;
  onClose: () => void;
}

export function WorldEventPanel({ event, date, onClose }: WorldEventPanelProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'history' | 'celebrate' | 'facts'>('about');

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* Slide-in Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-surface/90 backdrop-blur-2xl border-l border-border/40 z-50 p-6 md:p-8 flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold text-text-4 flex items-center gap-2 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-indigo-500" />
            World Event details
          </span>
          <button
            onClick={onClose}
            aria-label="Close event details"
            className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-hover border border-border/30 flex items-center justify-center text-text-3 hover:text-text active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Banner */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl md:text-6xl drop-shadow-md" role="img" aria-label={event.name}>
            {event.emoji}
          </span>
          <div className="space-y-1.5 flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-text leading-tight break-words">
              {event.name}
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                event.colors.bg,
                event.colors.border,
                event.colors.text
              )}>
                {event.category.replace('-', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-surface-2 text-text-3 border border-border/30">
                {event.importance}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-surface-2 text-text-3 border border-border/30">
                {event.globalReach.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="mb-6 px-4 py-3 bg-surface-2 border border-border/20 rounded-2xl flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-500/80" />
          <div>
            <p className="text-xs font-bold text-text-4 uppercase tracking-wider leading-none">Date Observed</p>
            <p className="text-sm font-black text-text mt-1">{format(date, 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>

        {/* Custom Segmented Tabs */}
        <div className="flex border-b border-border/20 mb-6 gap-2">
          {(['about', 'history', 'celebrate', 'facts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 px-1 relative -bottom-[2px]",
                activeTab === tab 
                  ? "border-indigo-500 text-indigo-500 font-black" 
                  : "border-transparent text-text-4 hover:text-text-2 font-bold"
              )}
            >
              {tab === 'celebrate' ? 'Observe' : tab === 'facts' ? 'Fun Fact' : tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <p className="text-sm md:text-base text-text-2 leading-relaxed font-medium">
                {event.description.full}
              </p>
              
              <div className="p-5 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-2">
                  Why We Celebrate
                </p>
                <p className="text-xs md:text-sm text-text-3 leading-relaxed">
                  {event.description.whyCelebrate}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <p className="text-xs md:text-sm text-text-2 leading-relaxed">
              {event.description.history}
            </p>
          )}

          {activeTab === 'celebrate' && (
            <p className="text-xs md:text-sm text-text-2 leading-relaxed">
              {event.description.howToObserve}
            </p>
          )}

          {activeTab === 'facts' && (
            <div className="p-5 bg-yellow-500/[0.03] border border-yellow-500/10 rounded-2xl">
              <p className="text-sm font-bold text-yellow-500 flex items-center gap-2 mb-2">
                💡 Did You Know?
              </p>
              <p className="text-xs md:text-sm text-text-2 leading-relaxed">
                {event.description.funFact}
              </p>
            </div>
          )}
        </div>

        {/* Footer Info / Links */}
        <div className="mt-8 pt-6 border-t border-border/20 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-surface-2 border border-border/20 text-text-3"
              >
                #{tag}
              </span>
            ))}
          </div>

          {event.links && event.links.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-4">Reference Links</p>
              <div className="flex flex-col gap-1.5">
                {event.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
