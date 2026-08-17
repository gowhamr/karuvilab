"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { getDeviceTier } from "../utils/device";
import AnnotationLayer from "./AnnotationLayer";
import { useEditorStore } from "../store";
import "pdfjs-dist/web/pdf_viewer.css";
export default function EditorCanvas({ pdfDoc, pageId, onPrevPage, onNextPage }) {
    const canvasRef = useRef(null);
    const textLayerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const pageState = useEditorStore(s => s.pages.find(p => p.id === pageId));
    const zoom = useEditorStore(s => s.zoom);
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const state = useEditorStore.getState();
                const delta = e.deltaY * -0.01;
                state.setZoom(Math.min(Math.max(state.zoom + delta, 0.5), 3.0));
            }
        };
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheel);
            }
        };
    }, []);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (!file)
                return;
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                let x = 10;
                let y = 10;
                if (canvasRef.current) {
                    const rect = canvasRef.current.getBoundingClientRect();
                    const dropX = e.clientX - rect.left;
                    const dropY = e.clientY - rect.top;
                    x = (dropX / rect.width) * 100;
                    y = (dropY / rect.height) * 100;
                    x = Math.max(0, Math.min(x, 100));
                    y = Math.max(0, Math.min(y, 100));
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        const dataUrl = event.target.result;
                        const img = new Image();
                        img.onload = () => {
                            const imgRatio = img.width / img.height;
                            let annWidth = 20;
                            let annHeight = 20;
                            if (canvasRef.current) {
                                const rect = canvasRef.current.getBoundingClientRect();
                                const actualWidthPx = (20 / 100) * rect.width;
                                const actualHeightPx = actualWidthPx / imgRatio;
                                annHeight = (actualHeightPx / rect.height) * 100;
                            }
                            useEditorStore.getState().addAnnotation({
                                id: crypto.randomUUID(),
                                type: 'image',
                                pageIndex: pageState.originalIndex,
                                x,
                                y,
                                width: annWidth,
                                height: annHeight,
                                dataUrl,
                            });
                        };
                        img.src = dataUrl;
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }, [pageState]);
    useEffect(() => {
        const handleMouseUp = () => {
            const state = useEditorStore.getState();
            if (state.activeTool === 'highlight') {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed)
                    return;
                const layer = textLayerRef.current;
                if (!layer)
                    return;
                const layerRect = layer.getBoundingClientRect();
                const rects = [];
                for (let i = 0; i < selection.rangeCount; i++) {
                    const range = selection.getRangeAt(i);
                    const clientRects = range.getClientRects();
                    for (let j = 0; j < clientRects.length; j++) {
                        const rect = clientRects[j];
                        if (rect.right < layerRect.left ||
                            rect.left > layerRect.right ||
                            rect.bottom < layerRect.top ||
                            rect.top > layerRect.bottom)
                            continue;
                        rects.push({
                            x: ((rect.left - layerRect.left) / layerRect.width) * 100,
                            y: ((rect.top - layerRect.top) / layerRect.height) * 100,
                            width: (rect.width / layerRect.width) * 100,
                            height: (rect.height / layerRect.height) * 100
                        });
                    }
                }
                if (rects.length > 0) {
                    state.addAnnotation({
                        id: crypto.randomUUID(),
                        pageIndex: pageState.originalIndex,
                        type: 'highlight',
                        rects,
                        color: '#FEF08A', // Yellow highlight
                        x: 0, y: 0 // Base properties
                    });
                }
                selection.removeAllRanges();
            }
        };
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [pageState]);
    useEffect(() => {
        let active = true;
        let renderTask = null;
        let pageRef = null;
        const canvas = canvasRef.current;
        const render = async () => {
            if (!pageState)
                return;
            try {
                setLoading(true);
                pageRef = await pdfDoc.getPage(pageState.originalIndex);
                if (!active || !canvas || !containerRef.current)
                    return;
                const ctx = canvas.getContext("2d");
                if (!ctx)
                    return;
                const rawWidth = containerRef.current.clientWidth;
                const tier = getDeviceTier();
                let dprCap = tier === "low" ? 1.5 : (tier === "standard" ? 2.0 : window.devicePixelRatio || 1);
                // On mobile (containerWidth < 600), use DPR cap of 1.5
                if (rawWidth < 600) {
                    dprCap = Math.min(dprCap, 1.5);
                }
                const actualDpr = Math.min(window.devicePixelRatio || 1, dprCap);
                // Remove fixed 40px padding subtraction, use a percentage instead
                const containerWidth = rawWidth * 0.95;
                const baseRotation = pageRef.rotate || 0;
                const totalRotation = (baseRotation + pageState.rotation) % 360;
                const unscaledViewport = pageRef.getViewport({ scale: 1.0, rotation: totalRotation });
                let scale = containerWidth / unscaledViewport.width;
                if (scale > 2)
                    scale = 2;
                const viewport = pageRef.getViewport({ scale: scale * actualDpr, rotation: totalRotation });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.style.width = `${viewport.width / actualDpr}px`;
                canvas.style.height = `${viewport.height / actualDpr}px`;
                renderTask = pageRef.render({ canvasContext: ctx, viewport });
                await renderTask.promise;
                if (active && textLayerRef.current) {
                    textLayerRef.current.innerHTML = '';
                    const textContent = await pageRef.getTextContent();
                    const pdfjsLib = await import('pdfjs-dist');
                    const textLayer = new pdfjsLib.TextLayer({
                        textContentSource: textContent,
                        container: textLayerRef.current,
                        viewport: viewport
                    });
                    textLayerRef.current.style.setProperty('--scale-factor', String(actualDpr));
                    await textLayer.render();
                    setLoading(false);
                }
            }
            catch (err) {
                if (active && err.name !== "RenderingCancelledException") {
                    // No console.log in production code as per instructions
                }
            }
        };
        render();
        return () => {
            active = false;
            if (renderTask) {
                try {
                    renderTask.cancel();
                }
                catch (e) { }
            }
            if (pageRef) {
                try {
                    pageRef.cleanup();
                }
                catch (e) { }
            }
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
            }
        };
    }, [pdfDoc, pageState]);
    if (!pageState)
        return null;
    const handleContainerPointerDown = (e) => {
        const state = useEditorStore.getState();
        if (state.activeTool === 'select') {
            // Only deselect if we didn't click on an annotation. Annotations have pointer-events-auto and will stop propagation.
            // Wait, we can just check if the target is an annotation. But annotations are inside AnnotationLayer.
            // Easiest is to let AnnotationItem call e.stopPropagation(). Since they do, any click reaching here is a background click.
            state.setSelectedAnnotation(null);
        }
    };
    return (_jsx("div", { ref: containerRef, className: "w-full h-full flex flex-col items-center py-10 overflow-auto custom-scrollbar", onDragOver: handleDragOver, onDrop: handleDrop, onPointerDown: handleContainerPointerDown, children: _jsx("div", { style: { transform: `scale(${zoom})`, transformOrigin: 'top center' }, children: _jsxs("div", { className: "relative shadow-xl bg-white border border-border", children: [_jsx("canvas", { ref: canvasRef, className: "block" }), _jsx("div", { ref: textLayerRef, className: "textLayer absolute inset-0 mix-blend-multiply" }), loading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-bg/20 backdrop-blur-sm z-modal", children: _jsx(Loader2, { className: "w-10 h-10 animate-spin text-blue" }) })), !loading && _jsx(AnnotationLayer, { pageIndex: pageState.originalIndex })] }) }) }));
}
