"use client";

import { useState, useMemo, useEffect, useId } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { d, formatINR, syncStateToUrl, getInitialStateFromUrl } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { ToolInput } from "@/components/ui/ToolInput";
import { Info, HelpCircle, ArrowRightLeft, Percent, Calculator } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

const GST_RATES = [3, 5, 12, 18, 28];

const DEFAULT_STATE = {
  amount: 1000,
  gstRate: 18,
  mode: "add" as "add" | "remove",
  isInterstate: false,
};

export default function GSTCalculatorClient() {
  const rateLabelId = useId();
  const [isLoaded, setIsLoaded] = useState(false);
  const [amount, setAmount] = useState<number>(DEFAULT_STATE.amount);
  const [gstRate, setGstRate] = useState(DEFAULT_STATE.gstRate);
  const [mode, setMode] = useState<"add" | "remove">(DEFAULT_STATE.mode);
  const [isInterstate, setIsInterstate] = useState(DEFAULT_STATE.isInterstate);

  // Initialize from URL
  useEffect(() => {
    const state = getInitialStateFromUrl(DEFAULT_STATE);
    setAmount(Number(state.amount));
    setGstRate(Number(state.gstRate));
    setMode(state.mode as "add" | "remove");
    setIsInterstate((state as any).isInterstate === "true");
    setIsLoaded(true);
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!isLoaded) return;
    syncStateToUrl({ amount, gstRate, mode, isInterstate });
  }, [amount, gstRate, mode, isInterstate, isLoaded]);

  const result = useMemo(() => {
    const val = d(amount || 0);
    const rate = d(gstRate);
    if (mode === "add") {
      const gstAmt = val.mul(rate.div(100));
      return { 
        net: val.toNumber(), 
        gst: gstAmt.toNumber(), 
        total: val.add(gstAmt).toNumber() 
      };
    } else {
      const net = val.div(d(1).add(rate.div(100)));
      const gstAmt = val.sub(net);
      return { 
        net: net.toNumber(), 
        gst: gstAmt.toNumber(), 
        total: val.toNumber() 
      };
    }
  }, [amount, gstRate, mode]);

  const taxBreakdown = useMemo(() => {
    if (isInterstate) {
      return { igst: result.gst, cgst: 0, sgst: 0 };
    }
    return { igst: 0, cgst: result.gst / 2, sgst: result.gst / 2 };
  }, [result.gst, isInterstate]);

  const summary = `GST Calculation (${gstRate}% ${mode === "add" ? "added" : "extracted"})
----------------
Net Amount: ${formatINR(result.net, 2)}
GST (${gstRate}%): ${formatINR(result.gst, 2)}
${isInterstate ? `IGST: ${formatINR(taxBreakdown.igst, 2)}` : `CGST: ${formatINR(taxBreakdown.cgst, 2)}\nSGST: ${formatINR(taxBreakdown.sgst, 2)}`}
Total Amount: ${formatINR(result.total, 2)}

Generated via KaruviLab`;

  return (
    <ToolWorkspace
      layout="split"
      tabs={{
        options: [
          { id: "add", label: "Add GST" },
          { id: "remove", label: "Remove GST" }
        ],
        activeId: mode,
        onChange: (id) => setMode(id as "add" | "remove")
      }}
      input={
        <div className="space-y-6">
          <ToolInput
            label="Amount (Base or Inclusive)"
            type="number"
            placeholder="e.g. 1000"
            value={amount === 0 ? "" : amount.toString()}
            onChange={(val) => setAmount(Number(val))}
          />

          <div className="space-y-3" role="group" aria-labelledby={rateLabelId}>
            <div className="flex items-center justify-between">
              <label id={rateLabelId} className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-muted">GST Rate Slab</label>
              <span className="text-xs font-bold text-blue bg-blue/5 px-2 py-0.5 rounded-full">{gstRate}% Selected</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {GST_RATES.map((r) => (
                <button
                  key={r}
                  onClick={() => setGstRate(r)}
                  aria-pressed={gstRate === r}
                  className={`py-3 rounded-2xl text-xs font-black transition-all ${
                    gstRate === r
                      ? "bg-blue text-white shadow-md shadow-blue/10"
                      : "bg-bg border border-border text-text-3 hover:border-blue/50 hover:text-blue"
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      optionsPanel={
        <div className="p-4 bg-bg border border-border rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center">
              <ArrowRightLeft size={14} className="text-blue" />
            </div>
            <div>
              <p className="text-tiny font-bold uppercase tracking-widest-sm">Interstate Sale</p>
              <p className="text-tiny font-bold text-text-muted uppercase tracking-tighter">Use IGST instead of CGST/SGST</p>
            </div>
          </div>
          <button 
            onClick={() => setIsInterstate(!isInterstate)}
            aria-label="Toggle Interstate Sale"
            aria-pressed={isInterstate}
            className={`w-12 h-6 rounded-full transition-all relative ${isInterstate ? 'bg-blue' : 'bg-border'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isInterstate ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      }
      output={
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <MetricCard 
              label="Net Amount" 
              value={formatINR(result.net, 2)} 
              sub="Excl. Tax"
            />
            <MetricCard 
              label="Gross Amount" 
              value={formatINR(result.total, 2)} 
              sub="Incl. Tax"
            />
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <MetricCard 
                label={`Total GST (${gstRate}%)`} 
                value={formatINR(result.gst, 2)} 
                sub="Total tax amount"
                accent
              />
            </div>
          </div>

          <div className="bg-bg/50 border border-border rounded-3xl overflow-hidden mt-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-3">Tax Breakdown</h2>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">INR</span>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              <dl className="space-y-4">
                {!isInterstate ? (
                  <>
                    <div className="flex justify-between items-center pb-4 border-b border-border/50">
                      <div>
                        <dt className="text-tiny font-bold uppercase tracking-widest-sm text-text-2">CGST</dt>
                        <dd className="text-tiny font-bold text-text-muted uppercase tracking-tighter">Central Tax ({gstRate/2}%)</dd>
                      </div>
                      <dd className="font-mono text-lg font-black text-text">{formatINR(taxBreakdown.cgst, 2)}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <dt className="text-tiny font-bold uppercase tracking-widest-sm text-text-2">SGST</dt>
                        <dd className="text-tiny font-bold text-text-muted uppercase tracking-tighter">State Tax ({gstRate/2}%)</dd>
                      </div>
                      <dd className="font-mono text-lg font-black text-text">{formatINR(taxBreakdown.sgst, 2)}</dd>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <div>
                      <dt className="text-tiny font-bold uppercase tracking-widest-sm text-text-2">IGST</dt>
                      <dd className="text-tiny font-bold text-text-muted uppercase tracking-tighter">Integrated Tax ({gstRate}%)</dd>
                    </div>
                    <dd className="font-mono text-2xl font-black text-blue">{formatINR(taxBreakdown.igst, 2)}</dd>
                  </div>
                )}
              </dl>

              <div className="bg-bg/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue">
                  <Info size={14} />
                  <span className="text-tiny font-bold uppercase tracking-widest-sm-sm">Calculation Details</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium leading-relaxed text-text-3 italic">
                    {mode === "add" 
                      ? `GST is added: ${formatINR(result.net)} × (${gstRate}/100) = ${formatINR(result.gst)}` 
                      : `GST is extracted: ${formatINR(result.total)} - (${formatINR(result.total)} / (1 + ${gstRate}/100)) = ${formatINR(result.gst)}`
                    }
                  </p>
                  <div className="h-px bg-border/50" />
                  <p className="text-xs font-medium leading-relaxed text-text-3">
                    The total amount is split based on {isInterstate ? "Integrated GST (Interstate)" : "Central and State GST (Intrastate)"} rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      infoPanel={
        <CalculatorActionBar
          summary={summary}
          toolId="gst-calculator"
          historyLabel={`${formatINR(amount)} @ ${gstRate}% (${mode})`}
          historyData={{ amount, gstRate, mode, isInterstate, result }}
        />
      }
    />
  );
}
