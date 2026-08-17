"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback } from "react";
import { X, Eraser, Check } from "lucide-react";
import { useEditorStore } from "../store";
import { setSignature } from "../utils/signature-db";
export default function SignatureModal() {
    const isSignatureModalOpen = useEditorStore(s => s.isSignatureModalOpen);
    const setSignatureModalOpen = useEditorStore(s => s.setSignatureModalOpen);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const ctxRef = useRef(null);
    useEffect(() => {
        if (isSignatureModalOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            // High DPI display support
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.scale(dpr, dpr);
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#000000";
                ctxRef.current = ctx;
            }
            setHasDrawn(false);
        }
    }, [isSignatureModalOpen]);
    const getPos = (e) => {
        if (!canvasRef.current)
            return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        return { x: clientX - rect.left, y: clientY - rect.top };
    };
    const startDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const { x, y } = getPos(e);
        if (ctxRef.current) {
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(x, y);
        }
    };
    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing || !ctxRef.current)
            return;
        const { x, y } = getPos(e);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        setHasDrawn(true);
    };
    const stopDrawing = () => {
        if (!isDrawing)
            return;
        setIsDrawing(false);
        if (ctxRef.current) {
            ctxRef.current.closePath();
        }
    };
    const handleClear = useCallback(() => {
        if (canvasRef.current && ctxRef.current) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setHasDrawn(false);
        }
    }, []);
    const handleSave = useCallback(async () => {
        if (canvasRef.current && hasDrawn) {
            // Find bounding box to crop the signature
            const ctx = ctxRef.current;
            if (!ctx)
                return;
            const canvas = canvasRef.current;
            // Get the image data
            // For simplicity, we just save the whole canvas for now, or we can try to crop it.
            // Saving whole canvas is easier.
            const dataUrl = canvas.toDataURL('image/png');
            await setSignature(dataUrl);
            setSignatureModalOpen(false);
            useEditorStore.getState().setActiveTool('signature');
        }
    }, [hasDrawn, setSignatureModalOpen]);
    if (!isSignatureModalOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center bg-black/50 p-4", children: _jsxs("div", { className: "bg-surface rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border bg-surface-2", children: [_jsx("h3", { className: "font-bold text-text", children: "Create Signature" }), _jsx("button", { onClick: () => setSignatureModalOpen(false), className: "p-1 text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors", "aria-label": "Close", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-4 bg-bg flex flex-col items-center", children: _jsxs("div", { className: "w-full relative bg-white border border-border rounded-xl overflow-hidden shadow-sm touch-none", children: [_jsx("canvas", { ref: canvasRef, className: "w-full h-48 cursor-crosshair block", onMouseDown: startDrawing, onMouseMove: draw, onMouseUp: stopDrawing, onMouseLeave: stopDrawing, onTouchStart: startDrawing, onTouchMove: draw, onTouchEnd: stopDrawing }), !hasDrawn && (_jsx("div", { className: "absolute inset-0 pointer-events-none flex items-center justify-center text-text-muted opacity-50", children: _jsx("p", { className: "font-medium", children: "Draw your signature here" }) }))] }) }), _jsxs("div", { className: "p-4 border-t border-border bg-surface-2 flex items-center justify-between gap-3", children: [_jsxs("button", { onClick: handleClear, disabled: !hasDrawn, className: "flex items-center gap-2 px-4 py-2 bg-surface text-text font-medium rounded-xl border border-border hover:bg-bg disabled:opacity-50 transition-colors", children: [_jsx(Eraser, { className: "w-4 h-4" }), _jsx("span", { children: "Clear" })] }), _jsxs("button", { onClick: handleSave, disabled: !hasDrawn, className: "flex items-center gap-2 px-6 py-2 bg-blue text-white font-bold rounded-xl shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all", children: [_jsx(Check, { className: "w-4 h-4" }), _jsx("span", { children: "Save & Use" })] })] })] }) }));
}
