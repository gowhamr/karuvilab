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
  loading?: boolean | undefined;
  style?: React.CSSProperties | undefined;
  step?: string | number | undefined;
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
  loading,
  style,
  step
}: ToolInputProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const baseClasses = cn(
    "w-full px-4 py-3 bg-bg border rounded-input outline-none transition-all min-h-12 text-text-primary",
    mono ? "font-mono text-caption" : "text-body", // Force clean text sizing
    error 
      ? "border-danger focus:ring-4 focus:ring-inset focus:ring-danger/10 focus:border-danger" 
      : "border-divider focus:ring-4 focus:ring-inset focus:ring-primary/10 focus:border-primary",
    "placeholder:text-text-secondary/60",
    (readOnly || loading) && "bg-surface/50 cursor-default",
    loading && "opacity-50 pointer-events-none",
    className
  );

  return (
    <div className="space-y-2">
      {(label || description) && (
        <div className="flex justify-between items-end px-1">
          {label && <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>}
          {description && (
            <span 
              id={descriptionId}
              className="text-xs text-text-4 uppercase font-black tracking-widest"
            >
              {description}
            </span>
          )}
        </div>
      )}
      {rows > 1 ? (
        <textarea
          id={id}
          className={cn(baseClasses, "min-h-30 py-4")}
          style={style}
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
          step={step}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={baseClasses}
          style={style}
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
          className="px-1 text-xs text-danger font-bold"
        >
          {error}
        </p>
      )}
    </div>
  );
}
