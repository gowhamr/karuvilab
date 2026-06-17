"use client";

import React, { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { UnitConverterTab } from "./UnitConverterTab";
import { TransferTimeTab } from "./TransferTimeTab";
import { StorageCostTab } from "./StorageCostTab";
import { ChecksumTab } from "./ChecksumTab";
import { Calculator, Wifi, HardDrive, ShieldCheck, Database } from "lucide-react";
import { cn } from "@/src/lib/utils";

const cat = CATEGORIES.find(c => c.id === "calculators")!;

const TABS = [
  { id: 'converter', label: 'Unit Converter', icon: Calculator, component: UnitConverterTab },
  { id: 'transfer',  label: 'Transfer Time',  icon: Wifi,       component: TransferTimeTab },
  { id: 'storage',   label: 'Storage Cost',   icon: HardDrive,  component: StorageCostTab },
  { id: 'checksum',  label: 'Checksum',       icon: ShieldCheck, component: ChecksumTab },
];

export default function DataCalculatorClient() {
  const [activeTab, setActiveTab] = useState(TABS[0]!.id);

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || UnitConverterTab;

  return (
    <div className="space-y-10">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-surface border border-border rounded-3xl w-fit mx-auto shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm transition-all duration-300",
                activeTab === tab.id
                  ? "bg-blue text-white shadow-md shadow-blue/10 scale-105"
                  : "text-text-4 hover:text-text-2 hover:bg-bg/50"
              )}
            >
              <Icon className={cn("w-4 h-4", activeTab === tab.id ? "animate-pulse" : "")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ActiveComponent />
      </div>

      {/* Privacy Note */}
      <div className="flex items-center justify-center gap-3 p-6 bg-bg/50 border border-border/50 rounded-4xl">
        <Database className="w-5 h-5 text-blue" />
        <p className="text-xs font-bold text-text-3">
          Zero-Upload Architecture: All data conversions and file hashing happen entirely in your browser using Web Workers.
        </p>
      </div>
    </div>
  );
}
