"use client";

import React, { useRef, useEffect } from "react";
import { AmortizationEntry } from "@/src/lib/emi-calculations";
import { formatCurrency, getThemeColor } from "@/src/lib/utils";

interface AmortisationChartProps {
  schedule: AmortizationEntry[];
}

export function AmortisationChart({ schedule }: AmortisationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || schedule.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set display size and handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Data preparation - aggregate by year if tenure is long to avoid overcrowding
    const data = schedule;
    const maxVal = Math.max(...data.map(d => d.principal + d.interest));

    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = getThemeColor('--border', '#e2e8f0');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Area Chart Implementation
    const step = chartWidth / (data.length - 1);

    // Interest Area (Bottom layer)
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    data.forEach((entry, i) => {
      const x = padding.left + i * step;
      const h = (entry.interest / maxVal) * chartHeight;
      ctx.lineTo(x, height - padding.bottom - h);
    });
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = getThemeColor('--text-4', '#94a3b8');
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Principal Area (Stacked on top of interest)
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    data.forEach((entry, i) => {
      const x = padding.left + i * step;
      const hInterest = (entry.interest / maxVal) * chartHeight;
      const hPrincipal = (entry.principal / maxVal) * chartHeight;
      ctx.lineTo(x, height - padding.bottom - hInterest - hPrincipal);
    });
    // Draw back along the interest line to create the stacked effect
    for (let i = data.length - 1; i >= 0; i--) {
      const entry = data[i];
      if (!entry) continue;
      const x = padding.left + i * step;
      const hInterest = (entry.interest / maxVal) * chartHeight;
      ctx.lineTo(x, height - padding.bottom - hInterest);
    }
    ctx.closePath();
    ctx.fillStyle = getThemeColor('--blue', '#4F46E5');
    ctx.fill();

    // Stroke for Principal line (Top line)
    ctx.beginPath();
    data.forEach((entry, i) => {
      const x = padding.left + i * step;
      const hTotal = ((entry.principal + entry.interest) / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, height - padding.bottom - hTotal);
      else ctx.lineTo(x, height - padding.bottom - hTotal);
    });
    ctx.strokeStyle = getThemeColor('--blue', '#4F46E5');
    ctx.lineWidth = 2;
    ctx.stroke();

    // Legends
    const legendY = height - 10;
    ctx.font = "10px Inter, sans-serif";
    
    ctx.fillStyle = getThemeColor('--blue', '#4F46E5');
    ctx.fillRect(padding.left, legendY - 8, 10, 8);
    ctx.fillStyle = getThemeColor('--text-2', '#1e293b');
    ctx.fillText("Principal", padding.left + 15, legendY);

    ctx.fillStyle = getThemeColor('--text-4', '#94a3b8');
    ctx.globalAlpha = 0.3;
    ctx.fillRect(padding.left + 80, legendY - 8, 10, 8);
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = getThemeColor('--text-2', '#1e293b');
    ctx.fillText("Interest", padding.left + 95, legendY);

  }, [schedule]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-text">Principal vs Interest Trend</h3>
      <div className="bg-surface border border-border rounded-2xl p-4 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 md:h-80"
          aria-label="Stacked bar chart showing principal and interest components of EMI over time"
          role="img"
        />
      </div>
      <p className="text-[10px] text-text-4 font-bold uppercase text-center tracking-widest">
        Loan Timeline (Months)
      </p>
    </div>
  );
}
