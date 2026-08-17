"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { workerManager } from "@/src/workers/manager";
import { useBatchStore, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";
import { DropZone } from "@/components/ui/DropZone";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useRecoveryStore } from "@/src/store/useRecoveryStore";
import { Layers, Code, FileCode, Zap, Type, FileText } from "lucide-react";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { StatusBadge } from "@/components/system/StatusBadge";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
const toolId = "code-minifier";
export default function CodeMinifierClient() {
    const [lang, setLang] = useState("css");
    const [inputMode, setInputMode] = useState("file");
    const [isProcessing, setIsProcessing] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [wordWrap, setWordWrap] = useState(false);
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const { toast } = useToast();
    // Text mode state
    const [textInput, setTextInput] = useState("");
    const [textOutput, setTextOutput] = useState("");
    const [textError, setTextError] = useState("");
    const [isTextProcessing, setIsTextProcessing] = useState(false);
    const showBanner = useRecoveryStore(state => state.showBanner);
    const addItems = useBatchStore(state => state.addItems);
    const startProcessing = useBatchStore(state => state.startProcessing);
    const updateItem = useBatchStore(state => state.updateItem);
    const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);
    // File processing
    const minifySingle = async (item) => {
        const code = await item.file.text();
        const result = await workerManager.minifyCode(code, lang, (p) => {
            updateItem(toolId, item.id, { progress: p.percent, message: p.message });
        }, item.abortController?.signal);
        if (result.error) {
            showBanner('partial_failure', result.error.message);
        }
        const blob = new Blob([result.code], { type: "text/plain" });
        const name = item.file.name.replace(/\.[^.]+$/, "") + ".min" + (item.file.name.match(/\.[^.]+$/)?.[0] || "");
        return {
            name,
            originalSize: item.file.size,
            compressedSize: blob.size,
            blob,
        };
    };
    const handleFiles = (files) => {
        if (!files || files.length === 0)
            return;
        const filesArray = Array.from(files);
        const validFiles = filesArray.filter(f => f.size <= 10 * 1024 * 1024);
        if (validFiles.length < filesArray.length) {
            toast("Some files were skipped. Maximum size is 10MB.", "error");
        }
        if (validFiles.length > 0) {
            addItems(toolId, validFiles);
        }
    };
    const processAll = async () => {
        setIsProcessing(true);
        await startProcessing(toolId, minifySingle);
        setIsProcessing(false);
    };
    const downloadAll = async () => {
        const completed = items.filter(i => i.status === 'completed' && i.result);
        if (completed.length === 0)
            return;
        const files = {};
        completed.forEach(item => {
            files[item.result.name] = item.result.blob;
        });
        const zipBlob = await createZip(files);
        const url = createUrl(zipBlob);
        downloadBlob(url, `minified-code-${Date.now()}.zip`);
    };
    const downloadOne = (item) => {
        if (item.result) {
            const url = createUrl(item.result.blob);
            downloadBlob(url, item.result.name);
        }
    };
    // Text processing
    useEffect(() => {
        if (inputMode !== "text")
            return;
        if (!textInput.trim()) {
            Promise.resolve().then(() => {
                setTextOutput("");
                setTextError("");
            });
            return;
        }
        if (textInput.length > 5 * 1024 * 1024) {
            setTextError("Input text exceeds 5MB limit");
            setTextOutput("");
            return;
        }
        const controller = new AbortController();
        const run = async () => {
            setIsTextProcessing(true);
            setTextError("");
            try {
                const result = await workerManager.minifyCode(textInput, lang, undefined, controller.signal);
                if (!controller.signal.aborted) {
                    if (result.error) {
                        setTextError(result.error.message);
                        setTextOutput("");
                    }
                    else {
                        setTextOutput(result.code);
                        setTextError("");
                    }
                }
            }
            catch (err) {
                if (!controller.signal.aborted) {
                    setTextError(err.message || "Failed to minify code");
                    setTextOutput("");
                }
            }
            finally {
                if (!controller.signal.aborted) {
                    setIsTextProcessing(false);
                }
            }
        };
        run();
        return () => controller.abort();
    }, [textInput, lang, inputMode]);
    useFocusModeIntegration({
        language: lang === "js" ? "javascript" : lang,
        onFontSizeChange: setFontSize,
        ...(inputMode === "text" && { onWrapToggle: () => setWordWrap(v => !v) }),
        charCount: inputMode === "text" ? textOutput.length : 0,
        lineCount: inputMode === "text" ? (textOutput ? textOutput.split('\n').length : 0) : 0
    });
    return (_jsx("div", { className: "w-full", children: _jsxs("div", { className: "space-y-12 w-full", children: [_jsxs("div", { className: "bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("h2", { className: "text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3", children: [_jsx(Layers, { className: "w-4 h-4" }), "Minification Engine"] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-center", children: [_jsx(SegmentedControl, { "aria-labelledby": "input-mode-label", options: [
                                                { id: "file", label: "File Upload", icon: _jsx(FileText, { className: "w-3 h-3" }) },
                                                { id: "text", label: "Text Input", icon: _jsx(Type, { className: "w-3 h-3" }) },
                                            ], activeId: inputMode, onChange: (id) => setInputMode(id) }), _jsx("div", { className: "w-px h-6 bg-border hidden sm:block" }), _jsx(SegmentedControl, { "aria-labelledby": "engine-label", options: [
                                                { id: "css", label: "CSS", icon: _jsx(Code, { className: "w-3 h-3" }) },
                                                { id: "js", label: "JS", icon: _jsx(FileCode, { className: "w-3 h-3" }) },
                                                { id: "html", label: "HTML", icon: _jsx(Layers, { className: "w-3 h-3" }) },
                                            ], activeId: lang, onChange: (id) => setLang(id) })] })] }), inputMode === "file" && (_jsx(DropZone, { onFilesSelected: handleFiles, accept: lang === 'js' ? '.js,.mjs,.cjs' : lang === 'css' ? '.css' : '.html,.htm', multiple: true, title: `Drop your ${lang.toUpperCase()} files here`, description: "Local-first processing. No files are uploaded to any server." }))] }), inputMode === "file" ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("h2", { className: "text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 px-2 flex items-center gap-2", children: [_jsx(Zap, { className: "w-3 h-3" }), "Processing Queue"] }), _jsx(BatchQueue, { toolId: toolId, isProcessing: isProcessing, onProcess: processAll, onDownload: downloadOne, onDownloadAll: downloadAll }), items.length === 0 && (_jsxs("div", { className: "py-20 text-center space-y-4 opacity-40", children: [_jsx("div", { className: "w-16 h-16 bg-blue/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue/10", children: _jsx(Code, { className: "w-8 h-8 text-blue" }) }), _jsx("p", { className: "font-black text-text-4 uppercase tracking-widest-lg text-xs", children: "Add files to start minifying" })] }))] })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start", children: [_jsx("div", { className: "space-y-4", children: _jsx("div", { className: "bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm", children: _jsx(ToolInput, { label: "Input Code", value: textInput, onChange: setTextInput, placeholder: `Paste your ${lang.toUpperCase()} code here...`, rows: 20, mono: true, style: { fontSize: `${fontSize}px` }, error: textError }) }) }), _jsxs("div", { className: "space-y-4 lg:sticky lg:top-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 px-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("h2", { className: "text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-2", children: [_jsx(Code, { className: "w-3 h-3" }), " Output"] }), _jsx(StatusBadge, { status: isTextProcessing ? "processing" : textError ? "error" : textOutput ? "complete" : "idle" }), _jsx(PrivacyBadge, { message: "Local processing", className: "hidden sm:inline-flex" })] }), _jsx(CopyButton, { text: textOutput, disabled: isTextProcessing || !textOutput })] }), _jsx("div", { className: "bg-surface border border-border rounded-4xl p-2 shadow-sm min-h-128 relative overflow-hidden", children: isTextProcessing ? (_jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-4 text-blue", children: [_jsx("div", { className: "w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center animate-pulse", children: _jsx(Zap, { size: 24 }) }), _jsx("p", { className: "text-sm font-black uppercase tracking-widest text-text", children: "Minifying..." })] })) : (_jsx("textarea", { readOnly: true, "aria-label": "Minified output", className: `w-full min-h-128 p-6 sm:p-8 bg-transparent font-mono text-text-2 resize-none outline-none custom-scrollbar ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`, style: { fontSize: `${fontSize}px` }, value: textOutput, placeholder: "Minified code will appear here..." })) })] })] }))] }) }));
}
