"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { workerManager } from "@/src/workers/manager";
import { useProgress } from "@/src/contexts/ProgressContext";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { DropZone } from "@/components/ui/DropZone";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const cat = CATEGORIES.find(c => c.id === "pdf");
function SortableFileItem({ f, i, removeFile, moveUp, moveDown, totalFiles }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: f.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };
    return (_jsxs("div", { ref: setNodeRef, style: style, className: "flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3 relative", children: [_jsx("div", { ...attributes, ...listeners, className: "cursor-grab active:cursor-grabbing text-text-muted hover:text-text px-1", "aria-label": "Drag handle", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "w-5 h-5", children: [_jsx("circle", { cx: "9", cy: "5", r: "1" }), _jsx("circle", { cx: "9", cy: "12", r: "1" }), _jsx("circle", { cx: "9", cy: "19", r: "1" }), _jsx("circle", { cx: "15", cy: "5", r: "1" }), _jsx("circle", { cx: "15", cy: "12", r: "1" }), _jsx("circle", { cx: "15", cy: "19", r: "1" })] }) }), _jsx("span", { className: "text-xs font-bold text-text-4 w-5 text-center", children: i + 1 }), _jsxs("div", { className: "flex flex-col gap-0.5 flex-shrink-0", children: [_jsx("button", { "aria-label": "Move file up", onClick: () => moveUp(i), disabled: i === 0, className: "text-xs text-text-4 hover:text-blue disabled:opacity-30", children: "\u25B2" }), _jsx("button", { "aria-label": "Move file down", onClick: () => moveDown(i), disabled: i === totalFiles - 1, className: "text-xs text-text-4 hover:text-blue disabled:opacity-30", children: "\u25BC" })] }), _jsx("p", { className: "flex-1 font-medium text-sm truncate", children: f.name }), _jsxs("p", { className: "text-xs text-text-4", children: [(f.file.size / 1024).toFixed(0), " KB"] }), _jsx("button", { "aria-label": "Remove file", onClick: () => removeFile(f.id), className: "text-red-400 hover:text-red-600 text-sm font-bold flex-shrink-0", children: "\u2715" })] }));
}
import { useWorkflowStore } from "@/src/store/useWorkflowStore";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
export default function MergePdfClient() {
    const { createUrl, revokeUrl } = useObjectUrlManager();
    const [files, setFiles] = useState([]);
    const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
    const [error, setError] = useState("");
    const [abortController, setAbortController] = useState(null);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    const { toast } = useToast();
    const addFiles = (fl) => {
        if (!fl)
            return;
        const MAX_FILE_SIZE = 100 * 1024 * 1024;
        const validFiles = [];
        Array.from(fl).forEach(f => {
            if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
                toast(`Invalid file type: ${f.name}. Only PDFs are allowed.`, "error");
                return;
            }
            if (f.size > MAX_FILE_SIZE) {
                toast(`File too large: ${f.name}. Maximum size is 100MB.`, "error");
                return;
            }
            validFiles.push({ id: crypto.randomUUID(), name: f.name, file: f });
        });
        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        }
    };
    useWorkflowInput(addFiles);
    const removeFile = (id) => setFiles(f => f.filter(file => file.id !== id));
    const moveUp = (i) => {
        if (i === 0)
            return;
        setFiles(f => { const a = [...f]; const t = a[i - 1]; a[i - 1] = a[i]; a[i] = t; return a; });
    };
    const moveDown = (i) => {
        setFiles(f => { if (i >= f.length - 1)
            return f; const a = [...f]; const t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; return a; });
    };
    const merge = async () => {
        if (files.length < 2) {
            setError("Please add at least 2 PDF files to merge.");
            return;
        }
        const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
        const isLarge = totalSize > 30 * 1024 * 1024; // 30MB threshold
        const controller = new AbortController();
        setAbortController(controller);
        startProcessing("heavy");
        setStage(isLarge ? "Large files detected. Merging sequentially to save memory..." : "Preparing files...");
        setProgress(0);
        // UI Warning for mobile
        if (isLarge && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            setStage("Processing >30MB on mobile. Please keep the app open...");
        }
        try {
            // Pass the File objects directly to the worker. 
            // They are cloned (not read into memory yet) when passed.
            const bytes = await workerManager.mergePdfs(files.map(f => f.file), (p) => {
                setStage(p.message || "Merging...");
                setProgress(p.percent);
            }, controller.signal);
            const blob = new Blob([bytes], { type: "application/pdf" });
            const url = createUrl(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged.pdf";
            a.click();
            useWorkflowStore.getState().syncToolOutput("merge-pdf", [{
                    blob,
                    name: "merged.pdf",
                    type: "pdf"
                }]);
            // Delay revocation by 5 seconds to ensure browser starts download even for massive blobs
            // KL-06: Let useObjectUrlManager handle cleanup
        }
        catch (e) {
            if (e.message === "Task cancelled") {
                setError("Merge cancelled.");
                finishProcessing(false, new Error("Merge cancelled."));
            }
            else {
                setError(e?.message || "Failed to merge PDFs.");
                finishProcessing(false, new Error(e?.message || "Failed to merge PDFs."));
            }
        }
        finally {
            finishProcessing(true);
            setAbortController(null);
        }
    };
    const cancelMerge = () => {
        abortController?.abort();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(DropZone, { onFilesSelected: addFiles, accept: ".pdf,application/pdf", multiple: true, title: "Drop PDF files here or click to add", description: "Add multiple PDFs \u2014 they will be merged in order", icon: _jsx("div", { className: "text-4xl", children: "\uD83D\uDCC4" }) }), files.length > 0 && (_jsxs("div", { className: "bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "font-bold text-text-2 text-sm uppercase tracking-wider", children: ["Files (", files.length, ") \u2014 drag to reorder"] }), _jsx("button", { onClick: () => setFiles([]), className: "text-xs text-red-500 hover:text-red-600 font-medium", children: "Clear all" })] }), _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: files.map(f => f.id), strategy: verticalListSortingStrategy, children: files.map((f, i) => (_jsx(SortableFileItem, { f: f, i: i, removeFile: removeFile, moveUp: moveUp, moveDown: moveDown, totalFiles: files.length }, f.id))) }) })] })), error && _jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm", children: error }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: merge, disabled: files.length < 2 || progressState.isProcessing, className: "flex-1 py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex flex-col items-center justify-center gap-1", children: progressState.isProcessing ? "Processing..." : `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}` }), progressState.isProcessing && (_jsx("button", { onClick: cancelMerge, className: "px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all", children: "Cancel" }))] }), _jsx(WorkflowSuggestions, {})] }));
}
