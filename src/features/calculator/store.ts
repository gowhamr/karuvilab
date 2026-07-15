import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/src/store/idb-storage';
import { AngleUnit, evaluateExpression } from './engine/parser';

export type CalcMode = 'standard' | 'scientific';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isPinned: boolean;
}

interface CalculatorStore {
  // State
  expression: string;
  result: string;
  memory: string;
  angleUnit: AngleUnit;
  mode: CalcMode;
  history: HistoryItem[];
  error: string | null;
  historyOpen: boolean;

  // Actions
  append: (val: string) => void;
  deleteLast: () => void;
  clear: () => void;
  calculate: () => void;
  setMode: (mode: CalcMode) => void;
  setAngleUnit: (unit: AngleUnit) => void;
  setMemory: (action: 'M+' | 'M-' | 'MR' | 'MC') => void;
  toggleHistory: () => void;
  clearHistory: () => void;
  pinHistory: (id: string) => void;
  deleteHistory: (id: string) => void;
  loadHistory: (item: HistoryItem) => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      expression: '',
      result: '',
      memory: '0',
      angleUnit: 'deg',
      mode: 'standard',
      history: [],
      error: null,
      historyOpen: false,

      append: (val) => {
        set((state) => {
          // If previous action was a calculation (result exists but error doesn't)
          // and they type a number, start fresh. If they type an operator, append to result.
          let newExp = state.expression;
          if (state.result && state.expression.includes('=')) {
             if (/[0-9.]/.test(val)) {
                 newExp = val;
             } else {
                 newExp = state.result + val;
             }
          } else {
             newExp = state.expression + val;
          }
          
          return { 
            expression: newExp, 
            result: evaluateExpression(newExp, state.angleUnit),
            error: null 
          };
        });
      },

      deleteLast: () => {
        set((state) => {
          if (state.expression.includes('=')) return { expression: '', result: '', error: null };
          const newExp = state.expression.slice(0, -1);
          return { 
            expression: newExp,
            result: evaluateExpression(newExp, state.angleUnit),
            error: null 
          };
        });
      },

      clear: () => set({ expression: '', result: '', error: null }),

      calculate: () => {
        set((state) => {
          if (!state.expression || state.expression.includes('=')) return state;
          
          const result = evaluateExpression(state.expression, state.angleUnit);
          if (result === 'Error') {
            return { error: 'Invalid Expression', result: '' };
          }
          if (result) {
            const newItem: HistoryItem = {
              id: Date.now().toString(),
              expression: state.expression,
              result,
              timestamp: Date.now(),
              isPinned: false
            };
            return {
              expression: state.expression + '=',
              result,
              history: [newItem, ...state.history].slice(0, 100),
              error: null
            };
          }
          return state;
        });
      },

      setMode: (mode) => set({ mode }),
      setAngleUnit: (angleUnit) => set((state) => {
        const newResult = evaluateExpression(state.expression, angleUnit);
        return { angleUnit, result: newResult };
      }),

      setMemory: (action) => {
        set((state) => {
          const val = Number(state.result) || 0;
          const mem = Number(state.memory) || 0;
          switch (action) {
            case 'M+': return { memory: (mem + val).toString() };
            case 'M-': return { memory: (mem - val).toString() };
            case 'MR': 
               const newExp = state.expression + state.memory;
               return { expression: newExp, result: evaluateExpression(newExp, state.angleUnit) };
            case 'MC': return { memory: '0' };
          }
          return state;
        });
      },

      toggleHistory: () => set((state) => ({ historyOpen: !state.historyOpen })),
      clearHistory: () => set((state) => ({ history: state.history.filter(h => h.isPinned) })),
      pinHistory: (id) => set((state) => ({
        history: state.history.map(h => h.id === id ? { ...h, isPinned: !h.isPinned } : h)
      })),
      deleteHistory: (id) => set((state) => ({
        history: state.history.filter(h => h.id !== id)
      })),
      loadHistory: (item) => set({ expression: item.expression, result: item.result })

    }),
    {
      name: 'kv-calculator',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        history: state.history,
        memory: state.memory,
        angleUnit: state.angleUnit,
        mode: state.mode
      }) as any
    }
  )
);
