"use client";

import { useState, useMemo, useEffect, useId } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { d, formatINR, syncStateToUrl, getInitialStateFromUrl } from "@/src/lib/calculator-utils";
import { CalculatorActionBar } from "@/components/ui/CalculatorActionBar";
import { ToolInput } from "@/components/ui/ToolInput";
import { Info, HelpCircle, ArrowRightLeft, Percent, Calculator } from "lucide-react";

const GST_RATES = [3, 5, 12, 18, 28];

const DEFAULT_STATE = {
  amount: 1000,
  gstRate: 18,
  mode: "add" as "add" | "remove",
  isInterstate: false,
};

export default function GSTCalculatorClient() {
  const rateLabelId = useId();
  const modeLabelId = useId();
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
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <label id={rateLabelId} className="text-xs font-black uppercase tracking-[0.2em] text-text-4">GST Rate Slab</label>
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

          <div className="space-y-6">
            <div className="space-y-3" role="group" aria-labelledby={modeLabelId}>
              <label id={modeLabelId} className="text-xs font-black uppercase tracking-[0.2em] text-text-4">Calculation Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("add")}
                  className={`flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all ${
                    mode === "add"
                      ? "bg-blue/5 border-blue text-blue"
                      : "bg-bg border-border text-text-3 hover:border-blue/30"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">Add GST</span>
                  <span className="text-tiny font-bold opacity-60">Net + Tax</span>
                </button>
                <button
                  onClick={() => setMode("remove")}
                  className={`flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all ${
                    mode === "remove"
                      ? "bg-blue/5 border-blue text-blue"
                      : "bg-bg border-border text-text-3 hover:border-blue/30"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">Remove GST</span>
                  <span className="text-tiny font-bold opacity-60">Inclusive - Tax</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-bg border border-border rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center">
                  <ArrowRightLeft size={14} className="text-blue" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Interstate Sale</p>
                  <p className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Use IGST instead of CGST/SGST</p>
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
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Net Amount (Excl. Tax)" 
          value={formatINR(result.net, 2)} 
          sub="The amount before tax"
        />
        <MetricCard 
          label={`Total GST (${gstRate}%)`} 
          value={formatINR(result.gst, 2)} 
          sub="Total tax amount"
          accent
        />
        <MetricCard 
          label="Gross Amount (Incl. Tax)" 
          value={formatINR(result.total, 2)} 
          sub="The final billing amount"
        />
      </div>

      {/* Breakdown Card */}
      <div className="bg-surface border border-border rounded-4xl overflow-hidden">
        <div className="p-6 border-b border-border bg-bg/50 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-3">Tax Breakdown</h2>
          <span className="text-xs font-bold text-text-4 uppercase tracking-widest">Local Currency (INR)</span>
        </div>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <dl className="space-y-4">
            {!isInterstate ? (
              <>
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <div>
                    <dt className="text-xs font-black uppercase tracking-widest text-text-2">CGST</dt>
                    <dd className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Central Tax ({gstRate/2}%)</dd>
                  </div>
                  <dd className="font-mono text-lg font-black text-text">{formatINR(taxBreakdown.cgst, 2)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <dt className="text-xs font-black uppercase tracking-widest text-text-2">SGST</dt>
                    <dd className="text-tiny font-bold text-text-4 uppercase tracking-tighter">State Tax ({gstRate/2}%)</dd>
                  </div>
                  <dd className="font-mono text-lg font-black text-text">{formatINR(taxBreakdown.sgst, 2)}</dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center h-full">
                <div>
                  <dt className="text-xs font-black uppercase tracking-widest text-text-2">IGST</dt>
                  <dd className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Integrated Tax ({gstRate}%)</dd>
                </div>
                <dd className="font-mono text-2xl font-black text-blue">{formatINR(taxBreakdown.igst, 2)}</dd>
              </div>
            )}
          </dl>

          <div className="bg-bg/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue">
              <Info size={14} />
              <span className="text-xs font-black uppercase tracking-[0.1em]">Calculation Details</span>
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

      <CalculatorActionBar
        summary={summary}
        toolId="gst-calculator"
        historyLabel={`${formatINR(amount)} @ ${gstRate}% (${mode})`}
        historyData={{ amount, gstRate, mode, isInterstate, result }}
      />
    </div>
  );
}
