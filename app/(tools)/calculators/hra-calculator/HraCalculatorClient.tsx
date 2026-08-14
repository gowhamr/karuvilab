'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Home, Info, CheckCircle2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/src/lib/utils';
import { MetricCard } from '@/components/ui/MetricCard';
import { useUrlState } from '@/src/hooks/useUrlState';
import { ShareButton } from '@/components/ui/ShareButton';
import { SharedResultBanner } from '@/components/ui/SharedResultBanner';
import { QRModal } from '@/components/ui/QRModal';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';

interface HRAInput {
  basicSalary: number;
  daPercent: number;
  hraReceived: number;
  rentPaid: number;
  city: 'metro' | 'non-metro';
}

interface HRAResult {
  method1: number;
  method2: number;
  method3: number;
  exemption: number;
  taxable: number;
  annual: {
    exemption: number;
    taxable: number;
  };
}

function calculateHRA(input: HRAInput): HRAResult {
  const daAmount = (input.basicSalary * input.daPercent) / 100;
  const basicPlusDa = input.basicSalary + daAmount;

  // Method 1: Actual HRA received
  const method1 = input.hraReceived;

  // Method 2: 50% / 40% of Basic + DA
  const method2 = input.city === 'metro' ? basicPlusDa * 0.5 : basicPlusDa * 0.4;

  // Method 3: Rent paid - 10% of Basic + DA
  const method3 = Math.max(0, input.rentPaid - (basicPlusDa * 0.1));

  const exemption = Math.min(method1, method2, method3);
  const taxable = Math.max(0, input.hraReceived - exemption);

  return {
    method1,
    method2,
    method3,
    exemption,
    taxable,
    annual: {
      exemption: exemption * 12,
      taxable: taxable * 12
    }
  };
}

