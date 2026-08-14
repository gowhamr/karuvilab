'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { TrendingUp, Info, PiggyBank, Calendar, Briefcase } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';

interface NPSResult {
  yearsToRetirement: number;
  totalInvested: number;
  estimatedCorpus: number;
  lumpsum: number;
  annuityCorpus: number;
  monthlyPension: number;
}

function calculateNPS(
  age: number, 
  retireAge: number, 
  monthlyInv: number, 
  returnRate: number, 
  annuityRate: number, 
  annuityPercent: number
): NPSResult {
  const years = Math.max(0, retireAge - age);
  const months = years * 12;
  const r = returnRate / 100 / 12;

  const totalInvested = monthlyInv * months;
  // Future Value of a Series (Compound Interest for regular contributions)
  const estimatedCorpus = monthlyInv * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);

  const annuityCorpus = estimatedCorpus * (annuityPercent / 100);
  const lumpsum = estimatedCorpus - annuityCorpus;
  
  // Monthly pension = (Annuity Corpus * Annual Annuity Rate) / 12
  const monthlyPension = (annuityCorpus * (annuityRate / 100)) / 12;

  return {
    yearsToRetirement: years,
    totalInvested: Math.round(totalInvested),
    estimatedCorpus: Math.round(estimatedCorpus),
    lumpsum: Math.round(lumpsum),
    annuityCorpus: Math.round(annuityCorpus),
    monthlyPension: Math.round(monthlyPension)
  };
}

export default function NpsCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { age: 30, retire: 60, monthly: 10000, returnRate: 10, annuityPct: 40, annuityRate: 6 },
    debounceMs: 400,
  });

  const age = state.age as number;
  const retireAge = state.retire as number;
  const monthlyInv = state.monthly as number;
  const returnRate = state.returnRate as number;
  const annuityPercent = state.annuityPct as number;
  const annuityRate = state.annuityRate as number;
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setAge = useCallback((v: number) => setState({ age: v }), [setState]);
  const setRetireAge = useCallback((v: number) => setState({ retire: v }), [setState]);
  const setMonthlyInv = useCallback((v: number) => setState({ monthly: v }), [setState]);
  const setReturnRate = useCallback((v: number) => setState({ returnRate: v }), [setState]);
  const setAnnuityPercent = useCallback((v: number) => setState({ annuityPct: v }), [setState]);
  const setAnnuityRate = useCallback((v: number) => setState({ annuityRate: v }), [setState]);

  const result = useMemo(() => calculateNPS(age, retireAge, monthlyInv, returnRate, annuityRate, annuityPercent), 
    [age, retireAge, monthlyInv, returnRate, annuityRate, annuityPercent]);

  return (
    <div className="w-full space-y-8 pb-12">
      <SharedResultBanner hasParams={hasParams} toolName="NPS Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      <ToolWorkspace
        className="pb-0 space-y-0"
        input={
          <div className="space-y-8">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Investment Details
            </h3>

            <div className="space-y-4">
              <label className="text-xs font-bold text-text-3 block">Monthly Investment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-muted">₹</span>
                <input
                  type="number"
                  value={monthlyInv || ''}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    if (num >= 0 && num <= 1000000000000) setMonthlyInv(num);
                  }}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 pl-10 pr-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-3 block">Current Age</label>
                <input
                  type="number"
                  value={age || ''}
                  onChange={(e) => setAge(Math.min(retireAge - 1, Number(e.target.value)))}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 px-4 font-mono text-lg text-center text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-3 block">Retirement Age</label>
                <input
                  type="number"
                  value={retireAge || ''}
                  onChange={(e) => setRetireAge(Math.max(age + 1, Number(e.target.value)))}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 px-4 font-mono text-lg text-center text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-border/50 pt-6">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-text-3 block">Expected Return</label>
                <span className="text-xs font-bold text-text-muted">{returnRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={8} max={15} step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue"
              />
            </div>
          </div>
        }
        optionsPanel={
          <div className="space-y-6">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Post-Retirement Allocation
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-text-3 block">Annuity Purchase (Min 40%)</label>
                <span className="text-xs font-bold text-text-muted">{annuityPercent}%</span>
              </div>
              <input
                type="range"
                min={40} max={100} step={5}
                value={annuityPercent}
                onChange={(e) => setAnnuityPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-text-3 block">Expected Annuity Rate</label>
                <span className="text-xs font-bold text-text-muted">{annuityRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={5} max={10} step={0.5}
                value={annuityRate}
                onChange={(e) => setAnnuityRate(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue"
              />
            </div>
          </div>
        }
        output={
          <div className="space-y-6 relative h-full flex flex-col">
            <div className="absolute -top-32 -right-32 w-64 h-64 blur-3xl opacity-[0.05] rounded-full transition-colors duration-700 bg-blue pointer-events-none" />
            
            <div className="text-center border-b border-border/50 pb-8 relative z-content">
              <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted mb-2">Total Estimated Corpus</p>
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-text tracking-tighter block">{formatCurrency(result.estimatedCorpus)}</span>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 relative z-content">
               <div>
                  <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted mb-1">Total Invested</p>
                  <span className="text-xl font-bold text-text-2">{formatCurrency(result.totalInvested)}</span>
               </div>
               <div>
                  <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted mb-1">Wealth Gained</p>
                  <span className="text-xl font-bold text-green-500">+{formatCurrency(result.estimatedCorpus - result.totalInvested)}</span>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-6 relative z-content">
              <MetricCard 
                label="Tax-Free Lumpsum (60%)" 
                value={formatCurrency(result.lumpsum)} 
                className="bg-blue/5 border-blue/20" 
                sub="Available for withdrawal at retirement"
              />
              <MetricCard 
                label="Estimated Monthly Pension" 
                value={formatCurrency(result.monthlyPension)} 
                className="bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" 
                sub="Taxable as per slab rate"
              />
            </div>

            <div className="flex justify-end pt-4 relative z-content">
              <ShareButton
                url={shareUrl}
                title={`NPS Corpus: ${formatCurrency(result.estimatedCorpus)} at retirement — KaruviLab`}
                onQrClick={() => setIsQrOpen(true)}
              />
            </div>
          </div>
        }
        infoPanel={
          <div className="bg-blue/5 border border-blue/20 rounded-3xl p-6 flex gap-4 items-start">
            <PiggyBank className="w-5 h-5 text-blue shrink-0" />
            <div>
              <p className="text-blue font-black uppercase tracking-widest text-sm">Tax Benefits</p>
              <ul className="text-text-3 text-sm mt-2 space-y-1 font-medium">
                <li>• Max <strong className="text-text">₹1.5 Lakhs</strong> deduction under Sec 80C.</li>
                <li>• Additional exclusive <strong className="text-text">₹50,000</strong> deduction under Sec 80CCD(1B).</li>
                <li>• At maturity, the 60% lumpsum withdrawal is completely tax-free.</li>
              </ul>
            </div>
          </div>
        }
      />
    </div>
  );
}
