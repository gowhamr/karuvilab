"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { SliderField } from "@/components/ui/SliderField";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { Settings2 } from "lucide-react";

const inr = (n: number, d = 0) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const RetirementCalculatorClient = memo(function RetirementCalculatorClient() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [expenses, setExpenses] = useState(50000);
  const [expectancy, setExpectancy] = useState(85);
  
  const [inflation, setInflation] = useState(6);
  const [postRetireReturn, setPostRetireReturn] = useState(8);

  const result = useMemo(() => {
    const yearsToRetire = Math.max(0, retireAge - age);
    const retirementYears = Math.max(0, expectancy - retireAge);
    
    // Monthly expenses at the time of retirement (inflated)
    const inflatedExpenses = expenses * Math.pow(1 + inflation / 100, yearsToRetire);
    
    // Real rate of return post retirement
    const realRate = ((1 + postRetireReturn / 100) / (1 + inflation / 100) - 1);
    
    // Corpus required using Present Value of Annuity formula
    // Corpus = Expenses * (1 - (1+r)^-n) / r
    let corpus = 0;
    if (realRate !== 0) {
      corpus = (inflatedExpenses * 12) * (1 - Math.pow(1 + realRate, -retirementYears)) / realRate;
    } else {
      corpus = (inflatedExpenses * 12) * retirementYears;
    }

    return { yearsToRetire, retirementYears, inflatedExpenses, corpus };
  }, [age, retireAge, expenses, expectancy, inflation, postRetireReturn]);

  const summary = `Retirement Planner Results\n----------------------\nCurrent Age: ${age} | Retirement Age: ${retireAge}\nMonthly Expenses: ${inr(expenses)}\nInflation: ${inflation}% | Post-Retire Return: ${postRetireReturn}%\n\nExpenses at Retirement: ${inr(result.inflatedExpenses)} / month\nEstimated Corpus Needed: ${inr(result.corpus)}\n\nGenerated via KaruviLab`;

  return (
    <ToolWorkspace
      input={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderField
              label="Current Age"
              id="ret-age"
              min={18}
              max={retireAge - 1}
              step={1}
              value={age}
              onChange={setAge}
              format={(v) => v + " yr"}
            />
            <SliderField
              label="Retirement Age"
              id="ret-retire-age"
              min={age + 1}
              max={80}
              step={1}
              value={retireAge}
              onChange={setRetireAge}
              format={(v) => v + " yr"}
            />
          </div>
          
          <SliderField
            label="Current Monthly Expenses"
            id="ret-expenses"
            min={10000}
            max={500000}
            step={5000}
            value={expenses}
            onChange={setExpenses}
            format={(v) => inr(v)}
          />

          <SliderField
            label="Life Expectancy"
            id="ret-expectancy"
            min={retireAge + 1}
            max={100}
            step={1}
            value={expectancy}
            onChange={setExpectancy}
            format={(v) => v + " yr"}
          />
        </div>
      }
      optionsPanel={
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-blue">
            <Settings2 className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-wider">Assumptions</span>
          </div>
          <SliderField
            label="Annual Inflation Rate (%)"
            id="ret-inflation"
            min={0}
            max={15}
            step={0.5}
            value={inflation}
            onChange={setInflation}
            format={(v) => v + "%"}
          />
          <SliderField
            label="Post-Retirement Return (%)"
            id="ret-return"
            min={1}
            max={15}
            step={0.5}
            value={postRetireReturn}
            onChange={setPostRetireReturn}
            format={(v) => v + "%"}
          />
        </div>
      }
      output={
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-bold text-text-2">Results</span>
            <CopyButton text={summary} label="Copy Summary" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <MetricCard 
              label="Required Retirement Corpus" 
              value={inr(result.corpus)} 
              accent 
              sub={`To last for ${result.retirementYears} years`}
            />
            <MetricCard 
              label="Monthly Expense at Retirement" 
              value={inr(result.inflatedExpenses)} 
              sub={`Adjusted for ${inflation}% inflation`}
            />
          </div>
        </div>
      }
      infoPanel={
        <div className="bg-blue/5 border border-blue/10 p-6 rounded-2xl">
          <h2 className="text-sm font-black uppercase tracking-widest text-blue mb-2">Planning Insight</h2>
          <p className="text-sm text-text-2 leading-relaxed">
            Due to inflation, your current expenses will significantly increase by the time you retire. 
...
            To maintain the same lifestyle, you need a corpus that can generate monthly income while also growing enough to offset inflation. 
            The calculated corpus assumes you will consume the principal entirely by the end of your life expectancy.
          </p>
        </div>
      }
    />
  );
});

export default RetirementCalculatorClient;

