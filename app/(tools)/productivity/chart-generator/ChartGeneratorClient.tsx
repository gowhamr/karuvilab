"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { BarChart, PieChart, Download, Plus, Trash2, Palette } from "lucide-react";
import { m } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function ChartGeneratorClient() {
  const [data, setData] = useState<DataPoint[]>([
    { label: "Apples", value: 45, color: COLORS[0]! },
    { label: "Oranges", value: 30, color: COLORS[1]! },
    { label: "Bananas", value: 25, color: COLORS[2]! },
  ]);
  const [type, setType] = useState<"bar" | "pie">("bar");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addPoint = () => {
    setData([...data, { label: "New", value: 0, color: COLORS[data.length % COLORS.length]! }]);
  };

  const updatePoint = (index: number, key: keyof DataPoint, val: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index]!, [key]: val };
    setData(newData);
  };

  const removePoint = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = 800;
      const H = 600;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, W, H);

      if (type === "bar") {
        const margin = 80;
        const chartW = W - margin * 2;
        const chartH = H - margin * 2;
        const maxVal = Math.max(...data.map(d => d.value), 1);
        const barW = (chartW / data.length) * 0.7;
        const spacing = (chartW / data.length) * 0.3;

        data.forEach((d, i) => {
          const h = (d.value / maxVal) * chartH;
          const x = margin + i * (barW + spacing) + spacing / 2;
          const y = H - margin - h;

          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.roundRect(x, y, barW, h, [8, 8, 0, 0]);
          ctx.fill();

          // Labels
          ctx.fillStyle = "#64748B";
          ctx.font = "bold 14px Inter";
          ctx.textAlign = "center";
          ctx.fillText(d.label, x + barW / 2, H - margin + 25);
          ctx.fillText(String(d.value), x + barW / 2, y - 10);
        });
      } else {
        const centerX = W / 2;
        const centerY = H / 2;
        const radius = 200;
        const total = data.reduce((a, b) => a + b.value, 0);
        let startAngle = -Math.PI / 2;

        data.forEach(d => {
          const sliceAngle = (d.value / total) * Math.PI * 2;
          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          ctx.fill();

          // Labels
          const midAngle = startAngle + sliceAngle / 2;
          const lx = centerX + Math.cos(midAngle) * (radius + 40);
          const ly = centerY + Math.sin(midAngle) * (radius + 40);
          
          ctx.fillStyle = "#0F172A";
          ctx.font = "bold 14px Inter";
          ctx.textAlign = "center";
          ctx.fillText(`${d.label} (${Math.round((d.value/total)*100)}%)`, lx, ly);

          startAngle += sliceAngle;
        });
      }
    }
  }, [data, type]);

  const download = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "chart.png";
      a.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 p-6 bg-surface border border-border rounded-[32px] overflow-y-auto max-h-[600px]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Chart Data</h3>
            <div className="flex gap-2">
              <button onClick={() => setType("bar")} className={`p-2 rounded-lg ${type === "bar" ? "bg-blue text-white" : "bg-bg text-text-4"}`}><BarChart className="w-4 h-4" /></button>
              <button onClick={() => setType("pie")} className={`p-2 rounded-lg ${type === "pie" ? "bg-blue text-white" : "bg-bg text-text-4"}`}><PieChart className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="space-y-4">
            {data.map((d, i) => (
              <div key={i} className="p-4 bg-bg border border-border rounded-2xl space-y-3 relative group">
                <button onClick={() => removePoint(i)} className="absolute top-4 right-4 text-text-4 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={d.label} 
                    onChange={e => updatePoint(i, "label", e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-bold text-sm"
                    placeholder="Label"
                  />
                  <input 
                    type="number" 
                    value={d.value} 
                    onChange={e => updatePoint(i, "value", Number(e.target.value))}
                    className="w-16 bg-transparent border-none outline-none font-bold text-sm text-blue text-right"
                  />
                </div>
                <div className="flex gap-1">
                  {COLORS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => updatePoint(i, "color", c)}
                      className={`w-6 h-6 rounded-full border ${d.color === c ? 'border-blue scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={addPoint} className="w-full py-4 bg-bg border border-dashed border-border rounded-2xl text-text-3 font-bold flex items-center justify-center gap-2 hover:border-blue hover:text-blue transition-all">
            <Plus className="w-4 h-4" /> Add Data Point
          </button>

          <button onClick={download} className="w-full py-4 bg-blue text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download Chart
          </button>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center p-8 bg-surface border border-border rounded-[32px]">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-2xl shadow-xl" />
        </div>
      </div>
    </div>
  );
}
