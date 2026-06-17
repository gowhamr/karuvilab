import React from 'react';
import { LucideIcon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface IntelligenceCardProps {
  icon: LucideIcon;
  title: string;
  requirement: number;
  current: number | null;
  isLatency?: boolean;
  desc: string;
}

export function IntelligenceCard({ icon: Icon, title, requirement, current, isLatency, desc }: IntelligenceCardProps) {
  const isReady = current !== null && (isLatency ? current <= requirement : current >= requirement);
  const status = current === null ? 'pending' : isReady ? 'yes' : 'no';

  return (
    <div className={cn(
      "bg-surface border p-6 rounded-4xl space-y-4 transition-all duration-500 relative overflow-hidden group",
      status === 'yes' ? "border-success/20 shadow-lg shadow-success/5" : "border-border"
    )}>
      {status === 'yes' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -mr-12 -mt-12 blur-2xl" />
      )}
      
      <div className="flex items-center justify-between relative z-10">
         <div className={cn(
           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
           status === 'yes' ? "bg-success/10 text-success scale-110" : "bg-bg text-text-4"
         )}>
            <Icon className="w-6 h-6" />
         </div>
         {status !== 'pending' && (
           <div className={cn(
             "px-3 py-1.5 rounded-xl text-tiny font-bold uppercase tracking-widest-sm flex items-center gap-2",
             status === 'yes' ? "bg-success text-white shadow-lg shadow-success/20" : "bg-error/10 text-error"
           )}>
              {status === 'yes' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Optimal</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Limited</span>
                </>
              )}
           </div>
         )}
      </div>
      
      <div className="space-y-1 relative z-10">
        <h3 className="font-black text-sm tracking-tight text-text group-hover:text-blue transition-colors">{title}</h3>
        <p className="text-xs text-text-4 leading-relaxed font-medium">{desc}</p>
      </div>
      
      <div className="pt-2 flex items-center gap-3 relative z-10">
         <div className="h-1.5 flex-1 bg-bg rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", status === 'yes' ? "bg-success" : "bg-text-4/30")}
              initial={{ width: 0 }}
              animate={{ width: status === 'yes' ? '100%' : status === 'no' ? '40%' : '0%' }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
         </div>
         <span className="text-xs font-black text-text-3 tabular-nums">
           {isLatency ? `${requirement}ms` : `${requirement}Mbps`}
         </span>
      </div>
    </div>
  );
}
