import React, { useState } from 'react';
import { FireInputs } from '@/src/features/calculators/financial-freedom/models/assumptions';
import { workerOrchestrator } from '@/src/engine/workers/WorkerOrchestrator';
import { runHistoricalBacktest, HISTORICAL_CRISES, MonteCarloResults } from '@/src/features/calculators/financial-freedom/engine/monte-carlo-engine';
import { formatCurrency } from '@/src/lib/utils';
import { Activity, AlertTriangle, ShieldAlert, Zap, Loader2 } from 'lucide-react';

interface MonteCarloPanelProps {
  inputs: FireInputs;
  baselineTargetCorpus: number;
}

export function MonteCarloPanel({ inputs, baselineTargetCorpus }: MonteCarloPanelProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [mcResults, setMcResults] = useState<MonteCarloResults | null>(null);
  const [trials, setTrials] = useState(1000);
  
  const [selectedCrisis, setSelectedCrisis] = useState<keyof typeof HISTORICAL_CRISES | 'none'>('none');
  
  // Compute crisis instantly on main thread since it's just 1 deterministic projection run
  const crisisResult = selectedCrisis !== 'none' ? runHistoricalBacktest(inputs, selectedCrisis) : null;
  const isCrisisFailing = crisisResult && crisisResult.depletionAge !== null;

  const handleRunMonteCarlo = async () => {
    setIsSimulating(true);
    setMcResults(null);
    try {
      // Dispatch randomized return trials via Web Worker
      const result = await workerOrchestrator.dispatch<MonteCarloResults>(
        'calculateMonteCarloSimulation',
        [inputs, trials, 1.0],
        undefined,
        undefined,
        undefined,
        true,
        2,
        undefined,
        undefined,
        'normal'
      );
      setMcResults(result);
    } catch (e) {
      console.error('Monte Carlo Simulation failed:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <section className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary m-0">Risk & Monte Carlo Simulation</h2>
          <p className="text-sm text-text-muted mt-1">Stress test your FIRE portfolio against historical crashes and market volatility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sequence of Returns Risk Panel */}
        <div className="bg-surface-2 border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-text-primary">Historical Sequence Risk</h3>
          </div>
          <p className="text-sm text-text-muted">
            What if a severe market crash happens the exact year you retire? 
            Select a historical crisis to see if your portfolio survives.
          </p>

          <div className="relative">
            <select
              value={selectedCrisis}
              onChange={(e) => setSelectedCrisis(e.target.value as any)}
              className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="none">-- Select a Historical Crisis --</option>
              <option value="1929_Great_Depression">1929 Great Depression (-43% max drop)</option>
              <option value="1973_Oil_Shock">1973 Oil Shock & Stagflation</option>
              <option value="2000_Dot_Com">2000 Dot Com Bubble Crash</option>
              <option value="2008_GFC">2008 Global Financial Crisis</option>
              <option value="2020_COVID">2020 COVID-19 Flash Crash</option>
            </select>
          </div>

          {selectedCrisis !== 'none' && crisisResult && (
            <div className={`p-4 rounded-xl border ${isCrisisFailing ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} transition-all`}>
              <div className="flex items-start gap-3">
                <ShieldAlert className={`w-5 h-5 mt-0.5 ${isCrisisFailing ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <div>
                  <h4 className={`font-semibold ${isCrisisFailing ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isCrisisFailing ? 'Portfolio Depleted' : 'Portfolio Survived'}
                  </h4>
                  <p className="text-sm text-text-muted mt-1">
                    {isCrisisFailing 
                      ? `If this crisis hit the year you retired, your money would run out at age ${crisisResult.depletionAge}.`
                      : `Your portfolio successfully survived this crisis sequence up to age ${inputs.longevityAge ?? 85}. Terminal corpus: ${formatCurrency(Math.round(crisisResult.projectedCorpus))}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monte Carlo Simulation Panel */}
        <div className="bg-surface-2 border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-text-primary">Stochastic Volatility</h3>
            </div>
            <select
              value={trials}
              onChange={(e) => setTrials(parseInt(e.target.value, 10))}
              disabled={isSimulating}
              className="bg-surface border border-border rounded-lg px-2 py-1 text-xs text-text-muted focus:outline-none"
            >
              <option value="1000">1,000 Trials</option>
              <option value="5000">5,000 Trials</option>
              <option value="10000">10,000 Trials</option>
            </select>
          </div>
          
          <p className="text-sm text-text-muted">
            Run thousands of randomized return trajectories to calculate your exact probability of success and confident survival bands.
          </p>

          <button
            onClick={handleRunMonteCarlo}
            disabled={isSimulating}
            className="w-full relative group overflow-hidden bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Simulating {trials.toLocaleString()} paths...</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>Run Monte Carlo Simulation</span>
              </>
            )}
          </button>

          {mcResults && !isSimulating && (
            <div className="mt-4 space-y-4 animate-in fade-in duration-500">
              <div className="flex items-end justify-between border-b border-border/50 pb-3">
                <div>
                  <p className="text-sm text-text-muted">Probability of Success</p>
                  <p className="text-xs text-text-muted mt-0.5">({mcResults.totalTrials.toLocaleString()} iterations vs {formatCurrency(Math.round(baselineTargetCorpus))} goal)</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${mcResults.successRate >= 95 ? 'text-emerald-600 dark:text-emerald-400' : mcResults.successRate >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {mcResults.successRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Confidence Bands (Terminal Corpus)</p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">95% Confident (Worst 5%)</span>
                  <span className={mcResults.percentiles.p5 <= 0 ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-text-primary'}>
                    {mcResults.percentiles.p5 <= 0 ? 'Depleted' : formatCurrency(Math.round(mcResults.percentiles.p5))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">90% Confident (Worst 10%)</span>
                  <span className={mcResults.percentiles.p10 <= 0 ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-text-primary'}>
                    {mcResults.percentiles.p10 <= 0 ? 'Depleted' : formatCurrency(Math.round(mcResults.percentiles.p10))}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">50% Median (Average case)</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(Math.round(mcResults.percentiles.p50))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Best 10% (Bull Market)</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(Math.round(mcResults.percentiles.p90))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
