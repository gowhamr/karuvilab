'use client';

import React, { useState, useMemo } from 'react';
import { Percent, Info, AlertTriangle, Building, User } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';

interface TDSSection {
  code: string;
  description: string;
  threshold: number;
  rateInd: number;
  rateComp: number;
}

const SECTIONS: TDSSection[] = [
  { code: '194A', description: 'Interest (Bank FD, etc.)', threshold: 40000, rateInd: 10, rateComp: 10 },
  { code: '194C', description: 'Payment to Contractors (Single)', threshold: 30000, rateInd: 1, rateComp: 2 },
  { code: '194C_AGG', description: 'Payment to Contractors (Aggregate)', threshold: 100000, rateInd: 1, rateComp: 2 },
  { code: '194H', description: 'Commission or Brokerage', threshold: 15000, rateInd: 5, rateComp: 5 },
  { code: '194I_A', description: 'Rent (Plant & Machinery)', threshold: 240000, rateInd: 2, rateComp: 2 },
  { code: '194I_B', description: 'Rent (Land, Building, Furniture)', threshold: 240000, rateInd: 10, rateComp: 10 },
  { code: '194J_A', description: 'Professional Fees', threshold: 30000, rateInd: 10, rateComp: 10 },
  { code: '194J_B', description: 'Technical Fees / Royalty / Call Center', threshold: 30000, rateInd: 2, rateComp: 2 },
  { code: '194Q', description: 'Purchase of Goods', threshold: 5000000, rateInd: 0.1, rateComp: 0.1 },
];

export default function TdsCalculatorClient() {
  const [sectionCode, setSectionCode] = useState<string>('194J_A');
  const [amount, setAmount] = useState<number>(50000);
  const [isCompany, setIsCompany] = useState<boolean>(false);
  const [hasPan, setHasPan] = useState<boolean>(true);

  const activeSection = useMemo(() => SECTIONS.find(s => s.code === sectionCode) || SECTIONS[0]!, [sectionCode]);

  const result = useMemo(() => {
    let rate = isCompany ? activeSection.rateComp : activeSection.rateInd;
    if (!hasPan) {
      rate = Math.max(rate, 20); // Generally 20% if PAN absent, or rate in force
    }

    const tdsApplicable = amount > activeSection.threshold;
    const tdsAmount = tdsApplicable ? (amount * rate) / 100 : 0;
    const netAmount = amount - tdsAmount;

    return {
      rate,
      tdsApplicable,
      tdsAmount,
      netAmount
    };
  }, [amount, isCompany, hasPan, activeSection]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <Percent className="w-3.5 h-3.5" /> Payment Details
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-3 block">Nature of Payment (Section)</label>
              <select
                value={sectionCode}
                onChange={(e) => setSectionCode(e.target.value)}
                className="w-full bg-bg border border-border rounded-2xl p-4 text-sm font-bold text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all appearance-none cursor-pointer"
              >
                {SECTIONS.map(s => (
                  <option key={s.code} value={s.code}>
                    Sec {s.code.split('_')[0]} — {s.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-text-3 block">Payment Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-4">₹</span>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-bg border border-border rounded-2xl py-4 pl-10 pr-4 font-mono text-xl text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border/50">
              <label className="text-xs font-bold text-text-3 block">Payee Type (Deductee)</label>
              <div className="flex bg-bg border border-border rounded-2xl p-1">
                <button
                  onClick={() => setIsCompany(false)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    !isCompany ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-4 hover:text-text"
                  )}
                >
                  <User className="w-4 h-4" /> Individual / HUF
                </button>
                <button
                  onClick={() => setIsCompany(true)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    isCompany ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-4 hover:text-text"
                  )}
                >
                  <Building className="w-4 h-4" /> Company / Firm
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group p-4 bg-bg border border-border rounded-2xl">
                <input
                  type="checkbox"
                  checked={hasPan}
                  onChange={(e) => setHasPan(e.target.checked)}
                  className="w-5 h-5 rounded text-blue focus:ring-blue/20 border-border"
                />
                <div>
                  <span className="text-sm font-bold text-text group-hover:text-blue transition-colors block">Valid PAN Provided</span>
                  <span className="text-xs text-text-4 font-medium">Uncheck if payee has not submitted PAN (Sec 206AA).</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="space-y-6">
          {!result.tdsApplicable && (
            <m.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4 items-start"
            >
              <Info className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-black uppercase tracking-widest">
                  No TDS Required
                </p>
                <p className="text-text-3 text-sm mt-1 leading-relaxed font-medium">
                  The payment amount is within the annual exemption threshold of <strong className="text-text">₹{activeSection.threshold.toLocaleString()}</strong> for this section.
                </p>
              </div>
            </m.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <MetricCard 
              label="TDS Rate Applied" 
              value={`${result.rate}%`} 
              className={cn("col-span-2", !hasPan && "bg-red-500/5 border-red-500/20 text-red-500")} 
              sub={!hasPan ? "Higher rate due to absent PAN" : undefined}
            />
            <MetricCard 
              label="TDS Amount to Deduct" 
              value={`- ${formatCurrency(result.tdsAmount)}`} 
              className="bg-red-500/5 border-red-500/20 text-red-500" 
            />
            <MetricCard 
              label="Net Payable to Payee" 
              value={formatCurrency(result.netAmount)} 
              className="bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" 
            />
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6 mt-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-4 flex items-center gap-2">
              <Info className="w-3 h-3" /> Section Details: {activeSection.code.split('_')[0]}
            </h4>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="p-4 bg-bg border border-border rounded-2xl flex justify-between items-center text-text-3">
                <span>Description</span>
                <strong className="text-text text-right max-w-[60%]">{activeSection.description}</strong>
              </div>
              <div className="p-4 bg-bg border border-border rounded-2xl flex justify-between items-center text-text-3">
                <span>Exemption Limit</span>
                <strong className="text-text">{formatCurrency(activeSection.threshold)}</strong>
              </div>
              <div className="p-4 bg-bg border border-border rounded-2xl flex justify-between items-center text-text-3">
                <span>Standard Rate (Ind/Comp)</span>
                <strong className="text-text">{activeSection.rateInd}% / {activeSection.rateComp}%</strong>
              </div>
            </div>
            
            <p className="text-xs font-medium text-text-4 leading-relaxed text-center italic mt-4">
              Note: Surcharge and Health & Education Cess (4%) are generally not applicable on payments made to residents (except Salary u/s 192). This calculator assumes a resident payee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
