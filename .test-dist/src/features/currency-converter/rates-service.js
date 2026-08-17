import { saveCurrencyRates, getCurrencyRates } from '@/src/lib/db';
const PRIMARY_API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/';
const FALLBACK_V4_URL = 'https://api.exchangerate-api.com/v4/latest/';
const FALLBACK_FRANKFURTER_URL = 'https://api.frankfurter.dev/v1/latest?from=';
const FRESH_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_STALE_DURATION = 72 * 60 * 60 * 1000; // 72 hours
const REQUEST_TIMEOUT = 15000; // 15 seconds
// Registry to deduplicate in-flight requests
const inFlightRequests = new Map();
async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            cache: 'no-cache', // Ensure we get fresh rates
        });
        return response;
    }
    catch (err) {
        if (err.name === 'AbortError') {
            throw new Error(`Request timed out after ${REQUEST_TIMEOUT}ms`);
        }
        throw err;
    }
    finally {
        clearTimeout(id);
    }
}
async function fetchFromPrimary(base) {
    const baseLower = base.toLowerCase();
    const url = `${PRIMARY_API_URL}${baseLower}.json`;
    const start = Date.now();
    const response = await fetchWithTimeout(url);
    const latency = Date.now() - start;
    if (!response.ok)
        throw { message: `Primary CDN API failed (${response.status})`, status: response.status, url };
    const json = await response.json();
    const rawRates = json[baseLower];
    if (!rawRates || typeof rawRates !== 'object') {
        throw { message: 'Malformed rates payload', url };
    }
    // Normalize rates to uppercase keys for app consistency
    const rates = {};
    Object.entries(rawRates).forEach(([k, v]) => {
        rates[k.toUpperCase()] = v;
    });
    const now = Date.now();
    // jsDelivr CDN API usually returns "date": "YYYY-MM-DD"
    const timestamp = json.date ? new Date(json.date).getTime() : now;
    const expiresAt = now + FRESH_DURATION;
    return {
        data: {
            base: base.toUpperCase(),
            rates,
            timestamp,
            source: 'primary',
            expiresAt,
        },
        latency,
        url
    };
}
async function fetchFromFallbackV4(base) {
    const url = `${FALLBACK_V4_URL}${base}`;
    const start = Date.now();
    const response = await fetchWithTimeout(url);
    const latency = Date.now() - start;
    if (!response.ok)
        throw { message: `V4 Fallback failed (${response.status})`, status: response.status, url };
    const json = await response.json();
    if (!json.rates || typeof json.rates !== 'object') {
        throw { message: 'Malformed rates payload (V4)', url };
    }
    const now = Date.now();
    const timestamp = json.time_last_updated ? json.time_last_updated * 1000 : now;
    // V4 doesn't always have next_update, so fallback to 24h
    const expiresAt = now + FRESH_DURATION;
    return {
        data: {
            base,
            rates: json.rates,
            timestamp,
            source: 'fallback',
            expiresAt,
        },
        latency,
        url
    };
}
async function fetchFromFrankfurter(base) {
    const url = `${FALLBACK_FRANKFURTER_URL}${base}`;
    const start = Date.now();
    const response = await fetchWithTimeout(url);
    const latency = Date.now() - start;
    if (!response.ok)
        throw { message: `Frankfurter API failed (${response.status})`, status: response.status, url };
    const json = await response.json();
    if (!json.rates || typeof json.rates !== 'object') {
        throw { message: 'Malformed rates payload (Frankfurter)', url };
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
export async function getLiveRates(base, forceRefresh = false, onBackgroundUpdate) {
    const debug = {
        attempts: [],
        lastFetchTime: Date.now(),
        latency: 0
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
                    return { ...cached, source: 'cache', debugInfo: debug };
                }
                if (!isTooStale) {
                    if (typeof navigator !== 'undefined' && navigator.onLine) {
                        refreshRatesInBackground(base, onBackgroundUpdate);
                    }
                    return { ...cached, source: 'cache', debugInfo: debug };
                }
            }
        }
        catch (err) {
            console.warn('Cache read failed:', err);
            debug.attempts.push({ source: 'cache', success: false, error: err.message });
        }
    }
    if (inFlightRequests.has(base)) {
        return inFlightRequests.get(base);
    }
    const fetchPromise = (async () => {
        try {
            let result;
            // Try Primary
            try {
                result = await fetchFromPrimary(base);
                debug.attempts.push({ source: 'primary', success: true, latency: result.latency, url: result.url });
                debug.latency += result.latency;
            }
            catch (primaryErr) {
                console.warn('Primary API failed, trying V4 fallback...', primaryErr);
                debug.attempts.push({
                    source: 'primary',
                    success: false,
                    error: primaryErr.message || 'Failed to fetch',
                    status: primaryErr.status,
                    url: primaryErr.url
                });
                // Try V4 Fallback
                try {
                    result = await fetchFromFallbackV4(base);
                    debug.attempts.push({ source: 'v4-fallback', success: true, latency: result.latency, url: result.url });
                    debug.latency += result.latency;
                }
                catch (v4Err) {
                    console.warn('V4 API failed, trying Frankfurter fallback...', v4Err);
                    debug.attempts.push({
                        source: 'v4-fallback',
                        success: false,
                        error: v4Err.message || 'Failed to fetch',
                        status: v4Err.status,
                        url: v4Err.url
                    });
                    // Try Frankfurter Fallback
                    result = await fetchFromFrankfurter(base);
                    debug.attempts.push({ source: 'frankfurter', success: true, latency: result.latency, url: result.url });
                    debug.latency += result.latency;
                }
            }
            const finalData = { ...result.data, debugInfo: debug };
            try {
                await saveCurrencyRates(finalData);
            }
            catch (cacheErr) {
                console.warn('Cache write failed:', cacheErr);
            }
            return finalData;
        }
        catch (finalErr) {
            debug.attempts.push({
                source: 'final-attempt',
                success: false,
                error: finalErr.message || 'All fetch attempts failed',
                status: finalErr.status,
                url: finalErr.url
            });
            throw { ...finalErr, debugInfo: debug };
        }
        finally {
            inFlightRequests.delete(base);
        }
    })();
    inFlightRequests.set(base, fetchPromise);
    return fetchPromise;
}
async function refreshRatesInBackground(base, onBackgroundUpdate) {
    try {
        const data = await getLiveRates(base, true);
        if (onBackgroundUpdate) {
            onBackgroundUpdate(data);
        }
    }
    catch (err) {
        console.warn('Background rates refresh failed', err);
    }
}
