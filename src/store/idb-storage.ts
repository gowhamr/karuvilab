import { openDB } from 'idb';

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
        console.log(`[idbStorage] Transparently migrated legacy key "${key}" from localStorage to IndexedDB.`);
      }
    }
    return val;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (!dbPromise) return;
    
    if (writeTimeouts.has(key)) {
      clearTimeout(writeTimeouts.get(key)!);
    }
    
    return new Promise((resolve) => {
      writeTimeouts.set(key, setTimeout(async () => {
        const db = await dbPromise;
        await db.put(STORE_NAME, value, key);
        writeTimeouts.delete(key);
        resolve();
      }, 500));
    });
  },
  removeItem: async (key: string): Promise<void> => {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.delete(STORE_NAME, key);
  },
};
