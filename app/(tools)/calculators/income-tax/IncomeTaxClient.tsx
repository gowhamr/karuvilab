'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { IndianRupee, Info, ArrowLeftRight, PiggyBank, Briefcase, FileText } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';

type TaxRegime = 'old' | 'new';
type AgeGroup = 'below60' | '60to80' | 'above80';

interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

const NEW_REGIME_SLABS: TaxSlab[] = [
  { min: 0,       max: 400000,  rate: 0  },
  { min: 400000,  max: 800000,  rate: 5  },
  { min: 800000,  max: 1200000, rate: 10 },
  { min: 1200000, max: 1600000, rate: 15 },
  { min: 1600000, max: 2000000, rate: 20 },
  { min: 2000000, max: 2400000, rate: 25 },
  { min: 2400000, max: Infinity,rate: 30 },
];

const OLD_REGIME_SLABS_BELOW60: TaxSlab[] = [
  { min: 0,       max: 250000,  rate: 0  },
  { min: 250000,  max: 500000,  rate: 5  },
  { min: 500000,  max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity,rate: 30 },
];

const OLD_REGIME_SLABS_60TO80: TaxSlab[] = [
  { min: 0,       max: 300000,  rate: 0  },
  { min: 300000,  max: 500000,  rate: 5  },
  { min: 500000,  max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity,rate: 30 },
];

const OLD_REGIME_SLABS_ABOVE80: TaxSlab[] = [
  { min: 0,       max: 500000,  rate: 0  },
  { min: 500000,  max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity,rate: 30 },
];

interface TaxResult {
  regime: TaxRegime;
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  monthlyTax: number;
  inHandMonthly: number;
  slabBreakdown: { slab: TaxSlab; taxableAmount: number; tax: number }[];
}

function calculateTaxForRegime(
  grossIncome: number,
  deductions: number,
  regime: TaxRegime,
  age: AgeGroup
): TaxResult {
  let taxableIncome = Math.max(0, grossIncome - deductions);
  
  let slabs = NEW_REGIME_SLABS;
  if (regime === 'old') {
    if (age === 'below60') slabs = OLD_REGIME_SLABS_BELOW60;
    else if (age === '60to80') slabs = OLD_REGIME_SLABS_60TO80;
    else slabs = OLD_REGIME_SLABS_ABOVE80;
  }

  let tax = 0;
  const slabBreakdown = [];

  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const taxableAmount = Math.min(taxableIncome, slab.max) - slab.min;
      const slabTax = (taxableAmount * slab.rate) / 100;
      tax += slabTax;
      if (slabTax > 0 || slab.rate === 0) {
        slabBreakdown.push({ slab, taxableAmount, tax: slabTax });
      }
    }
  }

  // Rebate u/s 87A
  if (regime === 'new' && taxableIncome <= 700000) {
    tax = Math.max(0, tax - 25000);
  } else if (regime === 'old' && taxableIncome <= 500000) {
    tax = Math.max(0, tax - 12500);
  }

  // Marginal Relief on 87A for New Regime (simplified)
  if (regime === 'new' && taxableIncome > 700000 && taxableIncome <= 727777) {
    const taxOn7L = 0;
    const taxAbove7L = taxableIncome - 700000;
    tax = Math.min(tax, taxOn7L + taxAbove7L);
  }

  // Surcharge
  let surchargeRate = 0;
  if (taxableIncome > 50000000) surchargeRate = 37; // > 5Cr
  else if (taxableIncome > 20000000) surchargeRate = 25; // > 2Cr
  else if (taxableIncome > 10000000) surchargeRate = 15; // > 1Cr
  else if (taxableIncome > 5000000) surchargeRate = 10; // > 50L
  
  // New regime caps surcharge at 25%
  if (regime === 'new' && surchargeRate > 25) surchargeRate = 25;

  const surcharge = (tax * surchargeRate) / 100;
  // Marginal relief on surcharge omitted for brevity, acceptable for standard calculator

  const cess = (tax + surcharge) * 0.04;
  const totalTax = tax + surcharge + cess;

  return {
    regime,
    grossIncome,
    totalDeductions: deductions,
    taxableIncome,
    taxBeforeCess: tax,
    surcharge,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    monthlyTax: totalTax / 12,
    inHandMonthly: (grossIncome - totalTax) / 12,
    slabBreakdown
  };
}

