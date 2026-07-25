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
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * A unified, accessible segmented control (tabs) for tool modes and settings.
 */
export const SegmentedControl = React.memo(function SegmentedControl<T extends string | number>(props: SegmentedControlProps<T>) {
  const { 
    options, 
    activeId, 
    onChange, 
    className, 
    disabled, 
    "aria-label": ariaLabel, 
    "aria-labelledby": ariaLabelledby 
  } = props;

  const id = React.useId();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "flex p-1 bg-bg border border-border rounded-2xl w-fit",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={String(option.id)}
            role="radio"
            id={`tab-${option.id}`}
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => !disabled && onChange(option.id)}
            className={cn(
              "relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue/20",
              isActive ? "text-white" : "text-text-4 hover:text-text hover:bg-surface/50",
              disabled && "cursor-not-allowed"
            )}
          >
            {isActive && (
              <m.div
                layoutId={`segmented-active-${id}`}
                className="absolute inset-0 bg-blue rounded-xl shadow-md shadow-blue/10 z-base"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {option.icon && (
              <span className={cn("relative z-content transition-transform", isActive && "scale-110")}>
                {option.icon}
              </span>
            )}
            <span className="relative z-content">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}) as <T extends string | number>(props: SegmentedControlProps<T>) => React.ReactElement;
