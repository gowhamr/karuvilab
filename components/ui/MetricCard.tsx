"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  accent?: boolean | undefined;
  sub?: string | undefined;
  icon?: LucideIcon | undefined;
  className?: string | undefined;
  valueClassName?: string | undefined;
  loading?: boolean;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string | undefined;
  } | undefined;
}

export function MetricCard({ label, value, accent = false, sub, icon: Icon, className, valueClassName, trend, loading }: MetricCardProps) {
  return (
    <m.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } 
      }}
      className={cn(
        "bg-mat-surface p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3 min-w-0 overflow-hidden shadow-mat-shine transition-[background-color,border-color] duration-150 ease-out border border-transparent hover:border-mat-border-focus hover:bg-mat-hover", 
        loading && "shimmer-wrapper",
        className
      )}
      role="group"
      aria-labelledby={label.replace(/\s+/g, "-").toLowerCase() + "-label"}
    >
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <h3 
          id={label.replace(/\s+/g, "-").toLowerCase() + "-label"}
          title={label}
          className="flex items-center gap-1.5 text-text-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider min-w-0 truncate"
        >
          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" focusable="false" />}
          <span className="truncate">{label}</span>
        </h3>
        {trend && !loading && (
          <div 
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider flex-shrink-0",
              trend.isPositive ? "bg-success/10 text-emerald-700 dark:text-emerald-400" : "bg-error/10 text-red-700 dark:text-red-400"
            )}
            role="status"
            aria-label={`${trend.label || "Trend"}: ${trend.value}`}
          >
            {trend.value}
          </div>
        )}
      </div>
      <div 
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "text-lg sm:text-2xl font-black tabular-nums break-words leading-snug transition-colors", 
          accent ? "text-brand-primary text-xl sm:text-3xl" : "text-text",
          valueClassName,
          loading && "opacity-20"
        )}
      >
        {loading ? "---" : value}
      </div>
      {(sub || trend?.label) && (
        <p className={cn(
          "text-[11px] sm:text-xs text-text-3 font-medium leading-normal break-words transition-all",
          loading && "opacity-20"
        )}>
          {loading ? "Calculating..." : (trend?.label ? `${trend.label}: ${sub || ""}` : sub)}
        </p>
      )}
    </m.div>
  );
}
