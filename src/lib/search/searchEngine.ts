// src/lib/search/searchEngine.ts
import { buildSearchIndex, IndexedTool } from './buildIndex';
import { useSearchStore } from '@/src/store/useSearchStore';

export interface SearchResult {
  tool: IndexedTool;
  score: number;
  matchType: 'exact' | 'prefix' | 'fuzzy' | 'keyword';
}

const STOP_WORDS = new Set(["a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "how", "do", "i", "can", "is", "what", "with"]);

/**
 * Score boost for popular tools as tie-breaker.
 * Increased from 5 → 10 per QA report a31c889 (2026-06-05).
 * Ensures frequently visited tools reliably surface above
 * equal-scored less-visited alternatives.
 */
const POPULARITY_BOOST = 10;

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 0 && !STOP_WORDS.has(word));
}

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  const firstRow = matrix[0];
  if (firstRow) {
    for (let i = 0; i <= a.length; i++) firstRow[i] = i;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const row = matrix[i];
      const prevRow = matrix[i - 1];
      if (row && prevRow) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          row[j] = prevRow[j - 1] ?? 0;
        } else {
          row[j] = Math.min(
            (prevRow[j - 1] ?? 0) + 1, // substitution
            Math.min(
              (row[j - 1] ?? 0) + 1,   // insertion
              (prevRow[j] ?? 0) + 1    // deletion
            )
          );
        }
      }
    }
  }
  return matrix[b.length]?.[a.length] ?? 0;
}

export function searchTools(query: string, maxResults: number = 8): SearchResult[] {
  if (!query || query.trim().length === 0) return [];

  const index = buildSearchIndex();
  const queryTokens = tokenizeQuery(query);
  const rawQuery = query.toLowerCase().trim();

  // If query consists only of stop words, don't return everything
  if (queryTokens.length === 0 && rawQuery.length > 0) {
    return [];
  }

  const results: SearchResult[] = [];
  const popularTools = useSearchStore.getState().popularTools;

  for (const tool of index) {
    let score = 0;
    let matchType: SearchResult['matchType'] | null = null;
    const toolNameRaw = tool.name.toLowerCase();

    // 1. Exact Name Match (highest priority)
    if (toolNameRaw === rawQuery || toolNameRaw.includes(rawQuery)) {
      score += 100;
      matchType = 'exact';
    } 
    // 2. Token Matching
    else {
      let matchedTokens = 0;
      for (const qToken of queryTokens) {
        let bestTokenScore = 0;

        // Check exact name tokens first
        for (const tToken of tool.exactNameTokens) {
          if (tToken === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 20);
          } else if (tToken.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 10);
          } else if (qToken.length >= 4 && levenshtein(tToken, qToken) <= 1) {
            bestTokenScore = Math.max(bestTokenScore, 5); // 1 typo allowed
          } else if (qToken.length >= 7 && levenshtein(tToken, qToken) <= 2) {
            bestTokenScore = Math.max(bestTokenScore, 3); // 2 typos allowed
          }
        }

        // If not found in name, check broader search tokens (keywords, synonyms, desc)
        if (bestTokenScore === 0) {
          for (const tToken of tool.searchTokens) {
             if (tToken === qToken) {
                bestTokenScore = Math.max(bestTokenScore, 15);
             } else if (tToken.startsWith(qToken)) {
                bestTokenScore = Math.max(bestTokenScore, 8);
             } else if (qToken.length >= 4 && levenshtein(tToken, qToken) <= 1) {
                bestTokenScore = Math.max(bestTokenScore, 4);
             }
          }
        }

        if (bestTokenScore > 0) {
          matchedTokens++;
          score += bestTokenScore;
        }
      }

      // Penalize tools that didn't match all query tokens (AND logic bias)
      if (matchedTokens < queryTokens.length) {
         score = score / 2;
      }
      
      if (score >= 20) matchType = 'prefix';
      else if (score >= 10) matchType = 'keyword';
      else if (score > 0) matchType = 'fuzzy';
    }

    if (score > 0 && matchType) {
      // Score boost applied to popular tools as a tie-breaker.
      // Set to 10 to ensure frequently used tools reliably surface
      // above less-relevant matches at equal text-match score.
      // QA report a31c889 — NIT fix — 2026-06-05
      const visits = popularTools[tool.id] || 0;
      score += Math.min(visits * 0.1, POPULARITY_BOOST); 
      
      results.push({ tool, score, matchType });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}
