"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * A purely presentational spinner component.
 * Supports prefers-reduced-motion and uses Tailwind utility classes.
 */
export function Spinner({ className, size = "md" }: SpinnerProps): React.JSX.Element {
  const sizeClasses = {
    sm: "w-4 h-4 border",
    md: "w-6 h-6 border",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-blue border-t-transparent motion-reduce:animate-[spin_3s_linear_infinite]",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
