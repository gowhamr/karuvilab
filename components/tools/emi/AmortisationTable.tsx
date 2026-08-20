"use client";

import React, { useState, useMemo, useRef } from "react";
import { AmortizationEntry } from "@/src/lib/emi-calculations";
import { formatCurrency } from "@/src/lib/utils";

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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text">Amortisation Schedule</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">Filter:</span>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-surface-2 border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-text outline-none focus:border-blue cursor-pointer"
          >
            <option value="all">All Years ({years.length} Yrs)</option>
            {years.map(y => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm" role="table" aria-label="Amortisation Schedule">
        <div 
          className="grid grid-cols-5 bg-surface-2/60 border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted"
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
                  className="grid grid-cols-5 px-4 h-12 items-center text-xs font-semibold border-b border-border/40 last:border-0 hover:bg-blue/5 transition-colors"
                  role="row"
                >
                  <span className="text-text-muted font-mono" role="rowheader">M{entry.month}</span>
                  <span className="text-text font-medium" role="cell">{formatCurrency(entry.principal)}</span>
                  <span className="text-text-muted" role="cell">{formatCurrency(entry.interest)}</span>
                  <span className="text-emerald-400 font-medium" role="cell">
                    {entry.prepayment > 0 ? formatCurrency(entry.prepayment) : '—'}
                  </span>
                  <span className="font-bold text-blue font-mono" role="cell">{formatCurrency(entry.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
