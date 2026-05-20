"use client";

import React from "react";
import { m } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface Option<T> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * A unified, accessible segmented control (tabs) for tool modes and settings.
 * Adheres to KL-Series design governance for elevated surfaces and interaction.
 */
export function SegmentedControl<T extends string | number>({
  options,
  activeId,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex p-1 bg-bg border border-border rounded-2xl w-fit",
        className
      )}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue/20",
              isActive ? "text-white" : "text-text-4 hover:text-text-2 hover:bg-surface/50"
            )}
          >
            {isActive && (
              <m.div
                layoutId="segmented-active"
                className="absolute inset-0 bg-blue rounded-xl shadow-lg shadow-blue/20 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {option.icon && <span className={cn("transition-transform", isActive && "scale-110")}>{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
