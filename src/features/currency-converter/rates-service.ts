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

async function fetchFromPrimary(base: string): Promise<{ data: RatesData; latency: number; url: string }> {
  const url = `${PRIMARY_API_URL}${base}`;
  const start = Date.now();
  const response = await fetchWithTimeout(url);
  const latency = Date.now() - start;

  if (!response.ok) throw { message: `Primary API failed with status ${response.status}`, status: response.status, url };
  
  const json: any = await response.json();
  
  if (json.result === 'error') {
    throw { message: `Primary API returned error: ${json['error-type']}`, url };
  }
  
  if (!json.rates || typeof json.rates !== 'object') {
    throw { message: 'Malformed rates payload from primary API', url };
  }

  const now = Date.now();
  return {
    data: {
      base,
      rates: json.rates,
      timestamp: now,
      source: 'primary',
      expiresAt: now + FRESH_DURATION,
    },
    latency,
    url
  };
}

async function fetchFromFallback(base: string): Promise<{ data: RatesData; latency: number; url: string }> {
  const url = `${FALLBACK_API_URL}${base}`;
  const start = Date.now();
  const response = await fetchWithTimeout(url);
  const latency = Date.now() - start;

  if (!response.ok) throw { message: `Fallback API failed with status ${response.status}`, status: response.status, url };
  
  const json: FrankfurterApiResponse = await response.json();
  
  if (!json.rates || typeof json.rates !== 'object') {
    throw { message: 'Malformed rates payload from fallback API', url };
  }

  const now = Date.now();
  return {
    data: {
      base,
      rates: json.rates,
      timestamp: now,
      source: 'fallback',
      expiresAt: now + FRESH_DURATION,
    },
    latency,
    url
  };
}

export async function getLiveRates(
  base: string, 
  forceRefresh = false,
  onBackgroundUpdate?: (data: RatesData) => void
): Promise<RatesData> {
  const debug: any = {
    attempts: [],
    lastFetchTime: Date.now()
  };

  // 1. Check cache first unless forceRefresh
  if (!forceRefresh) {
    try {
      const cached = await getCurrencyRates(base);
      if (cached) {
        const now = Date.now();
        const isFresh = now < cached.expiresAt;
        const isTooStale = now - cached.timestamp > MAX_STALE_DURATION;

        debug.attempts.push({ source: 'cache', success: true });

        if (isFresh) {
          return { ...cached, source: 'cache', debugInfo: debug } as RatesData;
        }

        // If stale but not too stale, return cached data and trigger refresh in background
        if (!isTooStale) {
          if (typeof navigator !== 'undefined' && navigator.onLine) {
            refreshRatesInBackground(base, onBackgroundUpdate);
          }
          return { ...cached, source: 'cache', debugInfo: debug } as RatesData;
        }
      }
    } catch (err: any) {
      console.warn('Cache read failed:', err);
      debug.attempts.push({ source: 'cache', success: false, error: err.message });
    }
  }

  // 2. Handle in-flight deduplication
  if (inFlightRequests.has(base)) {
    return inFlightRequests.get(base)!;
  }

  // 3. Fetch fresh data
  const fetchPromise = (async () => {
    try {
      let result: { data: RatesData; latency: number; url: string };
      try {
        result = await fetchFromPrimary(base);
        debug.attempts.push({ source: 'primary', success: true, latency: result.latency, url: result.url });
        debug.latency = result.latency;
      } catch (primaryErr: any) {
        console.warn('Primary currency API failed, trying fallback...', primaryErr);
        debug.attempts.push({ 
          source: 'primary', 
          success: false, 
          error: primaryErr.message, 
          status: primaryErr.status,
          url: primaryErr.url 
        });
        
        result = await fetchFromFallback(base);
        debug.attempts.push({ source: 'fallback', success: true, latency: result.latency, url: result.url });
        debug.latency = (debug.latency || 0) + result.latency;
      }
      
      const finalData = { ...result.data, debugInfo: debug };
      
      try {
        await saveCurrencyRates(finalData);
      } catch (cacheErr) {
        console.warn('Cache write failed:', cacheErr);
      }
      
      return finalData;
    } catch (finalErr: any) {
      debug.attempts.push({ 
        source: 'fallback', 
        success: false, 
        error: finalErr.message, 
        status: finalErr.status,
        url: finalErr.url 
      });
      // Rethrow with debug info attached if possible, or just let store handle it
      throw { ...finalErr, debugInfo: debug };
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

