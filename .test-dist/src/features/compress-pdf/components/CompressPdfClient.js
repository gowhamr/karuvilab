"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { workerManager } from "@/src/workers/manager";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const toolId = "compress-pdf";
const COMPRESSION_LEVELS = [
    { value: 'low', label: 'Low', description: 'Fastest — minimal size reduction, preserves all metadata' },
    { value: 'medium', label: 'Medium', description: 'Balanced — object stream compression + strip metadata' },
    { value: 'high', label: 'High', description: 'Maximum — deep re-encoding + orphan removal + strip all metadata' },
];
export default function CompressPdfClient() {
    const { createUrl } = useObjectUrlManager();
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState('medium');
    const processingRef = useRef(false);
    const addItems = useBatchStore(state => state.addItems);
    const startProcessing = useBatchStore(state => state.startProcessing);
    const updateItem = useBatchStore(state => state.updateItem);
    const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);
    const { toast } = useToast();
    const compressSingle = useCallback(async (item) => {
        try {
            updateItem(toolId, item.id, { message: "Loading PDF..." });
            const bytes = await item.file.arrayBuffer();
            const outBytes = await workerManager.compressPdf(bytes, compressionLevel, (progress) => updateItem(toolId, item.id, { message: progress.message || "Processing...", progress: progress.percent }), item.abortController?.signal);
            const blob = new Blob([outBytes], { type: "application/pdf" });
            const name = item.file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
            const url = createUrl(blob);
            return {
                name,
                originalSize: item.file.size,
                compressedSize: blob.size,
                url,
                blob,
            };
        }
        catch (e) {
            throw new Error(formatError(e));
        }
    }, [compressionLevel, createUrl, updateItem]);
    const handleFiles = useCallback((files) => {
        if (!files || files.length === 0)
            return;
        const validFiles = [];
        const fileArray = Array.from(files);
        for (const file of fileArray) {
            if (file.type !== "application/pdf") {
                toast(`Invalid file type: ${file.name}. Only PDFs are allowed.`, "error");
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast(`File too large: ${file.name}. Maximum size is 100MB.`, "error");
                continue;
            }
            validFiles.push(file);
        }
        if (validFiles.length > 0) {
            addItems(toolId, validFiles);
        }
    }, [addItems, toast]);
    useWorkflowInput(handleFiles);
    const processAll = useCallback(async () => {
        if (processingRef.current || isProcessing)
            return;
        processingRef.current = true;
        setIsProcessing(true);
        try {
            await startProcessing(toolId, compressSingle);
        }
        finally {
            setIsProcessing(false);
            processingRef.current = false;
        }
    }, [isProcessing, startProcessing, compressSingle]);
    const downloadOne = useCallback((item) => {
        if (item.result) {
            const a = document.createElement("a");
            a.href = item.result.url;
            a.download = item.result.name;
            a.click();
        }
    }, []);
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(PrivacyBadge, { message: "Local processing \u2013 No files uploaded to servers" }), _jsx(ToolWorkspace, { layout: "split", input: _jsxs("div", { className: "flex flex-col h-full space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-text-2 px-1", children: "Input Files" }), _jsx(DropZone, { onFilesSelected: handleFiles, accept: ".pdf,application/pdf", multiple: true, title: _jsxs(_Fragment, { children: [_jsx("span", { className: "hidden sm:inline", children: "Drop PDF files here" }), _jsx("span", { className: "sm:hidden", children: "Select PDF files" })] }), description: "Supports multiple PDFs up to 100MB", icon: _jsx("div", { className: "text-4xl", children: "\uD83D\uDCC4" }), className: "flex-1 min-h-[200px]" })] }), optionsPanel: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1 px-1", children: [_jsx("h3", { className: "text-sm font-bold text-text-2", children: "Compression Level" }), _jsx("p", { className: "text-xs text-text-4 font-medium", children: "Choose how aggressively to compress your PDFs" })] }), _jsx("div", { className: "grid grid-cols-1 gap-3", children: COMPRESSION_LEVELS.map((level) => (_jsxs("button", { onClick: () => setCompressionLevel(level.value), disabled: isProcessing, className: `
                    relative flex flex-col gap-1.5 p-4 rounded-xl border-2 text-left transition-all
                    outline-none focus-visible:ring-2 focus-visible:ring-blue
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${compressionLevel === level.value
                                    ? 'border-blue bg-blue/5 shadow-sm shadow-blue/10'
                                    : 'border-border hover:border-blue/30 bg-bg'}
                  `, "aria-pressed": compressionLevel === level.value, "aria-label": `${level.label} compression: ${level.description}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `
                      w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                      ${compressionLevel === level.value
                                                    ? 'border-blue bg-blue'
                                                    : 'border-text-4/30'}
                    `, children: compressionLevel === level.value && (_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white" })) }), _jsx("span", { className: `
                      text-sm font-black tracking-tight
                      ${compressionLevel === level.value ? 'text-blue' : 'text-text'}
                    `, children: level.label })] }), _jsx("p", { className: "text-xs text-text-4 font-medium leading-relaxed pl-6", children: level.description })] }, level.value))) })] }), output: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("h3", { className: "text-sm font-bold text-text-2 mb-4 px-1", children: "Queue & Results" }), _jsx("div", { className: "flex-1", children: _jsx(BatchQueue, { toolId: toolId, isProcessing: isProcessing, onProcess: processAll, onDownload: downloadOne, processLabel: "Compress All" }) })] }), infoPanel: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl text-sm text-yellow-700 dark:text-yellow-400 font-medium", children: [_jsx("strong", { children: "Note:" }), " Browser-based PDF compression re-encodes the PDF structure. Results vary \u2014 PDFs with large embedded images may not compress significantly without image re-encoding."] }), _jsx(WorkflowSuggestions, {})] }) })] }));
}
