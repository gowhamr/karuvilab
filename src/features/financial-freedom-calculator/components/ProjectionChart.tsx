"use client";

import { useEffect, useRef } from 'react';
import { useFinancialFreedomStore } from '../store';
import { formatCurrency, getThemeColor } from '@/src/lib/utils';

export function ProjectionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projections = useFinancialFreedomStore(state => state.results.projections);
  const retirementAge = useFinancialFreedomStore(state => state.inputs.retirementAge);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !projections || projections.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Padding for axes
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max values
    const maxNetWorth = Math.max(...projections.map(p => Math.max(p.netWorth, p.targetCorpus)));
    const minAge = projections[0]?.age || 0;
    const maxAge = projections[projections.length - 1]?.age || 100;

    // Drawing helpers
    const getX = (age: number) => padding.left + ((age - minAge) / (maxAge - minAge)) * chartWidth;
    const getY = (val: number) => padding.top + chartHeight - (val / (maxNetWorth || 1)) * chartHeight;

    // Draw Grid Lines & Y-Axis Labels
    ctx.strokeStyle = getThemeColor('--border', '#e2e8f0') + '40'; // Subtle grid
    ctx.fillStyle = getThemeColor('--text-4', '#94a3b8');
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const val = maxNetWorth * (i / steps);
      const y = getY(val);
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Label (format compactly, e.g., 10M, 1Cr)
      let label = '';
      if (val >= 10000000) label = `${(val / 10000000).toFixed(1)}Cr`;
      else if (val >= 100000) label = `${(val / 100000).toFixed(1)}L`;
      else if (val >= 1000) label = `${(val / 1000).toFixed(0)}k`;
      else label = val.toString();

      ctx.fillText(label, padding.left - 10, y);
    }

    // X-Axis Labels (Age)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const ageStep = Math.ceil((maxAge - minAge) / 10);
    for (let age = minAge; age <= maxAge; age += ageStep) {
      const x = getX(age);
      ctx.fillText(age.toString(), x, height - padding.bottom + 10);
    }
    
    // Draw Target Corpus Line
    ctx.beginPath();
    ctx.strokeStyle = getThemeColor('--success', '#10b981') + '80'; // Success color, semi-transparent
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed line
    projections.forEach((p, i) => {
      const x = getX(p.age);
      const y = getY(p.targetCorpus);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw Net Worth Line
    ctx.beginPath();
    ctx.strokeStyle = getThemeColor('--blue', '#4F46E5'); // KV Indigo
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    projections.forEach((p, i) => {
      const x = getX(p.age);
      const y = getY(p.netWorth);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under Net Worth
    ctx.lineTo(getX(maxAge), getY(0));
    ctx.lineTo(getX(minAge), getY(0));
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    const primaryColor = getThemeColor('--blue', '#4F46E5');
    gradient.addColorStop(0, primaryColor + '33');
    gradient.addColorStop(1, primaryColor + '00');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Retirement Age Marker
    if (retirementAge >= minAge && retirementAge <= maxAge) {
      const retX = getX(retirementAge);
      ctx.beginPath();
      ctx.strokeStyle = getThemeColor('--error', '#ef4444') + '80'; // Error / Red color
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(retX, padding.top);
      ctx.lineTo(retX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [projections, retirementAge]);

  return (
    <div className="w-full bg-surface border border-border rounded-[24px] sm:rounded-[32px] p-6 shadow-sm">
      <h3 className="text-sm font-bold text-text-2 mb-4 uppercase tracking-widest">Net Worth Projection</h3>
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none' }}
          role="img"
          aria-label="Line chart showing projected net worth over time"
        />
      </div>
      <div className="flex gap-4 mt-4 justify-center text-[11px] font-bold uppercase tracking-wider text-text-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue" />
          <span>Net Worth</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-success border-dashed" />
          <span>Target FI Corpus</span>
        </div>
      </div>
      
      {/* Screen Reader Data Table */}
      <table className="sr-only">
        <caption>Net Worth Projection Data</caption>
        <thead>
          <tr>
            <th scope="col">Age</th>
            <th scope="col">Year</th>
            <th scope="col">Net Worth</th>
            <th scope="col">Target Corpus</th>
          </tr>
        </thead>
        <tbody>
          {projections.filter((_, i) => i % 5 === 0 || i === projections.length - 1).map((p) => (
            <tr key={p.age}>
              <td>{p.age}</td>
              <td>{p.year}</td>
              <td>{formatCurrency(p.netWorth)}</td>
              <td>{formatCurrency(p.targetCorpus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
