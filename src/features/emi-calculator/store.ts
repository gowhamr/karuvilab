import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/src/store/idb-storage';
import { EmiInputs, AffordabilityInputs } from '@/src/lib/emi-calculations';

export interface SavedScenario {
  id: string;
  name: string;
  config: EmiInputs & { affordability?: AffordabilityInputs };
  timestamp: number;
}

interface EmiState {
  inputs: EmiInputs;
  affordability: AffordabilityInputs;
  
  // UI States
  showPrepayment: boolean;
  showAffordability: boolean;
  showMoratorium: boolean;
  showFloatingRate: boolean;
  
  // Comparison
  comparisonList: SavedScenario[];
  
  // Saved Scenarios from DB
  savedScenarios: SavedScenario[];
  
  // Actions
  setInputs: (updates: Partial<EmiInputs>) => void;
  setAffordability: (updates: Partial<AffordabilityInputs>) => void;
  toggleSection: (section: 'prepayment' | 'affordability' | 'moratorium' | 'floatingRate') => void;
  
  // Persistence Actions
  saveScenario: (name: string) => Promise<void>;
  loadScenario: (id: string) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
  fetchSavedScenarios: () => Promise<void>;
  
  // Comparison Actions
  addToComparison: () => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
}

const DEFAULT_INPUTS: EmiInputs = {
  loanAmount: 5000000,
  interestRate: 8.5,
  tenureMonths: 240,
  prepayments: [],
  floatingRateDelta: 0
};

const DEFAULT_AFFORDABILITY: AffordabilityInputs = {
  monthlyIncome: 150000,
  existingEmis: 0,
  monthlyExpenses: 40000
};

export const useEmiStore = create<EmiState>()(
  persist(
    (set, get) => ({
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
    const scenario: SavedScenario = {
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
    const current: SavedScenario = {
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
    }),
    {
      name: 'kv-emi-calculator',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ savedScenarios: state.savedScenarios })
    }
  )
);
