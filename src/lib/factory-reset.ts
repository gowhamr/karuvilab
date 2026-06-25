/**
 * KaruviLab Unified Factory Reset Engine
 * Performs a deep clean of all local data to ensure a completely fresh start.
 */

import { logger } from './logger';

export async function performFactoryReset() {
  logger.warn('[Factory Reset] Initializing full system wipe...');

  // 1. Clear Storage APIs
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    logger.info('✅ LocalStorage & SessionStorage cleared');
  }

  // 2. Clear All Cookies
  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      if (!cookie) continue;
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
    }
    logger.info('✅ Cookies purged');
  } catch (e) {
    logger.error('❌ Failed to clear cookies', { error: e });
  }

  // 3. Delete IndexedDB Databases
  const databases = ['karuvilab-db', 'karuvilab-storage', 'kv-history', 'workbox-precache-v2'];
  for (const dbName of databases) {
    try {
      await new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = resolve;
        req.onerror = reject;
        req.onblocked = () => {
          logger.warn(`[DB] Delete ${dbName} blocked. Closing connections...`);
          resolve(null);
        };
      });
      logger.info(`✅ IndexedDB: ${dbName} deleted`);
    } catch (e) {
      logger.error(`❌ Failed to delete DB ${dbName}`, { error: e });
    }
  }

  // 4. Clear Cache Storage (Service Worker)
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      logger.info('✅ Cache Storage cleared');
    } catch (e) {
      logger.error('❌ Failed to clear Cache Storage', { error: e });
    }
  }

  // 5. Unregister Service Workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      logger.info('✅ Service Workers unregistered');
    } catch (e) {
      logger.error('❌ Failed to unregister Service Workers', { error: e });
    }
  }

  logger.warn('[Factory Reset] Wipe complete. Reloading application...');
  window.location.href = window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || '');
}

/**
 * Partial reset - clears only tool data but keeps settings
 */
export async function clearToolData() {
  // Clear localStorage items that aren't settings/themes
  const preservedKeys = [
    'karuvi-theme', 
    'karuvi-font-size', 
    'karuvi-settings', 
    'karuvi-favorites', 
    'karuvi-high-contrast'
  ];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !preservedKeys.some(pk => key.startsWith(pk))) {
      localStorage.removeItem(key);
    }
  }

  // Clear specific IndexedDB stores in karuvilab-db
  const { getDB } = await import('./db');
  const db = await getDB();
  if (db) {
    const storesToClear: any[] = ['tool-states', 'history', 'cached-files', 'emiScenarios'];
    const tx = db.transaction(storesToClear, 'readwrite');
    await Promise.all(storesToClear.map(s => tx.objectStore(s).clear()));
    await tx.done;
  }

  logger.info('✅ Tool data cleared');
}