export default function HraCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { basic: 50000, da: 0, hra: 20000, rent: 18000, city: 'metro' },
    debounceMs: 400,
  });

  const basicSalary = state.basic as number;
  const daPercent = state.da as number;
  const hraReceived = state.hra as number;
  const rentPaid = state.rent as number;
  const city = state.city as 'metro' | 'non-metro';
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setBasicSalary = useCallback((v: number) => setState({ basic: v }), [setState]);
  const setDaPercent = useCallback((v: number) => setState({ da: v }), [setState]);
  const setHraReceived = useCallback((v: number) => setState({ hra: v }), [setState]);
  const setRentPaid = useCallback((v: number) => setState({ rent: v }), [setState]);
  const setCity = useCallback((v: 'metro' | 'non-metro') => setState({ city: v }), [setState]);

  const result = useMemo(() => calculateHRA({
    basicSalary,
    daPercent,
    hraReceived,
    rentPaid,
    city
  }), [basicSalary, daPercent, hraReceived, rentPaid, city]);

  const mult = isAnnual ? 12 : 1;

  return (
    <>
      <SharedResultBanner hasParams={hasParams} toolName="HRA Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <ToolWorkspace
        layout="split"
        input={
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
                <Home className="w-3.5 h-3.5" /> Salary & Rent Details
              </h3>
              <span className="text-xs font-bold text-text-muted uppercase bg-bg px-2 py-1 rounded-md">Monthly Values</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="basic-salary" className="text-xs font-bold text-text-3 block">Basic Salary (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-muted">₹</span>
                  <input
                    id="basic-salary"
                    type="number"
                    value={basicSalary || ''}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full bg-bg border border-border rounded-2xl py-3.5 pl-10 pr-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label htmlFor="da-percent" className="text-xs font-bold text-text-3 block">Dearness Allowance (DA)</label>
                  <span className="text-xs font-bold text-text-muted">{daPercent}%</span>
                </div>
                <input
                  id="da-percent"
                  type="range"
                  min={0}
                  max={100}
                  value={daPercent}
                  onChange={(e) => setDaPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue"
                />
                <p className="text-xs text-text-muted font-medium">DA is typically for Govt employees. Keep 0 if NA.</p>
              </div>

              <div className="space-y-3">
                <label htmlFor="hra-received" className="text-xs font-bold text-text-3 block">HRA Received from Employer</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-muted">₹</span>
                  <input
                    id="hra-received"
                    type="number"
                    value={hraReceived || ''}
                    onChange={(e) => setHraReceived(Number(e.target.value))}
                    className="w-full bg-bg border border-border rounded-2xl py-3.5 pl-10 pr-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="rent-paid" className="text-xs font-bold text-text-3 block">Actual Rent Paid (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-muted">₹</span>
                  <input
                    id="rent-paid"
                    type="number"
                    value={rentPaid || ''}
                    onChange={(e) => setRentPaid(Number(e.target.value))}
                    className="w-full bg-bg border border-border rounded-2xl py-3.5 pl-10 pr-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/50">
                <label id="city-type-label" className="text-xs font-bold text-text-3 block">City Type</label>
                <div role="group" aria-labelledby="city-type-label" className="flex bg-bg border border-border rounded-2xl p-1">
                  <button
                    onClick={() => setCity('metro')}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                      city === 'metro' ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-muted hover:text-text"
                    )}
                  >
                    Metro (50%)
                    <span className="block text-tiny font-medium text-text-muted mt-0.5">Delhi, Mumbai, Chennai, Kolkata</span>
                  </button>
                  <button
                    onClick={() => setCity('non-metro')}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                      city === 'non-metro' ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-muted hover:text-text"
                    )}
                  >
                    Non-Metro (40%)
                    <span className="block text-tiny font-medium text-text-muted mt-0.5">All other cities</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        output={
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-muted">Calculation Results</h3>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="text-xs font-bold uppercase tracking-widest text-blue hover:underline"
              >
                Show {isAnnual ? 'Monthly' : 'Annually'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard 
                label="Exempt HRA (Tax Free)" 
                value={formatCurrency(result.exemption * mult)} 
                className="bg-success/10 border-success/30 text-success" 
              />
              <MetricCard 
                label="Taxable HRA" 
                value={formatCurrency(result.taxable * mult)} 
                className="bg-error/5 border-error/20 text-error" 
              />
            </div>

            <div className="flex justify-end">
              <ShareButton
                url={shareUrl}
                title={`HRA Exempt: ${formatCurrency(result.exemption * 12)} annually — KaruviLab`}
                onQrClick={() => setIsQrOpen(true)}
              />
            </div>

            <div className="pt-4 border-t border-border/50 space-y-6">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted flex items-center gap-2">
                <Info className="w-3 h-3" /> The 3 Conditions (Sec 10(13A))
              </h4>
              
              <p className="text-xs font-medium text-text-3">
                The HRA exemption is the <strong className="text-text">minimum</strong> of the following three amounts:
              </p>

              <div className="space-y-3">
                {[
                  { label: '1. Actual HRA Received', val: result.method1, min: result.exemption === result.method1 },
                  { label: `2. ${city === 'metro' ? '50%' : '40%'} of (Basic + DA)`, val: result.method2, min: result.exemption === result.method2 },
                  { label: '3. Rent Paid - 10% of (Basic + DA)', val: result.method3, min: result.exemption === result.method3 },
                ].map((m, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-2xl border transition-colors flex items-center justify-between gap-4",
                    m.min ? "bg-blue/5 border-blue/30 shadow-sm" : "bg-bg border-border opacity-70"
                  )}>
                    <span className={cn("text-xs font-bold", m.min ? "text-blue" : "text-text-3")}>{m.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-text">{formatCurrency(m.val * mult)}</span>
                      {m.min && <CheckCircle2 className="w-4 h-4 text-blue shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
              
              {result.exemption === 0 && (
                <p className="text-xs font-bold text-warn bg-warn/10 p-4 rounded-xl border border-warn/20 mt-4">
                  Since you pay less rent than 10% of your Basic+DA salary, you cannot claim any HRA exemption. The entire HRA received is taxable.
                </p>
              )}
            </div>
          </div>
        }
      />
    </>
  );
}