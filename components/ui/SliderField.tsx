"use client";

import * as Slider from '@radix-ui/react-slider';
import { cn } from "@/src/lib/utils";

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
  const display = format ? format(value) : String(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={cn("text-sm font-bold", error ? "text-error" : "text-text-2")}>{label}</label>
        <span className={cn("text-sm font-black", error ? "text-error" : "text-text")} aria-hidden="true">{display}</span>
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
          id={id}
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
