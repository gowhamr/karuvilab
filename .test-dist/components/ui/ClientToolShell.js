'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from 'next/link';
import { ALL_TOOLS } from '@/src/tool-registry';
import { Check, ChevronRight, FileText, Share2 } from 'lucide-react';
import { ToolIcon } from '@/components/ui/Icons';
import { ErrorBoundary } from './ErrorBoundary';
import { FavoriteButton } from './FavoriteButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ToolMoreMenu } from './ToolMoreMenu';
import { ToolInfoSection } from './ToolInfoSection';
import { ProgressOverlay, ProgressToast } from '@/components/ui/Progress';
import { cn } from '@/src/lib/utils';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FocusModeWrapper } from './FocusModeWrapper';
import { ProgressProvider } from '@/src/contexts/ProgressContext';
import { useWorkflowIntegration } from '@/src/lib/workflow-hook';
import { m } from 'framer-motion';
import { useIntelligenceStore } from '@/src/store/useIntelligenceStore';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/src/lib/security';
function stripHtmlAndTruncate(html, maxLength = 80) {
    if (!html)
        return '';
    const text = html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
}
function UseCasesList({ useCases, visibleExamples = 2 }) {
    const [expanded, setExpanded] = useState(false);
    const showMoreButton = useCases.length > visibleExamples;
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: useCases.map((uc, i) => (_jsxs("div", { className: cn("items-start gap-3 p-4 bg-surface-elevated border border-border rounded-2xl", !expanded && i >= visibleExamples ? "hidden" : "flex"), children: [_jsx(Check, { className: "w-5 h-5 text-success shrink-0" }), _jsx("span", { className: "text-text-2 text-sm", children: uc })] }, i))) }), showMoreButton && (_jsx("button", { onClick: () => setExpanded(!expanded), className: "text-sm font-bold text-blue hover:underline py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm", children: expanded ? "Show Less ▴" : "Show More ▾" }))] }));
}
function FAQList({ faq }) {
    const [expanded, setExpanded] = useState(false);
    const visibleCount = 3;
    const showMoreButton = faq.length > visibleCount;
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "space-y-4", children: faq.map((item, i) => (_jsxs("div", { className: cn("p-6 bg-surface-elevated border border-border rounded-2xl space-y-3", !expanded && i >= visibleCount ? "hidden" : "block"), children: [_jsx("h4", { className: "font-bold text-text", children: item.question }), _jsx("div", { className: "text-text-3 text-sm leading-relaxed prose prose-sm prose-slate dark:prose-invert max-w-none", dangerouslySetInnerHTML: { __html: sanitizeHtml(item.answer) } })] }, i))) }), showMoreButton && (_jsx("button", { onClick: () => setExpanded(!expanded), className: "text-sm font-bold text-blue hover:underline py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm", children: expanded ? "View Less FAQs ▴" : "View All FAQs ▾" }))] }));
}
export function ClientToolShell({ title, description, category, children, toolId, content, parsedContent, fullWidth, workspaceSize, visibleExamples = 2 }) {
    const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
    const finalToolId = toolId || currentTool?.id || '';
    useWorkflowIntegration(finalToolId);
    const recordTransition = useIntelligenceStore(s => s.recordTransition);
    useEffect(() => {
        if (finalToolId) {
            recordTransition(finalToolId);
        }
    }, [finalToolId, recordTransition]);
    const [isEmbed, setIsEmbed] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            Promise.resolve().then(() => {
                setIsEmbed(params.get("embed") === "true");
            });
        }
    }, []);
    const storageKey = `kv-accordion-state-${finalToolId}`;
    const [openSectionId, setOpenSectionId] = useState(null);
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(storageKey);
            if (stored) {
                Promise.resolve().then(() => {
                    setOpenSectionId(stored);
                });
            }
        }
        catch (e) { }
    }, [storageKey]);
    const handleSectionToggle = (id, isOpen) => {
        const newId = isOpen ? id : null;
        setOpenSectionId(newId);
        try {
            if (newId) {
                sessionStorage.setItem(storageKey, newId);
            }
            else {
                sessionStorage.removeItem(storageKey);
            }
        }
        catch (e) { }
    };
    const fallbackParsedContent = useMemo(() => ({
        detailedDescription: '',
        howTo: [],
        faq: []
    }), []);
    const finalParsedContent = parsedContent || fallbackParsedContent;
    const [activeTab, setActiveTab] = useState('tool');
    const related = useMemo(() => {
        if (!category?.id)
            return [];
        return ALL_TOOLS.filter(t => t.category === category.id && t.id !== finalToolId);
    }, [category, finalToolId]);
    const relatedIds = useMemo(() => {
        return related.map(t => t.id);
    }, [related]);
    const handleShare = useCallback(async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `KV - ${title}`,
                    url: window.location.href,
                });
            }
            else {
                throw new Error("Share API not available");
            }
        }
        catch {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    }, [title]);
    const getSuggestions = useIntelligenceStore(s => s.getSuggestions);
    const suggestionIds = useMemo(() => getSuggestions(finalToolId), [finalToolId, getSuggestions]);
    // Filter out the current tool and any explicitly related tools, so we only show ML discovered workflows.
    const suggestions = useMemo(() => ALL_TOOLS.filter(t => suggestionIds.includes(t.id) && t.id !== finalToolId && !relatedIds.includes(t.id)), [suggestionIds, finalToolId, relatedIds]);
    const isWideWorkspace = workspaceSize === 'wide' || (!workspaceSize && category && ['developer', 'pdf', 'image', 'media', 'productivity', 'security'].includes(category.id));
    const containerWidthClass = isEmbed
        ? "w-full max-w-none px-2 py-4"
        : (fullWidth || workspaceSize === 'full')
            ? "w-full max-w-none px-4 md:px-8"
            : isWideWorkspace
                ? "max-w-screen-2xl px-4 md:px-8"
                : "max-w-7xl px-4 md:px-8";
    return (_jsxs(m.div, { initial: false, animate: { opacity: 1, y: 0 }, className: cn(containerWidthClass, "mx-auto space-y-8 sm:space-y-10 lg:space-y-12", !isEmbed && "pb-24"), children: [!isEmbed && (_jsxs("header", { className: "space-y-4 relative z-above", children: [_jsx(Breadcrumbs, { category: category, title: title }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-divider pb-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0", children: _jsx(ToolIcon, { toolId: finalToolId, category: category?.id, className: "w-6 h-6" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-black tracking-tight leading-none text-text-primary", children: title }), category && (_jsx(Badge, { variant: "primary", size: "sm", className: "bg-primary/10 text-primary border border-primary/20", children: category.label })), currentTool?.difficulty && (_jsx(Badge, { variant: currentTool.difficulty === 'beginner' ? 'success' :
                                                            currentTool.difficulty === 'intermediate' ? 'warning' : 'danger', size: "sm", children: currentTool.difficulty }))] }), description && (_jsx("p", { className: "text-sm text-text-muted max-w-2xl leading-relaxed", children: description })), (currentTool?.version || currentTool?.lastVerified) && (_jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-2 text-xs text-text-4 font-mono", children: [currentTool.version && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "opacity-60", children: "v" }), currentTool.version] })), currentTool.version && currentTool.lastVerified && _jsx("span", { className: "opacity-30", children: "\u2022" }), currentTool.lastVerified && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "opacity-60", children: "Verified:" }), " ", currentTool.lastVerified] }))] }))] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsxs(Button, { variant: "secondary", size: "sm", onClick: handleShare, className: "h-10 px-3 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary font-bold", "aria-label": "Share this tool", children: [_jsx(Share2, { className: "w-4 h-4" }), _jsx("span", { children: "Share" })] }), currentTool && _jsx(FavoriteButton, { toolId: currentTool.id }), _jsx(ToolMoreMenu, { toolId: finalToolId, toolName: title })] })] })] })), !isEmbed && related.length > 0 && (_jsxs("div", { className: "flex border-b border-divider gap-6", role: "tablist", "aria-label": "Tool views", children: [_jsx("button", { onClick: () => setActiveTab('tool'), className: cn("pb-3 font-bold text-sm border-b-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs relative px-1 cursor-pointer", activeTab === 'tool'
                            ? "border-primary text-text-primary font-black"
                            : "border-transparent text-text-secondary hover:text-text-primary"), role: "tab", "aria-selected": activeTab === 'tool', "aria-controls": "tabpanel-tool", id: "tab-tool", children: "Tool" }), _jsxs("button", { onClick: () => setActiveTab('related'), className: cn("pb-3 font-bold text-sm border-b-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs relative px-1 cursor-pointer", activeTab === 'related'
                            ? "border-primary text-text-primary font-black"
                            : "border-transparent text-text-secondary hover:text-text-primary"), role: "tab", "aria-selected": activeTab === 'related', "aria-controls": "tabpanel-related", id: "tab-related", children: ["Related Tools (", related.length, ")"] })] })), _jsx("div", { className: "space-y-10", children: activeTab === 'tool' ? (_jsxs("div", { role: "tabpanel", id: "tabpanel-tool", "aria-labelledby": "tab-tool", children: [_jsx("section", { className: "mb-12", "aria-live": "polite", "aria-atomic": "false", children: _jsx(ErrorBoundary, { children: _jsx(FocusModeWrapper, { toolId: finalToolId, toolName: title, children: _jsxs(ProgressProvider, { children: [_jsx(ProgressOverlay, {}), _jsx(ProgressToast, {}), children] }) }) }) }), !isEmbed && (_jsxs(_Fragment, { children: [((finalParsedContent?.howTo && finalParsedContent.howTo.length > 0) ||
                                    (content?.useCases && content.useCases.length > 0) ||
                                    (finalParsedContent?.faq && finalParsedContent.faq.length > 0) ||
                                    !!finalParsedContent?.detailedDescription) && (_jsx("div", { className: "max-w-4xl mx-auto space-y-8", children: _jsx(ToolInfoSection, { toolId: finalToolId, id: "learn-more", title: "\uD83D\uDCDA Learn More", preview: "Quick guide, tips, FAQ, deep dive, and documentation.", isOpen: openSectionId === 'learn-more', onToggle: (isOpen) => handleSectionToggle('learn-more', isOpen), children: _jsxs("div", { className: "space-y-10", children: [finalParsedContent.howTo && finalParsedContent.howTo.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-black text-text tracking-tight", children: "How to use" }), _jsx("div", { className: "space-y-3", children: finalParsedContent.howTo.map((step, i) => (_jsxs("li", { className: "flex gap-4 group", children: [_jsx("span", { className: "flex-shrink-0 w-6 h-6 rounded-lg bg-blue/10 text-blue flex items-center justify-center text-xs font-bold", children: i + 1 }), _jsx("div", { className: "text-text-2 text-sm leading-snug pt-0.5 prose prose-sm prose-slate dark:prose-invert max-w-none", dangerouslySetInnerHTML: { __html: sanitizeHtml(step) } })] }, i))) })] })), content?.useCases && content.useCases.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-bold text-text mb-4", children: "Tips & Use Cases" }), _jsx(UseCasesList, { useCases: content.useCases, visibleExamples: visibleExamples })] })), finalParsedContent.faq && finalParsedContent.faq.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-black text-text tracking-tight", children: "Frequently Asked Questions" }), _jsx(FAQList, { faq: finalParsedContent.faq })] })), finalParsedContent.detailedDescription && (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-black text-text tracking-tight", children: "About this tool" }), _jsx("div", { className: "prose prose-sm prose-slate dark:prose-invert max-w-none text-text-2 leading-relaxed prose-p:leading-relaxed prose-p:my-3 prose-headings:font-bold prose-headings:text-text prose-a:text-blue hover:prose-a:underline prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs", dangerouslySetInnerHTML: {
                                                                __html: sanitizeHtml(finalParsedContent.detailedDescription
                                                                    .replace(/<p>\s*<em>\s*\*?End of Elite Learning Hub Content\.?\*?\s*<\/em>\s*<\/p>/gi, '')
                                                                    .replace(/<p>\s*\*?End of Elite Learning Hub Content\.?\*?\s*<\/p>/gi, '')
                                                                    .replace(/\*?End of Elite Learning Hub Content\.?\*?/gi, ''))
                                                            } })] })), currentTool?.changelog && currentTool.changelog.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-black text-text tracking-tight", children: "Version History & Changelog" }), _jsx("div", { className: "space-y-4 border-l-2 border-border pl-4", children: currentTool.changelog.map((log, idx) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "font-bold text-sm text-text", children: ["v", log.version] }), _jsx("span", { className: "text-xs text-text-4", children: log.date })] }), _jsx("ul", { className: "list-disc pl-4 space-y-1 text-sm text-text-3", children: log.changes.map((change, cIdx) => (_jsx("li", { children: change }, cIdx))) })] }, idx))) })] })), _jsxs("section", { children: [_jsx("h2", { className: "text-lg font-bold text-text mb-4", children: "Documentation & Help" }), _jsx("div", { className: "grid grid-cols-1 gap-4", children: _jsxs(Link, { href: "/help", className: "flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl hover:border-blue transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center shrink-0", children: _jsx(FileText, { className: "w-4 h-4 text-blue group-hover:scale-110 transition-transform" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm text-text", children: "Documentation & Help" }), _jsx("p", { className: "text-xs text-text-4", children: "Read the full manual and troubleshooting guides" })] })] }) })] })] }) }) })), suggestions.length > 0 && (_jsxs("section", { className: "pt-12 border-t border-border space-y-8", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [_jsx("span", { className: "w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center", children: "\u2728" }), "Suggested Next Steps"] }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: suggestions.map(tool => (_jsxs(Link, { href: tool.href, className: "flex items-center gap-4 p-4 bg-surface-elevated border border-border shadow-sm rounded-2xl hover:border-blue/50 hover:bg-blue/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0", children: _jsx(ToolIcon, { toolId: tool.id, category: tool.category, className: "w-5 h-5 text-blue" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "font-bold text-sm truncate group-hover:text-blue transition-colors", children: tool.name }), _jsx("p", { className: "text-xs text-text-4 truncate", children: "Based on your workflow" })] })] }, tool.id))) })] }))] }))] })) : (related.length > 0 && (_jsxs("section", { className: "space-y-6 pt-2", "aria-live": "polite", role: "tabpanel", id: "tabpanel-related", "aria-labelledby": "tab-related", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-xl font-black text-text-primary", children: ["Related Tools in ", category?.label] }), _jsxs(Link, { href: "/all-tools", className: "text-xs font-bold uppercase tracking-widest text-blue hover:underline", children: ["Browse all ", _jsx(ChevronRight, { className: "inline w-3 h-3" })] })] }), _jsx("div", { className: "flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 snap-x", children: related.map(tool => (_jsx("div", { className: "w-[280px] shrink-0 snap-start h-full", children: _jsx(ToolCard, { tool: tool, compact: true }) }, tool.id))) })] }))) })] }));
}
