"use client";

import React, { useState, useEffect } from "react";
import { Save, FolderOpen, Trash2, CircleCheckBig as CheckCircle2 } from "lucide-react";
import { useEmiStore } from "@/src/store/useEmiStore";
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
      <div className="flex flex-col md:flex-row gap-4 items-end bg-surface border border-border p-6 rounded-2xl">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-4">Scenario Name</label>
          <input
            type="text"
            placeholder="e.g., My Dream Home"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:border-blue outline-none text-sm font-bold"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!newName.trim() || saveStatus !== 'idle'}
          className="px-8 py-3.5 bg-blue text-white rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-md shadow-blue/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {saveStatus === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saveStatus === 'saving' ? "Saving..." : saveStatus === 'done' ? "Saved" : "Save Scenario"}
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <button 
          onClick={() => setShowSaved(!showSaved)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-blue" />
            <span className="text-sm font-black uppercase tracking-widest">My Saved Scenarios ({savedScenarios.length})</span>
          </div>
          <span className="text-xs text-text-4 font-bold uppercase">{showSaved ? "Hide" : "Show"}</span>
        </button>

        {showSaved && (
          <div className="border-t border-border divide-y divide-border/50 max-h-80 overflow-y-auto">
            {savedScenarios.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-sm font-bold text-text-4">No saved scenarios yet.</p>
                <p className="text-[10px] uppercase tracking-widest text-text-4">Your loan data stays in your browser.</p>
              </div>
            ) : (
              savedScenarios.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between group hover:bg-bg/40 transition-colors">
                  <dl className="space-y-1">
                    <dt className="text-sm font-black text-text">{s.name}</dt>
                    <dd className="text-[10px] font-bold text-text-4 uppercase tracking-tighter">
                      {formatCurrency(s.config.loanAmount)} @ {s.config.interestRate}% for {s.config.tenureMonths}mo
                    </dd>
                  </dl>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadScenario(s.id)}
                      className="px-4 py-2 bg-bg border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-text-3 hover:border-blue hover:text-blue transition-all"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteScenario(s.id)}
                      className="p-2 text-text-4 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
