import { create } from 'zustand';
export const useDataCalcStore = create((set) => ({
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
