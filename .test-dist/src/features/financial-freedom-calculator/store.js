import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/src/store/idb-storage';
import { DEFAULT_INPUTS } from './constants';
import { calculateFIRE } from './utils';
export const useFinancialFreedomStore = create()(persist((set, get) => ({
    inputs: DEFAULT_INPUTS,
    results: calculateFIRE(DEFAULT_INPUTS),
    scenarios: [],
    isAdvancedOpen: false,
    isComparisonMode: false,
    setInputs: (newInputs) => {
        set((state) => {
            const updatedInputs = { ...state.inputs, ...newInputs };
            return {
                inputs: updatedInputs,
                results: calculateFIRE(updatedInputs),
            };
        });
    },
    resetInputs: () => {
        set({ inputs: DEFAULT_INPUTS, results: calculateFIRE(DEFAULT_INPUTS) });
    },
    toggleAdvanced: () => {
        set((state) => ({ isAdvancedOpen: !state.isAdvancedOpen }));
    },
    toggleComparisonMode: () => {
        set((state) => ({ isComparisonMode: !state.isComparisonMode }));
    },
    saveScenario: (name) => {
        set((state) => {
            if (state.scenarios.length >= 3)
                return state; // Max 3 scenarios
            const newScenario = {
                id: Date.now().toString(),
                name,
                inputs: { ...state.inputs },
                results: { ...state.results },
                dateSaved: new Date().toISOString(),
            };
            return { scenarios: [...state.scenarios, newScenario] };
        });
    },
    deleteScenario: (id) => {
        set((state) => ({
            scenarios: state.scenarios.filter((s) => s.id !== id),
        }));
    },
    loadScenario: (id) => {
        set((state) => {
            const scenario = state.scenarios.find((s) => s.id === id);
            if (scenario) {
                return {
                    inputs: { ...scenario.inputs },
                    results: { ...scenario.results },
                };
            }
            return state;
        });
    },
}), {
    version: 1,
    name: 'kv-financial-freedom',
    storage: createJSONStorage(() => idbStorage),
    partialize: (state) => ({
        inputs: state.inputs,
        isAdvancedOpen: state.isAdvancedOpen,
        scenarios: state.scenarios
    }),
}));
