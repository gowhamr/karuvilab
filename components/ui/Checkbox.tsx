"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const generatedId = React.useId();
  const finalId = id || generatedId;

  return (
    <div className={cn("flex items-center gap-3 cursor-pointer group", className)}>
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          id={finalId}
          className="peer appearance-none w-5 h-5 rounded border-2 border-border bg-bg checked:bg-blue checked:border-blue transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue/20"
          {...props}
        />
        <svg
          className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[3]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <label 
        htmlFor={finalId} 
        className="text-sm font-bold text-text-2 cursor-pointer select-none group-hover:text-text transition-colors"
      >
        {label}
      </label>
    </div>
  );
}
