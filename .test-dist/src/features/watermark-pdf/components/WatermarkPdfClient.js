"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useId } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { SliderField } from "@/components/ui/SliderField";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { useToast } from "@/components/ui/Toast";
const toolId = "watermark-pdf";
const cat = CATEGORIES.find(c => c.id === "pdf");
export default function WatermarkPdfClient() {
    const textId = useId();
    const colorId = useId();
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const [watermarkType, setWatermarkType] = useState("text");
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [watermarkImageUrl, setWatermarkImageUrl] = useState(null);
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
    const [opacity, setOpacity] = useState(0.3);
    const [fontSize, setFontSize] = useState(60);
    const [color, setColor] = useState("#cc0000");
    const [angle, setAngle] = useState(45);
    const [scale, setScale] = useState(0.5); // For image scale
    const imageRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const processingRef = useRef(false);
    const addItems = useBatchStore(state => state.addItems);
    const startProcessing = useBatchStore(state => state.startProcessing);
    const updateItem = useBatchStore(state => state.updateItem);
    const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);
    const processSingle = useCallback(async (item) => {
        try {
            updateItem(toolId, item.id, { message: "Loading PDF..." });
            const fileBytes = await item.file.arrayBuffer();
            let imageBytes = undefined;
            let imageType = undefined;
            if (watermarkType === "image" && watermarkImage) {
                imageBytes = await watermarkImage.arrayBuffer();
                imageType = watermarkImage.type;
            }
            const outBytes = await workerManager.watermarkPdf(fileBytes, {
                type: watermarkType,
                text: watermarkText,
                imageBytes,
                imageType,
                opacity,
                fontSize,
                colorHex: color,
                angle,
                scale
            }, (progress) => updateItem(toolId, item.id, { message: progress.message || "Watermarking...", progress: progress.percent }), item.abortController?.signal);
            const blob = new Blob([outBytes], { type: "application/pdf" });
            const name = item.file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
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
    }, [watermarkType, watermarkImage, watermarkText, opacity, fontSize, color, angle, scale, createUrl, updateItem]);
    const { toast } = useToast();
    const handleFiles = useCallback((files) => {
        if (!files || files.length === 0)
            return;
        const MAX_FILE_SIZE = 100 * 1024 * 1024;
        const validFiles = [];
        Array.from(files).forEach(file => {
            if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
                toast(`Invalid file type: ${file.name}. Only PDFs are allowed.`, "error");
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast(`File too large: ${file.name}. Maximum size is 100MB.`, "error");
                return;
            }
            validFiles.push(file);
        });
        if (validFiles.length > 0)
            addItems(toolId, validFiles);
    }, [addItems, toast]);
    useWorkflowInput(handleFiles);
    const processAll = useCallback(async () => {
        if (watermarkType === "text" && !watermarkText.trim()) {
            alert("Please enter watermark text.");
            return;
        }
        if (watermarkType === "image" && !watermarkImage) {
            alert("Please select a watermark image.");
            return;
        }
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
    }, [isProcessing, startProcessing, processSingle, watermarkType, watermarkText, watermarkImage]);
    const downloadOne = useCallback((item) => {
        if (item.result) {
            const a = document.createElement("a");
            a.href = item.result.url;
            a.download = item.result.name;
            a.click();
        }
    }, []);
    const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(PrivacyBadge, { message: "Local processing \u2013 No files uploaded to servers" }), _jsx(DropZone, { onFilesSelected: handleFiles, accept: ".pdf,application/pdf", multiple: true, title: _jsxs(_Fragment, { children: [_jsx("span", { className: "hidden sm:inline", children: "Drop PDF files here or click to add" }), _jsx("span", { className: "sm:hidden", children: "Select PDF files" })] }), description: "Supports multiple PDFs up to 100MB", icon: _jsx("div", { className: "text-4xl", children: "\uD83D\uDCC4" }) }), _jsxs("div", { className: "bg-surface border border-border p-5 rounded-3xl shadow-sm space-y-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "font-black text-text-2 text-sm uppercase tracking-wider", children: "Watermark Settings" }), _jsx("p", { className: "text-xs text-text-4 font-medium", children: "Configure the watermark for all selected PDFs" })] }), _jsxs("div", { className: "flex bg-bg p-1 rounded-xl border border-border", children: [_jsx("button", { onClick: () => setWatermarkType("text"), className: `flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${watermarkType === "text" ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text-2"}`, children: "Text" }), _jsx("button", { onClick: () => setWatermarkType("image"), className: `flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${watermarkType === "image" ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text-2"}`, children: "Image" })] }), watermarkType === "text" ? (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: textId, className: "text-sm font-medium", children: "Watermark Text" }), _jsx("input", { id: textId, type: "text", className: inputClass, value: watermarkText, onChange: e => setWatermarkText(e.target.value), placeholder: "CONFIDENTIAL" })] })) : (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium", children: "Watermark Image" }), _jsx(DropZone, { className: "bg-bg border-border rounded-xl p-4 hover:border-blue transition-colors", onFilesSelected: (files) => {
                                    const f = files[0];
                                    if (f && (f.type === "image/png" || f.type === "image/jpeg" || f.name.endsWith(".png") || f.name.endsWith(".jpg"))) {
                                        if (f.size > 5 * 1024 * 1024) {
                                            toast("Image too large. Maximum size is 5MB.", "error");
                                            return;
                                        }
                                        if (watermarkImageUrl)
                                            revokeUrl(watermarkImageUrl);
                                        setWatermarkImage(f);
                                        setWatermarkImageUrl(createUrl(f));
                                    }
                                    else {
                                        toast("Only PNG and JPG images are supported.", "error");
                                    }
                                }, accept: "image/png,image/jpeg", multiple: false, title: watermarkImageUrl ? _jsx("img", { src: watermarkImageUrl, alt: "Watermark", className: "mx-auto max-h-16 object-contain" }) : "Select Image", subtitle: !watermarkImageUrl ? "Drop PNG/JPG here or click" : undefined })] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [watermarkType === "text" && (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: colorId, className: "text-sm font-medium", children: "Color" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { id: colorId, type: "color", value: color, onChange: e => setColor(e.target.value), className: "w-10 h-10 rounded-xl border border-border cursor-pointer" }), _jsx("input", { type: "text", className: "flex-1 px-3 py-2 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none", value: color, onChange: e => setColor(e.target.value) })] })] })), watermarkType === "text" ? (_jsx(SliderField, { id: "fontSize", label: "Font Size", min: 20, max: 150, value: fontSize, onChange: setFontSize, format: v => `${v}px` })) : (_jsx(SliderField, { id: "scale", label: "Image Scale", min: 0.1, max: 2, step: 0.1, value: scale, onChange: setScale, format: v => `${Math.round(v * 100)}%` }))] }), _jsx(SliderField, { id: "opacity", label: "Opacity", min: 0.05, max: 1, step: 0.05, value: opacity, onChange: setOpacity, format: v => `${Math.round(v * 100)}%` }), _jsx(SliderField, { id: "rotation", label: "Rotation", min: -90, max: 90, value: angle, onChange: setAngle, format: v => `${v}°` })] }), _jsx(BatchQueue, { toolId: toolId, isProcessing: isProcessing, onProcess: processAll, onDownload: downloadOne, processLabel: "Watermark All" }), _jsx(WorkflowSuggestions, {})] }));
}
