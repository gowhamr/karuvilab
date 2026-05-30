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
  loading?: boolean;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string | undefined;
  } | undefined;
}

export function MetricCard({ label, value, accent = false, sub, icon: Icon, className, trend, loading }: MetricCardProps) {
  return (
    <m.dl 
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } 
      }}
      className={cn(
        "bg-surface border border-border p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] space-y-3 min-w-0 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-blue/10 transition-all duration-300", 
        loading && "shimmer-wrapper",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <dt className="flex items-center gap-2 text-text-3 text-[11px] font-black uppercase tracking-widest truncate">
          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
          {label}
        </dt>
        {trend && !loading && (
          <dd 
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex-shrink-0",
              trend.isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
            )}
          >
            {trend.value}
          </dd>
        )}
      </div>
      <dd 
        className={cn(
          "text-2xl sm:text-3xl font-black tabular-nums break-words leading-tight transition-all", 
          accent ? "text-blue" : "text-text",
          loading && "opacity-20"
        )}
      >
        {loading ? "---" : value}
      </dd>
      {(sub || trend?.label) && (
        <dd className={cn(
          "text-[11px] text-text-3 font-bold leading-relaxed line-clamp-2 transition-all",
          loading && "opacity-20"
        )}>
          {loading ? "Calculating..." : (trend?.label ? `${trend.label}: ${sub || ""}` : sub)}
        </dd>
      )}
    </m.dl>
  );
}
