"use client";

import * as Slider from '@radix-ui/react-slider';
import { cn } from "@/src/lib/utils";
import { useState, useEffect } from "react";

interface SliderFieldProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  error?: boolean;
}

export function SliderField({ label, id, min, max, step = 1, value, onChange, format, error }: SliderFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  
  // Sync local input state if value changes externally while not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(value));
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    // Remove any formatting like commas before parsing
    const parsed = parseFloat(inputValue.replace(/,/g, ''));
    if (!isNaN(parsed)) {
       onChange(Math.max(min, Math.min(max, parsed)));
    } else {
       setInputValue(String(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
       setIsEditing(false);
       setInputValue(String(value));
    }
  };

  const display = format ? format(value) : String(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={cn("text-sm font-bold", error ? "text-error" : "text-text-2")}>{label}</label>
        {isEditing ? (
          <input
            id={id}
            type="text"
            inputMode="decimal"
            autoFocus
            className={cn(
              "w-32 bg-surface border rounded-lg px-2 py-1 text-sm font-black text-text text-right focus:outline-none focus:ring-1",
              error ? "border-error/50 focus:ring-error" : "border-blue/50 focus:ring-blue"
            )}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button 
            type="button"
            onClick={() => { setInputValue(String(value)); setIsEditing(true); }}
            className={cn(
              "text-sm font-black transition-colors px-2 py-1 rounded hover:bg-surface-2 cursor-text border border-transparent hover:border-border -mr-2", 
              error ? "text-error hover:text-error" : "text-text hover:text-blue"
            )}
            title="Click to type exact amount"
            aria-label={`Edit ${label}`}
          >
            {display}
          </button>
        )}
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-11"
        value={[value]}
        onValueChange={(v) => onChange(v[0]!)}
        max={max}
        min={min}
        step={step}
      >
        <Slider.Track className={cn("relative grow rounded-full h-2", error ? "bg-error/20" : "bg-blue/20")}>
          <Slider.Range className={cn("absolute rounded-full h-full", error ? "bg-error" : "bg-brand-primary")} />
        </Slider.Track>
        <Slider.Thumb
          id={isEditing ? `${id}-thumb` : id}
          className={cn(
            "block w-6 h-6 bg-text border rounded-full shadow-md cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-mat-base focus:outline-none transition-all active:scale-95",
            error ? "border-error focus-visible:ring-error" : "border-brand-primary focus-visible:ring-brand-primary"
          )}
          aria-label={label}
          aria-valuetext={display}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-text-4 font-black uppercase tracking-widest-sm" aria-hidden="true">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}
