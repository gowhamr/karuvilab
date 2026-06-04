// src/lib/search/synonyms.ts
// Map of common keywords to specific tools for fuzzy intent matching

export const SYNONYM_MAP: Record<string, string[]> = {
  // Verbs & Intents
  "combine": ["merge", "join", "concatenate"],
  "shrink": ["compress", "reduce", "optimize", "minify"],
  "change": ["convert", "transform", "encode", "decode"],
  "fix": ["repair", "clean", "validate", "lint"],
  "make": ["generate", "create", "build", "produce"],
  "look at": ["view", "preview", "open", "inspect", "read"],
  "cut": ["split", "trim", "crop", "slice"],
  "lock": ["encrypt", "protect", "secure", "password"],
  "unlock": ["decrypt", "remove password"],
  "find": ["search", "extract", "discover"],

  // File Types
  "text": ["string", "plain text", "txt", "words", "letters"],
  "picture": ["image", "photo", "png", "jpg", "jpeg", "webp", "gif", "svg"],
  "doc": ["document", "word", "docx"],
  "sound": ["audio", "mp3", "wav", "music"],
  "movie": ["video", "mp4", "webm"],
  "data": ["json", "csv", "xml", "yaml", "yml"],

  // Specific Tool Synonyms
  "calc": ["calculator", "math", "numbers"],
  "money": ["finance", "currency", "salary", "investment", "loan", "emi", "tax", "gst"],
  "time": ["clock", "date", "hours", "timezone", "utc", "ist"],
  "dev": ["developer", "code", "programming", "json", "base64", "hash", "regex"],
  "seo": ["search engine", "meta tags", "sitemap", "robots.txt", "slug"],
  "type": ["typing", "keyboard", "speed test"],
  "speed": ["internet", "bandwidth", "ping"],
  "color": ["hex", "rgb", "hsl", "palette"],
  "qr": ["barcode", "scan", "wifi"],
  "case": ["uppercase", "lowercase", "camelcase", "snakecase"],
  "count": ["length", "words", "characters", "letters"],
};

// Expand synonyms to a flat list for easier indexing
export function expandSynonyms(word: string): string[] {
  const w = word.toLowerCase();
  const expanded = new Set<string>();
  expanded.add(w);

  for (const [key, aliases] of Object.entries(SYNONYM_MAP)) {
    if (w === key || aliases.includes(w)) {
      expanded.add(key);
      aliases.forEach(a => expanded.add(a));
    }
  }

  return Array.from(expanded);
}
