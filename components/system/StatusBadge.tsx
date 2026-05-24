import { Loader2, Clock, CheckCircle2, WifiOff, Database, AlertCircle } from "lucide-react";
import { memo } from "react";

export type StatusType = "processing" | "queued" | "saved" | "offline" | "cached" | "error" | "complete" | "idle";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { icon: any; defaultLabel: string; colors: string; animation?: string }> = {
  idle: { icon: null, defaultLabel: "", colors: "" },
  processing: { icon: Loader2, defaultLabel: "Processing...", colors: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400", animation: "animate-spin" },
  queued: { icon: Clock, defaultLabel: "Queued", colors: "bg-slate-500/10 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400" },
  saved: { icon: CheckCircle2, defaultLabel: "Saved", colors: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400" },
  offline: { icon: WifiOff, defaultLabel: "Offline mode", colors: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400" },
  cached: { icon: Database, defaultLabel: "Cached locally", colors: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400" },
  error: { icon: AlertCircle, defaultLabel: "Error", colors: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400" },
  complete: { icon: CheckCircle2, defaultLabel: "Complete", colors: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400" },
};

export const StatusBadge = memo(function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  if (status === "idle") return null;

  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${config.colors} ${className}`}
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${config.animation || ""}`} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </div>
  );
});
