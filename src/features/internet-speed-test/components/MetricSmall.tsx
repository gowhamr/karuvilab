import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/src/lib/utils";

interface MetricSmallProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

export function MetricSmall({ label, value, icon: Icon, color = "text-text-2" }: MetricSmallProps) {
  return (
    <div className="flex flex-col items-center space-y-2 group">
      <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-text-4 group-hover:text-blue transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-widest text-text-4">{label}</p>
        <p className={cn("text-xl font-black tracking-tight", color)}>{value}</p>
      </div>
    </div>
  );
}
