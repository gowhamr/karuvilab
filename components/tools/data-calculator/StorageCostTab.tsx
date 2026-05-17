"use client";

import React, { useState, useMemo } from "react";
import { DATA_UNITS, STORAGE_PROVIDERS, calculateStorageCost } from "@/src/lib/data-unit-utils";
import { useDataCalcStore } from "@/src/store/useDataCalcStore";
import { ToolInput } from "@/components/ui/ToolInput";
import { SliderField } from "@/components/ui/SliderField";
import { MetricCard } from "@/components/ui/MetricCard";
import { HardDrive, DollarSign, Calendar, Info } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

export function StorageCostTab() {
  const costPerGB = useDataCalcStore(state => state.costPerGB);
  const setCostPerGB = useDataCalcStore(state => state.setCostPerGB);
  const durationMonths = useDataCalcStore(state => state.durationMonths);
  const setDurationMonths = useDataCalcStore(state => state.setDurationMonths);
  const provider = useDataCalcStore(state => state.provider);
  
  const [dataSize, setDataSize] = useState("1");
  const [dataUnit, setDataUnit] = useState("TB");

  const totalCost = useMemo(() => {
    const size = parseFloat(dataSize);
    if (isNaN(size)) return 0;
    return calculateStorageCost(size, dataUnit, costPerGB, durationMonths);
  }, [dataSize, dataUnit, costPerGB, durationMonths]);

  const handleProviderChange = (pId: string) => {
    const p = STORAGE_PROVIDERS.find(x => x.id === pId);
    if (p) {
      setCostPerGB(p.cost, p.id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-surface border border-border p-8 rounded-[32px] shadow-sm space-y-8">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage Volume
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToolInput
                label="Data Size"
                type="number"
                value={dataSize}
                onChange={setDataSize}
              />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-4 px-1">Unit</label>
                <select
                  value={dataUnit}
                  onChange={(e) => setDataUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
                >
                  {DATA_UNITS.filter(u => u.factor >= 8 * 1e9).map((u) => (
                    <option key={u.id} value={u.id}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing Model
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-4 px-1">Provider Preset</label>
                <select
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
                >
                  {STORAGE_PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              
              <ToolInput
                label="Cost per GB / Month ($)"
                type="number"
                value={String(costPerGB)}
                onChange={(val) => setCostPerGB(Number(val))}
              />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-border/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Storage Duration
            </h3>
            <SliderField
              label="Months"
              id="duration-slider"
              min={1}
              max={120}
              step={1}
              value={durationMonths}
              onChange={setDurationMonths}
              format={(v) => `${v} mo (${(v / 12).toFixed(1)} yr)`}
            />
          </div>
        </div>

        <div className="space-y-6">
          <MetricCard
            label="Total Estimated Cost"
            value={`$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            accent
            sub={`$${(totalCost / durationMonths).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month`}
          />
          
          <div className="p-8 bg-surface border border-border rounded-[32px] space-y-6">
            <div className="flex items-center gap-2 text-blue">
              <Info className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Cost Analysis</h4>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-bg rounded-2xl border border-border/50 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4">Capacity</p>
                <p className="text-sm font-bold text-text">{dataSize} {dataUnit}</p>
              </div>
              
              <div className="p-4 bg-bg rounded-2xl border border-border/50 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4">Monthly Rate</p>
                <p className="text-sm font-bold text-text">
                  ${(totalCost / durationMonths).toLocaleString(undefined, { minimumFractionDigits: 4 })} / month
                </p>
              </div>
              
              <p className="text-[10px] text-text-3 leading-relaxed">
                Prices vary by region and storage class (e.g., Hot vs Cold storage). This calculator uses standard base rates and does not include egress (download) fees, API request costs, or data transfer taxes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
