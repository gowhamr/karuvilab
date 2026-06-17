import { create } from 'zustand';

export interface ConversionHistory {
  id: string;
  value: number;
  fromUnit: string;
  toUnit: string;
  result: number;
  timestamp: number;
}

export interface DataCalcState {
  // Conversion State
  fromUnit: string;
  toUnit: string;
  history: ConversionHistory[];
  
  // Storage Cost State
  costPerGB: number;
  provider: string;
  durationMonths: number;
  
  // Bandwidth State
  bandwidthUnit: string;
  overhead: number;
  
  // Checksum State
  checksumAlgo: string;
  checksumResult: string | null;
  checksumProgress: number;
  isHashing: boolean;
  
  // Actions
  setFromUnit: (unit: string) => void;
  setToUnit: (unit: string) => void;
  addToHistory: (entry: Omit<ConversionHistory, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  setCostPerGB: (cost: number, provider?: string) => void;
  setDurationMonths: (months: number) => void;
  
  setBandwidthUnit: (unit: string) => void;
  setOverhead: (percent: number) => void;
  
  setChecksumAlgo: (algo: string) => void;
  setChecksumResult: (res: string | null) => void;
  setChecksumProgress: (progress: number) => void;
  setIsHashing: (isHashing: boolean) => void;
}

export const useDataCalcStore = create<DataCalcState>((set) => ({
  fromUnit: 'MB',
  toUnit: 'GB',
  history: [],
  
  costPerGB: 0.023, // AWS S3 Standard approx
  provider: 'aws-s3',
  durationMonths: 1,
  
  bandwidthUnit: 'Mbps',
  overhead: 5,
  
  checksumAlgo: 'SHA-256',
  checksumResult: null,
  checksumProgress: 0,
  isHashing: false,
  
  setFromUnit: (fromUnit) => set({ fromUnit }),
  setToUnit: (toUnit) => set({ toUnit }),
  addToHistory: (entry) => set((state) => ({
    history: [
      { ...entry, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
      ...state.history
    ].slice(0, 10) // Keep last 10
  })),
  clearHistory: () => set({ history: [] }),
  
  setCostPerGB: (costPerGB, provider = 'custom') => set({ costPerGB, provider }),
  setDurationMonths: (durationMonths) => set({ durationMonths }),
  
  setBandwidthUnit: (bandwidthUnit) => set({ bandwidthUnit }),
  setOverhead: (overhead) => set({ overhead }),
  
  setChecksumAlgo: (checksumAlgo) => set({ checksumAlgo, checksumResult: null }),
  setChecksumResult: (checksumResult) => set({ checksumResult }),
  setChecksumProgress: (checksumProgress) => set({ checksumProgress }),
  setIsHashing: (isHashing) => set({ isHashing })
}));
