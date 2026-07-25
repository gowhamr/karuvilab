// src/lib/search/searchEngine.ts
import { buildSearchIndex, IndexedTool } from './buildIndex';
import { useSearchStore } from '../../store/useSearchStore';
import { detectContentToolSuggestion } from './intelligentDetector';

export interface SearchResult {
  tool: IndexedTool;
  score: number;
  matchType: 'exact' | 'prefix' | 'fuzzy' | 'keyword' | 'detected';
  reason?: string | undefined;
}

const STOP_WORDS = new Set(["a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "how", "do", "i", "can", "is", "what", "with"]);

/**
 * Score boost for popular tools as tie-breaker.
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

export function searchTools(query: string, maxResults: number = 30): SearchResult[] {
  if (!query || query.trim().length === 0) return [];

  const index = buildSearchIndex();
  const queryTokens = tokenizeQuery(query);
  const rawQuery = query.toLowerCase().trim();

  // Check Intelligent Content Pattern Detector (P1 Feature)
  const intelligentMatch = detectContentToolSuggestion(query);

  // If query consists only of stop words, don't return everything
  if (queryTokens.length === 0 && rawQuery.length > 0 && !intelligentMatch) {
    return [];
  }

  const results: SearchResult[] = [];
  const popularTools = useSearchStore.getState().popularTools;

  for (const tool of index) {
    let score = 0;
    let matchType: SearchResult['matchType'] | null = null;
    let reason: string | undefined = undefined;

    // Check if tool matches Intelligent Detector Pattern
    if (intelligentMatch && (tool.id === intelligentMatch.toolId || tool.href.includes(intelligentMatch.toolId))) {
      score += 1000 * intelligentMatch.confidence;
      matchType = 'detected';
      reason = intelligentMatch.reason;
    }

    const toolNameRaw = tool.name.toLowerCase();

    // 1. Exact Tool Name Match or Prefix
    if (toolNameRaw === rawQuery) {
      score += 500;
      if (!matchType) matchType = 'exact';
    } else if (toolNameRaw.startsWith(rawQuery)) {
      score += 300;
      if (!matchType) matchType = 'prefix';
    } else if (tool.id.toLowerCase() === rawQuery || tool.id.toLowerCase().startsWith(rawQuery)) {
      score += 250;
      if (!matchType) matchType = 'prefix';
    }

    // 2. Exact Keyword / Alias match
    if (tool.keywords.some((k: string) => k.toLowerCase() === rawQuery)) {
      score += 200;
      if (!matchType) matchType = 'keyword';
    } else if (tool.keywords.some((k: string) => k.toLowerCase().startsWith(rawQuery))) {
      score += 100;
      if (!matchType) matchType = 'keyword';
    }

    // 3. Token Level Matching
    let matchedTokens = 0;
    for (const qToken of queryTokens) {
      let bestTokenScore = 0;

      for (const tToken of tool.exactNameTokens) {
        if (tToken === qToken) {
          bestTokenScore = Math.max(bestTokenScore, 40);
        } else if (tToken.startsWith(qToken)) {
          bestTokenScore = Math.max(bestTokenScore, 20);
        } else if (qToken.length >= 4 && levenshtein(tToken, qToken) <= 1) {
          bestTokenScore = Math.max(bestTokenScore, 10);
        }
      }

      if (bestTokenScore === 0) {
        for (const tToken of tool.searchTokens) {
          if (tToken === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 25);
          } else if (tToken.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 12);
          } else if (qToken.length >= 4 && levenshtein(tToken, qToken) <= 1) {
            bestTokenScore = Math.max(bestTokenScore, 5);
          }
        }
      }

      if (bestTokenScore > 0) {
        matchedTokens++;
        score += bestTokenScore;
      }
    }

    if (queryTokens.length > 0 && matchedTokens < queryTokens.length) {
      score = score / 2;
    }

    if (!matchType && score > 0) {
      matchType = score >= 50 ? 'prefix' : score >= 20 ? 'keyword' : 'fuzzy';
    }

    if (score > 0 && matchType) {
      const visits = popularTools[tool.id] || 0;
      score += Math.min(visits * 0.1, POPULARITY_BOOST);
      
      results.push({ tool, score, matchType, reason });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}
