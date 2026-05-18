export type RatesSource = 'primary' | 'fallback' | 'cache';

export interface RatesData {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  source: RatesSource;
  expiresAt: number;
}

export interface RatesApiResponse {
  base_code: string;
  rates: Record<string, number>;
  time_last_update_unix: number;
  time_next_update_unix: number;
}

export interface FrankfurterApiResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CachedRatesEntry extends RatesData {
  // Same as RatesData for now
}

export interface FetchRatesResult {
  data: RatesData | null;
  error: string | null;
  fromCache: boolean;
}
