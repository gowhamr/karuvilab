import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface KaruviDB extends DBSchema {
  'tool-states': {
    key: string;
    value: {
      toolId: string;
      state: Record<string, unknown>;
      updatedAt: number;
    };
  };
  'history': {
    key: number;
    value: {
      id?: number;
      toolId: string;
      label: string;
      data: Record<string, unknown>;
      timestamp: number;
    };
    indexes: { 'by-tool': string; 'by-date': number };
  };
  'preferences': {
    key: string;
    value: unknown;
  };
  'cached-files': {
    key: string;
    value: {
      id: string;
      name: string;
      type: string;
      data: Blob;
      timestamp: number;
    };
  };
}

const DB_NAME = 'karuvilab-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<KaruviDB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB<KaruviDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tool states (current inputs)
        db.createObjectStore('tool-states', { keyPath: 'toolId' });
        
        // History of calculations
        const historyStore = db.createObjectStore('history', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        historyStore.createIndex('by-tool', 'toolId');
        historyStore.createIndex('by-date', 'timestamp');
        
        // App preferences
        db.createObjectStore('preferences');
        
        // File storage for offline access to generated files
        db.createObjectStore('cached-files', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};

export async function saveToolState(toolId: string, state: Record<string, unknown>) {
  const db = await getDB();
  if (!db) return;
  await db.put('tool-states', {
    toolId,
    state,
    updatedAt: Date.now(),
  });
}

export async function getToolState(toolId: string) {
  const db = await getDB();
  if (!db) return null;
  return db.get('tool-states', toolId);
}

export async function addToHistory(toolId: string, label: string, data: Record<string, unknown>) {
  const db = await getDB();
  if (!db) return;
  await db.add('history', {
    toolId,
    label,
    data,
    timestamp: Date.now(),
  });
}

export async function getHistory(toolId?: string) {
  const db = await getDB();
  if (!db) return [];
  if (toolId) {
    return db.getAllFromIndex('history', 'by-tool', toolId);
  }
  return db.getAll('history');
}

export async function setPreference(key: string, value: unknown) {
  const db = await getDB();
  if (!db) return;
  await db.put('preferences', value, key);
}

export async function getPreference(key: string) {
  const db = await getDB();
  if (!db) return null;
  return db.get('preferences', key);
}

/**
 * Storage Quota and Governance
 */
export async function getStorageStats() {
  if (typeof navigator === 'undefined' || !navigator.storage) {
    return { quota: 0, usage: 0, percent: 0 };
  }
  const estimate = await navigator.storage.estimate();
  const quota = estimate.quota || 0;
  const usage = estimate.usage || 0;
  return {
    quota,
    usage,
    percent: quota > 0 ? (usage / quota) * 100 : 0
  };
}

export async function clearOldCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000) {
  const db = await getDB();
  if (!db) return;
  const now = Date.now();
  const tx = db.transaction(['cached-files', 'history'], 'readwrite');
  
  // Clear old cached files
  const fileStore = tx.objectStore('cached-files');
  const files = await fileStore.getAll();
  for (const file of files) {
    if (now - file.timestamp > maxAgeMs) {
      await fileStore.delete(file.id);
    }
  }

  // Clear old history
  const historyStore = tx.objectStore('history');
  const history = await historyStore.getAll();
  for (const item of history) {
    if (now - item.timestamp > maxAgeMs) {
      await historyStore.delete(item.id!);
    }
  }

  await tx.done;
}
