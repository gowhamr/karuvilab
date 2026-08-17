"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useRef, useEffect } from "react";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { REGEX_CATEGORIES, REGEX_LIBRARY } from "../library";
import { BookOpen, Search, Copy, Check, ChevronLeft, ChevronRight, ArrowUpRight, Info } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
export default function RegexTesterClient() {
    const { toast } = useToast();
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
    const [testString, setTestString] = useState("");
    const [fontSize, setFontSize] = useState(14);
    const [wordWrap, setWordWrap] = useState(true);
    const [replaceStr, setReplaceStr] = useState("");
    const [mode, setMode] = useState("match");
    // Regex Library state
    const [librarySearch, setLibrarySearch] = useState("");
    const [activeLibCategory, setActiveLibCategory] = useState("all");
    const [copiedPatternId, setCopiedPatternId] = useState(null);
    const [visibleCount, setVisibleCount] = useState(12);
    const scrollContainerRef = useRef(null);
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
        if (!el)
            return;
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
    const handleCopyPattern = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedPatternId(id);
        setTimeout(() => setCopiedPatternId(null), 2000);
    };
    const handleInsertPattern = (patternObj) => {
        setPattern(patternObj.pattern);
        const newFlags = { g: false, i: false, m: false, s: false, u: false };
        for (const f of patternObj.flags) {
            if (f in newFlags)
                newFlags[f] = true;
        }
        setFlags(newFlags);
        setTestString(patternObj.example);
    };
    const flagString = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
    const result = useMemo(() => {
        if (!pattern || !testString)
            return null;
        try {
            const re = new RegExp(pattern, flagString);
            const matches = [];
            if (flags.g) {
                let m;
                while ((m = re.exec(testString)) !== null) {
                    matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
                    if (!flags.g || re.lastIndex === m.index)
                        break;
                }
            }
            else {
                const m = re.exec(testString);
                if (m)
                    matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
            }
            return { matches, error: null };
        }
        catch (e) {
            return { matches: [], error: e.message };
        }
    }, [pattern, flagString, testString, flags.g]);
    const replaceOutput = useMemo(() => {
        if (!pattern || !testString)
            return null;
        try {
            const re = new RegExp(pattern, flagString);
            return testString.replace(re, replaceStr);
        }
        catch {
            return null;
        }
    }, [pattern, flagString, testString, replaceStr]);
    const highlighted = useMemo(() => {
        if (!result || result.error || result.matches.length === 0)
            return null;
        try {
            const re = new RegExp(pattern, flagString.includes("g") ? flagString : flagString + "g");
            const parts = [];
            let last = 0;
            testString.replace(re, (match, ...args) => {
                const offset = args[args.length - 2];
                if (offset > last)
                    parts.push({ text: testString.slice(last, offset), match: false });
                parts.push({ text: match, match: true });
                last = offset + match.length;
                return match;
            });
            if (last < testString.length)
                parts.push({ text: testString.slice(last), match: false });
            return parts;
        }
        catch {
            return null;
        }
    }, [pattern, flagString, testString, result]);
    useFocusModeIntegration({
        charCount: testString.length,
        lineCount: testString ? testString.split('\n').length : 0,
        language: "regex",
        onFontSizeChange: setFontSize,
        onWrapToggle: () => setWordWrap(v => !v)
    });
    return (_jsx(ToolWorkspace, { layout: "split", tabs: {
            options: [
                { id: "match", label: "Match" },
                { id: "replace", label: "Replace" }
            ],
            activeId: mode,
            onChange: (id) => setMode(id)
        }, input: _jsxs("div", { className: "space-y-6 flex flex-col h-full", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "regex-pattern", className: "text-sm font-bold text-text-2", children: "Pattern" }), _jsxs("div", { className: "flex items-center bg-bg border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue transition-all h-12", children: [_jsx("span", { className: "px-3 text-text-4 font-mono text-lg select-none", children: "/" }), _jsx("input", { id: "regex-pattern", "aria-label": "Regular expression pattern", className: "flex-1 py-3 bg-transparent font-mono text-sm outline-none text-text", placeholder: "[a-z]+", value: pattern, onChange: e => setPattern(e.target.value) }), _jsxs("span", { className: "px-3 text-text-4 font-mono text-lg select-none", children: ["/", flagString] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-text-2", children: "Flags" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [Object.keys(flags).map(f => (_jsx("button", { onClick: () => setFlags(prev => ({ ...prev, [f]: !prev[f] })), className: `px-3 py-1.5 rounded-lg text-sm font-mono font-bold border transition-all ${flags[f] ? "bg-blue text-white border-blue" : "bg-bg border-border text-text-2 hover:border-blue"}`, children: f }, f))), _jsx("span", { className: "text-xs text-text-4 self-center ml-1", children: "g=global i=case-insensitive m=multiline s=dotall u=unicode" })] })] }), _jsxs("div", { className: "space-y-2 flex-1 flex flex-col", children: [_jsx("div", { className: "flex justify-between items-center px-1", children: _jsx("label", { htmlFor: "regex-test-string", className: "text-sm font-bold text-text-2", children: "Test String" }) }), _jsx("textarea", { id: "regex-test-string", "aria-label": "Test string to match against", className: `w-full flex-1 min-h-32 px-4 py-3 bg-bg border border-border rounded-xl font-mono focus:ring-2 focus:ring-blue outline-none transition-all resize-none ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`, style: { fontSize: `${fontSize}px` }, placeholder: "Enter your test string here\u2026", value: testString, onChange: e => {
                                if (e.target.value.length > 5 * 1024 * 1024) {
                                    toast("Input text exceeds 5MB limit", "error");
                                }
                                else {
                                    setTestString(e.target.value);
                                }
                            } })] }), mode === "replace" && (_jsx(ToolInput, { label: "Replacement", placeholder: "Replacement (e.g. $1, <b>$2</b>)\u2026", value: replaceStr, onChange: setReplaceStr, mono: true }))] }), output: _jsxs("div", { className: "space-y-6 h-full flex flex-col", children: [_jsx("h2", { className: "text-sm font-bold text-text-2", children: "Results" }), result?.error && (_jsxs("div", { className: "bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500 font-mono", children: ["Invalid regex: ", result.error] })), !result?.error && !result?.matches?.length && !replaceOutput && (_jsx("div", { className: "flex-1 flex items-center justify-center border border-dashed border-border rounded-xl p-6 text-text-4 italic text-sm", children: "Results will appear here..." })), mode === "replace" && replaceOutput !== null && !result?.error && (_jsx("div", { className: "flex-1 space-y-2 flex flex-col", children: _jsx("pre", { className: "w-full flex-1 min-h-32 px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text whitespace-pre-wrap break-words overflow-auto custom-scrollbar", children: replaceOutput }) })), mode === "match" && result && !result.error && (_jsxs("div", { className: "space-y-4 flex-1 flex flex-col", children: [_jsxs("dl", { className: "bg-bg border border-border p-4 rounded-xl flex items-center gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("dd", { className: "text-2xl font-black text-blue", children: result.matches.length }), _jsx("dt", { className: "text-xs text-text-4 uppercase tracking-wider", children: "Matches" })] }), result.matches[0] && result.matches[0].groups.length > 0 && (_jsxs("div", { className: "text-center", children: [_jsx("dd", { className: "text-2xl font-black text-text", children: result.matches[0].groups.length }), _jsx("dt", { className: "text-xs text-text-4 uppercase tracking-wider", children: "Groups" })] }))] }), highlighted && (_jsxs("div", { className: "flex-1 flex flex-col space-y-2 min-h-32", children: [_jsx("h3", { className: "text-xs font-bold text-text-3 uppercase tracking-widest", children: "Highlighted Matches" }), _jsx("div", { className: "font-mono text-sm text-text break-all leading-relaxed whitespace-pre-wrap bg-bg border border-border rounded-xl p-4 flex-1 overflow-auto custom-scrollbar", children: highlighted.map((part, i) => part.match
                                        ? _jsx("mark", { className: "bg-blue/20 text-blue rounded px-0.5", children: part.text }, i)
                                        : _jsx("span", { children: part.text }, i)) })] })), result.matches.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-xs font-bold text-text-3 uppercase tracking-widest", children: "Match Details" }), _jsxs("div", { className: "space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2", children: [result.matches.slice(0, 50).map((m, i) => (_jsxs("div", { className: "bg-bg border border-border rounded-xl p-3 text-sm", children: [_jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("span", { className: "text-xs font-bold text-text-4", children: ["#", i + 1] }), _jsxs("span", { className: "font-mono text-blue", children: ["\"", m.value, "\""] }), _jsxs("span", { className: "text-xs text-text-4", children: ["at index ", m.index] })] }), m.groups.length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-2", children: m.groups.map((g, gi) => (_jsxs("span", { className: "text-xs font-mono text-text-3", children: ["Group ", gi + 1, ": ", _jsxs("span", { className: "text-text", children: ["\"", g ?? "undefined", "\""] })] }, gi))) }))] }, i))), result.matches.length > 50 && (_jsxs("p", { className: "text-xs text-text-4 text-center", children: ["Showing 50 of ", result.matches.length, " matches"] }))] })] }))] }))] }), infoPanel: _jsxs("div", { className: "bg-surface border border-border p-6 rounded-2xl space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("h2", { className: "text-lg font-bold text-text flex items-center gap-2", children: [_jsx(BookOpen, { className: "w-5 h-5 text-blue" }), "Regex Library"] }), _jsx("p", { className: "text-xs text-text-4", children: "Browse and search 100+ production-ready regular expressions with interactive testing." })] }), _jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4 pointer-events-none" }), _jsx("input", { type: "text", "aria-label": "Search regex library by label, pattern, or description", placeholder: "Search by label, pattern, description...", className: "w-full pl-9 pr-8 py-2 bg-bg border border-border rounded-xl text-xs text-text focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all placeholder:text-text-4", value: librarySearch, onChange: e => setLibrarySearch(e.target.value) }), librarySearch && (_jsx("button", { onClick: () => setLibrarySearch(""), "aria-label": "Clear library search", className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-4 hover:text-text cursor-pointer font-bold", children: "\u2715" }))] })] }), _jsxs("div", { className: "relative w-full border-b border-border/50 pb-2", children: [_jsx("div", { className: "absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-surface to-transparent pointer-events-none transition-opacity duration-200 z-content", style: { opacity: showLeftScrollBtn ? 1 : 0 } }), _jsx("div", { className: "absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-surface to-transparent pointer-events-none transition-opacity duration-200 z-content", style: { opacity: showRightScrollBtn ? 1 : 0 } }), showLeftScrollBtn && (_jsx("button", { onClick: () => scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" }), className: "absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-2 hover:bg-bg hover:text-blue transition-all z-above cursor-pointer hidden md:flex", "aria-label": "Scroll left", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) })), showRightScrollBtn && (_jsx("button", { onClick: () => scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" }), className: "absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-2 hover:bg-bg hover:text-blue transition-all z-above cursor-pointer hidden md:flex", "aria-label": "Scroll right", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })), _jsx("div", { ref: scrollContainerRef, onScroll: updateScrollButtons, className: "flex gap-2 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-proximity px-1 py-1", children: allCategories.map(catItem => {
                                const isActive = activeLibCategory === catItem.id;
                                return (_jsx("button", { onClick: (e) => {
                                        setActiveLibCategory(catItem.id);
                                        e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                                    }, className: `snap-start px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border select-none cursor-pointer ${isActive
                                        ? "bg-blue text-white border-blue shadow-sm shadow-blue/20"
                                        : "bg-bg text-text-2 border-border hover:border-blue/50 hover:text-blue"}`, children: catItem.label }, catItem.id));
                            }) })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: _jsx(AnimatePresence, { mode: "popLayout", children: filteredPatterns.slice(0, visibleCount).map((pat) => (_jsxs(m.div, { layout: true, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }, className: "bg-bg border border-border hover:border-blue/50 hover:shadow-sm rounded-xl p-4 flex flex-col justify-between transition-all group", children: [_jsxs("div", { className: "space-y-2.5", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("h3", { className: "font-bold text-xs text-text group-hover:text-blue transition-colors truncate", title: pat.label, children: pat.label }), _jsx("span", { className: "text-tiny px-1.5 py-0.5 rounded font-medium bg-surface text-text-3 border border-border uppercase shrink-0", children: pat.category === "dev" ? "Dev" : pat.category === "indian" ? "Indian" : pat.category })] }), _jsxs("div", { className: "relative bg-surface font-mono text-xs px-2.5 py-1.5 rounded-lg border border-border text-blue overflow-x-auto scrollbar-none flex justify-between items-center gap-2", children: [_jsxs("span", { className: "font-semibold select-all truncate", children: ["/", pat.pattern, "/"] }), _jsx("button", { onClick: () => handleCopyPattern(pat.id, pat.pattern), className: "text-text-4 hover:text-blue p-0.5 rounded hover:bg-bg transition-colors shrink-0", title: "Copy regular expression", children: copiedPatternId === pat.id ? (_jsx(Check, { className: "w-3.5 h-3.5 text-green-500" })) : (_jsx(Copy, { className: "w-3.5 h-3.5" })) })] }), _jsx("p", { className: "text-xs text-text-3 font-normal leading-relaxed line-clamp-3 min-h-12", children: pat.description })] }), _jsxs("div", { className: "mt-3 pt-3 border-t border-border/40 space-y-2.5", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-text-4 bg-surface/30 px-2 py-1 rounded border border-border/30", children: [_jsx("span", { className: "font-semibold text-text-3 shrink-0", children: "Example:" }), _jsx("code", { className: "font-mono text-text truncate max-w-full", title: pat.example, children: pat.example })] }), _jsxs("button", { onClick: () => handleInsertPattern(pat), className: "w-full py-1.5 bg-surface hover:bg-blue hover:text-white border border-border hover:border-blue text-xs font-semibold text-text rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer", children: ["Insert Into Tester", _jsx(ArrowUpRight, { className: "w-3 h-3" })] })] })] }, pat.id))) }) }), filteredPatterns.length === 0 && (_jsxs("div", { className: "text-center py-10 space-y-2 border border-dashed border-border rounded-xl", children: [_jsx(Info, { className: "w-8 h-8 text-text-4 mx-auto" }), _jsx("h3", { className: "font-bold text-xs text-text", children: "No patterns found" }), _jsxs("p", { className: "text-xs text-text-4 max-w-md mx-auto", children: ["We couldn't find any patterns matching \"", librarySearch, "\" in the \"", allCategories.find(c => c.id === activeLibCategory)?.label, "\" category."] })] })), filteredPatterns.length > visibleCount && (_jsx("div", { className: "text-center pt-2", children: _jsxs("button", { onClick: () => setVisibleCount(prev => prev + 12), className: "px-5 py-2 bg-bg hover:bg-surface border border-border hover:border-blue/50 text-xs font-semibold text-text hover:text-blue rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5", children: ["Show More Patterns", _jsxs("span", { className: "text-tiny px-1.5 py-0.5 bg-surface rounded text-text-3 border border-border", children: [filteredPatterns.length - visibleCount, " remaining"] })] }) }))] }) }));
}
