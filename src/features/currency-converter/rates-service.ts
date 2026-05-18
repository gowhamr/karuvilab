import { 
  RatesData, 
  RatesApiResponse, 
  FrankfurterApiResponse, 
  RatesSource 
} from './types';
import { saveCurrencyRates, getCurrencyRates } from '@/src/lib/db';

const PRIMARY_API_URL = 'https://open.er-api.com/v6/latest/';
const FALLBACK_API_URL = 'https://api.frankfurter.dev/v1/latest?from=';

const FRESH_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_STALE_DURATION = 72 * 60 * 60 * 1000; // 72 hours
const REQUEST_TIMEOUT = 8000; // 8 seconds

// Registry to deduplicate in-flight requests
const inFlightRequests = new Map<string, Promise<RatesData>>();

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

async function fetchFromPrimary(base: string): Promise<RatesData> {
  const response = await fetchWithTimeout(`${PRIMARY_API_URL}${base}`);
  if (!response.ok) throw new Error(`Primary API failed with status ${response.status}`);
  
  const json: any = await response.json();
  
  if (json.result === 'error') {
    throw new Error(`Primary API returned error: ${json['error-type']}`);
  }
  
  if (!json.rates || typeof json.rates !== 'object') {
    throw new Error('Malformed rates payload from primary API');
  }

  const now = Date.now();
  return {
    base,
    rates: json.rates,
    timestamp: now,
    source: 'primary',
    expiresAt: now + FRESH_DURATION,
  };
}

async function fetchFromFallback(base: string): Promise<RatesData> {
  const response = await fetchWithTimeout(`${FALLBACK_API_URL}${base}`);
  if (!response.ok) throw new Error(`Fallback API failed with status ${response.status}`);
  
  const json: FrankfurterApiResponse = await response.json();
  
  if (!json.rates || typeof json.rates !== 'object') {
    throw new Error('Malformed rates payload from fallback API');
  }

  const now = Date.now();
  return {
    base,
    rates: json.rates,
    timestamp: now,
    source: 'fallback',
    expiresAt: now + FRESH_DURATION,
  };
}

export async function getLiveRates(
  base: string, 
  forceRefresh = false,
  onBackgroundUpdate?: (data: RatesData) => void
): Promise<RatesData> {
  // 1. Check cache first unless forceRefresh
  if (!forceRefresh) {
    try {
      const cached = await getCurrencyRates(base);
      if (cached) {
        const now = Date.now();
        const isFresh = now < cached.expiresAt;
        const isTooStale = now - cached.timestamp > MAX_STALE_DURATION;

        if (isFresh) {
          return { ...cached, source: 'cache' } as RatesData;
        }

        // If stale but not too stale, return cached data and trigger refresh in background
        if (!isTooStale) {
          refreshRatesInBackground(base, onBackgroundUpdate);
          return { ...cached, source: 'cache' } as RatesData;
        }
      }
    } catch (err) {
      console.warn('Cache read failed:', err);
    }
  }

  // 2. Handle in-flight deduplication
  if (inFlightRequests.has(base)) {
    return inFlightRequests.get(base)!;
  }

  // 3. Fetch fresh data
  const fetchPromise = (async () => {
    try {
      let data: RatesData;
      try {
        data = await fetchFromPrimary(base);
      } catch (primaryErr) {
        console.warn('Primary currency API failed, trying fallback...', primaryErr);
        data = await fetchFromFallback(base);
      }
      
      try {
        await saveCurrencyRates(data);
      } catch (cacheErr) {
        console.warn('Cache write failed:', cacheErr);
      }
      
      return data;
    } finally {
      inFlightRequests.delete(base);
    }
  })();

  inFlightRequests.set(base, fetchPromise);
  return fetchPromise;
}

async function refreshRatesInBackground(
  base: string, 
  onBackgroundUpdate?: (data: RatesData) => void
) {
  try {
    const data = await getLiveRates(base, true);
    if (onBackgroundUpdate) {
      onBackgroundUpdate(data);
    }
  } catch (err) {
    console.warn('Background rates refresh failed', err);
  }
}

