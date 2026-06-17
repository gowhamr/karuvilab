"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface SpeedGaugeProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
}

export function SpeedGauge({ value, max = 100, color = "#4F46E5", label = "Mbps" }: SpeedGaugeProps) {
  const size = 320; 
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const arcLength = circumference * 0.75; 
  const strokeDashoffset = arcLength - (progress * arcLength);

  return (
    <div 
      className="relative w-64 h-64 md:w-80 md:h-80 mx-auto"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="Current speed"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform -rotate-225"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="16"
          strokeDasharray={arcLength}
          strokeLinecap="round"
          style={{ 
            strokeDashoffset: 0,
            opacity: 0.1
          }}
        />
        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeDasharray={arcLength}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ filter: value > 0 ? "url(#glow)" : "none" }}
        />
      </svg>
      
      {/* Ticks/Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (tick / 100) * 270 - 225;
          const x = 50 + 44 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 44 * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={tick}
              className="absolute font-black text-micro text-text-4/40 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {Math.round((tick / 100) * max)}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl md:text-6xl font-black text-text tracking-tighter">
          {Math.round(value)}
        </span>
        <span className="text-sm font-black text-text-4 uppercase tracking-widest-lg mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
