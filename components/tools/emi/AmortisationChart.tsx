"use client";

import React, { useRef, useEffect } from "react";
import { AmortizationEntry } from "@/src/lib/emi-calculations";
import { formatCurrency } from "@/src/lib/utils";

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
    ctx.strokeStyle = "#e2e8f0"; // border color
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    const barWidth = Math.max(1, (chartWidth / data.length) * 0.8);
    const gap = (chartWidth / data.length) * 0.2;

    data.forEach((entry, i) => {
      const x = padding.left + i * (chartWidth / data.length);
      
      // Principal part
      const pHeight = (entry.principal / maxVal) * chartHeight;
      ctx.fillStyle = "#4F46E5"; // blue (principal)
      ctx.fillRect(x, height - padding.bottom - pHeight, barWidth, pHeight);

      // Interest part
      const iHeight = (entry.interest / maxVal) * chartHeight;
      ctx.fillStyle = "#94a3b8"; // slate-400 (interest)
      ctx.fillRect(x, height - padding.bottom - pHeight - iHeight, barWidth, iHeight);
    });

    // Legends
    const legendY = height - 10;
    ctx.font = "10px Inter, sans-serif";
    
    ctx.fillStyle = "#4F46E5";
    ctx.fillRect(padding.left, legendY - 8, 10, 8);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Principal", padding.left + 15, legendY);

    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(padding.left + 80, legendY - 8, 10, 8);
    ctx.fillStyle = "#1e293b";
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
