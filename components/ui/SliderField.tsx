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
}

export function SliderField({ label, id, min, max, step = 1, value, onChange, format }: SliderFieldProps) {
  const display = format ? format(value) : String(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>
        <span className="text-sm font-black text-blue" aria-hidden="true">{display}</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(v) => onChange(v[0]!)}
        max={max}
        min={min}
        step={step}
      >
        <Slider.Track className="bg-border relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-blue rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          id={id}
          className="block w-5 h-5 bg-white border border-border rounded-full shadow-md cursor-pointer hover:border-blue/50 focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
          aria-label={label}
          aria-valuetext={display}
        />
      </Slider.Root>

      <div className="flex justify-between text-[11px] text-text-3 font-bold uppercase tracking-wider" aria-hidden="true">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}
