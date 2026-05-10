"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";

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
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="disc-price" className="text-sm font-bold text-text-2">
            Original Price (₹)
          </label>
          <input
            id="disc-price"
            type="number"
            min={0}
            placeholder="Enter original price"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-lg font-bold"
          />
        </div>
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

      <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-text-3">
          Save <strong className="text-blue">₹{fmt(forward.savings)}</strong> on ₹{fmt(parseFloat(originalPrice) || 0)}
        </span>
        <CopyButton text={summary} label="Copy Summary" />
      </div>

      {/* Reverse Calculator */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-base font-bold text-text-2">Reverse: What % off to reach target price?</h2>
        <div className="space-y-2">
          <label htmlFor="disc-target" className="text-sm font-bold text-text-2">
            Target Price (₹)
          </label>
          <input
            id="disc-target"
            type="number"
            min={0}
            placeholder="Enter target price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
          />
        </div>
        <div className="p-4 bg-bg rounded-xl border border-border flex items-center justify-between">
          <span className="text-sm text-text-3">Required discount</span>
          <span className="text-2xl font-black text-blue">
            {reverse.pctOff > 0
              ? fmt(reverse.pctOff) + "% off"
              : "—"}
          </span>
        </div>
        {reverse.pctOff > 0 && (
          <p className="text-sm text-text-3">
            To reach ₹{fmt(parseFloat(targetPrice) || 0)} from ₹{fmt(parseFloat(originalPrice) || 0)}, you need a{" "}
            <strong className="text-blue">{fmt(reverse.pctOff)}% discount</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
