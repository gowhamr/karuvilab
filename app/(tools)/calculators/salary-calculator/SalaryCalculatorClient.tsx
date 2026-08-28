"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { useUrlState } from "@/src/hooks/useUrlState";
import { cn } from "@/src/lib/utils";
import {
  RotateCcw,
  AlertCircle,
  IndianRupee,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  calculateSalary,
  formatCurrency,
  formatNumber,
  TaxRegime,
} from "@/src/features/calculators/salary";

export default function SalaryCalculatorClient() {
  const { state, setState, hasParams } = useUrlState({
    defaults: {
      gross: "1200000",
      regime: "new",
      basic: "40",
      d80c: "0",
      d80d: "0",
      hraExempt: "0",
      // Legacy alias
      ctc: "1200000",
    },
    debounceMs: 350,
  });

  const grossVal = parseFloat((state.gross as string) || (state.ctc as string) || "1200000") || 1200000;
  const regime: TaxRegime = state.regime === "old" ? "old" : "new";
  const basicPercent = parseFloat((state.basic as string) || "40") || 40;
  const ded80c = parseFloat((state.d80c as string) || "0") || 0;
  const ded80d = parseFloat((state.d80d as string) || "0") || 0;
  const hraExempt = parseFloat((state.hraExempt as string) || "0") || 0;

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const setGross = useCallback(
    (g: number) => setState({ gross: String(g), ctc: String(g) }),
    [setState]
  );
  const setRegime = useCallback(
    (r: TaxRegime) => setState({ regime: r }),
    [setState]
  );
  const setBasicPercent = useCallback(
    (b: number) => setState({ basic: String(b) }),
    [setState]
  );
  const setDed80c = useCallback(
    (v: number) => setState({ d80c: String(v) }),
    [setState]
  );
  const setDed80d = useCallback(
    (v: number) => setState({ d80d: String(v) }),
    [setState]
  );
  const setHraExempt = useCallback(
    (v: number) => setState({ hraExempt: String(v) }),
    [setState]
  );

  const resetAll = () => {
    setState({
      gross: "1200000",
      regime: "new",
      basic: "40",
      d80c: "0",
      d80d: "0",
      hraExempt: "0",
      ctc: "1200000",
    });
  };

  // Pure deterministic calculation response
  const salaryResponse = useMemo(() => {
    return calculateSalary({
      ctc: grossVal,
      regime,
      basicSalaryPercent: basicPercent,
      customDeductions80C: ded80c,
      customDeductions80D: ded80d,
      customHraExemption: hraExempt,
    });
  }, [grossVal, regime, basicPercent, ded80c, ded80d, hraExempt]);

  // Construct canonical share URL
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?gross=${grossVal}&regime=${regime}${
        basicPercent !== 40 ? `&basic=${basicPercent}` : ""
      }${ded80c > 0 ? `&d80c=${ded80c}` : ""}${
        ded80d > 0 ? `&d80d=${ded80d}` : ""
      }${hraExempt > 0 ? `&hraExempt=${hraExempt}` : ""}`
    : `?gross=${grossVal}&regime=${regime}`;

  const summary = salaryResponse.success
    ? `Indian Salary Breakdown (${salaryResponse.data.regime === "new" ? "New Tax Regime FY 2024-25" : "Old Tax Regime"})\n-----------------------------------------\nAnnual CTC: ${formatCurrency(salaryResponse.data.ctc)}\n\nBasic Salary: ${salaryResponse.data.formattedBasicSalary}\nHouse Rent Allowance (HRA): ${salaryResponse.data.formattedHra}\nSpecial Allowance: ${salaryResponse.data.formattedSpecialAllowance}\nGross Salary: ${salaryResponse.data.formattedGrossSalary}\n\nStatutory & Tax Deductions:\n• EPF (Employee 12%): ${salaryResponse.data.formattedPfEmployee}\n• EPF (Employer 12% in CTC): ${salaryResponse.data.formattedPfEmployer}\n• Professional Tax: ${salaryResponse.data.formattedProfessionalTax}\n• Standard Deduction: ${formatCurrency(salaryResponse.data.deductions.standardDeduction)}\n• Taxable Income: ${salaryResponse.data.formattedTaxableIncome}\n• Income Tax (TDS + Cess): ${salaryResponse.data.formattedTotalTax}\n• Total Deductions: ${salaryResponse.data.formattedTotalDeductions}\n\nNet In-Hand Take-Home Pay:\n• Monthly In-Hand: ${salaryResponse.data.formattedMonthlyTakeHome}\n• Annual In-Hand: ${salaryResponse.data.formattedAnnualTakeHome}\n\nGenerated via KaruviLab (Offline & Private)`
    : "";

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Salary / Take-Home Pay Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        tabs={{
          options: [
            { id: "new", label: "New Regime (Budget 2024)" },
            { id: "old", label: "Old Regime (With Exemptions)" },
          ],
          activeId: regime,
          onChange: (id) => setRegime(id as TaxRegime),
        }}
        input={
          <form
            data-tool="salary-calculator"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 min-w-0 w-full"
          >
            <div data-input-field="gross-salary">
              <SliderField
                id="salary-gross"
                label={`Annual CTC / Gross Package (${formatCurrency(grossVal)})`}
                min={100000}
                max={20000000}
                step={25000}
                value={grossVal}
                onChange={setGross}
                format={(v) => formatCurrency(v)}
              />
            </div>

            <div className="space-y-2" data-input-field="tax-regime">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Tax Regime Selection
              </label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Tax Regime">
                <button
                  type="button"
                  onClick={() => setRegime("new")}
                  aria-pressed={regime === "new"}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                    regime === "new"
                      ? "bg-blue text-white border-blue shadow-sm shadow-blue/20"
                      : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                  )}
                >
                  New Regime (₹75k Std Ded)
                </button>
                <button
                  type="button"
                  onClick={() => setRegime("old")}
                  aria-pressed={regime === "old"}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer",
                    regime === "old"
                      ? "bg-blue text-white border-blue shadow-sm shadow-blue/20"
                      : "bg-surface-2 border-border text-text-muted hover:text-text hover:border-blue/30"
                  )}
                >
                  Old Regime (80C / HRA)
                </button>
              </div>
            </div>

            <div data-input-field="basic-percentage">
              <SliderField
                id="salary-basic-percent"
                label="Basic Salary Percentage of CTC"
                min={20}
                max={70}
                step={5}
                value={basicPercent}
                onChange={setBasicPercent}
                format={(v) => `${v}%`}
              />
            </div>

            {/* Advanced Deductions Panel (Essential for Old Regime or Custom Structures) */}
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full py-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-blue" />
                  <span>{regime === "old" ? "Tax Deductions & Exemptions" : "Custom Allowances & Deductions"}</span>
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="space-y-4 pt-3 mt-1 animate-in fade-in duration-200">
                  {regime === "old" && (
                    <>
                      <div data-input-field="deductions-80c">
                        <SliderField
                          id="salary-80c"
                          label="Section 80C Deductions (ELSS, PPF, LIC)"
                          min={0}
                          max={150000}
                          step={5000}
                          value={ded80c}
                          onChange={setDed80c}
                          format={(v) => formatCurrency(v)}
                        />
                      </div>

                      <div data-input-field="deductions-80d">
                        <SliderField
                          id="salary-80d"
                          label="Section 80D Health Insurance"
                          min={0}
                          max={100000}
                          step={5000}
                          value={ded80d}
                          onChange={setDed80d}
                          format={(v) => formatCurrency(v)}
                        />
                      </div>

                      <div data-input-field="hra-exemption">
                        <SliderField
                          id="salary-hra-exempt"
                          label="Section 10(13A) HRA Exemption"
                          min={0}
                          max={Math.round(grossVal * 0.4)}
                          step={10000}
                          value={hraExempt}
                          onChange={setHraExempt}
                          format={(v) => formatCurrency(v)}
                        />
                      </div>
                    </>
                  )}

                  {regime === "new" && (
                    <div className="p-3 bg-surface-2 rounded-xl text-xs text-text-muted leading-relaxed">
                      💡 Under the <strong>New Tax Regime</strong> (FY 2024-25), deductions like Section 80C, 80D, and HRA exemption are omitted in favor of simplified tax slabs and an enhanced standard deduction of <strong>₹75,000</strong>.
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        }
        output={
          salaryResponse.success ? (
            <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
              {/* Machine-readable outputs for automation / agents */}
              <div className="sr-only" aria-hidden="true">
                <output data-result-field="monthly-take-home">{salaryResponse.data.monthlyTakeHome}</output>
                <output data-result-field="annual-take-home">{salaryResponse.data.annualTakeHome}</output>
                <output data-result-field="gross-salary">{salaryResponse.data.grossSalary}</output>
                <output data-result-field="total-deductions">{salaryResponse.data.deductions.totalPaycheckDeductions}</output>
                <output data-result-field="income-tax">{salaryResponse.data.deductions.totalIncomeTax}</output>
                <output data-result-field="pf-employee">{salaryResponse.data.deductions.employeePf}</output>
                <output data-result-field="pf-employer">{salaryResponse.data.deductions.employerPf}</output>
                <output data-result-field="professional-tax">{salaryResponse.data.deductions.professionalTax}</output>
                <output data-result-field="taxable-income">{salaryResponse.data.deductions.taxableIncome}</output>
              </div>

              {/* Actions Header Row */}
              <div className="flex items-center justify-between gap-3 min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-text truncate">
                  Paycheck Summary ({salaryResponse.data.regime === "new" ? "New Regime" : "Old Regime"})
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="flex items-center justify-center gap-1.5 bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer whitespace-nowrap"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Reset</span>
                  </button>
                  <ShareButton
                    url={shareUrl}
                    title={`Indian Salary: In-Hand ${salaryResponse.data.formattedMonthlyTakeHome}/mo from ${formatCurrency(grossVal)} CTC — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>

              {/* Main Metric Card */}
              <div className="w-full min-w-0">
                <MetricCard
                  label="Net In-Hand Take-Home / Month"
                  value={salaryResponse.data.formattedMonthlyTakeHome}
                  accent
                  className="bg-primary/5 border-primary/20 shadow-sm w-full min-w-0"
                  valueClassName="text-2xl sm:text-4xl text-blue leading-tight font-bold font-mono"
                  sub={`Annual Take-Home: ${salaryResponse.data.formattedAnnualTakeHome} (${formatNumber((salaryResponse.data.annualTakeHome / (salaryResponse.data.ctc || 1)) * 100)}% of CTC)`}
                  dataResultField="monthly-take-home"
                />
              </div>

              {/* Grid of Supporting Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                <MetricCard
                  label="Annual Take-Home"
                  value={salaryResponse.data.formattedAnnualTakeHome}
                  sub={`From ${formatCurrency(salaryResponse.data.ctc)} total CTC`}
                  dataResultField="annual-take-home"
                />
                <MetricCard
                  label="Gross Pay / Year"
                  value={salaryResponse.data.formattedGrossSalary}
                  sub={`Excludes ${salaryResponse.data.formattedPfEmployer} employer PF`}
                  dataResultField="gross-salary"
                />
                <MetricCard
                  label="Total Annual Deductions"
                  value={salaryResponse.data.formattedTotalDeductions}
                  sub={`PF + PT + Income Tax`}
                  className="bg-red-500/5 border-red-500/20"
                  valueClassName="text-red-600 dark:text-red-400 font-bold"
                  dataResultField="total-deductions"
                />
                <MetricCard
                  label="Total Income Tax (TDS)"
                  value={salaryResponse.data.formattedTotalTax}
                  sub={`Effective Tax Rate: ${salaryResponse.data.effectiveTaxRate}%`}
                  className={salaryResponse.data.deductions.totalIncomeTax === 0 ? "bg-emerald-500/5 border-emerald-500/20" : ""}
                  valueClassName={salaryResponse.data.deductions.totalIncomeTax === 0 ? "text-emerald-500 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}
                  dataResultField="income-tax"
                />
              </div>

              {/* Detailed Component Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
                {/* Salary Components */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border bg-surface-2/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Salary Components (Earnings)
                    </h4>
                  </div>
                  <div className="divide-y divide-border/60">
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">Basic Salary ({basicPercent}% of CTC)</span>
                      <span className="font-mono font-medium text-text">{salaryResponse.data.formattedBasicSalary}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-medium text-text">{salaryResponse.data.formattedHra}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">Special / Other Allowances</span>
                      <span className="font-mono font-medium text-text">{salaryResponse.data.formattedSpecialAllowance}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs bg-blue/5 font-semibold">
                      <span className="text-blue">Gross Earnings (Monthly: {formatCurrency(salaryResponse.data.monthlyGrossSalary)})</span>
                      <span className="font-mono text-blue">{salaryResponse.data.formattedGrossSalary}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border bg-surface-2/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Paycheck Deductions (From Gross)
                    </h4>
                  </div>
                  <div className="divide-y divide-border/60">
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">Employee EPF (12% of Basic)</span>
                      <span className="font-mono font-medium text-red-600 dark:text-red-400">{salaryResponse.data.formattedPfEmployee}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">Employer EPF (Paid into EPFO)</span>
                      <span className="font-mono font-medium text-text-muted">{salaryResponse.data.formattedPfEmployer}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">Professional Tax (PT)</span>
                      <span className="font-mono font-medium text-red-600 dark:text-red-400">{salaryResponse.data.formattedProfessionalTax}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs">
                      <span className="text-text-muted">Income Tax (TDS with 4% Cess)</span>
                      <span className="font-mono font-medium text-red-600 dark:text-red-400">{salaryResponse.data.formattedTotalTax}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-xs bg-red-500/5 font-semibold">
                      <span className="text-red-600 dark:text-red-400">Total Deductions (Monthly: {formatCurrency(salaryResponse.data.monthlyTotalDeductions)})</span>
                      <span className="font-mono text-red-600 dark:text-red-400">{salaryResponse.data.formattedTotalDeductions}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Slab Breakdown Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Income Tax Slab Calculation
                  </h4>
                  <span className="text-xs font-medium text-text-muted font-mono">
                    Taxable Income: {salaryResponse.data.formattedTaxableIncome} (after {formatCurrency(salaryResponse.data.deductions.standardDeduction)} Std Ded)
                  </span>
                </div>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto w-full max-w-full min-w-0">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <tr>
                          <th className="px-4 py-3">Income Slab</th>
                          <th className="px-4 py-3 text-center">Tax Rate</th>
                          <th className="px-4 py-3 text-right">Taxable Sliced Amount</th>
                          <th className="px-4 py-3 text-right">Calculated Tax</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-border/60">
                        {salaryResponse.data.slabs.map((s) => (
                          <tr key={s.range} className="hover:bg-surface-2/30 transition-colors">
                            <td className="px-4 py-2.5 font-bold text-text">{s.range}</td>
                            <td className="px-4 py-2.5 text-center font-mono text-text-muted">{s.rate}</td>
                            <td className="px-4 py-2.5 text-right font-mono text-text-muted">{formatCurrency(s.taxableAmount)}</td>
                            <td className="px-4 py-2.5 text-right font-mono font-bold text-text">{formatCurrency(s.tax)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Summary Copy Banner */}
              <div className="bg-surface-2/40 border border-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-text">
                    In-Hand Pay: {salaryResponse.data.formattedMonthlyTakeHome} / month ({salaryResponse.data.formattedAnnualTakeHome} / year)
                  </p>
                  <p className="text-[11px] text-text-muted font-mono truncate">
                    {salaryResponse.data.formula}
                  </p>
                </div>
                <CopyButton text={summary} label="Copy Breakdown" className="bg-surface border border-border" />
              </div>
            </div>
          ) : (
            <div
              role="alert"
              aria-live="assertive"
              data-error-code={salaryResponse.error.code}
              data-error-message={salaryResponse.error.message}
              className="p-5 sm:p-6 rounded-2xl bg-error/5 border border-error/20 space-y-4 text-text min-w-0 w-full animate-in fade-in duration-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400">
                    Calculation Error
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {salaryResponse.error.message}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-error/10 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 border border-border text-text hover:text-blue transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
