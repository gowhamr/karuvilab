"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { AmortizationEntry } from "@/src/lib/emi-calculations";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

interface AmortisationTableProps {
  schedule: AmortizationEntry[];
}

export function AmortisationTable({ schedule }: AmortisationTableProps) {
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSchedule = useMemo(() => {
    if (filterYear === 'all') return schedule;
    return schedule.filter(entry => entry.year === filterYear);
  }, [schedule, filterYear]);

  const years = useMemo(() => {
    const y = new Set(schedule.map(e => e.year));
    return Array.from(y);
  }, [schedule]);

  // Virtualization constants
  const rowHeight = 48;
  const viewportHeight = 400;
  const overscan = 5;

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(
      filteredSchedule.length - 1,
      Math.floor((scrollTop + viewportHeight) / rowHeight)
    );
    
    return {
      start: Math.max(0, start - overscan),
      end: Math.min(filteredSchedule.length - 1, end + overscan)
    };
  }, [scrollTop, filteredSchedule.length]);

  const visibleRows = filteredSchedule.slice(visibleRange.start, visibleRange.end + 1);
  const totalHeight = filteredSchedule.length * rowHeight;
  const offset = visibleRange.start * rowHeight;

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-text">Amortisation Schedule</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-4 uppercase tracking-widest">Filter Year</span>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-surface border border-border rounded-lg px-3 py-1 text-xs font-bold outline-none focus:border-blue"
          >
            <option value="all">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden" role="table" aria-label="Amortisation Schedule">
        <div 
          className="grid grid-cols-5 bg-bg/50 border-b border-border px-4 py-3 text-tiny font-bold uppercase tracking-widest-sm text-text-4"
          role="row"
        >
          <span role="columnheader">Month</span>
          <span role="columnheader">Principal</span>
          <span role="columnheader">Interest</span>
          <span role="columnheader">Extra</span>
          <span role="columnheader">Balance</span>
        </div>

        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="relative overflow-auto"
          style={{ height: viewportHeight }}
        >
          <div style={{ height: totalHeight, position: 'relative' }} role="rowgroup">
            <div style={{ transform: `translateY(${offset}px)` }} role="presentation">
              {visibleRows.map((entry) => (
                <div 
                  key={entry.month} 
                  className="grid grid-cols-5 px-4 h-12 items-center text-xs font-bold border-b border-border/30 last:border-0 hover:bg-blue/5 transition-colors"
                  role="row"
                >
                  <span className="text-text-3" role="rowheader">M{entry.month}</span>
                  <span className="text-text" role="cell">{formatCurrency(entry.principal)}</span>
                  <span className="text-text-4" role="cell">{formatCurrency(entry.interest)}</span>
                  <span className="text-green-600" role="cell">
                    {entry.prepayment > 0 ? formatCurrency(entry.prepayment) : '-'}
                  </span>
                  <span className="font-black text-blue" role="cell">{formatCurrency(entry.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
