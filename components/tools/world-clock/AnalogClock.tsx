"use client";

import React from 'react';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * A minimalist, visually pleasing analog clock display.
 * Renders hour, minute, and second hands based on provided time.
 */
export const AnalogClock: React.FC<AnalogClockProps> = ({ hours, minutes, seconds }) => {
  const hoursRotation = (hours % 12) * 30 + minutes * 0.5;
  const minutesRotation = minutes * 6 + seconds * 0.1;
  const secondsRotation = seconds * 6;

  return (
    <div className="relative w-10 h-10">
      {/* Clock Face */}
      <div className="w-full h-full rounded-full bg-bg border-2 border-surface" />

      {/* Center Dot */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue" />

      {/* Hour Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-[25%] origin-top bg-text-2"
        style={{ transform: `translateX(-50%) rotate(${hoursRotation}deg)` }}
      />

      {/* Minute Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-[35%] origin-top bg-text-4"
        style={{ transform: `translateX(-50%) rotate(${minutesRotation}deg)` }}
      />

      {/* Second Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-px h-[40%] origin-top bg-blue"
        style={{ transform: `translateX(-50%) rotate(${secondsRotation}deg)` }}
      />
    </div>
  );
};
