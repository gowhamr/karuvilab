'use client';

import React from 'react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { BMIThreshold } from '../types';

interface BmiGaugeProps {
  bmi: number;
  threshold: BMIThreshold;
}

export function BmiGauge({ bmi, threshold }: BmiGaugeProps) {
  // Map BMI 10-45 to 180-0 degrees
  const clampedBmi = Math.min(Math.max(bmi, 10), 45);
  const percentage = (clampedBmi - 10) / (45 - 10);
  const rotation = 180 - (percentage * 180);

  return (
    <div className="relative flex flex-col items-center py-8">
      <svg width="300" height="160" viewBox="0 0 300 160" className="overflow-visible">
        {/* Arc Background segments */}
        <path d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="currentColor" strokeWidth="24" className="text-border" />
        
        {/* Colored segments */}
        <path d="M 30 150 A 120 120 0 0 1 70 65" fill="none" stroke="var(--blue)" strokeWidth="24" />
        <path d="M 70 65 A 120 120 0 0 1 100 40" fill="none" stroke="var(--ocean-blue)" strokeWidth="24" />
        <path d="M 100 40 A 120 120 0 0 1 165 30" fill="none" stroke="var(--success)" strokeWidth="24" />
        <path d="M 165 30 A 120 120 0 0 1 215 50" fill="none" stroke="var(--warn)" strokeWidth="24" />
        <path d="M 215 50 A 120 120 0 0 1 250 85" fill="none" stroke="var(--error)" strokeWidth="24" opacity="0.8" />
        <path d="M 250 85 A 120 120 0 0 1 270 150" fill="none" stroke="var(--error)" strokeWidth="24" />

        {/* Animated Needle */}
        <m.g
          initial={{ rotate: 180 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          style={{ transformOrigin: '150px 150px' }}
        >
          <line x1="150" y1="150" x2="30" y2="150" stroke="currentColor" strokeWidth="4" className="text-text" strokeLinecap="round" />
          <circle cx="150" cy="150" r="8" fill="currentColor" className="text-text" />
        </m.g>

        {/* Labels */}
        <text x="35" y="170" textAnchor="middle" className="text-xs fill-text-4 font-bold">16</text>
        <text x="80" y="55" textAnchor="middle" className="text-xs fill-text-4 font-bold">18.5</text>
        <text x="165" y="20" textAnchor="middle" className="text-xs fill-text-4 font-bold">25</text>
        <text x="235" y="60" textAnchor="middle" className="text-xs fill-text-4 font-bold">30</text>
        <text x="265" y="100" textAnchor="middle" className="text-xs fill-text-4 font-bold">35</text>
        <text x="275" y="170" textAnchor="middle" className="text-xs fill-text-4 font-bold">40</text>
      </svg>

      <div className="text-center -mt-10 space-y-1">
        <m.span 
          key={bmi}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="block text-5xl font-black tabular-nums tracking-tighter"
        >
          {bmi}
        </m.span>
        <span className={cn("text-sm font-black uppercase tracking-widest-lg", threshold.color)}>
          {threshold.label}
        </span>
      </div>
    </div>
  );
}
