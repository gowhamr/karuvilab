"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { REGEX_CATEGORIES, REGEX_LIBRARY, type RegexPattern } from "../library";
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Info 
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

interface Match {
  value: string;
  index: number;
  groups: string[];
}

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  // Regex Library state
  const [librarySearch, setLibrarySearch] = useState("");
  const [activeLibCategory, setActiveLibCategory] = useState("all");
  const [copiedPatternId, setCopiedPatternId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
  const [showRightScrollBtn, setShowRightScrollBtn] = useState(false);

  const allCategories = useMemo(() => [
    { id: "all", label: "All Patterns" },
    ...REGEX_CATEGORIES
  ], []);

  const filteredPatterns = useMemo(() => {
    return REGEX_LIBRARY.filter(pat => {
      const matchesCategory = activeLibCategory === "all" || pat.category === activeLibCategory;
      const query = librarySearch.toLowerCase().trim();
      const matchesSearch = !query || 
        pat.label.toLowerCase().includes(query) ||
        pat.description.toLowerCase().includes(query) ||
        pat.pattern.toLowerCase().includes(query) ||
        pat.example.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeLibCategory, librarySearch]);

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setShowLeftScrollBtn(scrollLeft > 5);
    setShowRightScrollBtn(scrollLeft < maxScroll - 5);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateScrollButtons, 100);
    return () => clearTimeout(timer);
  }, [activeLibCategory]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setVisibleCount(12);
    });
  }, [activeLibCategory, librarySearch]);

  const handleCopyPattern = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPatternId(id);
    setTimeout(() => setCopiedPatternId(null), 2000);
  };

  const handleInsertPattern = (patternObj: RegexPattern) => {
    setPattern(patternObj.pattern);
    const newFlags = { g: false, i: false, m: false, s: false, u: false };
    for (const f of patternObj.flags) {
      if (f in newFlags) (newFlags as Record<string, boolean>)[f] = true;
    }
    setFlags(newFlags);
    setTestString(patternObj.example);
  };

  const flagString = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const re = new RegExp(pattern, flagString);
      const matches: Match[] = [];
      if (flags.g) {
        let m;
        while ((m = re.exec(testString)) !== null) {
          matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
          if (!flags.g || re.lastIndex === m.index) break;
        }
      } else {
        const m = re.exec(testString);
        if (m) matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flagString, testString, flags.g]);

  const highlighted = useMemo(() => {
    if (!result || result.error || result.matches.length === 0) return null;
    try {
      const re = new RegExp(pattern, flagString.includes("g") ? flagString : flagString + "g");
      const parts: { text: string; match: boolean }[] = [];
      let last = 0;
      testString.replace(re, (match, ...args) => {
        const offset = args[args.length - 2] as number;
        if (offset > last) parts.push({ text: testString.slice(last, offset), match: false });
        parts.push({ text: match, match: true });
        last = offset + match.length;
        return match;
      });
      if (last < testString.length) parts.push({ text: testString.slice(last), match: false });
      return parts;
    } catch { return null; }
  }, [pattern, flagString, testString, result]);

  useFocusModeIntegration({
    charCount: testString.length,
    lineCount: testString ? testString.split('\n').length : 0,
    language: "regex",
    onFontSizeChange: setFontSize,
    onWrapToggle: () => setWordWrap(v => !v)
  });

  return (
    <div className="w-full">
      <div className="space-y-6 w-full">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Pattern</label>
          <div className="flex items-center bg-bg border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue transition-all">
            <span className="px-3 text-text-4 font-mono text-lg select-none">/</span>
            <input
              className="flex-1 py-3 bg-transparent font-mono text-sm outline-none text-text"
              placeholder="[a-z]+"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
            />
            <span className="px-3 text-text-4 font-mono text-lg select-none">/{flagString}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Flags</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(flags) as (keyof typeof flags)[]).map(f => (
              <button
                key={f}
                onClick={() => setFlags(prev => ({ ...prev, [f]: !prev[f] }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono font-bold border transition-all ${flags[f] ? "bg-blue text-white border-blue" : "bg-bg border-border text-text-2 hover:border-blue"}`}
              >
                {f}
              </button>
            ))}
            <span className="text-xs text-text-4 self-center ml-1">g=global i=case-insensitive m=multiline s=dotall u=unicode</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Test String</label>
          <textarea
            className={`w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono focus:ring-2 focus:ring-blue outline-none transition-all resize-none ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
            style={{ fontSize: `${fontSize}px` }}
            rows={6}
            placeholder="Enter your test string here…"
            value={testString}
            onChange={e => setTestString(e.target.value)}
          />
        </div>
      </div>

      {result?.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500 font-mono">
          Invalid regex: {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="space-y-4">
          <dl className="bg-surface border border-border p-4 rounded-xl flex items-center gap-4">
            <div className="text-center">
              <dd className="text-2xl font-black text-blue">{result.matches.length}</dd>
              <dt className="text-xs text-text-4 uppercase tracking-wider">Matches</dt>
            </div>
            {result.matches[0] && result.matches[0].groups.length > 0 && (
              <div className="text-center">
                <dd className="text-2xl font-black text-text">{result.matches[0].groups.length}</dd>
                <dt className="text-xs text-text-4 uppercase tracking-wider">Groups</dt>
              </div>
            )}
          </dl>

          {highlighted && (
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
              <h2 className="text-sm font-bold text-text-2">Highlighted Matches</h2>
              <div className="font-mono text-sm text-text break-all leading-relaxed whitespace-pre-wrap bg-bg border border-border rounded-xl p-4">
                {highlighted.map((part, i) =>
                  part.match
                    ? <mark key={i} className="bg-blue/20 text-blue rounded px-0.5">{part.text}</mark>
                    : <span key={i}>{part.text}</span>
                )}
              </div>
            </div>
          )}

          {result.matches.length > 0 && (
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
              <h2 className="text-sm font-bold text-text-2">Match Details</h2>
              <div className="space-y-2">
                {result.matches.slice(0, 50).map((m, i) => (
                  <div key={i} className="bg-bg border border-border rounded-xl p-3 text-sm">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold text-text-4">#{i + 1}</span>
                      <span className="font-mono text-blue">"{m.value}"</span>
                      <span className="text-xs text-text-4">at index {m.index}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {m.groups.map((g, gi) => (
                          <span key={gi} className="text-xs font-mono text-text-3">
                            Group {gi + 1}: <span className="text-text">"{g ?? "undefined"}"</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {result.matches.length > 50 && (
                  <p className="text-xs text-text-4 text-center">Showing 50 of {result.matches.length} matches</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Regex Library Browser */}
      <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue" />
              Regex Library
            </h2>
            <p className="text-xs text-text-4">
              Browse and search 100+ production-ready regular expressions with interactive testing.
            </p>
          </div>
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by label, pattern, description..."
              className="w-full pl-9 pr-8 py-2 bg-bg border border-border rounded-xl text-xs text-text focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all placeholder:text-text-4"
              value={librarySearch}
              onChange={e => setLibrarySearch(e.target.value)}
            />
            {librarySearch && (
              <button
                onClick={() => setLibrarySearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-4 hover:text-text cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Scroll */}
        <div className="relative w-full border-b border-border/50 pb-2">
          {/* Gradient Fades */}
          <div 
            className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-surface to-transparent pointer-events-none transition-opacity duration-200 z-content"
            style={{ opacity: showLeftScrollBtn ? 1 : 0 }}
          />
          <div 
            className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-surface to-transparent pointer-events-none transition-opacity duration-200 z-content"
            style={{ opacity: showRightScrollBtn ? 1 : 0 }}
          />

          {/* Navigation Buttons for desktop */}
          {showLeftScrollBtn && (
            <button 
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-2 hover:bg-bg hover:text-blue transition-all z-above cursor-pointer hidden md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {showRightScrollBtn && (
            <button 
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-2 hover:bg-bg hover:text-blue transition-all z-above cursor-pointer hidden md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={updateScrollButtons}
            className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-proximity px-1 py-1"
          >
            {allCategories.map(catItem => {
              const isActive = activeLibCategory === catItem.id;
              return (
                <button
                  key={catItem.id}
                  onClick={(e) => {
                    setActiveLibCategory(catItem.id);
                    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                  }}
                  className={`snap-start px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border select-none cursor-pointer ${
                    isActive 
                      ? "bg-blue text-white border-blue shadow-sm shadow-blue/20" 
                      : "bg-bg text-text-2 border-border hover:border-blue/50 hover:text-blue"
                  }`}
                >
                  {catItem.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPatterns.slice(0, visibleCount).map((pat) => (
              <m.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={pat.id}
                className="bg-bg border border-border hover:border-blue/50 hover:shadow-sm rounded-xl p-4 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xs text-text group-hover:text-blue transition-colors truncate" title={pat.label}>
                      {pat.label}
                    </h3>
                    <span className="text-tiny px-1.5 py-0.5 rounded font-medium bg-surface text-text-3 border border-border uppercase shrink-0">
                      {pat.category === "dev" ? "Dev" : pat.category === "indian" ? "Indian" : pat.category}
                    </span>
                  </div>

                  {/* Regex code block with copy button */}
                  <div className="relative bg-surface font-mono text-xs px-2.5 py-1.5 rounded-lg border border-border text-blue overflow-x-auto scrollbar-none flex justify-between items-center gap-2">
                    <span className="font-semibold select-all truncate">
                      /{pat.pattern}/
                    </span>
                    <button
                      onClick={() => handleCopyPattern(pat.id, pat.pattern)}
                      className="text-text-4 hover:text-blue p-0.5 rounded hover:bg-bg transition-colors shrink-0"
                      title="Copy regular expression"
                    >
                      {copiedPatternId === pat.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Description (community-style) */}
                  <p className="text-xs text-text-3 font-normal leading-relaxed line-clamp-3 min-h-12">
                    {pat.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 space-y-2.5">
                  {/* Example */}
                  <div className="flex items-center gap-1.5 text-xs text-text-4 bg-surface/30 px-2 py-1 rounded border border-border/30">
                    <span className="font-semibold text-text-3 shrink-0">Example:</span>
                    <code className="font-mono text-text truncate max-w-full" title={pat.example}>
                      {pat.example}
                    </code>
                  </div>

                  {/* Action buttons */}
                  <button
                    onClick={() => handleInsertPattern(pat)}
                    className="w-full py-1.5 bg-surface hover:bg-blue hover:text-white border border-border hover:border-blue text-xs font-semibold text-text rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Insert Into Tester
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </m.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPatterns.length === 0 && (
          <div className="text-center py-10 space-y-2 border border-dashed border-border rounded-xl">
            <Info className="w-8 h-8 text-text-4 mx-auto" />
            <h3 className="font-bold text-xs text-text">No patterns found</h3>
            <p className="text-xs text-text-4 max-w-md mx-auto">
              We couldn't find any patterns matching "{librarySearch}" in the "{allCategories.find(c => c.id === activeLibCategory)?.label}" category.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPatterns.length > visibleCount && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-5 py-2 bg-bg hover:bg-surface border border-border hover:border-blue/50 text-xs font-semibold text-text hover:text-blue rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              Show More Patterns
              <span className="text-tiny px-1.5 py-0.5 bg-surface rounded text-text-3 border border-border">
                {filteredPatterns.length - visibleCount} remaining
              </span>
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
