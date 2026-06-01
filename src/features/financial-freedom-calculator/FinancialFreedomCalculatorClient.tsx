"use client";

import { useState } from 'react';
import { useFinancialFreedomStore } from './store';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { ProjectionChart } from './components/ProjectionChart';
import { ComparisonView } from './components/ComparisonView';
import { Save, RefreshCw, Layers } from 'lucide-react';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { m, AnimatePresence } from 'framer-motion';

export default function FinancialFreedomCalculatorClient() {
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const resetInputs = useFinancialFreedomStore(state => state.resetInputs);
  const saveScenario = useFinancialFreedomStore(state => state.saveScenario);
  const isComparisonMode = useFinancialFreedomStore(state => state.isComparisonMode);
  const toggleComparisonMode = useFinancialFreedomStore(state => state.toggleComparisonMode);
  const scenariosCount = useFinancialFreedomStore(state => state.scenarios.length);

  const handleSaveScenario = () => {
    if (scenarioName.trim()) {
      saveScenario(scenarioName.trim());
      setScenarioName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4 lg:col-start-1 h-full">
        <InputPanel />
      </div>

      <div className="lg:col-span-8 lg:col-start-5 space-y-8">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
          <div className="flex gap-2">
            <button
              onClick={resetInputs}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-text-2 bg-surface border border-border hover:bg-surface-hover transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Defaults
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSaveDialog(!showSaveDialog)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue bg-blue/10 border border-blue/20 hover:bg-blue/20 transition-colors"
                disabled={scenariosCount >= 3}
              >
                <Save className="w-4 h-4" />
                {scenariosCount >= 3 ? 'Max Scenarios Reached' : 'Save Scenario'}
              </button>
              
              <AnimatePresence>
                {showSaveDialog && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-64 bg-surface border border-border shadow-xl rounded-xl p-4 z-10"
                  >
                    <label htmlFor="scenarioName" className="block text-xs font-bold uppercase tracking-wider text-text-2 mb-2">
                      Scenario Name
                    </label>
                    <input
                      id="scenarioName"
                      type="text"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="e.g., Aggressive Savings"
                      className="w-full bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-blue transition-colors mb-3"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveScenario();
                        if (e.key === 'Escape') setShowSaveDialog(false);
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setShowSaveDialog(false)}
                        className="px-3 py-1.5 text-xs font-bold text-text-3 hover:text-text-2 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveScenario}
                        disabled={!scenarioName.trim()}
                        className="px-3 py-1.5 text-xs font-bold bg-blue text-white rounded-lg disabled:opacity-50 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <button
            onClick={toggleComparisonMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isComparisonMode ? 'bg-blue text-white' : 'bg-surface border border-border text-text-2 hover:bg-surface-hover'}`}
          >
            <Layers className="w-4 h-4" />
            Compare ({scenariosCount})
          </button>
        </div>

        {isComparisonMode ? (
          <div className="bg-surface border border-border p-6 rounded-[32px] space-y-4">
            <h2 className="text-sm font-bold text-text-2 uppercase tracking-widest">Scenario Comparison</h2>
            <ComparisonView />
          </div>
        ) : (
          <>
            <ResultsPanel />
            <ProjectionChart />
          </>
        )}
      </div>
    </div>
  );
}
