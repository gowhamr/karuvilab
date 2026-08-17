"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useCallback } from "react";
import { useEditorStore } from "../store";
import { getSignature } from "../utils/signature-db";
export default function AnnotationLayer({ pageIndex }) {
    const allAnnotations = useEditorStore(state => state.annotations);
    const annotations = allAnnotations.filter(a => a.pageIndex === pageIndex);
    const activeTool = useEditorStore(state => state.activeTool);
    const addAnnotation = useEditorStore(state => state.addAnnotation);
    const updateAnnotation = useEditorStore(state => state.updateAnnotation);
    const setSelectedAnnotation = useEditorStore(state => state.setSelectedAnnotation);
    const setActiveTool = useEditorStore(state => state.setActiveTool);
    const layerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentDrawId, setCurrentDrawId] = useState(null);
    const getPercentagePos = (e) => {
        if (!layerRef.current)
            return { x: 0, y: 0 };
        const rect = layerRef.current.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e && e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        return { x, y };
    };
    const handlePointerDown = async (e) => {
        if (activeTool === 'select') {
            if (layerRef.current && e.target === layerRef.current) {
                setSelectedAnnotation(null);
            }
            return;
        }
        if (layerRef.current && e.target !== layerRef.current)
            return;
        // Prevent default to stop focus stealing (for text tool) and native dragging (for drawing tools)
        if (e.cancelable) {
            e.preventDefault();
        }
        const { x, y } = getPercentagePos(e);
        const id = Date.now().toString();
        if (activeTool === 'text') {
            addAnnotation({
                id, pageIndex, x, y,
                type: 'text',
                content: '',
                fontSize: 3,
                color: '#000000',
                isEditing: true
            });
            setSelectedAnnotation(id);
            setActiveTool('select');
        }
        else if (activeTool === 'shape') {
            addAnnotation({
                id, pageIndex, x, y,
                type: 'shape',
                shapeType: 'rectangle',
                width: 15, height: 10,
                color: '#4F46E5',
                strokeWidth: 3
            });
            setSelectedAnnotation(id);
        }
        else if (activeTool === 'draw') {
            setIsDrawing(true);
            setCurrentDrawId(id);
            addAnnotation({
                id, pageIndex, x, y,
                type: 'draw',
                points: [{ x, y }],
                color: '#EF4444',
                strokeWidth: 3
            });
            setSelectedAnnotation(id);
        }
        else if (activeTool === 'blackout') {
            addAnnotation({
                id, pageIndex, x, y,
                type: 'blackout',
                width: 15, height: 5,
            });
            setSelectedAnnotation(id);
        }
        else if (activeTool === 'signature') {
            const dataUrl = await getSignature();
            if (dataUrl) {
                addAnnotation({
                    id, pageIndex, x, y,
                    type: 'image',
                    dataUrl,
                    width: 20, height: 10,
                });
                setSelectedAnnotation(id);
                setActiveTool('select');
            }
            else {
                alert("No saved signature found. Please use the Signature tool in the sidebar to create one first.");
            }
        }
        else if (activeTool === 'arrow') {
            setIsDrawing(true);
            setCurrentDrawId(id);
            addAnnotation({
                id, pageIndex, x, y,
                type: 'arrow',
                endX: x, endY: y,
                color: '#4F46E5',
                strokeWidth: 3
            });
            setSelectedAnnotation(id);
        }
    };
    const handlePointerMove = (e) => {
        if (!isDrawing || !currentDrawId)
            return;
        const { x, y } = getPercentagePos(e);
        if (activeTool === 'draw') {
            const currentAnn = annotations.find(a => a.id === currentDrawId);
            if (currentAnn) {
                updateAnnotation(currentDrawId, {
                    points: [...currentAnn.points, { x, y }]
                });
            }
        }
        else if (activeTool === 'arrow') {
            const currentAnn = annotations.find(a => a.id === currentDrawId);
            if (currentAnn) {
                updateAnnotation(currentDrawId, {
                    endX: x, endY: y
                });
            }
        }
    };
    const handlePointerUp = () => {
        setIsDrawing(false);
        setCurrentDrawId(null);
    };
    const isDrawingTool = activeTool === 'draw' || activeTool === 'shape' || activeTool === 'blackout' || activeTool === 'arrow' || activeTool === 'signature';
    const isHighlightTool = activeTool === 'highlight';
    const pointerEventsClass = (activeTool === 'highlight' || activeTool === 'select') ? 'pointer-events-none' : 'pointer-events-auto';
    return (_jsx("div", { ref: layerRef, className: `absolute inset-0 z-content ${isDrawingTool ? 'touch-none' : ''} ${pointerEventsClass}`, onMouseDown: handlePointerDown, onMouseMove: handlePointerMove, onMouseUp: handlePointerUp, onMouseLeave: handlePointerUp, onTouchStart: handlePointerDown, onTouchMove: handlePointerMove, onTouchEnd: handlePointerUp, style: { cursor: activeTool === 'select' ? 'default' : 'crosshair' }, children: annotations.map(ann => (_jsx(AnnotationItem, { annotation: ann }, ann.id))) }));
}
function AnnotationItem({ annotation }) {
    const updateAnnotation = useEditorStore(state => state.updateAnnotation);
    const deleteAnnotation = useEditorStore(state => state.deleteAnnotation);
    const activeTool = useEditorStore(state => state.activeTool);
    const selectedAnnotationId = useEditorStore(state => state.selectedAnnotationId);
    const setSelectedAnnotation = useEditorStore(state => state.setSelectedAnnotation);
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(annotation.type === 'text' ? Boolean(annotation.isEditing) : false);
    const lastTapRef = useRef(0);
    const isSelectMode = activeTool === 'select';
    const isSelected = selectedAnnotationId === annotation.id;
    const handleDelete = (e) => {
        e.stopPropagation();
        deleteAnnotation(annotation.id);
    };
    const handlePointerDown = (e) => {
        if (!isSelectMode || isEditing)
            return;
        e.stopPropagation();
        if (e.cancelable)
            e.preventDefault();
        setSelectedAnnotation(annotation.id);
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;
        lastTapRef.current = now;
        if (annotation.type === 'text' && timeSinceLastTap < 500) {
            setIsEditing(true);
            return;
        }
        const target = e.currentTarget;
        const parent = target.parentElement;
        if (!parent)
            return;
        try {
            target.setPointerCapture(e.pointerId);
        }
        catch { }
        setIsDragging(true);
        const startX = e.clientX;
        const startY = e.clientY;
        const startAnnX = annotation.x;
        const startAnnY = annotation.y;
        const initialPoints = annotation.type === 'draw' ? [...annotation.points] : [];
        const initialEndX = annotation.type === 'arrow' ? annotation.endX : 0;
        const initialEndY = annotation.type === 'arrow' ? annotation.endY : 0;
        const rect = parent.getBoundingClientRect();
        const onMove = (ev) => {
            const dx = ((ev.clientX - startX) / rect.width) * 100;
            const dy = ((ev.clientY - startY) / rect.height) * 100;
            if (annotation.type === 'draw') {
                updateAnnotation(annotation.id, {
                    points: initialPoints.map(p => ({ x: p.x + dx, y: p.y + dy }))
                });
            }
            else if (annotation.type === 'arrow') {
                updateAnnotation(annotation.id, {
                    x: startAnnX + dx, y: startAnnY + dy,
                    endX: initialEndX + dx, endY: initialEndY + dy
                });
            }
            else {
                updateAnnotation(annotation.id, { x: startAnnX + dx, y: startAnnY + dy });
            }
        };
        const onUp = (ev) => {
            setIsDragging(false);
            try {
                target.releasePointerCapture(ev.pointerId);
            }
            catch { }
            target.removeEventListener('pointermove', onMove);
            target.removeEventListener('pointerup', onUp);
            target.removeEventListener('pointercancel', onUp);
        };
        target.addEventListener('pointermove', onMove);
        target.addEventListener('pointerup', onUp);
        target.addEventListener('pointercancel', onUp);
    };
    const handleFinishEditing = () => {
        setIsEditing(false);
        if (annotation.type === 'text') {
            if (!annotation.content || annotation.content.trim() === '') {
                deleteAnnotation(annotation.id);
            }
            else {
                updateAnnotation(annotation.id, { isEditing: false });
            }
        }
    };
    const handleResizeDown = useCallback((e, handleId) => {
        e.stopPropagation();
        if (e.cancelable)
            e.preventDefault();
        const target = e.currentTarget;
        const layerElement = target.closest('.z-content') || target.parentElement?.parentElement;
        if (!layerElement)
            return;
        try {
            target.setPointerCapture(e.pointerId);
        }
        catch { }
        const startX = e.clientX;
        const startY = e.clientY;
        const startAnnX = annotation.x;
        const startAnnY = annotation.y;
        const startWidth = annotation.width;
        const startHeight = annotation.height;
        const rect = layerElement.getBoundingClientRect();
        const onMove = (ev) => {
            const dx = ((ev.clientX - startX) / rect.width) * 100;
            const dy = ((ev.clientY - startY) / rect.height) * 100;
            let newX = startAnnX;
            let newY = startAnnY;
            let newWidth = startWidth;
            let newHeight = startHeight;
            if (handleId.includes('left')) {
                newX = startAnnX + dx;
                newWidth = startWidth - dx;
            }
            else if (handleId.includes('right')) {
                newWidth = startWidth + dx;
            }
            if (handleId.includes('top')) {
                newY = startAnnY + dy;
                newHeight = startHeight - dy;
            }
            else if (handleId.includes('bottom')) {
                newHeight = startHeight + dy;
            }
            if (newWidth < 2) {
                if (handleId.includes('left'))
                    newX = startAnnX + startWidth - 2;
                newWidth = 2;
            }
            if (newHeight < 2) {
                if (handleId.includes('top'))
                    newY = startAnnY + startHeight - 2;
                newHeight = 2;
            }
            updateAnnotation(annotation.id, { x: newX, y: newY, width: newWidth, height: newHeight });
        };
        const onUp = (ev) => {
            try {
                target.releasePointerCapture(ev.pointerId);
            }
            catch { }
            target.removeEventListener('pointermove', onMove);
            target.removeEventListener('pointerup', onUp);
            target.removeEventListener('pointercancel', onUp);
        };
        target.addEventListener('pointermove', onMove);
        target.addEventListener('pointerup', onUp);
        target.addEventListener('pointercancel', onUp);
    }, [annotation, updateAnnotation]);
    const renderResizeHandles = () => {
        if (!isSelectMode || !isSelected || isEditing)
            return null;
        if (annotation.type !== 'shape' && annotation.type !== 'blackout' && annotation.type !== 'image')
            return null;
        const handles = [
            { id: 'top-left', style: { top: 0, left: 0 }, cursor: 'nwse-resize' },
            { id: 'top-center', style: { top: 0, left: '50%' }, cursor: 'ns-resize' },
            { id: 'top-right', style: { top: 0, left: '100%' }, cursor: 'nesw-resize' },
            { id: 'left-center', style: { top: '50%', left: 0 }, cursor: 'ew-resize' },
            { id: 'right-center', style: { top: '50%', left: '100%' }, cursor: 'ew-resize' },
            { id: 'bottom-left', style: { top: '100%', left: 0 }, cursor: 'nesw-resize' },
            { id: 'bottom-center', style: { top: '100%', left: '50%' }, cursor: 'ns-resize' },
            { id: 'bottom-right', style: { top: '100%', left: '100%' }, cursor: 'nwse-resize' },
        ];
        return (_jsx(_Fragment, { children: handles.map(h => (_jsx("div", { onPointerDown: (e) => handleResizeDown(e, h.id), className: "absolute flex items-center justify-center pointer-events-auto z-content", style: {
                    ...h.style,
                    width: '44px',
                    height: '44px',
                    cursor: h.cursor,
                    transform: 'translate(-50%, -50%)'
                }, "aria-label": `Resize ${h.id}`, children: _jsx("div", { className: "w-4 h-4 bg-white border-2 border-blue rounded-full shadow-sm" }) }, h.id))) }));
    };
    const renderControls = () => {
        if (!isSelectMode || !isSelected || isEditing)
            return null;
        return (_jsxs("div", { className: "absolute -top-14 -right-4 flex items-center gap-2 z-content bg-surface p-1 rounded-lg shadow-lg pointer-events-auto", children: [annotation.type === 'text' && (_jsx("button", { onClick: (e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }, onTouchEnd: (e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }, "aria-label": "Edit text", title: "Edit text", className: "bg-blue text-white rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue", children: "\u270F\uFE0F" })), _jsx("button", { onClick: handleDelete, onTouchEnd: handleDelete, "aria-label": "Delete annotation", title: "Delete", className: "bg-red-500 text-white rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500", children: "\u2715" })] }));
    };
    if (annotation.type === 'text') {
        return (_jsx("div", { onPointerDown: handlePointerDown, className: `absolute pointer-events-auto ${isSelectMode && !isEditing ? 'group cursor-move' : ''}`, style: {
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                color: annotation.color,
                fontSize: `${Math.max(16, window.innerHeight * (annotation.fontSize / 100))}px`,
                fontWeight: 'bold',
                whiteSpace: 'pre-wrap',
            }, children: _jsxs("div", { className: `p-1 transition-colors relative border-2 ${isSelected && !isEditing ? 'border-blue' : 'border-transparent'}`, children: [isEditing ? (_jsx("input", { type: "text", autoFocus: true, value: annotation.content, onChange: (e) => updateAnnotation(annotation.id, { content: e.target.value }), onBlur: handleFinishEditing, onKeyDown: (e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') {
                                handleFinishEditing();
                            }
                        }, onPointerDown: (e) => e.stopPropagation(), className: "bg-surface-elevated text-text border-2 border-blue px-2 py-1 rounded shadow-md focus:outline-none min-w-[140px]" })) : ((annotation.content || "Tap to edit")), renderControls()] }) }));
    }
    if (annotation.type === 'shape') {
        const isCircle = annotation.shapeType === 'circle';
        return (_jsxs("div", { onPointerDown: handlePointerDown, className: `absolute pointer-events-auto group ${isSelectMode ? 'cursor-move' : ''}`, style: {
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`,
                border: `${annotation.strokeWidth}px solid ${annotation.color}`,
                backgroundColor: annotation.fill || 'transparent',
                borderRadius: isCircle ? '50%' : '0',
                outline: isSelected ? '2px solid #4F46E5' : 'none',
                outlineOffset: '2px'
            }, children: [renderControls(), renderResizeHandles()] }));
    }
    if (annotation.type === 'draw') {
        if (annotation.points.length < 2)
            return null;
        const minX = Math.min(...annotation.points.map(p => p.x));
        const minY = Math.min(...annotation.points.map(p => p.y));
        const maxX = Math.max(...annotation.points.map(p => p.x));
        const maxY = Math.max(...annotation.points.map(p => p.y));
        const width = Math.max(maxX - minX, 0.1);
        const height = Math.max(maxY - minY, 0.1);
        const polylinePoints = annotation.points.map(p => `${p.x - minX},${p.y - minY}`).join(' ');
        return (_jsxs("div", { onPointerDown: handlePointerDown, className: `absolute overflow-visible pointer-events-auto ${isSelectMode ? 'group cursor-move' : ''}`, style: {
                left: `${minX}%`,
                top: `${minY}%`,
                width: `${width}%`,
                height: `${height}%`,
                border: isSelected ? '2px solid #4F46E5' : '2px solid transparent',
            }, children: [_jsx("svg", { className: "w-full h-full overflow-visible pointer-events-none", viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "none", children: _jsx("polyline", { points: polylinePoints, fill: "none", stroke: annotation.color, strokeWidth: annotation.strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" }) }), renderControls()] }));
    }
    if (annotation.type === 'arrow') {
        const arr = annotation;
        const minX = Math.min(arr.x, arr.endX);
        const minY = Math.min(arr.y, arr.endY);
        const maxX = Math.max(arr.x, arr.endX);
        const maxY = Math.max(arr.y, arr.endY);
        const width = Math.max(maxX - minX, 0.1);
        const height = Math.max(maxY - minY, 0.1);
        const isLeftToRight = arr.x <= arr.endX;
        const isTopToBottom = arr.y <= arr.endY;
        const x1 = isLeftToRight ? '0%' : '100%';
        const y1 = isTopToBottom ? '0%' : '100%';
        const x2 = isLeftToRight ? '100%' : '0%';
        const y2 = isTopToBottom ? '100%' : '0%';
        return (_jsxs("div", { onPointerDown: handlePointerDown, className: `absolute overflow-visible pointer-events-auto ${isSelectMode ? 'group cursor-move' : ''}`, style: {
                left: `${minX}%`,
                top: `${minY}%`,
                width: `${width}%`,
                height: `${height}%`,
                border: isSelected ? '2px solid #4F46E5' : '2px solid transparent',
            }, children: [_jsxs("svg", { className: "w-full h-full overflow-visible pointer-events-none", children: [_jsx("defs", { children: _jsx("marker", { id: `arrowhead-${annotation.id}`, markerWidth: "7", markerHeight: "7", refX: "6.5", refY: "3.5", orient: "auto", children: _jsx("polygon", { points: "0 0, 7 3.5, 0 7", fill: arr.color }) }) }), _jsx("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: arr.color, strokeWidth: arr.strokeWidth, markerEnd: `url(#arrowhead-${annotation.id})` })] }), renderControls()] }));
    }
    if (annotation.type === 'blackout') {
        return (_jsxs("div", { onPointerDown: handlePointerDown, className: `absolute pointer-events-auto group ${isSelectMode ? 'cursor-move' : ''}`, style: {
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`,
                backgroundColor: '#000000',
                outline: isSelected ? '2px solid #4F46E5' : 'none',
                outlineOffset: '2px'
            }, children: [_jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wLDggTDgsMCB6IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50 pointer-events-none" }), renderControls(), renderResizeHandles()] }));
    }
    if (annotation.type === 'image') {
        return (_jsxs("div", { onPointerDown: handlePointerDown, className: `absolute pointer-events-auto group ${isSelectMode ? 'cursor-move' : ''}`, style: {
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`,
                outline: isSelected ? '2px solid #4F46E5' : 'none',
                outlineOffset: '2px'
            }, children: [_jsx("img", { src: annotation.dataUrl, alt: "User annotation", className: "w-full h-full object-contain pointer-events-none" }), renderControls(), renderResizeHandles()] }));
    }
    if (annotation.type === 'highlight') {
        return (_jsx("div", { className: "absolute inset-0 pointer-events-none", children: annotation.rects.map((rect, idx) => (_jsx("div", { className: `absolute pointer-events-auto ${isSelectMode ? 'cursor-pointer' : ''}`, onPointerDown: (e) => {
                    // only the first rect handles selection for simplicity or any rect
                    handlePointerDown(e);
                }, style: {
                    left: `${rect.x}%`,
                    top: `${rect.y}%`,
                    width: `${rect.width}%`,
                    height: `${rect.height}%`,
                    backgroundColor: annotation.color,
                    mixBlendMode: 'multiply',
                    outline: isSelected ? '2px solid #4F46E5' : 'none',
                }, children: idx === 0 && renderControls() }, idx))) }));
    }
    return null;
}
