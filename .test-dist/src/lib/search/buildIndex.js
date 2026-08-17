// src/lib/search/buildIndex.ts
import { ALL_TOOLS } from '../../tool-registry';
import { expandSynonyms } from './synonyms';
// Stop words that provide no search value
const STOP_WORDS = new Set(["a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "how", "do", "i", "can", "is", "what", "with"]);
function tokenize(text) {
    if (!text)
        return [];
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}
let cachedIndex = null;
export function buildSearchIndex() {
    if (cachedIndex)
        return cachedIndex;
    cachedIndex = ALL_TOOLS.filter(t => t.status !== 'deprecated').map(tool => {
        // 1. Exact name tokens (highest priority)
        const exactNameTokens = tokenize(tool.name);
        // 2. Build full searchable token set
        const tokenSet = new Set();
        // Add name and description
        tokenize(tool.name).forEach(t => tokenSet.add(t));
        tokenize(tool.desc).forEach(t => tokenSet.add(t));
        // Add keywords and their synonyms
        tool.keywords.forEach((keyword) => {
            tokenize(keyword).forEach(token => {
                tokenSet.add(token);
                expandSynonyms(token).forEach(syn => tokenSet.add(syn));
            });
        });
        // Add category and id
        tokenSet.add(tool.category);
        tokenize(tool.id.replace(/-/g, " ")).forEach(t => tokenSet.add(t));
        return {
            ...tool,
            searchTokens: Array.from(tokenSet),
            exactNameTokens,
        };
    });
    return cachedIndex;
}
