import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  accent?: boolean | undefined;
  sub?: string | undefined;
  icon?: LucideIcon | undefined;
  className?: string | undefined;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string | undefined;
  } | undefined;
}

export function MetricCard({ label, value, accent = false, sub, icon: Icon, className, trend }: MetricCardProps) {
  return (
    <dl className={cn("bg-surface border border-border p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] space-y-3 min-w-0 overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-3">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <dt className="text-[10px] font-black uppercase tracking-widest truncate">{label}</dt>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0",
            trend.isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
          )}>
            {trend.value}
          </div>
        )}
      </div>
      <dd className={cn("text-2xl sm:text-3xl font-black tabular-nums break-words leading-tight", accent ? "text-blue" : "text-text")}>{value}</dd>
      {(sub || trend?.label) && (
        <dd className="text-[10px] text-text-3 font-medium leading-relaxed line-clamp-2">
          {trend?.label ? `${trend.label}: ${sub || ""}` : sub}
        </dd>
      )}
    </dl>
  );
}
