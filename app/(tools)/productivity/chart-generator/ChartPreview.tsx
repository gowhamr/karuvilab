"use client";

import React from "react";
import { m } from "framer-motion";
import { DataPoint, ChartType, PALETTES, TRANSITION, ChartOptions } from "./types";

interface ChartPreviewProps {
  data: DataPoint[];
  type: ChartType;
  options: ChartOptions;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export default function ChartPreview({ data, type, options, svgRef }: ChartPreviewProps) {
  const chartWidth = 800;
  const chartHeight = 600;
  const margin = 80;
  const innerW = chartWidth - margin * 2;
  const innerH = chartHeight - margin * 2;
  
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  // Helper for smooth lines (Cubic Bezier)
  const getPathData = (isArea: boolean, isSmooth: boolean) => {
    if (data.length === 0) return "";
    
    const points = data.map((d, i) => {
      const step = innerW / (data.length - 1 || 1);
      return {
        x: margin + i * step,
        y: chartHeight - margin - (d.value / maxVal) * innerH
      };
    });

    if (!isSmooth) {
      let path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      if (isArea) {
        path += ` L ${points[points.length - 1]!.x} ${chartHeight - margin} L ${points[0]!.x} ${chartHeight - margin} Z`;
      }
      return path;
    }

    // Simple Bezier Smoothing
    let path = `M ${points[0]!.x} ${points[0]!.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]!;
      const p1 = points[i + 1]!;
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    if (isArea) {
      path += ` L ${points[points.length - 1]!.x} ${chartHeight - margin} L ${points[0]!.x} ${chartHeight - margin} Z`;
    }
    return path;
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-3xl">
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTES[options.activePalette]?.colors[0]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={PALETTES[options.activePalette]?.colors[0]} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {options.showGrid && (type === "bar" || type === "line" || type === "area") && (
          <g opacity="0.1">
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line 
                key={p} 
                x1={margin} 
                y1={margin + innerH * (1 - p)} 
                x2={chartWidth - margin} 
                y2={margin + innerH * (1 - p)} 
                stroke="currentColor" 
                strokeWidth="1" 
              />
            ))}
          </g>
        )}

        {/* Render Bar Chart */}
        {type === "bar" && data.map((d, i) => {
          const barW = (innerW / data.length) * 0.7;
          const spacing = (innerW / data.length) * 0.3;
          const h = (d.value / maxVal) * innerH;
          const x = margin + i * (barW + spacing) + spacing / 2;
          const y = chartHeight - margin - h;
          
          return (
            <g key={d.id}>
              <m.rect
                initial={{ height: 0, y: chartHeight - margin }}
                animate={{ height: h, y }}
                transition={TRANSITION}
                x={x}
                width={barW}
                fill={d.color}
                rx={8}
              />
              {options.showValues && (
                <m.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={x + barW / 2}
                  y={y - 15}
                  textAnchor="middle"
                  className="text-[14px] font-black fill-text"
                >
                  {d.value}
                </m.text>
              )}
              <text
                x={x + barW / 2}
                y={chartHeight - margin + 30}
                textAnchor="middle"
                className="text-[12px] font-bold fill-text-4"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Render Line/Area Chart */}
        {(type === "line" || type === "area") && (
          <g>
            {type === "area" && (
              <m.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                d={getPathData(true, options.smoothLines)}
                fill="url(#areaGradient)"
              />
            )}
            <m.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
              d={getPathData(false, options.smoothLines)}
              fill="none"
              stroke={PALETTES[options.activePalette]?.colors[0]}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const step = innerW / (data.length - 1 || 1);
              const x = margin + i * step;
              const y = chartHeight - margin - (d.value / maxVal) * innerH;
              return (
                <g key={d.id}>
                  <m.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    cx={x}
                    cy={y}
                    r="6"
                    fill="white"
                    stroke={d.color}
                    strokeWidth="3"
                  />
                  {options.showValues && (
                    <text x={x} y={y - 20} textAnchor="middle" className="text-[14px] font-black fill-text">{d.value}</text>
                  )}
                  <text x={x} y={chartHeight - margin + 30} textAnchor="middle" className="text-[12px] font-bold fill-text-4">{d.label}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* Render Pie/Doughnut */}
        {(type === "pie" || type === "doughnut") && (
          <g transform={`translate(${chartWidth/2}, ${chartHeight/2})`}>
            {data.map((d, i) => {
              const startAngle = data.slice(0, i).reduce((sum, p) => sum + (p.value/total) * 360, 0);
              const angle = (d.value / total) * 360;
              const innerR = type === "doughnut" ? 120 : 0;
              const outerR = 220;
              
              const x1 = Math.cos((startAngle - 90) * Math.PI / 180) * outerR;
              const y1 = Math.sin((startAngle - 90) * Math.PI / 180) * outerR;
              const x2 = Math.cos((startAngle + angle - 90) * Math.PI / 180) * outerR;
              const y2 = Math.sin((startAngle + angle - 90) * Math.PI / 180) * outerR;
              
              const ix1 = Math.cos((startAngle - 90) * Math.PI / 180) * innerR;
              const iy1 = Math.sin((startAngle - 90) * Math.PI / 180) * innerR;
              const ix2 = Math.cos((startAngle + angle - 90) * Math.PI / 180) * innerR;
              const iy2 = Math.sin((startAngle + angle - 90) * Math.PI / 180) * innerR;

              const largeArc = angle > 180 ? 1 : 0;
              
              const pathData = `
                M ${ix1} ${iy1}
                L ${x1} ${y1}
                A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
                L ${ix2} ${iy2}
                A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}
                Z
              `;

              return (
                <g key={d.id}>
                  <m.path
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    d={pathData}
                    fill={d.color}
                    stroke="white"
                    strokeWidth="2"
                    whileHover={{ scale: 1.05 }}
                  />
                  {options.showValues && angle > 15 && (
                    <text
                      transform={`translate(${Math.cos((startAngle + angle/2 - 90) * Math.PI / 180) * (outerR + innerR)/2}, ${Math.sin((startAngle + angle/2 - 90) * Math.PI / 180) * (outerR + innerR)/2})`}
                      textAnchor="middle"
                      className="text-[12px] font-black fill-white pointer-events-none"
                    >
                      {Math.round((d.value/total)*100)}%
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
