"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useRef } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { useToast } from "@/components/ui/Toast";
const toolId = "extract-images";
export default function ExtractImagesClient() {
    const { toast } = useToast();
    const { createUrl } = useObjectUrlManager();
    const [isProcessing, setIsProcessing] = useState(false);
    const processingRef = useRef(false);
    const addItems = useBatchStore(state => state.addItems);
    const startProcessing = useBatchStore(state => state.startProcessing);
    const updateItem = useBatchStore(state => state.updateItem);
    const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);
    const processSingle = useCallback(async (item) => {
        try {
            updateItem(toolId, item.id, { message: "Loading PDF..." });
            const bytes = await item.file.arrayBuffer();
            const results = await workerOrchestrator.dispatch("extractImagesFromPdf", [bytes], [bytes], (p) => {
                updateItem(toolId, item.id, { message: p.message || "Extracting images...", progress: p.percent });
            });
            if (results.length === 0) {
                throw new Error("No extractable images found in this PDF.");
            }
            updateItem(toolId, item.id, { message: "Zipping images...", progress: 95 });
            const zipData = {};
            const transferList = [];
            for (const img of results) {
                zipData[`extracted-page${img.page}-img${img.index + 1}.png`] = new Uint8Array(img.arrayBuffer);
                transferList.push(img.arrayBuffer);
            }
            const zipBytes = await workerOrchestrator.dispatch("createZip", [zipData], transferList);
            const blob = new Blob([zipBytes], { type: "application/zip" });
            const name = item.file.name.replace(/\.pdf$/i, "") + "-extracted-images.zip";
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
    }, [createUrl, updateItem]);
    const handleFiles = useCallback((files) => {
        if (!files || files.length === 0)
            return;
        const filesArray = Array.from(files);
        const validFiles = filesArray.filter(f => f.size <= 100 * 1024 * 1024);
        if (validFiles.length < filesArray.length) {
            toast("Some files were skipped. Maximum size is 100MB.", "error");
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
            await startProcessing(toolId, processSingle);
        }
        finally {
            setIsProcessing(false);
            processingRef.current = false;
        }
    }, [isProcessing, startProcessing, processSingle]);
    const downloadOne = useCallback((item) => {
        if (item.result) {
            const a = document.createElement("a");
            a.href = item.result.url;
            a.download = item.result.name;
            a.click();
        }
    }, []);
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(PrivacyBadge, { message: "Local processing \u2013 No files uploaded to servers" }), _jsxs("div", { className: "p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl text-sm text-yellow-700 dark:text-yellow-400 font-medium", children: [_jsx("strong", { children: "Note:" }), " Extracts raster images (JPEG, PNG) embedded in the PDFs. Vector graphics and text-based content cannot be extracted as images. Output is provided as a ZIP file containing all images per PDF."] }), _jsx(DropZone, { onFilesSelected: handleFiles, accept: ".pdf,application/pdf", multiple: true, title: _jsxs(_Fragment, { children: [_jsx("span", { className: "hidden sm:inline", children: "Drop PDF files here or click to add" }), _jsx("span", { className: "sm:hidden", children: "Select PDF files" })] }), description: "Supports multiple PDFs", icon: _jsx("div", { className: "text-4xl", children: "\uD83D\uDDBC\uFE0F" }) }), _jsx(BatchQueue, { toolId: toolId, isProcessing: isProcessing, onProcess: processAll, onDownload: downloadOne, processLabel: "Extract Images All" }), _jsx(WorkflowSuggestions, {})] }));
}
