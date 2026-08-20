"use client";

import React, { useState, useEffect } from "react";
import { Save, FolderOpen, Trash2, CircleCheckBig as CheckCircle2 } from "lucide-react";
import { useEmiStore } from "@/src/features/emi-calculator/store";
import { formatCurrency } from "@/src/lib/utils";
import { useShallow } from "zustand/react/shallow";

export function SaveLoadScenarios() {
  const { 
    savedScenarios, 
    fetchSavedScenarios, 
    saveScenario, 
    loadScenario, 
    deleteScenario 
  } = useEmiStore(useShallow(state => ({
    savedScenarios: state.savedScenarios,
    fetchSavedScenarios: state.fetchSavedScenarios,
    saveScenario: state.saveScenario,
    loadScenario: state.loadScenario,
    deleteScenario: state.deleteScenario
  })));
  
  const [newName, setNewName] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  useEffect(() => {
    fetchSavedScenarios();
  }, [fetchSavedScenarios]);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaveStatus('saving');
    await saveScenario(newName);
    setSaveStatus('done');
    setNewName("");
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 bg-surface-2/40 border border-border/80 p-4 sm:p-5 rounded-2xl">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text">Save this Calculation</h4>
          <p className="text-xs text-text-muted">Persist this scenario locally for quick comparison.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g., Dream Home 20Y"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-surface border border-border rounded-xl focus:border-blue outline-none text-xs font-semibold text-text placeholder:text-text-muted"
          />
          <button
            onClick={handleSave}
            disabled={!newName.trim() || saveStatus !== 'idle'}
            className="px-5 py-2 bg-blue text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue/10 hover:bg-blue/90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            aria-label="Save Scenario"
          >
            {saveStatus === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saveStatus === 'saving' ? "Saving..." : saveStatus === 'done' ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {savedScenarios.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setShowSaved(!showSaved)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue" />
              <span className="text-xs font-bold uppercase tracking-wider text-text">My Saved Scenarios ({savedScenarios.length})</span>
            </div>
            <span className="text-xs text-text-muted font-semibold">{showSaved ? "Hide" : "Show"}</span>
          </button>

          {showSaved && (
            <div className="border-t border-border divide-y divide-border/60 max-h-60 overflow-y-auto">
              {savedScenarios.map((s) => (
                <div key={s.id} className="p-3.5 flex items-center justify-between group hover:bg-surface-2 transition-colors">
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-text truncate">{s.name}</p>
                    <p className="text-[11px] font-medium text-text-muted">
                      {formatCurrency(s.config.loanAmount)} @ {s.config.interestRate}% ({s.config.tenureMonths} Mo)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => loadScenario(s.id)}
                      className="px-3 py-1.5 bg-surface-2 border border-border rounded-lg text-xs font-bold uppercase tracking-wider text-text hover:border-blue hover:text-blue transition-all cursor-pointer"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteScenario(s.id)}
                      className="p-1.5 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Scenario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
