"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DiscountCalculatorClient() {
  const [originalPrice, setOriginalPrice] = useState<string>("1000");
  const [discountPct, setDiscountPct] = useState(20);
  const [targetPrice, setTargetPrice] = useState<string>("750");

  const forward = useMemo(() => {
    const price = parseFloat(originalPrice) || 0;
    const savings = price * (discountPct / 100);
    const finalPrice = price - savings;
    return { finalPrice, savings, effectivePct: discountPct };
  }, [originalPrice, discountPct]);

  const reverse = useMemo(() => {
    const price = parseFloat(originalPrice) || 0;
    const target = parseFloat(targetPrice) || 0;
    if (price <= 0 || target >= price) return { pctOff: 0 };
    const pctOff = ((price - target) / price) * 100;
    return { pctOff };
  }, [originalPrice, targetPrice]);

  const summary = `Discount Calculator\n--------------------\nOriginal Price: ₹${fmt(parseFloat(originalPrice) || 0)}\nDiscount: ${discountPct}%\n\nFinal Price: ₹${fmt(forward.finalPrice)}\nYou Save: ₹${fmt(forward.savings)}\nEffective Discount: ${fmt(forward.effectivePct)}%\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-8">
        <ToolInput
          label="Original Price (₹)"
          id="disc-price"
          type="number"
          placeholder="Enter original price"
          value={originalPrice}
          onChange={setOriginalPrice}
        />
        
        <SliderField
          label="Discount %"
          id="disc-pct"
          min={0}
          max={90}
          step={1}
          value={discountPct}
          onChange={setDiscountPct}
          format={(v) => v + "%"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Final Price" value={"₹" + fmt(forward.finalPrice)} accent />
        <MetricCard label="You Save" value={"₹" + fmt(forward.savings)} />
        <MetricCard label="Effective Discount" value={fmt(forward.effectivePct) + "%"} />
      </div>

      <div className="bg-surface border border-border p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <span className="text-sm text-text-3 font-medium">
          Save <strong className="text-blue">₹{fmt(forward.savings)}</strong> on ₹{fmt(parseFloat(originalPrice) || 0)}
        </span>
        <CopyButton text={summary} label="Copy Summary" className="bg-bg border border-border" />
      </div>

      {/* Reverse Calculator */}
      <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue">
            <span className="text-xl font-bold">↺</span>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-text">Reverse Calculator</h2>
            <p className="text-[10px] font-bold text-text-4 uppercase">Find % off to reach target</p>
          </div>
        </div>

        <ToolInput
          label="Target Price (₹)"
          id="disc-target"
          type="number"
          placeholder="Enter target price"
          value={targetPrice}
          onChange={setTargetPrice}
        />

        <div className="p-6 bg-bg rounded-2xl border border-border flex items-center justify-between shadow-inner">
          <span className="text-xs font-black uppercase tracking-widest text-text-4">Required discount</span>
          <span className="text-3xl font-black text-blue tabular-nums">
            {reverse.pctOff > 0
              ? fmt(reverse.pctOff) + "%"
              : "—"}
          </span>
        </div>
        
        {reverse.pctOff > 0 && (
          <p className="text-xs text-text-3 font-medium leading-relaxed">
            To reach ₹{fmt(parseFloat(targetPrice) || 0)} from ₹{fmt(parseFloat(originalPrice) || 0)}, you need a{" "}
            <strong className="text-blue">{fmt(reverse.pctOff)}% discount</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