export default function IncomeTaxClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { salary: 1200000, regime: 'new', age: 'below60', c80: 0, c80d: 0, hra: 0, hli: 0 },
    debounceMs: 400,
  });

  const grossSalary = state.salary as number;
  const activeRegime = state.regime as TaxRegime;
  const age = state.age as AgeGroup;
  const sec80C = state.c80 as number;
  const sec80D = state.c80d as number;
  const hra = state.hra as number;
  const homeLoan = state.hli as number;
  const [otherDed, setOtherDed] = useState<number>(0);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setGrossSalary = useCallback((v: number) => setState({ salary: v }), [setState]);
  const setActiveRegime = useCallback((v: TaxRegime) => setState({ regime: v }), [setState]);
  const setAge = useCallback((v: AgeGroup) => setState({ age: v }), [setState]);
  const setSec80C = useCallback((v: number) => setState({ c80: v }), [setState]);
  const setSec80D = useCallback((v: number) => setState({ c80d: v }), [setState]);
  const setHra = useCallback((v: number) => setState({ hra: v }), [setState]);
  const setHomeLoan = useCallback((v: number) => setState({ hli: v }), [setState]);

  const results = useMemo(() => {
    const stdDeductionOld = 50000;
    const stdDeductionNew = 75000;

    const oldDeductions = stdDeductionOld + Math.min(150000, sec80C) + sec80D + hra + homeLoan + otherDed;
    const newDeductions = stdDeductionNew; // New regime only has std deduction

    const oldRes = calculateTaxForRegime(grossSalary, oldDeductions, 'old', age);
    const newRes = calculateTaxForRegime(grossSalary, newDeductions, 'new', age);

    return {
      old: oldRes,
      new: newRes,
      recommendation: newRes.totalTax <= oldRes.totalTax ? 'new' as TaxRegime : 'old' as TaxRegime,
      savings: Math.abs(newRes.totalTax - oldRes.totalTax)
    };
  }, [grossSalary, age, sec80C, sec80D, hra, homeLoan, otherDed]);

  const activeResult = activeRegime === 'new' ? results.new : results.old;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <SharedResultBanner hasParams={hasParams} toolName="Income Tax Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      {/* Top Banner - Recommendation */}
      <div className={cn(
        "p-6 rounded-4xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors shadow-sm",
        results.savings > 0 ? "bg-green-500/10 border-green-500/30" : "bg-surface border-border"
      )}>
        <div>
          <h2 className="text-xl font-black text-text">
            {results.savings > 0 ? (
              <>The <span className={cn(results.recommendation === 'new' ? 'text-blue' : 'text-purple-500 capitalize')}>{results.recommendation} Regime</span> is better for you.</>
            ) : "Both regimes result in the same tax."}
          </h2>
          {results.savings > 0 && (
            <p className="text-sm font-medium text-text-3 mt-1">
              You save <strong className="text-green-500 dark:text-green-400">{formatCurrency(results.savings)}</strong> annually.
            </p>
          )}
        </div>
        <div className="flex bg-bg border border-border p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveRegime('new')}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-black transition-all",
              activeRegime === 'new' ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text"
            )}
          >
            New Regime
          </button>
          <button
            onClick={() => setActiveRegime('old')}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-black transition-all",
              activeRegime === 'old' ? "bg-purple-500 text-white shadow-md shadow-purple-500/20" : "text-text-4 hover:text-text"
            )}
          >
            Old Regime
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <ShareButton
          url={shareUrl}
          title={`Income Tax: ${formatCurrency(activeResult.totalTax)} total tax (${activeRegime} regime) — KaruviLab`}
          onQrClick={() => setIsQrOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Income Details
            </h3>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-text-4 block">Annual Gross Salary</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-4">₹</span>
                <input
                  type="number"
                  value={grossSalary || ''}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full bg-bg border border-border rounded-2xl py-4 pl-10 pr-4 font-mono text-xl text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-text-4 block">Age Group</label>
              <div className="grid grid-cols-3 gap-2 bg-bg border border-border p-1 rounded-2xl">
                {(['below60', '60to80', 'above80'] as AgeGroup[]).map(a => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={cn(
                      "py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                      age === a ? "bg-surface text-text shadow-sm" : "text-text-4 hover:text-text-2"
                    )}
                  >
                    {a === 'below60' ? '< 60' : a === '60to80' ? '60 - 80' : '> 80'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {activeRegime === 'old' && (
              <m.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 flex items-center gap-2">
                    <PiggyBank className="w-3.5 h-3.5" /> Deductions
                  </h3>
                  <span className="text-[9px] font-bold uppercase bg-purple-500/10 text-purple-500 px-2 py-1 rounded-md">Old Regime Only</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: '80C (EPF, LIC, ELSS)', val: sec80C, set: setSec80C, max: 150000 },
                    { label: '80D (Health Insurance)', val: sec80D, set: setSec80D },
                    { label: 'HRA Exemption', val: hra, set: setHra },
                    { label: 'Home Loan Interest (24b)', val: homeLoan, set: setHomeLoan, max: 200000 },
                    { label: 'Other Deductions', val: otherDed, set: setOtherDed },
                  ].map((field, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-text-3 flex-1">{field.label}</label>
                      <div className="relative w-full sm:w-40 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-text-4 text-xs">₹</span>
                        <input
                          type="number"
                          value={field.val || ''}
                          onChange={(e) => field.set(Number(e.target.value))}
                          className="w-full bg-bg border border-border rounded-xl py-2 pl-7 pr-3 font-mono text-sm text-text focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-text-4 font-medium text-center pt-2 italic">Standard deduction of ₹50,000 is auto-applied.</p>
                </div>
              </m.div>
            )}
            
            {activeRegime === 'new' && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue/5 border border-blue/20 rounded-4xl p-6 sm:p-8 text-center space-y-3"
              >
                <Info className="w-6 h-6 text-blue mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold text-blue">No Deductions Needed</p>
                <p className="text-xs font-medium text-text-3 leading-relaxed">
                  The New Regime automatically applies a standard deduction of <strong className="text-text">₹75,000</strong>. Other deductions like 80C, HRA, and home loan interest are not applicable.
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 px-2">Tax Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Gross Income" value={formatCurrency(activeResult.grossIncome)} />
            <MetricCard label="Total Deductions" value={`-${formatCurrency(activeResult.totalDeductions)}`} accent className="text-green-500" />
            <MetricCard label="Taxable Income" value={formatCurrency(activeResult.taxableIncome)} className="col-span-2 bg-bg/50" />
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            <div className={cn(
              "absolute -top-32 -right-32 w-64 h-64 blur-3xl opacity-[0.05] rounded-full transition-colors duration-700",
              activeRegime === 'new' ? 'bg-blue' : 'bg-purple-500'
            )} />
            
            <div className="flex items-end justify-between border-b border-border/50 pb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4 mb-2">Total Tax Payable</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-text tracking-tighter">{formatCurrency(activeResult.totalTax)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4 mb-1">Effective Rate</p>
                <span className="text-xl font-black text-text-3">{activeResult.effectiveRate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-4 mb-1">Monthly In-Hand</p>
                  <span className="text-2xl font-bold text-green-500">{formatCurrency(activeResult.inHandMonthly)}</span>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-4 mb-1">Monthly Tax</p>
                  <span className="text-xl font-bold text-red-400">{formatCurrency(activeResult.monthlyTax)}</span>
               </div>
            </div>

            {/* Slab Table */}
            <div className="pt-6 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Slab Breakdown
              </h4>
              <div className="bg-bg border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-mat-base border-b border-border text-[9px] uppercase tracking-widest text-text-4 font-black">
                    <tr>
                      <th className="px-4 py-3">Income Range</th>
                      <th className="px-4 py-3">Rate</th>
                      <th className="px-4 py-3 text-right">Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 font-mono text-xs">
                    {activeResult.slabBreakdown.map((b, i) => (
                      <tr key={i} className="hover:bg-hover/50 transition-colors">
                        <td className="px-4 py-3 text-text-3">
                          {b.slab.min / 100000}L - {b.slab.max === Infinity ? 'Above' : b.slab.max / 100000 + 'L'}
                        </td>
                        <td className="px-4 py-3 text-text-4">{b.slab.rate}%</td>
                        <td className="px-4 py-3 text-right font-bold text-text">{formatCurrency(b.tax)}</td>
                      </tr>
                    ))}
                    {activeResult.cess > 0 && (
                      <tr className="bg-mat-base">
                        <td className="px-4 py-3 text-text-4 font-sans font-bold" colSpan={2}>Health & Education Cess</td>
                        <td className="px-4 py-3 text-right font-bold text-text-3">{formatCurrency(activeResult.cess)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
