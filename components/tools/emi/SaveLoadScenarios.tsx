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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-blue/5 border border-blue/10 p-5 rounded-2xl sm:rounded-3xl">
        <div className="space-y-1">
          <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-blue">Save this Calculation</h4>
          <p className="text-xs font-bold text-text-4">Persist this scenario to your local browser storage.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g., My Dream Home"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-2 bg-surface border border-border rounded-xl focus:border-blue outline-none text-xs font-bold"
          />
          <button
            onClick={handleSave}
            disabled={!newName.trim() || saveStatus !== 'idle'}
            className="px-6 py-2.5 bg-blue text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm flex items-center justify-center gap-2 shadow-lg shadow-blue/20 hover:scale-102 active:scale-95 transition-all disabled:opacity-50"
           aria-label="Check Circle2">
            {saveStatus === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saveStatus === 'saving' ? "Saving..." : saveStatus === 'done' ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {savedScenarios.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <button 
            onClick={() => setShowSaved(!showSaved)}
            className="w-full px-5 py-3 flex items-center justify-between hover:bg-bg/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-4 h-4 text-blue" />
              <span className="text-tiny font-bold uppercase tracking-widest-sm">My Saved Scenarios ({savedScenarios.length})</span>
            </div>
            <span className="text-tiny text-text-4 font-bold uppercase">{showSaved ? "Hide" : "Show"}</span>
          </button>

          {showSaved && (
            <div className="border-t border-border divide-y divide-border/50 max-h-60 overflow-y-auto">
              {savedScenarios.map((s) => (
                <div key={s.id} className="p-3.5 flex items-center justify-between group hover:bg-bg/40 transition-colors">
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-black text-text truncate">{s.name}</p>
                    <p className="text-tiny font-bold text-text-4 uppercase tracking-tighter">
                      {formatCurrency(s.config.loanAmount)} @ {s.config.interestRate}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => loadScenario(s.id)}
                      className="px-3 py-1.5 bg-bg border border-border rounded-lg text-tiny font-black uppercase tracking-widest text-text-3 hover:border-blue hover:text-blue transition-all"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteScenario(s.id)}
                      className="p-1.5 text-text-4 hover:text-red-500 transition-colors"
                      title="Delete"
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
