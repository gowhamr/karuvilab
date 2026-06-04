"use client";

import React, { useId } from "react";
import { cn } from "@/src/lib/utils";

interface ToolInputProps {
  label?: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  rows?: number;
  type?: "text" | "number" | "password" | "date" | "datetime-local" | "email" | "tel";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
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
  inputMode,
  autoComplete,
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
    mono ? "font-mono text-sm md:text-sm" : "text-[16px]", // Force 16px on mobile to prevent zoom
    error 
      ? "border-red-500 focus:ring-4 focus:ring-inset focus:ring-red-500/10 focus:border-red-500" 
      : "border-border focus:ring-4 focus:ring-inset focus:ring-blue/10 focus:border-blue",
    "placeholder:text-text-3/80",
    (readOnly || loading) && "bg-surface cursor-default",
    loading && "opacity-50 pointer-events-none",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-end px-1">
          <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>
          {description && (
            <span 
              id={descriptionId}
              className="text-[12px] text-text-4 uppercase font-black tracking-widest"
            >
              {description}
            </span>
          )}
        </div>
      )}
      {rows > 1 ? (
        <textarea
          id={id}
          className={cn(baseClasses, "min-h-[120px] py-4")}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly || loading}
          autoComplete={autoComplete}
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
          inputMode={inputMode}
          autoComplete={autoComplete}
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
          className="px-1 text-[12px] text-red-500 font-bold"
        >
          {error}
        </p>
      )}
    </div>
  );
}
