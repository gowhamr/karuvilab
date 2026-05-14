"use client";

import React, { useState, useMemo } from "react";
import { DATA_UNITS, BANDWIDTH_UNITS, calculateTransferTime, formatDuration } from "@/src/lib/data-unit-utils";
import { useDataCalcStore } from "@/src/store/useDataCalcStore";
import { ToolInput } from "@/components/ui/ToolInput";
import { SliderField } from "@/components/ui/SliderField";
import { MetricCard } from "@/components/ui/MetricCard";
import { Clock, Wifi, FileText, Settings2 } from "lucide-react";

export function TransferTimeTab() {
  const { bandwidthUnit, setBandwidthUnit, overhead, setOverhead } = useDataCalcStore();
  
  const [fileSize, setFileSize] = useState("1");
  const [fileUnit, setFileUnit] = useState("GB");
  const [bandwidth, setBandwidth] = useState("100");

  const duration = useMemo(() => {
    const size = parseFloat(fileSize);
    const speed = parseFloat(bandwidth);
    if (isNaN(size) || isNaN(speed) || speed <= 0) return 0;
    
    return calculateTransferTime(size, fileUnit, speed, bandwidthUnit, overhead);
  }, [fileSize, fileUnit, bandwidth, bandwidthUnit, overhead]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-surface border border-border p-8 rounded-[32px] shadow-sm space-y-8">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue flex items-center gap-2">
              <FileText className="w-4 h-4" />
              File Configuration
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToolInput
                label="File Size"
                type="number"
                value={fileSize}
                onChange={setFileSize}
              />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-4 px-1">Unit</label>
                <select
                  value={fileUnit}
                  onChange={(e) => setFileUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
                >
                  {DATA_UNITS.filter(u => u.id !== 'b').map((u) => (
                    <option key={u.id} value={u.id}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Network Configuration
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToolInput
                label="Bandwidth"
                type="number"
                value={bandwidth}
                onChange={setBandwidth}
              />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-4 px-1">Speed Unit</label>
                <select
                  value={bandwidthUnit}
                  onChange={(e) => setBandwidthUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
                >
                  {BANDWIDTH_UNITS.map((u) => (
                    <option key={u.id} value={u.id}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-border/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Advanced Settings
            </h3>
            <SliderField
              label="Network Overhead (%)"
              id="overhead-slider"
              min={0}
              max={50}
              step={1}
              value={overhead}
              onChange={setOverhead}
              format={(v) => `${v}%`}
            />
            <p className="text-[10px] text-text-4 font-medium leading-relaxed italic">
              * Real-world transfers typically have ~5-10% TCP/IP and protocol overhead.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <MetricCard
            label="Estimated Transfer Time"
            value={formatDuration(duration)}
            icon={Clock}
            accent
          />
          
          <div className="p-8 bg-surface border border-border rounded-[32px] space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">Detailed Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-text-2">Total Bits (incl. overhead)</span>
                <span className="text-sm font-black text-text tabular-nums">
                  {((parseFloat(fileSize) || 0) * (DATA_UNITS.find(u => u.id === fileUnit)?.factor || 0) * (1 + overhead/100)).toExponential(4)} bits
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-text-2">Effective Speed</span>
                <span className="text-sm font-black text-text tabular-nums">
                  {bandwidth} {bandwidthUnit}
                </span>
              </div>
              <p className="text-[10px] text-text-3 leading-relaxed pt-2">
                This estimate assumes a stable connection at the specified speed. Actual times may vary due to server load, packet loss, and physical distance (latency).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
