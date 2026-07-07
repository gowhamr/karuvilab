import { Loader2, Clock, CheckCircle2, WifiOff, Database, AlertCircle, XCircle } from "lucide-react";
import React, { memo } from "react";

export type StatusType = "processing" | "queued" | "saved" | "offline" | "cached" | "error" | "complete" | "idle" | "pending" | "completed" | "failed" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { icon: React.ElementType | null; defaultLabel: string; colors: string; animation?: string }> = {
  idle: { icon: null, defaultLabel: "", colors: "" },
  processing: { icon: Loader2, defaultLabel: "Processing...", colors: "bg-blue/10 text-blue", animation: "animate-spin" },
  queued: { icon: Clock, defaultLabel: "Queued", colors: "bg-hover/50 text-text-3" },
  saved: { icon: CheckCircle2, defaultLabel: "Saved", colors: "bg-success/10 text-success" },
  offline: { icon: WifiOff, defaultLabel: "Offline mode", colors: "bg-warn/10 text-warn" },
  cached: { icon: Database, defaultLabel: "Cached locally", colors: "bg-ocean/10 text-ocean" },
  error: { icon: AlertCircle, defaultLabel: "Error", colors: "bg-error/10 text-error" },
  complete: { icon: CheckCircle2, defaultLabel: "Complete", colors: "bg-success/10 text-success" },
  pending: { icon: Clock, defaultLabel: "Pending", colors: "bg-hover/50 text-text-3" },
  completed: { icon: CheckCircle2, defaultLabel: "Completed", colors: "bg-success/10 text-success" },
  failed: { icon: AlertCircle, defaultLabel: "Failed", colors: "bg-error/10 text-error" },
  cancelled: { icon: XCircle, defaultLabel: "Cancelled", colors: "bg-warn/10 text-warn" },
};

export const StatusBadge = memo(function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  if (status === "idle") return null;

  const config = statusConfig[status] || statusConfig.idle;
  const Icon = config?.icon;
  const displayLabel = label || config?.defaultLabel || "Unknown";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${config.colors} ${className}`}
      role={status === "error" || status === "failed" ? "alert" : "status"}
      aria-live={status === "error" || status === "failed" ? "assertive" : "polite"}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${config.animation || ""}`} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </div>
  );
});
