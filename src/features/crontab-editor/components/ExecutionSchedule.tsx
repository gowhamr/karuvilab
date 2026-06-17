import React from 'react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface ExecutionScheduleProps {
  nextRuns: Date[];
  formatRelative: (date: Date) => string;
}

export const ExecutionSchedule = ({ nextRuns, formatRelative }: ExecutionScheduleProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {nextRuns.map((date, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between p-5 bg-surface border border-border rounded-2xl group hover:border-blue/30 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className={cn(
              "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black",
              i === 0 ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-bg text-text-4"
            )}>{i + 1}</span>
            <div className="space-y-0.5">
              <span className="text-sm font-black text-text group-hover:text-blue transition-colors block">
                {date.toLocaleString('en-US', { 
                  weekday: 'short', 
                  day: '2-digit', 
                  month: 'short', 
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              <span className="text-xs font-bold text-text-4 uppercase tracking-widest">
                {date.getFullYear()}
              </span>
            </div>
          </div>
          <span className="text-tiny font-bold uppercase tracking-widest-sm text-blue bg-blue/5 px-3 py-1.5 rounded-xl border border-blue/10">
            {formatRelative(date)}
          </span>
        </m.div>
      ))}
    </div>
  );
};
