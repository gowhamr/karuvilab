import { openDB } from 'idb';
const DB_NAME = 'karuvilab-db';
const DB_VERSION = 6; // Incremented version
let dbPromise = null;
export const getDB = () => {
    if (typeof window === 'undefined')
        return null;
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) {
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
                }
                if (oldVersion < 2) {
                    db.createObjectStore('emiScenarios', { keyPath: 'id' });
                }
                if (oldVersion < 3) {
                    db.createObjectStore('currency-rates', { keyPath: 'base' });
                }
                if (oldVersion < 4) {
                    const calendarStore = db.createObjectStore('calendar-events', { keyPath: 'id' });
                    calendarStore.createIndex('by-start', 'startDate');
                }
                if (oldVersion < 5) {
                    const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
                    notesStore.createIndex('by-updated', 'updatedAt');
                }
                if (oldVersion < 6) {
                    db.createObjectStore('notes-folders', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};
export async function saveNote(note) {
    const db = await getDB();
    if (!db)
        return;
    await db.put('notes', note);
}
export async function getNotes() {
    const db = await getDB();
    if (!db)
        return [];
    return db.getAll('notes');
}
export async function deleteNote(id) {
    const db = await getDB();
    if (!db)
        return;
    await db.delete('notes', id);
}
export async function saveFolder(folder) {
    const db = await getDB();
    if (!db)
        return;
    await db.put('notes-folders', folder);
}
export async function getFolders() {
    const db = await getDB();
    if (!db)
        return [];
    return db.getAll('notes-folders');
}
export async function deleteFolder(id) {
    const db = await getDB();
    if (!db)
        return;
    await db.delete('notes-folders', id);
}
export async function saveCalendarEvent(event) {
    const db = await getDB();
    if (!db)
        return;
    await db.put('calendar-events', event);
}
export async function getCalendarEvents() {
    const db = await getDB();
    if (!db)
        return [];
    return db.getAll('calendar-events');
}
export async function deleteCalendarEvent(id) {
    const db = await getDB();
    if (!db)
        return;
    await db.delete('calendar-events', id);
}
export async function saveCurrencyRates(data) {
    const db = await getDB();
    if (!db)
        return;
    await db.put('currency-rates', data);
}
export async function getCurrencyRates(base) {
    const db = await getDB();
    if (!db)
        return null;
    return db.get('currency-rates', base);
}
export async function clearExpiredCurrencyRates() {
    const db = await getDB();
    if (!db)
        return;
    const now = Date.now();
    const tx = db.transaction('currency-rates', 'readwrite');
    const store = tx.objectStore('currency-rates');
    const all = await store.getAll();
    for (const entry of all) {
        // Prune if older than 72 hours (max stale duration)
        if (now - entry.timestamp > 72 * 60 * 60 * 1000) {
            await store.delete(entry.base);
        }
    }
    await tx.done;
}
export async function saveToolState(toolId, state) {
    const db = await getDB();
    if (!db)
        return;
    await db.put('tool-states', {
        toolId,
        state,
        updatedAt: Date.now(),
    });
}
export async function getToolState(toolId) {
    const db = await getDB();
    if (!db)
        return null;
    return db.get('tool-states', toolId);
}
export async function addToHistory(toolId, label, data) {
    const db = await getDB();
    if (!db)
        return;
    await db.add('history', {
        toolId,
        label,
        data,
        timestamp: Date.now(),
    });
}
export async function getHistory(toolId) {
    const db = await getDB();
    if (!db)
        return [];
    if (toolId) {
        return db.getAllFromIndex('history', 'by-tool', toolId);
    }
    return db.getAll('history');
}
export async function setPreference(key, value) {
    const db = await getDB();
    if (!db)
        return;
    await db.put('preferences', value, key);
}
export async function getPreference(key) {
    const db = await getDB();
    if (!db)
        return null;
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
export async function clearOldCache(maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
    const db = await getDB();
    if (!db)
        return;
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
            await historyStore.delete(item.id);
        }
    }
    await tx.done;
}
export async function clearAllHistory() {
    const db = await getDB();
    if (!db)
        return;
    await db.clear('history');
}
/**
 * Safe IndexedDB operations that handle quota exceeded, version mismatch, etc.
 */
export async function safePut(storeName, value, key) {
    try {
        const db = await getDB();
        if (!db)
            return false;
        await db.put(storeName, value, key);
        return true;
    }
    catch (error) {
        console.error(`[DB Error] safePut failed on ${storeName}:`, error);
        if (error.name === 'QuotaExceededError') {
            import('@/src/store/useRecoveryStore').then(({ useRecoveryStore }) => {
                useRecoveryStore.getState().showBanner('idb_quota', 'Storage full. Please clear space or some data may not be saved.', {
                    label: 'Clear Data',
                    onClick: () => clearOldCache(0)
                });
                useRecoveryStore.getState().setReducedPersistence(true);
            });
        }
        else {
            import('@/src/store/useRecoveryStore').then(({ useRecoveryStore }) => {
                useRecoveryStore.getState().showBanner('idb_error', 'Database error occurred. In-memory work is preserved.');
            });
        }
        return false;
    }
}
export async function safeGet(storeName, key) {
    try {
        const db = await getDB();
        if (!db)
            return null;
        return await db.get(storeName, key);
    }
    catch (error) {
        console.error(`[DB Error] safeGet failed on ${storeName}:`, error);
        return null;
    }
}
export async function safeDelete(storeName, key) {
    try {
        const db = await getDB();
        if (!db)
            return false;
        await db.delete(storeName, key);
        return true;
    }
    catch (error) {
        console.error(`[DB Error] safeDelete failed on ${storeName}:`, error);
        return false;
    }
}
