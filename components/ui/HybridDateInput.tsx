"use client";

import React, { useState, useCallback, useRef, useId } from "react";
import { cn } from "@/src/lib/utils";
import { Calendar } from "lucide-react";

interface HybridDateInputProps {
  label?: string;
  value: string; // ISO date string: YYYY-MM-DD
  onChange: (val: string) => void;
  description?: string;
  error?: string;
  id?: string;
  className?: string;
  max?: string;
  min?: string;
}

/**
 * Parse a user-typed date string into ISO YYYY-MM-DD.
 * Accepts: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD, YYYY/MM/DD
 */
function parseUserDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // ISO format: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = trimmed.match(/^(\d{4})\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{1,2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const year = parseInt(y!, 10);
    const month = parseInt(m!, 10);
    const day = parseInt(d!, 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
    return null;
  }

  // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const dmy = trimmed.match(/^(\d{1,2})\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = parseInt(y!, 10);
    const month = parseInt(m!, 10);
    const day = parseInt(d!, 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
    return null;
  }

  return null;
}

/**
 * Format ISO date (YYYY-MM-DD) to display format (DD / MM / YYYY).
 */
function formatForDisplay(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d} / ${m} / ${y}`;
}

export function HybridDateInput({
  label,
  value,
  onChange,
  description,
  error,
  id: providedId,
  className,
  max,
  min,
}: HybridDateInputProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const hiddenDateRef = useRef<HTMLInputElement>(null);

  // Text field shows the display format when not being edited
  const [textValue, setTextValue] = useState(() => formatForDisplay(value));
  const [isEditing, setIsEditing] = useState(false);
  const [parseError, setParseError] = useState(false);

  // Sync display when value changes externally (not during editing)
  const lastValueRef = useRef(value);
  if (value !== lastValueRef.current && !isEditing) {
    lastValueRef.current = value;
    setTextValue(formatForDisplay(value));
    setParseError(false);
  }

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTextValue(raw);
    setParseError(false);

    // Try live parse — only update if valid
    const parsed = parseUserDate(raw);
    if (parsed) {
      lastValueRef.current = parsed;
      onChange(parsed);
      setParseError(false);
    }
  }, [onChange]);

  const handleTextFocus = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
    const trimmed = textValue.trim();
    if (!trimmed) {
      // Allow clearing
      return;
    }

    const parsed = parseUserDate(trimmed);
    if (parsed) {
      lastValueRef.current = parsed;
      onChange(parsed);
      setTextValue(formatForDisplay(parsed));
      setParseError(false);
    } else {
      // Invalid — revert to last good value
      setParseError(true);
      // Don't revert immediately so user can see the error
      setTimeout(() => {
        setTextValue(formatForDisplay(value));
        setParseError(false);
      }, 2000);
    }
  }, [textValue, onChange, value]);

  const handleCalendarClick = useCallback(() => {
    // Open native date picker without stealing focus from other elements
    hiddenDateRef.current?.showPicker?.();
  }, []);

  const handleCalendarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (newVal) {
      lastValueRef.current = newVal;
      onChange(newVal);
      setTextValue(formatForDisplay(newVal));
      setParseError(false);
    }
  }, [onChange]);

  const displayError = error || (parseError ? "Invalid date — use DD/MM/YYYY" : undefined);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || description) && (
        <div className="flex justify-between items-end px-1">
          {label && (
            <label htmlFor={id} className="text-sm font-bold text-text-2">
              {label}
            </label>
          )}
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
      <div className="relative flex items-stretch">
        {/* Manual text input */}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          className={cn(
            "w-full px-4 py-3 bg-bg border rounded-l-xl outline-none transition-all min-h-12 text-text-primary text-body",
            "placeholder:text-text-secondary/60",
            displayError
              ? "border-danger focus:ring-4 focus:ring-inset focus:ring-danger/10 focus:border-danger"
              : "border-divider focus:ring-4 focus:ring-inset focus:ring-primary/10 focus:border-primary",
            "border-r-0"
          )}
          placeholder="DD / MM / YYYY"
          value={textValue}
          onChange={handleTextChange}
          onFocus={handleTextFocus}
          onBlur={handleTextBlur}
          autoComplete="off"
          aria-describedby={cn(
            description ? descriptionId : undefined,
            displayError ? errorId : undefined
          )}
          aria-invalid={!!displayError}
        />

        {/* Calendar picker button */}
        <button
          type="button"
          onClick={handleCalendarClick}
          className={cn(
            "flex items-center justify-center px-3 border rounded-r-xl transition-all",
            "bg-surface-2 hover:bg-primary/10 active:scale-[0.98]",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary",
            displayError
              ? "border-danger"
              : "border-divider hover:border-primary/50",
          )}
          aria-label={`Open date picker for ${label || 'date'}`}
        >
          <Calendar className="w-5 h-5 text-text-4" />
        </button>

        {/* Hidden native date input for picker */}
        <input
          ref={hiddenDateRef}
          type="date"
          value={value}
          onChange={handleCalendarChange}
          max={max}
          min={min}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
      {displayError && (
        <p
          id={errorId}
          role="alert"
          className="px-1 text-xs text-danger font-bold"
        >
          {displayError}
        </p>
      )}
    </div>
  );
}
