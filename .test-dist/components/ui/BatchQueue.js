"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useEffect, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { File, Trash2, Play, XCircle, CircleCheckBig as CheckCircle2, CircleAlert as AlertCircle, Download, X, Clock, Inbox, RotateCcw } from 'lucide-react';
import { useBatchStore } from '@/src/store/useBatchStore';
import { StatusBadge } from '@/components/system/StatusBadge';
import { cn } from '@/src/lib/utils';
import { useContextualActionBar } from '@/src/store/useContextualActionBar';
import { EmptyState } from '@/components/ui/EmptyState';
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const EMPTY_ARRAY = [];
const BatchQueueItemComponent = memo(({ item, toolId, renderThumbnail, onDownload, removeItem, cancelItem }) => {
    return (_jsxs(m.div, { layout: true, initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }, className: cn("group bg-surface-2 border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all relative overflow-hidden", item.status === 'completed' ? "border-green-500/10" : "border-border hover:border-blue/30", item.status === 'failed' ? "border-red-500/30 border-l-4 border-l-red-500" : ""), children: [_jsxs("div", { className: "flex items-start sm:items-center gap-3 sm:gap-4 w-full flex-1 min-w-0", children: [_jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-bg border border-border shadow-inner overflow-hidden", children: renderThumbnail ? renderThumbnail(item) : (_jsx(File, { className: cn("w-5 h-5 sm:w-6 sm:h-6", item.status === 'completed' ? "text-green-500" :
                                item.status === 'failed' ? "text-red-500" : "text-text-4") })) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-1.5 sm:space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 sm:gap-4", children: [_jsx("p", { className: "font-bold truncate text-xs sm:text-sm text-text tracking-tight", children: item.file.name }), _jsx(StatusBadge, { status: item.status })] }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [_jsx("div", { className: "flex-1 h-1.5 bg-bg rounded-full overflow-hidden shadow-inner", children: _jsx(m.div, { initial: { width: 0 }, animate: { width: `${item.progress || (item.status === 'completed' ? 100 : 0)}%` }, className: cn("h-full transition-all duration-300", item.status === 'completed' ? "bg-green-500" :
                                                item.status === 'failed' ? "bg-red-500" :
                                                    "bg-blue"), style: { width: `${item.progress || (item.status === 'completed' ? 100 : 0)}%` } }) }), _jsx("span", { className: "text-[10px] sm:text-xs font-black font-mono text-text-4 w-8 sm:w-10 text-right", children: item.status === 'completed' ? '100%' : `${Math.round(item.progress)}%` })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] sm:text-xs font-medium text-text-4 uppercase tracking-widest min-w-0", children: [_jsx("span", { className: "truncate flex-shrink", children: formatBytes(item.file.size) }), item.status === 'completed' && item.result && (_jsxs("span", { className: "text-green-500 font-black truncate flex-shrink", children: ["\u2192 ", formatBytes(item.result.compressedSize), " ", _jsxs("span", { className: "hidden sm:inline", children: ["(", Math.round((1 - item.result.compressedSize / item.file.size) * 100), "% Small)"] })] })), item.status === 'failed' && (_jsx("button", { onClick: () => useBatchStore.getState().updateItem(toolId, item.id, { status: 'pending', progress: 0, error: undefined }), className: "text-blue font-black hover:underline underline-offset-4", children: "Retry" }))] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-1 mt-1 sm:mt-0 w-full sm:w-auto shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 border-t sm:border-none border-border pt-2 sm:pt-0", children: [item.status === 'completed' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => useBatchStore.getState().reprocessItem(toolId, item.id), className: "flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-text hover:text-blue hover:bg-blue/10 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue transition-colors bg-surface sm:bg-transparent border sm:border-none border-border", "aria-label": `Reprocess ${item.file.name}`, title: "Use output as new input", children: _jsx(RotateCcw, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => onDownload(item), className: "flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-blue hover:bg-blue/10 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue transition-colors bg-blue/5 sm:bg-transparent border sm:border-none border-blue/20", "aria-label": `Download ${item.file.name}`, title: "Download", children: _jsx(Download, { className: "w-4 h-4" }) })] })), (item.status === 'processing' || item.status === 'pending') && (_jsx("button", { onClick: () => cancelItem(toolId, item.id), className: "flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-text-4 hover:text-red-500 hover:bg-red-500/5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-surface sm:bg-transparent border sm:border-none border-border", "aria-label": `Cancel ${item.file.name}`, children: _jsx(X, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => removeItem(toolId, item.id), disabled: item.status === 'processing', className: "flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-text-4 hover:text-red-500 hover:bg-red-500/5 rounded-lg disabled:opacity-10 transition-colors bg-surface sm:bg-transparent border sm:border-none border-border", "aria-label": "Remove item", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }));
});
export function BatchQueue({ toolId, onDownload, onDownloadAll, onProcess, isProcessing, processLabel = 'Execute All', renderThumbnail }) {
    const items = useBatchStore(state => state.items[toolId] || EMPTY_ARRAY);
    const removeItem = useBatchStore(state => state.removeItem);
    const clearItems = useBatchStore(state => state.clearItems);
    const clearCompletedItems = useBatchStore(state => state.clearCompletedItems);
    const cancelItem = useBatchStore(state => state.cancelItem);
    const cancelAll = useBatchStore(state => state.cancelAll);
    const stats = useMemo(() => {
        const total = items.length;
        const completed = items.filter(i => i.status === 'completed').length;
        const failed = items.filter(i => i.status === 'failed').length;
        const processing = items.filter(i => i.status === 'processing').length;
        const pending = items.filter(i => i.status === 'pending').length;
        const originalSize = items.reduce((acc, i) => acc + i.file.size, 0);
        const resultSize = items.reduce((acc, i) => acc + (i.result?.compressedSize || 0), 0);
        const saved = originalSize > 0 && resultSize > 0 ? originalSize - resultSize : 0;
        return { total, completed, failed, processing, pending, originalSize, resultSize, saved };
    }, [items]);
    const setBarConfig = useContextualActionBar(s => s.setBarConfig);
    const hideBar = useContextualActionBar(s => s.hide);
    const overallProgress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    const allCompleted = stats.total > 0 && stats.completed === stats.total;
    useEffect(() => {
        if (items.length === 0) {
            hideBar();
            return;
        }
        if (isProcessing) {
            setBarConfig({
                type: "processing",
                progress: overallProgress,
                label: `Processing ${stats.processing + stats.pending} files...`,
                onCancel: () => cancelAll(toolId),
            });
        }
        else if (allCompleted) {
            setBarConfig({
                type: "done",
                primaryLabel: onDownloadAll ? "Bundle .ZIP" : "Clear Queue",
                onPrimaryClick: onDownloadAll || (() => clearItems(toolId)),
                secondaryLabel: onDownloadAll ? "Clear" : undefined,
                onSecondaryClick: onDownloadAll ? (() => clearItems(toolId)) : undefined,
            });
        }
        else {
            setBarConfig({
                type: "idle",
                label: processLabel,
                onClick: onProcess,
            });
        }
        return () => {
            hideBar();
        };
    }, [
        processLabel,
        items.length,
        isProcessing,
        overallProgress,
        stats.processing,
        stats.pending,
        allCompleted,
        onDownloadAll,
        onProcess,
        toolId,
        cancelAll,
        clearItems,
        setBarConfig,
        hideBar
    ]);
    if (items.length === 0)
        return (_jsx(EmptyState, { icon: Inbox, headline: "Queue is empty", toolType: "batch", toolId: toolId, onDrop: () => { }, dragState: "idle", subAction: { label: "Upload files to begin batch processing", onClick: () => { } } }));
    return (_jsxs("div", { className: "space-y-6", role: "region", "aria-label": "Processing Queue", children: [_jsxs("div", { className: "bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-1.5 bg-surface-2 overflow-hidden", children: _jsx(m.div, { initial: { width: 0 }, animate: { width: `${overallProgress}%` }, transition: { duration: 0.5, ease: "easeOut" }, className: cn("h-full bg-gradient-to-r from-blue to-blue-light transition-all", isProcessing && "animate-pulse"), style: { width: `${overallProgress}%` } }) }), _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-1", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs("h3", { className: "font-black text-2xl flex items-center gap-3 tracking-tight", children: ["Process Queue", _jsxs("span", { className: "text-xs font-black text-blue bg-blue/10 border border-blue/20 px-2.5 py-1 rounded-full uppercase tracking-widest", children: [stats.total, " Files"] })] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-tiny font-bold uppercase tracking-widest-sm-md text-text-4", role: "status", "aria-live": "polite", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "w-3 h-3 text-green-500" }), " ", stats.completed, " Complete"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-3 h-3 text-blue" }), " ", stats.pending + stats.processing, " Active"] }), stats.failed > 0 && _jsxs("span", { className: "flex items-center gap-1.5 text-red-500", children: [_jsx(AlertCircle, { className: "w-3 h-3" }), " ", stats.failed, " Errors"] }), stats.saved > 0 && _jsxs("span", { className: "text-green-500 font-black", children: ["Saved ", formatBytes(stats.saved)] })] })] }), _jsx("div", { className: "flex flex-wrap gap-2 w-full md:w-auto", children: !isProcessing ? (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: onProcess, disabled: isProcessing || stats.pending + stats.failed === 0, className: "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 bg-blue text-white font-black rounded-xl hover:shadow-md hover:shadow-blue/10 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-30 outline-none focus-visible:ring-2 focus-visible:ring-blue min-w-0", children: [_jsx(Play, { className: "w-3.5 h-3.5 fill-current" }), " ", processLabel] }), onDownloadAll && stats.completed > 0 && (_jsxs("button", { onClick: onDownloadAll, className: "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-bg border border-border text-text font-black rounded-xl hover:border-blue transition-all text-xs uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-blue min-w-0", children: [_jsx(Download, { className: "w-3.5 h-3.5 shrink-0" }), " ", _jsx("span", { className: "truncate", children: "Bundle .ZIP" })] })), _jsx("button", { onClick: () => clearItems(toolId), className: "p-3 text-text-4 hover:text-red-500 transition-colors outline-none rounded-xl hover:bg-red-500/5 shrink-0", "aria-label": "Clear Queue", children: _jsx(Trash2, { className: "w-5 h-5" }) })] })) : (_jsxs("button", { onClick: () => cancelAll(toolId), className: "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 bg-red-500/10 text-red-500 font-black rounded-xl hover:bg-red-500/20 transition-all text-xs uppercase tracking-widest border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500 min-w-0", children: [_jsx(XCircle, { className: "w-3.5 h-3.5 shrink-0" }), " ", _jsx("span", { className: "truncate", children: "Halt Processing" })] })) })] })] }), _jsx("div", { className: "grid gap-3 max-h-full overflow-y-auto pr-2 custom-scrollbar-thin", role: "list", children: _jsx(AnimatePresence, { initial: false, mode: "popLayout", children: items.map((item, index) => (_jsx(BatchQueueItemComponent, { item: item, toolId: toolId, renderThumbnail: renderThumbnail, onDownload: onDownload, removeItem: removeItem, cancelItem: cancelItem }, item.id))) }) }), _jsx("style", { jsx: true, global: true, children: `
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--kv-border);
          border-radius: 4px;
        }
      ` })] }));
}
