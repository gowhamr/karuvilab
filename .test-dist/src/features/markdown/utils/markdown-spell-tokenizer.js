/**
 * Markdown-aware spell-check tokenizer.
 *
 * Extracts spell-checkable plain text from raw Markdown while preserving
 * a per-character offset map so diagnostics can be translated back to exact
 * raw-Markdown positions for Monaco marker placement.
 *
 * Safety invariant: READ-ONLY with respect to the canonical Markdown string.
 */
// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------
const FENCE_RE = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1[ \t]*$/gm;
const INLINE_CODE_RE = /``[^`]+``|`[^`\n]+`/g;
const HEADING_HASH_RE = /^#{1,6}\s+/;
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/;
const HTML_TAG_RE = /<\/?[a-zA-Z][^>]*\/?>/g;
const URL_RE = /https?:\/\/\S+|www\.\S+/gi;
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi;
const IMAGE_RE = /!\[([^\]]*)\]\([^)]*\)/g;
const LINK_RE = /\[([^\]]+)\]\([^)]*\)/g;
const LINK_DEF_RE = /^\[[^\]]+\]:\s+\S+.*$/gm;
const BLOCKQUOTE_RE = /^(\s*>\s?)+/;
const LIST_PREFIX_RE = /^(\s*)(\d+\.|[-*+])\s+/;
const TASK_CHECKBOX_RE = /^\[[ xX]\]\s*/;
const HR_RE = /^(\s*[-*_]){3,}\s*$/;
const TABLE_ALIGN_RE = /^\|?(\s*:?-+:?\s*\|?)+$/;
// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function tokenizeMarkdownForSpellCheck(rawMd) {
    if (!rawMd)
        return { plainText: "", offsetMap: new Int32Array(0) };
    const outChars = [];
    const outOffsets = [];
    let src = rawMd;
    let baseOffset = 0;
    // Strip YAML frontmatter
    FRONTMATTER_RE.lastIndex = 0;
    const fmMatch = FRONTMATTER_RE.exec(rawMd);
    if (fmMatch && fmMatch.index === 0) {
        baseOffset = fmMatch[0].length;
        src = rawMd.slice(baseOffset);
    }
    // Mark fenced-block positions (absolute in rawMd)
    const fencedSet = new Set();
    FENCE_RE.lastIndex = 0;
    let fm;
    while ((fm = FENCE_RE.exec(src)) !== null) {
        const abs = baseOffset + fm.index;
        for (let k = abs; k < abs + fm[0].length; k++)
            fencedSet.add(k);
    }
    // Line-by-line
    const lines = src.split("\n");
    let lineStart = 0;
    for (const rawLine of lines) {
        const lineAbsStart = baseOffset + lineStart;
        // Skip fenced regions
        if (fencedSet.has(lineAbsStart) || fencedSet.has(lineAbsStart + 1)) {
            lineStart += rawLine.length + 1;
            pushSpace(outChars, outOffsets, lineAbsStart);
            continue;
        }
        const trimmed = rawLine.trim();
        if (!trimmed ||
            HR_RE.test(trimmed) ||
            TABLE_ALIGN_RE.test(trimmed) ||
            LINK_DEF_RE.test(trimmed)) {
            lineStart += rawLine.length + 1;
            pushSpace(outChars, outOffsets, lineAbsStart);
            continue;
        }
        // Strip prefix markers, track consumed characters
        let localPos = 0;
        const bq = BLOCKQUOTE_RE.exec(rawLine);
        if (bq)
            localPos += bq[0].length;
        const li = LIST_PREFIX_RE.exec(rawLine.slice(localPos));
        if (li)
            localPos += li[0].length;
        const cb = TASK_CHECKBOX_RE.exec(rawLine.slice(localPos));
        if (cb)
            localPos += cb[0].length;
        const hd = HEADING_HASH_RE.exec(rawLine.slice(localPos));
        if (hd)
            localPos += hd[0].length;
        processInline(rawLine.slice(localPos), lineAbsStart + localPos, outChars, outOffsets, fencedSet);
        pushSpace(outChars, outOffsets, lineAbsStart + rawLine.length);
        lineStart += rawLine.length + 1;
    }
    return {
        plainText: outChars.join(""),
        offsetMap: new Int32Array(outOffsets),
    };
}
// ---------------------------------------------------------------------------
// Inline processor
// ---------------------------------------------------------------------------
function processInline(line, lineRawStart, outChars, outOffsets, fencedSet) {
    if (!line)
        return;
    const skip = []; // emit space
    const replace = []; // emit repl string
    // Inline code → skip
    applyRe(INLINE_CODE_RE, line, (m) => skip.push({ s: m.index, e: m.index + m[0].length }));
    // Images → skip entirely (alt text rarely prose, avoid false positives)
    applyRe(IMAGE_RE, line, (m) => skip.push({ s: m.index, e: m.index + m[0].length }));
    // Links → replace with display text
    applyRe(LINK_RE, line, (m) => {
        // Check no skip range already covers this
        replace.push({ s: m.index, e: m.index + m[0].length, repl: m[1] ?? "" });
    });
    // URLs → skip
    applyRe(URL_RE, line, (m) => skip.push({ s: m.index, e: m.index + m[0].length }));
    applyRe(EMAIL_RE, line, (m) => skip.push({ s: m.index, e: m.index + m[0].length }));
    // HTML tags → skip
    applyRe(HTML_TAG_RE, line, (m) => skip.push({ s: m.index, e: m.index + m[0].length }));
    const intervals = [
        ...skip.map(r => ({ ...r, kind: 'skip' })),
        ...replace.map(r => ({ ...r, kind: 'replace' })),
    ].sort((a, b) => a.s - b.s);
    let i = 0;
    const len = line.length;
    outer: while (i < len) {
        // Find applicable interval at current position
        for (const iv of intervals) {
            if (iv.s > i)
                break;
            if (iv.s === i) {
                if (iv.kind === 'skip') {
                    pushSpace(outChars, outOffsets, lineRawStart + i);
                }
                else {
                    // replace: emit repl, mapped to the start offset
                    const repl = iv.repl || "";
                    for (let ri = 0; ri < repl.length; ri++) {
                        const replCh = repl[ri];
                        if (replCh !== undefined) {
                            outChars.push(replCh);
                            outOffsets.push(lineRawStart + iv.s);
                        }
                    }
                    if (repl.length > 0)
                        pushSpace(outChars, outOffsets, lineRawStart + iv.e);
                }
                i = iv.e;
                continue outer;
            }
        }
        if (fencedSet.has(lineRawStart + i)) {
            i++;
            continue;
        }
        const ch = line[i];
        // Emphasis / strong / strikethrough markers
        if (ch === "*" || ch === "_" || ch === "~") {
            const start = i;
            while (i < len && line[i] === ch)
                i++;
            pushSpace(outChars, outOffsets, lineRawStart + start);
            continue;
        }
        // Backslash escape
        if (ch === "\\" && i + 1 < len) {
            i++;
            const escCh = line[i];
            if (escCh !== undefined) {
                outChars.push(escCh);
                outOffsets.push(lineRawStart + i);
            }
            i++;
            continue;
        }
        // Table pipe
        if (ch === "|") {
            pushSpace(outChars, outOffsets, lineRawStart + i);
            i++;
            continue;
        }
        if (ch !== undefined) {
            outChars.push(ch);
            outOffsets.push(lineRawStart + i);
        }
        i++;
    }
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function pushSpace(chars, offsets, pos) {
    if (chars.length > 0 && chars[chars.length - 1] !== " ") {
        chars.push(" ");
        offsets.push(pos);
    }
}
function applyRe(pattern, text, fn) {
    const re = new RegExp(pattern.source, pattern.flags.replace("g", "") + "g");
    let m;
    while ((m = re.exec(text)) !== null)
        fn(m);
}
