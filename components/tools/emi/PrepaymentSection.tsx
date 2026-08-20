"use client";

import React, { useState } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { formatCurrency } from "@/src/lib/utils";
import { EmiResult } from "@/src/lib/emi-calculations";
import { Zap, Copy, Check, TrendingDown, Clock, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface PrepaymentSectionProps {
  result?: EmiResult | null;
}

export function PrepaymentSection({ result }: PrepaymentSectionProps) {
  const inputs = useEmiStore(state => state.inputs);
  const setInputs = useEmiStore(state => state.setInputs);
  const showPrepayment = useEmiStore(state => state.showPrepayment);
  const toggleSection = useEmiStore(state => state.toggleSection);
  const [copied, setCopied] = useState(false);
  const [showMilestones, setShowMilestones] = useState(true);
  const { toast } = useToast();

  const savings = result?.savings;
  const extraAmount = inputs.recurringPrepayment?.amount || 0;
  const baseEmi = result?.monthlyEmi || 0;
  const totalMonthlyOutflow = baseEmi + extraAmount;
  const originalMonths = inputs.tenureMonths || 0;
  const effectiveMonths = result?.effectiveTenure || originalMonths;

  // Calculate Year-by-Year outstanding balance milestones
  const yearlyMilestones = React.useMemo(() => {
    if (!result?.schedule || result.schedule.length === 0) return [];
    const milestones: Array<{ label: string; balance: number; month: number }> = [];
    
    // Group by years (month 12, 24, 36...)
    for (let yr = 1; yr <= Math.ceil(effectiveMonths / 12); yr++) {
      const targetMonth = yr * 12;
      const entry = result.schedule.find(e => e.month === Math.min(targetMonth, effectiveMonths));
      if (entry) {
        milestones.push({
          label: `Year ${yr}`,
          balance: entry.balance,
          month: entry.month,
        });
      }
    }

    // Final month payoff
    const lastEntry = result.schedule[result.schedule.length - 1];
    if (lastEntry && (milestones.length === 0 || milestones[milestones.length - 1]?.month !== lastEntry.month)) {
      milestones.push({
        label: `Month ${lastEntry.month} (Payoff)`,
        balance: 0,
        month: lastEntry.month,
      });
    }

    return milestones;
  }, [result?.schedule, effectiveMonths]);

  // Format years & months helper
  const formatDuration = (months: number) => {
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs === 0) return `${mos} months`;
    if (mos === 0) return `${yrs} years`;
    return `${yrs} yr ${mos} mo`;
  };

  const handleCopyReport = () => {
    if (!result) return;
    const timeSavedStr = savings ? formatDuration(savings.months) : '0 months';
    const newDurationStr = formatDuration(effectiveMonths);
    const originalDurationStr = formatDuration(originalMonths);

    let text = `📊 Loan Prepayment & Early Payoff Report\n`;
    text += `==========================================\n\n`;
    text += `• Loan Amount: ${formatCurrency(inputs.loanAmount)}\n`;
    text += `• Interest Rate: ${inputs.interestRate}% p.a.\n`;
    text += `• Original Tenure: ${originalDurationStr} (${originalMonths} months)\n`;
    text += `• Normal Monthly EMI: ${formatCurrency(baseEmi)}\n`;
    text += `• Extra Monthly Prepayment: ${formatCurrency(extraAmount)}\n`;
    text += `• Total Monthly Outflow: ${formatCurrency(totalMonthlyOutflow)}\n\n`;

    text += `--- Comparison Summary ---\n`;
    text += `• Without Extra Payment:\n`;
    text += `  - Monthly EMI: ${formatCurrency(baseEmi)}\n`;
    text += `  - Duration: ${originalDurationStr}\n`;
    text += `  - Total Repayment: ${formatCurrency(inputs.loanAmount + (result.totalInterest + (savings?.interest || 0)))}\n`;
    text += `  - Total Interest: ${formatCurrency(result.totalInterest + (savings?.interest || 0))}\n\n`;

    text += `• With ${formatCurrency(extraAmount)} Extra Every Month:\n`;
    text += `  - Total Monthly Payment: ${formatCurrency(totalMonthlyOutflow)}\n`;
    text += `  - Loan Finishes In: ${newDurationStr} (${effectiveMonths} months)\n`;
    text += `  - Total Repayment: ${formatCurrency(result.totalPayment)}\n`;
    text += `  - Total Interest: ${formatCurrency(result.totalInterest)}\n`;
    text += `  - ⭐ Interest Saved: ${formatCurrency(savings?.interest || 0)}\n`;
    text += `  - ⏳ Time Saved: ${timeSavedStr} (${savings?.months || 0} months)\n\n`;

    if (yearlyMilestones.length > 0) {
      text += `--- Year-by-Year Outstanding Balance ---\n`;
      yearlyMilestones.forEach(m => {
        text += `• ${m.label}: ${formatCurrency(m.balance)}\n`;
      });
      text += `\n`;
    }

    text += `Generated via KaruviLab (Offline & Private Browser Tool)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast("Payoff report copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Checkbox
          id="enable-prepayment"
          label="Prepayment & Early Foreclosure Simulator"
          checked={showPrepayment}
          onChange={() => toggleSection('prepayment')}
        />
        {showPrepayment && savings && (savings.interest > 0 || savings.months > 0) && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Saves {formatCurrency(savings.interest)} & {formatDuration(savings.months)}</span>
          </div>
        )}
      </div>

      {showPrepayment && (
        <div className="space-y-6 pt-4 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ToolInput
              label="Recurring Extra Monthly Payment"
              type="number"
              value={String(inputs.recurringPrepayment?.amount || 0)}
              onChange={(val) => setInputs({ 
                recurringPrepayment: { 
                  amount: Number(val), 
                  startMonth: inputs.recurringPrepayment?.startMonth || 1 
                } 
              })}
              description="Additional monthly amount applied directly toward principal"
            />
            <ToolInput
              label="Start Prepayments from Month"
              type="number"
              value={String(inputs.recurringPrepayment?.startMonth || 1)}
              onChange={(val) => setInputs({ 
                recurringPrepayment: { 
                  amount: inputs.recurringPrepayment?.amount || 0, 
                  startMonth: Math.max(1, Number(val)) 
                } 
              })}
              description="Month number to begin extra contributions (default: Month 1)"
            />
          </div>

          {/* Comparative Impact Cards */}
          {savings && (savings.interest > 0 || savings.months > 0) && (
            <div className="space-y-4 bg-surface-2/40 border border-border/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Early Payoff Impact Analysis</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-blue text-xs font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
                  title="Copy full comparison report"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Report"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                {/* Without Prepayment */}
                <div className="p-3.5 bg-surface rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between text-text-muted border-b border-border/60 pb-2">
                    <span className="font-bold uppercase text-[10px]">Standard Loan</span>
                    <span className="font-mono">{formatDuration(originalMonths)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Monthly EMI:</span>
                    <strong className="text-text font-mono">{formatCurrency(baseEmi)}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Total Interest:</span>
                    <strong className="text-text font-mono">
                      {formatCurrency(result?.totalInterest ? result.totalInterest + savings.interest : 0)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Total Payment:</span>
                    <strong className="text-text font-mono">
                      {formatCurrency(inputs.loanAmount + (result?.totalInterest ? result.totalInterest + savings.interest : 0))}
                    </strong>
                  </div>
                </div>

                {/* With Extra Prepayment */}
                <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 border-b border-emerald-500/20 pb-2">
                    <span className="font-bold uppercase text-[10px]">With Extra {formatCurrency(extraAmount)}/mo</span>
                    <span className="font-mono font-bold">{formatDuration(effectiveMonths)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Total Monthly:</span>
                    <strong className="text-text font-mono">{formatCurrency(totalMonthlyOutflow)}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Interest Saved:</span>
                    <strong className="text-emerald-400 font-mono font-bold">-{formatCurrency(savings.interest)}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Time Saved:</span>
                    <strong className="text-emerald-400 font-mono font-bold">-{formatDuration(savings.months)} ({savings.months} mo)</strong>
                  </div>
                </div>
              </div>

              {/* Year-by-Year Milestones Accordion */}
              {yearlyMilestones.length > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMilestones(!showMilestones)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-text-muted hover:text-text transition-colors py-1 cursor-pointer"
                  >
                    <span>Year-by-Year Outstanding Balance with Prepayment</span>
                    {showMilestones ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showMilestones && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                      {yearlyMilestones.map((m, idx) => (
                        <div key={idx} className="p-2.5 bg-surface border border-border/80 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-text-muted block">{m.label}</span>
                          <strong className="text-xs font-bold text-text font-mono block">
                            {m.balance > 0 ? formatCurrency(m.balance) : "₹0 (Closed)"}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="p-3.5 bg-surface-2/30 border border-border rounded-xl">
            <p className="text-xs text-text-muted leading-relaxed">
              💡 <strong>How it works:</strong> For monthly-reducing home and personal loans, interest is calculated solely on the outstanding principal. Paying an extra amount directly chips away at the principal earlier, which stops future compounding interest and rapidly shortens your repayment timeline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
