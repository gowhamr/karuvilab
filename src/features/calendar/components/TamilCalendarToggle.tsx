"use client";

import { useCalendarStore } from "../store";
import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function TamilCalendarToggle() {
  const { tamilModeEnabled, setTamilMode } = useCalendarStore();

  return (
    <button
      onClick={() => setTamilMode(!tamilModeEnabled)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
        tamilModeEnabled
          ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
          : "bg-surface border-border text-text-4 hover:border-indigo-500/30"
      )}
      title="Toggle Tamil Calendar Mode"
    >
      <Sparkles className={cn("w-3 h-3", tamilModeEnabled && "fill-current")} />
      <span>Tamil Mode</span>
    </button>
  );
}
