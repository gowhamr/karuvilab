"use client";

import React, { useId } from "react";
import { cn } from "@/src/lib/utils";

interface ToolInputProps {
  label?: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  rows?: number;
  type?: "text" | "number" | "password" | "date";
  description?: string | undefined;
  error?: string | undefined;
  mono?: boolean;
  id?: string;
  readOnly?: boolean;
  className?: string;
  loading?: boolean;
}

export function ToolInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 1, 
  type = "text",
  description,
  error,
  mono = false,
  id: providedId,
  readOnly,
  className,
  loading
}: ToolInputProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const baseClasses = cn(
    "w-full px-4 py-3 bg-bg border rounded-xl outline-none transition-all min-h-[48px] text-text",
    mono ? "font-mono text-sm" : "text-base",
    error 
      ? "border-red-500 focus:ring-4 focus:ring-inset focus:ring-red-500/10 focus:border-red-500" 
      : "border-border focus:ring-4 focus:ring-inset focus:ring-blue/10 focus:border-blue",
    "placeholder:text-text-3/60",
    (readOnly || loading) && "bg-surface cursor-default",
    loading && "opacity-50 pointer-events-none",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-end">
          <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>
          {description && (
            <span 
              id={descriptionId}
              className="text-[11px] text-text-3 uppercase font-bold tracking-wider"
            >
              {description}
            </span>
          )}
        </div>
      )}
      {rows > 1 ? (
        <textarea
          id={id}
          className={baseClasses}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly || loading}
          aria-describedby={cn(
            description ? descriptionId : undefined,
            error ? errorId : undefined
          )}
          aria-invalid={!!error}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={baseClasses}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly || loading}
          aria-describedby={cn(
            description ? descriptionId : undefined,
            error ? errorId : undefined
          )}
          aria-invalid={!!error}
        />
      )}
      {error && (
        <p 
          id={errorId}
          role="alert"
          className="text-[10px] text-red-500 font-bold uppercase tracking-wider"
        >
          {error}
        </p>
      )}
    </div>
  );
}
