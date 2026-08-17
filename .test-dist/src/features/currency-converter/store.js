import { create } from 'zustand';
import { getLiveRates } from './rates-service';
const DEFAULT_RATES = {
    USD: 1, EUR: 0.92, GBP: 0.79, INR: 84.5, JPY: 149.5,
    AUD: 1.54, CAD: 1.36, CHF: 0.89, SGD: 1.34, AED: 3.67, CNY: 7.24,
};
export const useCurrencyStore = create((set, get) => ({
    base: 'USD',
    ratesData: null,
    isLoading: false,
    error: null,
    amount: '100',
    from: 'USD',
    to: 'INR',
    fetchRates: async (force = false) => {
        const { from, isLoading } = get();
        if (isLoading && !force)
            return;
        set({ isLoading: true, error: null });
        try {
            const data = await getLiveRates(from, force, (updatedData) => {
                // Handle background update
                const current = get();
                if (current.from === updatedData.base) {
                    set({ ratesData: updatedData });
                }
            });
            set({ ratesData: data, isLoading: false });
        }
        catch (err) {
            console.error('Failed to fetch currency rates:', err);
            const debugInfo = err.debugInfo || {
                attempts: [{ source: 'network', success: false, error: err.message }],
                lastFetchTime: Date.now()
            };
            set({
                error: err.message || 'Failed to load live rates. Using cached or estimated data.',
                isLoading: false
            });
            // Fallback if no data at all
            if (!get().ratesData) {
                set({
                    ratesData: {
                        base: 'USD',
                        rates: DEFAULT_RATES,
                        timestamp: Date.now(),
                        source: 'cache',
                        expiresAt: Date.now() - 1, // Expired
                        debugInfo
                    }
                });
            }
            else {
                // Update existing data with new debug info if it failed to refresh
                set((state) => ({
                    ratesData: state.ratesData ? { ...state.ratesData, debugInfo } : null
                }));
            }
        }
    },
    setAmount: (amount) => set({ amount }),
    setFrom: (from) => {
        set({ from });
        get().fetchRates();
    },
    setTo: (to) => set({ to }),
    swapCurrencies: () => {
        const { from, to } = get();
        set({ from: to, to: from });
        get().fetchRates();
    },
}));
