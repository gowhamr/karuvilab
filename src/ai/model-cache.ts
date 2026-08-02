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

export async function getCachedModel(modelId: string, version: string): Promise<ArrayBuffer | null> {
  try {
    const db = await getDb();
    const record = (await db.get(STORE_NAME, modelId)) as CachedModelRecord | undefined;
    if (record && record.version === version && record.buffer) {
      return record.buffer;
    }
    return null;
  } catch (err) {
    console.warn(`[AI ModelCache] Failed to read model ${modelId} from IndexedDB:`, err);
    return null;
  }
}

export async function saveCachedModel(modelId: string, version: string, buffer: ArrayBuffer): Promise<void> {
  try {
    const db = await getDb();
    const record: CachedModelRecord = {
      modelId,
      version,
      buffer,
      cachedAt: Date.now()
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
