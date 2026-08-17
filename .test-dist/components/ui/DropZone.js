"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useCallback } from "react";
import { Upload, CircleAlert as AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";
export function DropZone({ onFilesSelected, onFilesDrop, accept, multiple = false, title = "Drop files here", description = "or click to upload", subtitle, className, icon, maxSize, }) {
    const finalDescription = subtitle || description;
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const errorId = `dropzone-error-${typeof title === 'string' ? title.toLowerCase().replace(/\s+/g, "-") : "upload"}`;
    const handleFiles = useCallback((files) => {
        setError(null);
        const fileArray = Array.from(files);
        if (maxSize) {
            const oversizedFiles = fileArray.filter(file => file.size > maxSize);
            if (oversizedFiles.length > 0) {
                setError(`Some files exceed the maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
                return;
            }
        }
        const callback = onFilesSelected || onFilesDrop;
        if (callback)
            callback(fileArray);
    }, [onFilesSelected, onFilesDrop, maxSize]);
    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };
    const onClick = () => {
        fileInputRef.current?.click();
    };
    return (_jsxs("div", { className: "w-full space-y-2", children: [_jsxs(m.div, { whileHover: { scale: 1.005 }, whileTap: { scale: 0.995 }, animate: {
                    scale: isDragging ? 1.02 : 1,
                    borderColor: isDragging ? "var(--blue)" : error ? "var(--error)" : "var(--border)",
                    backgroundColor: isDragging ? "var(--blue-glow)" : error ? "var(--error-glow)" : "var(--surface)"
                }, className: cn("relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-colors duration-300", "flex flex-col items-center justify-center p-10 text-center", className), onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: onDrop, onClick: onClick, role: "button", tabIndex: 0, onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick();
                    }
                }, "aria-label": `${typeof title === 'string' ? title : "Upload file"}. ${typeof finalDescription === 'string' ? finalDescription : ""}`, "data-invalid": !!error, "aria-describedby": error ? errorId : undefined, "aria-dropeffect": "copy", children: [_jsx(m.div, { animate: {
                            scale: isDragging ? 1.2 : 1,
                            y: isDragging ? [0, -10, 0] : 0
                        }, transition: {
                            y: isDragging ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" } : { duration: 0.3 }
                        }, className: cn("mb-4 rounded-2xl p-4 transition-all duration-300", isDragging ? "bg-blue text-white shadow-md shadow-blue/10" : "bg-bg text-text-3 group-hover:text-blue group-hover:bg-blue/5"), "aria-hidden": "true", children: icon || _jsx(Upload, { className: "w-8 h-8" }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "font-bold text-lg text-text-2 group-hover:text-blue transition-colors", children: title }), _jsx("p", { className: "text-sm text-text-3 font-medium italic", children: finalDescription })] }), _jsx(AnimatePresence, { children: isDragging && (_jsx(m.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-blue/5 pointer-events-none", children: _jsx(m.div, { animate: {
                                    opacity: [0.1, 0.2, 0.1],
                                    scale: [1, 1.05, 1]
                                }, transition: { repeat: Infinity, duration: 2 }, className: "absolute inset-0 border-4 border-blue/20 rounded-3xl" }) })) }), _jsx("input", { ref: fileInputRef, type: "file", accept: accept, multiple: multiple, className: "hidden", tabIndex: -1, onChange: (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleFiles(e.target.files);
                                // Reset input value so re-selecting the same file triggers onChange again
                                e.target.value = "";
                            }
                        } })] }), _jsx(AnimatePresence, { children: error && (_jsxs(m.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, id: errorId, role: "alert", className: "flex items-center gap-2 text-xs font-bold text-error bg-error/5 p-3 rounded-xl border border-error/20 overflow-hidden", children: [_jsx(AlertCircle, { className: "w-4 h-4", "aria-hidden": "true" }), error] })) })] }));
}
