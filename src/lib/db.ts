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
