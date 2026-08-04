/**
 * KaruviLab (KV) Local AI Engine - IndexedDB Model Cache
 * Download models once, cache locally in IDB, offline forever (Rule P-09, Rule P-18)
 */

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'kv-ai-models-v1';
const DB_VERSION = 1;
const STORE_NAME = 'models';

interface CachedModelRecord {
  modelId: string;
  version: string;
  buffer: ArrayBuffer;
  cachedAt: number;
  lastAccessedAt?: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available on server side'));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'modelId' });
        }
      }
    });
  }
  return dbPromise;
}

function getDefaultMaxCacheSize(): number {
  if (typeof navigator === 'undefined') return 500 * 1024 * 1024; // SSR fallback
  
  // Use deviceMemory if available (Chrome/Edge only)
  const memory = (navigator as any).deviceMemory;
  if (typeof memory === 'number') {
    return memory >= 8 ? 1.5 * 1024 * 1024 * 1024 : 500 * 1024 * 1024;
  }
  
  // Fallback to userAgent mobile check
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isMobile ? 500 * 1024 * 1024 : 1.5 * 1024 * 1024 * 1024;
}

/**
 * Automatically evict least-recently-used models if cache size exceeds limit
 */
export async function evictLruModelCache(maxStorageBytes?: number): Promise<number> {
  const limit = maxStorageBytes || getDefaultMaxCacheSize();
  try {
    const db = await getDb();
    const records = (await db.getAll(STORE_NAME)) as CachedModelRecord[];
    if (!records || records.length === 0) return 0;

    let totalBytes = records.reduce((acc, r) => acc + (r.buffer?.byteLength || 0), 0);
    if (totalBytes <= limit) return 0;

    // Sort by lastAccessedAt or cachedAt ascending (oldest first)
    const sorted = records.sort((a, b) => {
      const timeA = a.lastAccessedAt || a.cachedAt || 0;
      const timeB = b.lastAccessedAt || b.cachedAt || 0;
      return timeA - timeB;
    });

    let evictedCount = 0;
    for (const record of sorted) {
      if (totalBytes <= limit) break;
      await db.delete(STORE_NAME, record.modelId);
      totalBytes -= (record.buffer?.byteLength || 0);
      evictedCount++;
    }
    return evictedCount;
  } catch (err) {
    console.warn('[AI ModelCache] Failed to evict LRU model cache:', err);
    return 0;
  }
}

export async function getCachedModel(modelId: string, version: string): Promise<ArrayBuffer | null> {
  try {
    const db = await getDb();
    const record = (await db.get(STORE_NAME, modelId)) as CachedModelRecord | undefined;
    if (record && record.version === version && record.buffer) {
      // Touch lastAccessedAt asynchronously
      record.lastAccessedAt = Date.now();
      db.put(STORE_NAME, record).catch(() => {});
      return record.buffer;
    }
    return null;
  } catch (err) {
    console.warn(`[AI ModelCache] Failed to read model ${modelId} from IndexedDB:`, err);
    return null;
  }
}

export async function saveCachedModel(
  modelId: string, 
  version: string, 
  buffer: ArrayBuffer, 
  maxStorageBytes?: number
): Promise<void> {
  try {
    const limit = maxStorageBytes || getDefaultMaxCacheSize();
    await evictLruModelCache(limit);
    const db = await getDb();
    const record: CachedModelRecord = {
      modelId,
      version,
      buffer,
      cachedAt: Date.now(),
      lastAccessedAt: Date.now()
    };
    await db.put(STORE_NAME, record);
  } catch (err) {
    console.warn(`[AI ModelCache] Failed to cache model ${modelId} in IndexedDB:`, err);
  }
}

export async function clearModelCache(modelId?: string): Promise<void> {
  try {
    const db = await getDb();
    if (modelId) {
      await db.delete(STORE_NAME, modelId);
    } else {
      await db.clear(STORE_NAME);
    }
  } catch (err) {
    console.warn('[AI ModelCache] Failed to clear model cache:', err);
  }
}

export async function getAllCachedModelIds(): Promise<string[]> {
  try {
    const db = await getDb();
    const keys = await db.getAllKeys(STORE_NAME);
    return keys.map(k => String(k));
  } catch {
    return [];
  }
}
