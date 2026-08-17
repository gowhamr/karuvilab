"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, MousePointer2, Type, PenTool, Square, Image as ImageIcon, Eraser, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ZoomIn, ZoomOut, Undo2, Signature as SignatureIcon, ArrowUpRight, Highlighter } from "lucide-react";
import ThumbnailSidebar from "./ThumbnailSidebar";
import EditorCanvas from "./EditorCanvas";
import AnnotationProperties from "./AnnotationProperties";
import SignatureModal from "./SignatureModal";
import { useEditorStore } from "../store";
import { useProgress } from "@/src/contexts/ProgressContext";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { getSignature } from "../utils/signature-db";
export default function PdfWorkspace({ file, onClear }) {
    const [pdfDoc, setPdfDoc] = useState(null);
    const [error, setError] = useState(null);
    const [currentPageId, setCurrentPageId] = useState("1");
    const [showThumbnails, setShowThumbnails] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const initPages = useEditorStore(s => s.initPages);
    const pages = useEditorStore(s => s.pages);
    const zoom = useEditorStore(s => s.zoom);
    const setZoom = useEditorStore(s => s.setZoom);
    const undoStack = useEditorStore(s => s.undoStack);
    const activeTool = useEditorStore(s => s.activeTool);
    const activePages = pages.filter(p => !p.isDeleted);
    const displayIndex = activePages.findIndex(p => p.id === currentPageId) + 1;
    const numActivePages = activePages.length;
    const [pageInput, setPageInput] = useState(String(displayIndex));
    useEffect(() => {
        setPageInput(String(displayIndex > 0 ? displayIndex : 1));
    }, [displayIndex]);
    const handlePageJump = useCallback((val) => {
        const num = parseInt(val, 10);
        if (!isNaN(num) && num >= 1 && num <= numActivePages) {
            setCurrentPageId(activePages[num - 1].id);
        }
        else {
            setPageInput(String(displayIndex > 0 ? displayIndex : 1));
        }
    }, [activePages, numActivePages, displayIndex]);
    const goToFirstPage = useCallback(() => {
        if (activePages.length > 0)
            setCurrentPageId(activePages[0].id);
    }, [activePages]);
    const goToLastPage = useCallback(() => {
        if (activePages.length > 0)
            setCurrentPageId(activePages[activePages.length - 1].id);
    }, [activePages]);
    const goToPrevPage = useCallback(() => {
        const currentIndex = activePages.findIndex(p => p.id === currentPageId);
        if (currentIndex > 0) {
            setCurrentPageId(activePages[currentIndex - 1].id);
        }
    }, [activePages, currentPageId]);
    const goToNextPage = useCallback(() => {
        const currentIndex = activePages.findIndex(p => p.id === currentPageId);
        if (currentIndex < activePages.length - 1) {
            setCurrentPageId(activePages[currentIndex + 1].id);
        }
    }, [activePages, currentPageId]);
    const handleZoomIn = useCallback(() => {
        setZoom(Math.min(zoom + 0.25, 3.0));
    }, [zoom, setZoom]);
    const handleZoomOut = useCallback(() => {
        setZoom(Math.max(zoom - 0.25, 0.5));
    }, [zoom, setZoom]);
    const handleZoomReset = useCallback(() => {
        setZoom(1.0);
    }, [setZoom]);
    const handleUndo = useCallback(() => {
        useEditorStore.getState().undo();
    }, []);
    const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
    const { createUrl, revokeUrl } = useObjectUrlManager();
    useEffect(() => {
        if (activePages.length > 0 && displayIndex === 0) {
            setCurrentPageId(activePages[0].id);
        }
    }, [activePages, displayIndex]);
    const fileInputRef = useRef(null);
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const currentPageData = pages.find(p => p.id === currentPageId);
        if (!currentPageData)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result;
            useEditorStore.getState().addAnnotation({
                id: Date.now().toString(),
                pageIndex: currentPageData.originalIndex,
                type: 'image',
                dataUrl,
                x: 40, y: 40,
                width: 20, height: 20,
            });
            useEditorStore.getState().setActiveTool('select');
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const handleExport = async () => {
        const controller = new AbortController();
        setAbortController(controller);
        startProcessing("heavy");
        setStage("Preparing to export...");
        setProgress(0);
        try {
            const bytes = await file.arrayBuffer();
            const activeState = pages.filter(p => !p.isDeleted).map(p => ({ originalIndex: p.originalIndex, rotation: p.rotation }));
            const annotations = useEditorStore.getState().annotations;
            const outBytes = await workerManager.exportPdfEditor(bytes, activeState, annotations, (p) => {
                setStage(p.message || "Exporting...");
                setProgress(p.percent);
            }, controller.signal);
            const blob = new Blob([outBytes], { type: "application/pdf" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name.replace(/\.pdf$/i, "") + "-edited.pdf";
            a.click();
            revokeUrl(url);
        }
        catch (e) {
            if (e.message !== "Task cancelled") {
                setError(e?.message || "Failed to export PDF.");
            }
        }
        finally {
            finishProcessing(true);
            setAbortController(null);
        }
    };
    const handleClear = useCallback(() => {
        useEditorStore.getState().reset();
        onClear();
    }, [onClear]);
    useEffect(() => {
        let active = true;
        let loadingTask = null;
        const loadPdf = async () => {
            try {
                const pdfjsLib = await import("pdfjs-dist");
                const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                const version = pdfjsLib.version || '6.2.108';
                const workerUrl = typeof window !== 'undefined'
                    ? `${window.location.origin}${basePath}/pdf.worker.min.mjs?v=${version}`
                    : `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
                if (pdfjsLib.GlobalWorkerOptions) {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
                }
                if (pdfjsLib.default?.GlobalWorkerOptions) {
                    pdfjsLib.default.GlobalWorkerOptions.workerSrc = workerUrl;
                }
                let buffer = await file.arrayBuffer();
                if (!active) {
                    buffer = null;
                    return;
                }
                useEditorStore.getState().reset();
                loadingTask = pdfjsLib.getDocument({ data: buffer });
                buffer = null;
                const doc = await loadingTask.promise;
                if (!active)
                    return;
                setPdfDoc(doc);
                initPages(doc.numPages);
            }
            catch (err) {
                if (active)
                    setError(err.message || "Failed to load PDF");
            }
        };
        loadPdf();
        return () => {
            active = false;
            if (loadingTask) {
                try {
                    loadingTask.destroy();
                }
                catch (e) { }
            }
        };
    }, [file, initPages]);
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                handleUndo();
            }
            else if (e.key === '+' || e.key === '=') {
                handleZoomIn();
            }
            else if (e.key === '-') {
                handleZoomOut();
            }
            else if (e.key === '0') {
                handleZoomReset();
            }
            else if (e.key === 'ArrowLeft') {
                goToPrevPage();
            }
            else if (e.key === 'ArrowRight') {
                goToNextPage();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleZoomIn, handleZoomOut, handleZoomReset, goToPrevPage, goToNextPage]);
    if (error) {
        return (_jsxs("div", { className: "p-4 sm:p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20", children: [_jsx("p", { className: "text-red-500 font-bold mb-4", children: error }), _jsx("button", { onClick: handleClear, className: "px-6 py-3 bg-bg rounded-xl border border-border text-sm font-bold text-text-2 hover:bg-surface-2 transition-colors", children: "Back" })] }));
    }
    if (!pdfDoc) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[600px] bg-surface border border-border rounded-4xl shadow-sm", children: [_jsx(Loader2, { className: "w-10 h-10 animate-spin text-blue mb-4" }), _jsx("p", { className: "text-text-2 font-bold animate-pulse uppercase tracking-wider text-sm", children: "Parsing PDF..." })] }));
    }
    if (activePages.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[600px] bg-surface border border-border rounded-4xl shadow-sm space-y-4", children: [_jsx("div", { className: "text-4xl", children: "\uD83D\uDDD1\uFE0F" }), _jsx("p", { className: "text-text-2 font-bold text-lg", children: "All pages deleted" }), _jsx("button", { onClick: handleClear, className: "px-6 py-3 bg-blue text-white rounded-xl font-bold shadow-lg shadow-blue/20", children: "Start Over" })] }));
    }
    return (_jsxs("div", { className: "flex flex-col sm:flex-row h-[calc(100vh-140px)] min-h-[600px] border border-border rounded-4xl overflow-hidden bg-bg shadow-sm", children: [_jsx(ThumbnailSidebar, { pdfDoc: pdfDoc, currentPageId: currentPageId, onSelectPage: setCurrentPageId, className: showThumbnails ? 'flex' : 'hidden sm:flex' }), _jsxs("div", { className: "flex-1 bg-surface-2 relative flex flex-col min-w-0", children: [_jsxs("div", { className: "border-b border-border bg-surface flex flex-col sm:flex-row sm:flex-wrap items-center justify-between p-2 sm:px-4 z-content relative gap-2 sm:gap-2 sm:min-h-14 py-2", children: [_jsxs("div", { className: "flex items-center justify-between w-full sm:w-auto gap-2", children: [_jsx("span", { className: "text-sm font-bold text-text-2 truncate max-w-[200px] sm:max-w-[150px] lg:max-w-[300px]", children: file.name }), _jsxs("div", { className: "flex sm:hidden items-center gap-2", children: [_jsx("button", { onClick: () => setShowThumbnails(!showThumbnails), className: "px-3 py-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-blue/10 text-blue border border-blue/20 rounded-xl text-xs font-bold uppercase tracking-widest", "aria-label": showThumbnails ? 'Hide Pages' : 'Show Pages', children: showThumbnails ? 'Hide' : 'Pages' }), _jsx("button", { onClick: handleClear, className: "min-w-[44px] min-h-[44px] flex items-center justify-center text-text-4 hover:text-red-500 transition-colors p-2 text-sm font-bold bg-bg rounded-xl border border-border", title: "Close PDF", "aria-label": "Close PDF", children: "\u2715" })] })] }), _jsxs("div", { className: "flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-auto order-2 sm:order-none my-1 sm:my-0", children: [_jsx("button", { onClick: goToFirstPage, disabled: displayIndex <= 1, className: "p-2 sm:p-1 min-w-[44px] sm:min-w-0 min-h-[44px] sm:min-h-0 flex items-center justify-center bg-bg border border-border rounded-xl sm:rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors max-[359px]:hidden", title: "First Page", "aria-label": "First Page", children: _jsx(ChevronsLeft, { className: "w-5 h-5 sm:w-4 sm:h-4" }) }), _jsx("button", { onClick: goToPrevPage, disabled: displayIndex <= 1, className: "p-2 sm:p-1 min-w-[44px] sm:min-w-0 min-h-[44px] sm:min-h-0 flex items-center justify-center bg-bg border border-border rounded-xl sm:rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors", title: "Previous Page", "aria-label": "Previous Page", children: _jsx(ChevronLeft, { className: "w-5 h-5 sm:w-4 sm:h-4" }) }), _jsxs("div", { className: "flex items-center gap-1 bg-bg border border-border rounded-xl sm:rounded-md px-2 sm:px-1.5 py-1 sm:py-0.5 shrink-0 h-[44px] sm:h-auto", children: [_jsx("span", { className: "text-xs sm:text-[11px] font-bold text-text-muted hidden min-[360px]:inline", children: "Page" }), _jsx("input", { type: "number", min: 1, max: numActivePages, value: pageInput, onChange: (e) => setPageInput(e.target.value), onKeyDown: (e) => {
                                                    if (e.key === 'Enter')
                                                        handlePageJump(pageInput);
                                                }, onBlur: () => handlePageJump(pageInput), "aria-label": "Target Page Number", className: "w-12 sm:w-10 text-center text-sm sm:text-xs font-bold text-text bg-surface-2 border border-border/60 rounded px-1 py-1 sm:py-0.5 focus:outline-none focus:ring-1 focus:ring-blue h-8 sm:h-auto" }), _jsxs("span", { className: "text-xs sm:text-[11px] font-bold text-text-muted", children: ["/ ", numActivePages] })] }), _jsx("button", { onClick: goToNextPage, disabled: displayIndex >= numActivePages, className: "p-2 sm:p-1 min-w-[44px] sm:min-w-0 min-h-[44px] sm:min-h-0 flex items-center justify-center bg-bg border border-border rounded-xl sm:rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors", title: "Next Page", "aria-label": "Next Page", children: _jsx(ChevronRight, { className: "w-5 h-5 sm:w-4 sm:h-4" }) }), _jsx("button", { onClick: goToLastPage, disabled: displayIndex >= numActivePages, className: "p-2 sm:p-1 min-w-[44px] sm:min-w-0 min-h-[44px] sm:min-h-0 flex items-center justify-center bg-bg border border-border rounded-xl sm:rounded-md text-text hover:bg-surface-2 disabled:opacity-30 disabled:pointer-events-none transition-colors max-[359px]:hidden", title: "Last Page", "aria-label": "Last Page", children: _jsx(ChevronsRight, { className: "w-5 h-5 sm:w-4 sm:h-4" }) }), _jsx("div", { className: "hidden sm:block w-px h-6 bg-border mx-1" }), _jsxs("div", { className: "hidden sm:flex items-center gap-1", children: [_jsx("button", { onClick: handleZoomOut, disabled: zoom <= 0.5, className: "p-1 bg-bg border border-border rounded-md text-text hover:bg-surface-2 disabled:opacity-30 transition-colors", title: "Zoom Out", "aria-label": "Zoom Out", children: _jsx(ZoomOut, { className: "w-4 h-4" }) }), _jsxs("button", { onClick: handleZoomReset, className: "w-12 text-center text-[11px] font-bold text-text hover:text-blue transition-colors", title: "Reset Zoom", "aria-label": "Reset Zoom", children: [Math.round(zoom * 100), "%"] }), _jsx("button", { onClick: handleZoomIn, disabled: zoom >= 3.0, className: "p-1 bg-bg border border-border rounded-md text-text hover:bg-surface-2 disabled:opacity-30 transition-colors", title: "Zoom In", "aria-label": "Zoom In", children: _jsx(ZoomIn, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "flex items-center overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto order-3 sm:order-none gap-2 no-scrollbar", children: [_jsxs("div", { className: "flex sm:hidden items-center gap-1 bg-bg p-1 rounded-xl border border-border mr-1 shrink-0", children: [_jsx("button", { onClick: handleZoomOut, disabled: zoom <= 0.5, className: "p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-surface-2 disabled:opacity-30 text-text", "aria-label": "Zoom Out", children: _jsx(ZoomOut, { className: "w-5 h-5" }) }), _jsxs("button", { onClick: handleZoomReset, className: "text-xs font-bold text-text w-10 text-center min-h-[44px]", "aria-label": "Reset Zoom", children: [Math.round(zoom * 100), "%"] }), _jsx("button", { onClick: handleZoomIn, disabled: zoom >= 3.0, className: "p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-surface-2 disabled:opacity-30 text-text", "aria-label": "Zoom In", children: _jsx(ZoomIn, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex items-center gap-1 sm:gap-2 bg-bg p-1 rounded-xl border border-border shrink-0", children: [_jsx("button", { onClick: handleUndo, disabled: undoStack.length === 0, className: "p-2 sm:p-1.5 min-w-[44px] sm:min-w-0 min-h-[44px] sm:min-h-0 flex items-center justify-center rounded-lg transition-colors text-text-4 hover:bg-surface-2 hover:text-text disabled:opacity-30 disabled:pointer-events-none", title: "Undo (Ctrl+Z)", "aria-label": "Undo", children: _jsx(Undo2, { className: "w-5 h-5 sm:w-4 sm:h-4" }) }), _jsx("div", { className: "w-px h-6 bg-border mx-1" }), [
                                                { id: 'select', icon: MousePointer2, label: 'Select' },
                                                { id: 'highlight', icon: Highlighter, label: 'Highlight' },
                                                { id: 'text', icon: Type, label: 'Text' },
                                                { id: 'draw', icon: PenTool, label: 'Draw' },
                                                { id: 'shape', icon: Square, label: 'Shape' },
                                                { id: 'arrow', icon: ArrowUpRight, label: 'Arrow' },
                                                { id: 'image', icon: ImageIcon, label: 'Image' },
                                                { id: 'signature', icon: SignatureIcon, label: 'Signature' },
                                                { id: 'blackout', icon: Eraser, label: 'Black Out (Redact)' }
                                            ].map(tool => {
                                                const Icon = tool.icon;
                                                return (_jsxs("button", { onClick: () => {
                                                        if (tool.id === 'image') {
                                                            fileInputRef.current?.click();
                                                        }
                                                        else if (tool.id === 'signature') {
                                                            getSignature().then(sig => {
                                                                if (sig) {
                                                                    useEditorStore.getState().setActiveTool('signature');
                                                                }
                                                                else {
                                                                    useEditorStore.getState().setSignatureModalOpen(true);
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            useEditorStore.getState().setActiveTool(tool.id);
                                                        }
                                                    }, onDoubleClick: () => {
                                                        if (tool.id === 'signature') {
                                                            useEditorStore.getState().setSignatureModalOpen(true);
                                                        }
                                                    }, className: `p-2 sm:p-1.5 min-w-[44px] sm:min-w-0 min-h-[44px] sm:min-h-0 rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTool === tool.id ? 'bg-blue text-white' : 'text-text-4 hover:bg-surface-2'}`, title: tool.label, "aria-label": tool.label, children: [_jsx(Icon, { className: "w-5 h-5 sm:w-4 sm:h-4" }), _jsx("span", { className: "hidden min-[400px]:inline text-xs font-medium pr-1", children: tool.label })] }, tool.id));
                                            })] })] }), _jsxs("div", { className: "hidden sm:flex items-center justify-end gap-2 shrink-0", children: [_jsx("button", { onClick: () => setShowThumbnails(!showThumbnails), className: "px-2 py-1 bg-blue/10 text-blue border border-blue/20 rounded-md text-xs font-bold uppercase tracking-widest", "aria-label": showThumbnails ? 'Hide Pages' : 'Show Pages', children: showThumbnails ? 'Hide' : 'Pages' }), _jsxs("button", { onClick: handleExport, disabled: progressState.isProcessing, className: "flex items-center justify-center gap-2 px-4 py-1.5 bg-blue text-white rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100", "aria-label": "Export", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: progressState.isProcessing ? "Exporting..." : "Export" })] }), _jsx("button", { onClick: handleClear, className: "text-text-4 hover:text-red-500 transition-colors p-1.5 text-sm font-bold bg-bg rounded-xl border border-border", title: "Close PDF", "aria-label": "Close PDF", children: "\u2715" })] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleImageUpload, accept: "image/*", className: "hidden" })] }), _jsx("div", { className: "sm:hidden w-full p-2 bg-surface border-b border-border z-content relative flex gap-2", children: _jsxs("button", { onClick: handleExport, disabled: progressState.isProcessing, className: "flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 bg-blue text-white rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:scale-100", "aria-label": "Export", children: [_jsx(Download, { className: "w-5 h-5" }), _jsx("span", { children: progressState.isProcessing ? "Exporting..." : "Export" })] }) }), activeTool === 'blackout' && (_jsxs("div", { className: "bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center justify-center gap-2 z-content relative", children: [_jsx("span", { children: "\u26A0\uFE0F" }), _jsxs("span", { children: [_jsx("strong", { children: "Note:" }), " \"Black Out\" visually covers text but ", _jsx("strong", { children: "does not guarantee" }), " complete removal of underlying metadata or invisible text streams from the file."] })] })), _jsxs("div", { className: "flex-1 relative overflow-hidden", children: [_jsx(AnnotationProperties, {}), _jsx(EditorCanvas, { pdfDoc: pdfDoc, pageId: currentPageId, onPrevPage: goToPrevPage, onNextPage: goToNextPage })] })] }), _jsx(SignatureModal, {})] }));
}
