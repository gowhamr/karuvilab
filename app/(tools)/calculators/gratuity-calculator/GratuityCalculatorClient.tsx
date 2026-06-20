'use client';

import React, { useState, useMemo } from 'react';
import { Award, Info, AlertTriangle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';

interface GratuityInput {
  lastSalary: number;
  yearsOfService: number;
  monthsOfService: number;
  employeeType: 'covered' | 'not-covered';
}

interface GratuityResult {
  gratuity: number;
  formula: string;
  taxExempt: number;
  taxable: number;
  effectiveYears: number;
}

function calculateGratuity(input: GratuityInput): GratuityResult {
  const { lastSalary, yearsOfService, monthsOfService, employeeType } = input;
  const maxExempt = 2000000; // 20 Lakhs

  let effectiveYears = yearsOfService;
  let gratuity = 0;
  let formula = '';

  if (employeeType === 'covered') {
    // Covered: Round up if months > 6
    if (monthsOfService > 6) {
      effectiveYears += 1;
    }
    gratuity = (lastSalary * 15 * effectiveYears) / 26;
    formula = `(${formatCurrency(lastSalary)} × 15 × ${effectiveYears} years) ÷ 26`;
  } else {
    // Not covered: Ignore months
    gratuity = (lastSalary * 15 * effectiveYears) / 30;
    formula = `(${formatCurrency(lastSalary)} × 15 × ${effectiveYears} years) ÷ 30`;
  }

  const taxExempt = Math.min(gratuity, maxExempt);
  const taxable = Math.max(0, gratuity - maxExempt);

  return {
    gratuity: Math.round(gratuity),
    formula,
    taxExempt: Math.round(taxExempt),
    taxable: Math.round(taxable),
    effectiveYears
  };
}

export default function GratuityCalculatorClient() {
  const [lastSalary, setLastSalary] = useState<number>(75000);
  const [years, setYears] = useState<number>(5);
  const [months, setMonths] = useState<number>(7);
  const [type, setType] = useState<'covered' | 'not-covered'>('covered');

  const isEligible = years >= 5 || (years === 4 && months >= 8); // 4 years 240 days approx

  const result = useMemo(() => calculateGratuity({
    lastSalary,
    yearsOfService: years,
    monthsOfService: months,
    employeeType: type
  }), [lastSalary, years, months, type]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> Employment Details
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-3 block">Last Drawn Salary (Basic + DA)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-4">₹</span>
                <input
                  type="number"
                  value={lastSalary || ''}
                  onChange={(e) => setLastSalary(Number(e.target.value))}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 pl-10 pr-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-3 block">Years of Service</label>
                <input
                  type="number"
                  value={years || ''}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 px-4 font-mono text-lg text-center text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-3 block">Additional Months</label>
                <input
                  type="number"
                  value={months || ''}
                  onChange={(e) => setMonths(Math.min(11, Number(e.target.value)))}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 px-4 font-mono text-lg text-center text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border/50">
              <label className="text-xs font-bold text-text-3 block flex items-center gap-2">
                Gratuity Act 1972 Coverage
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-text-4 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-surface border border-border shadow-xl rounded-xl text-xs text-text-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-content">
                    If your employer has 10 or more employees, they are typically covered under the Act.
                  </div>
                </div>
              </label>
              <div className="flex bg-bg border border-border rounded-2xl p-1">
                <button
                  onClick={() => setType('covered')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                    type === 'covered' ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-4 hover:text-text"
                  )}
                >
                  Covered
                </button>
                <button
                  onClick={() => setType('not-covered')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                    type === 'not-covered' ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-4 hover:text-text"
                  )}
                >
                  Not Covered
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="space-y-6">
          {!isEligible && (
            <m.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error/20 rounded-3xl p-6 flex gap-4 items-start"
            >
              <AlertTriangle className="w-5 h-5 text-error shrink-0" />
              <div>
                <p className="text-error text-sm font-black uppercase tracking-widest">
                  Not Eligible for Gratuity
                </p>
                <p className="text-text-3 text-sm mt-1 leading-relaxed font-medium">
                  You need to complete a minimum of <strong className="text-text">5 years</strong> of continuous service with the same employer to be eligible for gratuity. 
                  (Legally, 4 years and 240 days is often considered as 5 years).
                </p>
              </div>
            </m.div>
          )}

          <div className={cn("transition-opacity duration-300", !isEligible && "opacity-40 pointer-events-none")}>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard 
                label="Total Gratuity Payable" 
                value={formatCurrency(result.gratuity)} 
                className="col-span-2 bg-blue/5 border-blue/20" 
              />
              <MetricCard 
                label="Tax Exempt (Up to ₹20L)" 
                value={formatCurrency(result.taxExempt)} 
                className="bg-success/10 border-success/30 text-success" 
              />
              <MetricCard 
                label="Taxable Amount" 
                value={formatCurrency(result.taxable)} 
                className={result.taxable > 0 ? "bg-error/5 border-error/20 text-error" : "bg-bg border-border"} 
              />
            </div>

            <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6 mt-6">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-2">
                <Info className="w-3 h-3" /> Calculation Breakdown
              </h4>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="p-4 bg-bg border border-border rounded-2xl flex justify-between items-center text-text-3">
                  <span>Effective Tenure</span>
                  <strong className="text-text">{result.effectiveYears} Years</strong>
                </div>
                
                <div className="p-4 bg-bg border border-border rounded-2xl space-y-2">
                  <span className="text-xs text-text-4 block">Formula Applied:</span>
                  <div className="text-blue font-bold break-all">
                    {result.formula}
                  </div>
                </div>
              </div>
              
              <p className="text-xs font-medium text-text-3 leading-relaxed">
                {type === 'covered' 
                  ? "For covered employees, gratuity is calculated at 15 days wages for each completed year. A month is considered as 26 working days. Tenure is rounded up if additional months exceed 6."
                  : "For non-covered employees, gratuity is calculated at 15 days wages for each completed year based on a 30-day month. Only fully completed years are counted."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
