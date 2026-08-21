/**
 * KaruviLab Mermaid L1 LRU Cache
 * Caches rendered Mermaid SVGs by deterministic hash + theme with strict entry and byte budgets.
 */

import { MermaidCacheEntry, MermaidThemeMode } from './types';

export class MermaidLRUCache {
  private cache = new Map<string, MermaidCacheEntry>();
  private readonly maxEntries: number;
  private readonly maxBytes: number;
  private currentBytes: number = 0;
  private hits = 0;
  private misses = 0;

  constructor(maxEntries: number = 60, maxBytes: number = 20 * 1024 * 1024) {
    this.maxEntries = maxEntries;
    this.maxBytes = maxBytes;
  }

  private buildKey(hash: string, theme: MermaidThemeMode): string {
    return `${hash}_${theme}`;
  }

  private estimateEntryBytes(entry: MermaidCacheEntry): number {
    return (entry.svg ? entry.svg.length * 2 : 0) + entry.hash.length * 2 + 256;
  }

  public get(hash: string, theme: MermaidThemeMode): MermaidCacheEntry | undefined {
    const key = this.buildKey(hash, theme);
    const entry = this.cache.get(key);
    if (entry) {
      this.hits++;
      // Move to most recently used
      this.cache.delete(key);
      this.cache.set(key, entry);
      return entry;
    }
    this.misses++;
    return undefined;
  }

  public has(hash: string, theme: MermaidThemeMode): boolean {
    const key = this.buildKey(hash, theme);
    return this.cache.has(key);
  }

  public set(entry: MermaidCacheEntry): void {
    const key = this.buildKey(entry.hash, entry.theme);
    const entryBytes = (entry.approxBytes && entry.approxBytes > 0) ? entry.approxBytes : this.estimateEntryBytes(entry);
    entry.approxBytes = entryBytes;

    if (this.cache.has(key)) {
      const existing = this.cache.get(key);
      if (existing) {
        this.currentBytes -= existing.approxBytes || 0;
      }
      this.cache.delete(key);
    }

    // Evict oldest entries until within entry and byte budgets
    while (
      this.cache.size >= this.maxEntries ||
      (this.currentBytes + entryBytes > this.maxBytes && this.cache.size > 0)
    ) {
      const oldestKey = this.cache.keys().next().value;
      if (!oldestKey) break;
      const oldestEntry = this.cache.get(oldestKey);
      if (oldestEntry) {
        this.currentBytes -= oldestEntry.approxBytes || 0;
      }
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, entry);
    this.currentBytes += entryBytes;
  }

  public delete(hash: string, theme: MermaidThemeMode): boolean {
    const key = this.buildKey(hash, theme);
    const entry = this.cache.get(key);
    if (entry) {
      this.currentBytes -= entry.approxBytes || 0;
      return this.cache.delete(key);
    }
    return false;
  }

  public clear(): void {
    this.cache.clear();
    this.currentBytes = 0;
    this.hits = 0;
    this.misses = 0;
  }

  public getStats() {
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
      maxBytes: this.maxBytes,
      currentBytes: this.currentBytes,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
    };
  }
}

export const mermaidCache = new MermaidLRUCache(60, 20 * 1024 * 1024);
