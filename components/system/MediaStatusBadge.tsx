"use client";

import { StatusBadge, StatusType } from "./StatusBadge";

export type MediaStatusType = StatusType | "encoding" | "ready";

interface MediaStatusBadgeProps {
  status: MediaStatusType;
  label?: string;
  className?: string;
}

export function MediaStatusBadge({ status, label, className }: MediaStatusBadgeProps) {
  // Map custom media statuses to base statuses if needed, or handle them specifically
  let baseStatus: StatusType = status as StatusType;
  let customLabel = label;

  if (status === "encoding") {
    baseStatus = "processing";
    customLabel = label || "Encoding...";
  } else if (status === "ready") {
    baseStatus = "idle"; // Or another appropriate base status
    customLabel = label || "Ready";
  }

  const props: any = { status: baseStatus };
  if (customLabel) props.label = customLabel;
  if (className) props.className = className;

  return <StatusBadge {...props} />;
}
