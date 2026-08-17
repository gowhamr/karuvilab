import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/src/store/idb-storage';
const DEFAULT_INPUTS = {
    loanAmount: 5000000,
    interestRate: 8.5,
    tenureMonths: 240,
    prepayments: [],
    floatingRateDelta: 0
};
const DEFAULT_AFFORDABILITY = {
    monthlyIncome: 150000,
    existingEmis: 0,
    monthlyExpenses: 40000
};
export const useEmiStore = create()(persist((set, get) => ({
    inputs: DEFAULT_INPUTS,
    affordability: DEFAULT_AFFORDABILITY,
    showPrepayment: false,
    showAffordability: false,
    showMoratorium: false,
    showFloatingRate: false,
    comparisonList: [],
    savedScenarios: [],
    setInputs: (updates) => set((state) => ({
        inputs: { ...state.inputs, ...updates }
    })),
    setAffordability: (updates) => set((state) => ({
        affordability: { ...state.affordability, ...updates }
    })),
    toggleSection: (section) => set((state) => {
        switch (section) {
            case 'prepayment': return { showPrepayment: !state.showPrepayment };
            case 'affordability': return { showAffordability: !state.showAffordability };
            case 'moratorium': return { showMoratorium: !state.showMoratorium };
            case 'floatingRate': return { showFloatingRate: !state.showFloatingRate };
            default: return {};
        }
    }),
    saveScenario: async (name) => {
        const id = Math.random().toString(36).substring(7);
        const scenario = {
            id,
            name,
            config: { ...get().inputs, affordability: get().affordability },
            timestamp: Date.now()
        };
        set((state) => ({ savedScenarios: [...state.savedScenarios, scenario].sort((a, b) => b.timestamp - a.timestamp) }));
    },
    loadScenario: async (id) => {
        const scenario = get().savedScenarios.find(s => s.id === id);
        if (scenario) {
            const { affordability, ...inputs } = scenario.config;
            set({
                inputs,
                affordability: affordability || DEFAULT_AFFORDABILITY
            });
        }
    },
    deleteScenario: async (id) => {
        set((state) => ({ savedScenarios: state.savedScenarios.filter(s => s.id !== id) }));
    },
    fetchSavedScenarios: async () => {
        // Handled automatically by Zustand persist
    },
    addToComparison: () => {
        const current = {
            id: `comp-${Math.random().toString(36).substring(7)}`,
            name: `Scenario ${get().comparisonList.length + 1}`,
            config: { ...get().inputs, affordability: get().affordability },
            timestamp: Date.now()
        };
        set((state) => ({
            comparisonList: [...state.comparisonList, current].slice(-4)
        }));
    },
    removeFromComparison: (id) => set((state) => ({
        comparisonList: state.comparisonList.filter(item => item.id !== id)
    })),
    clearComparison: () => set({ comparisonList: [] })
}), {
    name: 'kv-emi-calculator',
    version: 1,
    storage: createJSONStorage(() => idbStorage),
    partialize: (state) => ({ savedScenarios: state.savedScenarios })
}));
