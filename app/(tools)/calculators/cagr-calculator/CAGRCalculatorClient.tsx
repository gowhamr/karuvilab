"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const CAGRCalculatorClient = memo(function CAGRCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { initial: '10000', final: '25000', years: '5' },
    debounceMs: 400,
  });

  const initial = state.initial as string;
  const final = state.final as string;
  const years = state.years as string;
  const [isQrOpen, setIsQrOpen] = useState(false);

  const setInitial = useCallback((v: string) => setState({ initial: v }), [setState]);
  const setFinal = useCallback((v: string) => setState({ final: v }), [setState]);
  const setYears = useCallback((v: string) => setState({ years: v }), [setState]);

  const result = useMemo(() => {
    const i = parseFloat(initial) || 0;
    const f = parseFloat(final) || 0;
    const y = parseFloat(years) || 0;
    if (i <= 0 || f <= 0 || y <= 0) return { cagr: 0, absolute: 0 };
    
    const cagr = (Math.pow(f / i, 1 / y) - 1) * 100;
    const absolute = ((f - i) / i) * 100;
    
    return { cagr, absolute };
  }, [initial, final, years]);

  const summary = `CAGR Calculator Results\n----------------------\nInitial Value: ${inr(parseFloat(initial) || 0)}\nFinal Value: ${inr(parseFloat(final) || 0)}\nDuration: ${years} Years\n\nCAGR (Annualized): ${result.cagr.toFixed(2)}%\nAbsolute Return: ${result.absolute.toFixed(2)}%\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <SharedResultBanner hasParams={hasParams} toolName="CAGR Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      <ToolWorkspace
        layout="stacked"
        input={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolInput
              label="Initial Investment (BV)"
              type="number"
              value={initial}
              onChange={(v) => {
                const num = Number(v);
                if (num >= 0 && num <= 1000000000000) setInitial(v);
              }}
              placeholder="e.g. 10000"
            />
            <ToolInput
              label="Final Value (EV)"
              type="number"
              value={final}
              onChange={(v) => {
                const num = Number(v);
                if (num >= 0 && num <= 1000000000000) setFinal(v);
              }}
              placeholder="e.g. 25000"
            />
            <ToolInput
              label="Duration (Years)"
              type="number"
              value={years}
              onChange={(v) => {
                const num = Number(v);
                if (num >= 0 && num <= 1000) setYears(v);
              }}
              placeholder="e.g. 5"
            />
          </div>
        }
        output={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard label="CAGR (Annualized)" value={result.cagr.toFixed(2) + "%"} accent sub="Geometric mean growth" />
              <MetricCard label="Absolute Return" value={result.absolute.toFixed(2) + "%"} sub="Total percentage gain" />
            </div>

            <div className="flex justify-end gap-3">
              <CopyButton text={summary} label="Copy Summary" />
              <ShareButton
                url={shareUrl}
                title={`CAGR: ${result.cagr.toFixed(2)}% annualized return — KaruviLab`}
                onQrClick={() => setIsQrOpen(true)}
              />
            </div>
          </div>
        }
        infoPanel={
          <div className="bg-blue/5 border border-blue/10 p-6 rounded-2xl">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue mb-2">How it works</h2>
            <p className="text-sm text-text-2 leading-relaxed">
              Compound Annual Growth Rate (CAGR) is the best way to measure the performance of an investment over time. 
              Unlike simple absolute returns, CAGR accounts for the effect of compounding, giving you a normalized annual rate.
              <br /><br />
              <strong>Formula:</strong> [(Ending Value / Beginning Value) ^ (1 / Years)] - 1
            </p>
          </div>
        }
      />
    </div>
  );
});

export default CAGRCalculatorClient;
