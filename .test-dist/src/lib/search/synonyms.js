// src/lib/search/synonyms.ts
// Map of common keywords to specific tools for fuzzy intent matching
export const SYNONYM_MAP = {
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
    // File Extensions & Formats
    "pdf": [".pdf", "pdf document", "acrobat"],
    "image": ["picture", "photo", "png", "jpg", "jpeg", "webp", "gif", "svg", "ico", ".png", ".jpg", ".svg", ".webp"],
    "text": ["string", "plain text", "txt", "words", "letters", ".txt"],
    "doc": ["document", "word", "docx", ".doc", ".docx"],
    "sound": ["audio", "mp3", "wav", "music", ".mp3", ".wav"],
    "movie": ["video", "mp4", "webm", ".mp4", ".webm"],
    "data": ["json", "csv", "xml", "yaml", "yml", ".json", ".csv", ".xml", ".yaml"],
    // Specific Tool & Domain Synonyms
    "calc": ["calculator", "math", "numbers"],
    "money": ["finance", "currency", "salary", "investment", "loan", "emi", "tax", "gst"],
    "banking": ["iso8583", "emv", "tlv", "swift", "mt103", "mx", "bic", "iban", "finacle", "luhn", "pan", "apdu", "mti", "bitmap", "cryptogram"],
    "iso8583": ["mti", "bitmap", "field decoder", "0100", "0200", "card processing", "payment gateway"],
    "emv": ["tlv", "tag dictionary", "apdu", "chip card", "icc", "smartcard", "cryptogram"],
    "swift": ["mt103", "mt202", "mx", "iso20022", "bic", "iban", "wire transfer", "pacs.008"],
    "card": ["luhn", "pan", "track 2", "bin lookup", "expiry", "credit card", "debit card"],
    "time": ["clock", "date", "hours", "timezone", "utc", "ist"],
    "dev": ["developer", "code", "programming", "json", "base64", "hash", "regex", "sql", "js", "ts", "python"],
    "seo": ["search engine", "meta tags", "sitemap", "robots.txt", "slug"],
    "type": ["typing", "keyboard", "speed test"],
    "speed": ["internet", "bandwidth", "ping"],
    "color": ["hex", "rgb", "hsl", "palette"],
    "qr": ["barcode", "scan", "wifi"],
    "case": ["uppercase", "lowercase", "camelcase", "snakecase"],
    "count": ["length", "words", "characters", "letters"],
};
// Expand synonyms to a flat list for easier indexing
export function expandSynonyms(word) {
    const w = word.toLowerCase();
    const expanded = new Set();
    expanded.add(w);
    for (const [key, aliases] of Object.entries(SYNONYM_MAP)) {
        if (w === key || aliases.includes(w)) {
            expanded.add(key);
            aliases.forEach(a => expanded.add(a));
        }
    }
    return Array.from(expanded);
}
