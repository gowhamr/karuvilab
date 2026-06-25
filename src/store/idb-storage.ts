import { openDB } from 'idb';
import { logger } from '../lib/logger';

const DB_NAME = 'karuvilab-storage';
const STORE_NAME = 'keyval';

const dbPromise = typeof window !== 'undefined' 
  ? openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    })
  : null;

const writeTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const pendingResolves = new Map<string, Array<() => void>>();

export const idbStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (!dbPromise) return null;
    const db = await dbPromise;
    let val = (await db.get(STORE_NAME, key)) || null;

    if (!val && typeof window !== 'undefined') {
      const legacyVal = localStorage.getItem(key);
      if (legacyVal) {
        val = legacyVal;
        await db.put(STORE_NAME, val, key);
        localStorage.removeItem(key);
        logger.info(`[idbStorage] Transparently migrated legacy key "${key}" from localStorage to IndexedDB.`);
      }
    }
    return val;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (!dbPromise) return;
    
    if (writeTimeouts.has(key)) {
      clearTimeout(writeTimeouts.get(key)!);
    }
    
    return new Promise<void>((resolve) => {
      if (!pendingResolves.has(key)) {
        pendingResolves.set(key, []);
      }
      pendingResolves.get(key)!.push(resolve);
      
      writeTimeouts.set(key, setTimeout(async () => {
        try {
          const db = await dbPromise;
          await db.put(STORE_NAME, value, key);
        } catch (e) {
          logger.error('[idbStorage] Write error:', { error: e });
        } finally {
          writeTimeouts.delete(key);
          const resolves = pendingResolves.get(key) || [];
          pendingResolves.delete(key);
          resolves.forEach(res => res());
        }
      }, 500));
    });
  },
  removeItem: async (key: string): Promise<void> => {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.delete(STORE_NAME, key);
  },
};
