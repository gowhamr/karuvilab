"use client";
import React, { useRef, useState } from "react";
import { useEditorStore, Annotation, TextAnnotation, DrawAnnotation, ShapeAnnotation, ImageAnnotation, BlackoutAnnotation, ToolType } from "../store";

interface AnnotationLayerProps {
  pageIndex: number;
}

export default function AnnotationLayer({ pageIndex }: AnnotationLayerProps) {
  const allAnnotations = useEditorStore(state => state.annotations);
  const annotations = allAnnotations.filter(a => a.pageIndex === pageIndex);
  const activeTool = useEditorStore(state => state.activeTool);
  const addAnnotation = useEditorStore(state => state.addAnnotation);
  const updateAnnotation = useEditorStore(state => state.updateAnnotation);
  
  const layerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawId, setCurrentDrawId] = useState<string | null>(null);

  const getPercentagePos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!layerRef.current) return { x: 0, y: 0 };
    const rect = layerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0]!.clientX;
      clientY = e.touches[0]!.clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool === 'select') return;
    
    const { x, y } = getPercentagePos(e);
    const id = Date.now().toString();

    if (activeTool === 'text') {
      addAnnotation({
        id, pageIndex, x, y,
        type: 'text',
        content: 'Double click to edit',
        fontSize: 3, 
        color: '#000000'
      } as TextAnnotation);
    } else if (activeTool === 'shape') {
      addAnnotation({
        id, pageIndex, x, y,
        type: 'shape',
        shapeType: 'rectangle',
        width: 15, height: 10,
        color: '#4F46E5',
        strokeWidth: 3
      } as ShapeAnnotation);
    } else if (activeTool === 'draw') {
      setIsDrawing(true);
      setCurrentDrawId(id);
      addAnnotation({
        id, pageIndex, x, y,
        type: 'draw',
        points: [{ x, y }],
        color: '#EF4444',
        strokeWidth: 3
      } as DrawAnnotation);
    } else if (activeTool === 'blackout') {
      addAnnotation({
        id, pageIndex, x, y,
        type: 'blackout',
        width: 15, height: 5,
      } as BlackoutAnnotation);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentDrawId || activeTool !== 'draw') return;
    
    const { x, y } = getPercentagePos(e);
    
    const currentAnn = annotations.find(a => a.id === currentDrawId) as DrawAnnotation;
    if (currentAnn) {
      updateAnnotation(currentDrawId, {
        points: [...currentAnn.points, { x, y }]
      });
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setCurrentDrawId(null);
  };

  return (
    <div 
      ref={layerRef}
      className="absolute inset-0 z-content touch-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
    >
      {annotations.map(ann => (
        <AnnotationItem key={ann.id} annotation={ann} />
      ))}
    </div>
  );
}

function AnnotationItem({ annotation }: { annotation: Annotation }) {
  const updateAnnotation = useEditorStore(state => state.updateAnnotation);
  const deleteAnnotation = useEditorStore(state => state.deleteAnnotation);
  const activeTool = useEditorStore(state => state.activeTool);
  const [isDragging, setIsDragging] = useState(false);

  const isSelectMode = activeTool === 'select';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAnnotation(annotation.id);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!isSelectMode) return;
    e.stopPropagation();
    const target = e.currentTarget;
    const parent = target.parentElement;
    if (!parent) return;

    target.setPointerCapture(e.pointerId);
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startAnnX = annotation.x;
    const startAnnY = annotation.y;
    const initialPoints = annotation.type === 'draw' ? [...annotation.points] : [];
    const rect = parent.getBoundingClientRect();

    const onMove = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      if (annotation.type === 'draw') {
        updateAnnotation(annotation.id, {
          points: initialPoints.map(p => ({ x: p.x + dx, y: p.y + dy }))
        });
      } else {
        updateAnnotation(annotation.id, { x: startAnnX + dx, y: startAnnY + dy });
      }
    };

    const onUp = (ev: PointerEvent) => {
      setIsDragging(false);
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  };

  if (annotation.type === 'text') {
    return (
      <div 
        onPointerDown={handlePointerDown}
        className={`absolute pointer-events-auto ${isSelectMode ? 'group cursor-move' : ''}`}
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          color: annotation.color,
          fontSize: `${Math.max(16, window.innerHeight * (annotation.fontSize / 100))}px`,
          fontWeight: 'bold',
          whiteSpace: 'pre-wrap',
          border: isSelectMode ? '1px dashed transparent' : 'none',
        }}
        onDoubleClick={(e) => {
          if (!isSelectMode) return;
          e.stopPropagation();
          const newText = prompt("Edit text:", annotation.content);
          if (newText !== null) updateAnnotation(annotation.id, { content: newText });
        }}
      >
        <div className="group-hover:border-blue border border-transparent p-1 transition-colors relative">
          {annotation.content || "Text"}
          {isSelectMode && (
            <button 
              onClick={handleDelete}
              aria-label="Delete annotation"
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-content focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
            >✕</button>
          )}
        </div>
      </div>
    );
  }
  
  if (annotation.type === 'shape') {
    const isCircle = annotation.shapeType === 'circle';
    return (
      <div
        onPointerDown={handlePointerDown}
        className={`absolute pointer-events-auto group ${isSelectMode ? 'cursor-move' : ''}`}
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          width: `${annotation.width}%`,
          height: `${annotation.height}%`,
          border: `${annotation.strokeWidth}px solid ${annotation.color}`,
          backgroundColor: annotation.fill || 'transparent',
          borderRadius: isCircle ? '50%' : '0'
        }}
      >
        {isSelectMode && (
          <button 
            onClick={handleDelete}
            aria-label="Delete annotation"
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-content focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          >✕</button>
        )}
      </div>
    );
  }

  if (annotation.type === 'draw') {
    if (annotation.points.length < 2) return null;
    
    const minX = Math.min(...annotation.points.map(p => p.x));
    const minY = Math.min(...annotation.points.map(p => p.y));
    const maxX = Math.max(...annotation.points.map(p => p.x));
    const maxY = Math.max(...annotation.points.map(p => p.y));

    // Convert points to SVG polyline coordinates relative to its bounding box
    const polylinePoints = annotation.points.map(p => `${p.x - minX},${p.y - minY}`).join(' ');
    
    return (
      <svg
        onPointerDown={handlePointerDown}
        className={`absolute overflow-visible pointer-events-none ${isSelectMode ? 'group pointer-events-auto cursor-move' : ''}`}
        style={{
          left: `${minX}%`,
          top: `${minY}%`,
          width: `${maxX - minX}%`,
          height: `${maxY - minY}%`
        }}
      >
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={annotation.color}
          strokeWidth={annotation.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {isSelectMode && (
          <rect 
            x="0" y="0" width="100%" height="100%" 
            fill="transparent" stroke="transparent" 
            className="group-hover:stroke-blue stroke-dashed cursor-pointer pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); }} // Prevent adding new annotation
          />
        )}
      </svg>
    );
  }

  if (annotation.type === 'blackout') {
    return (
      <div
        onPointerDown={handlePointerDown}
        className={`absolute pointer-events-auto group ${isSelectMode ? 'cursor-move' : ''}`}
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          width: `${annotation.width}%`,
          height: `${annotation.height}%`,
          backgroundColor: '#000000',
          border: isSelectMode ? '1px solid #4F46E5' : 'none',
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wLDggTDgsMCB6IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />
        {isSelectMode && (
          <button 
            onClick={handleDelete}
            aria-label="Delete annotation"
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-content focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          >✕</button>
        )}
      </div>
    );
  }

  if (annotation.type === 'image') {
    return (
      <div
        onPointerDown={handlePointerDown}
        className={`absolute pointer-events-auto group ${isSelectMode ? 'cursor-move' : ''}`}
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          width: `${annotation.width}%`,
          height: `${annotation.height}%`,
          border: isSelectMode ? '1px dashed #4F46E5' : 'none',
        }}
      >
        <img 
          src={annotation.dataUrl} 
          alt="User annotation" 
          className="w-full h-full object-contain pointer-events-none" 
        />
        {isSelectMode && (
          <button 
            onClick={handleDelete}
            aria-label="Delete annotation"
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-content focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          >✕</button>
        )}
      </div>
    );
  }

  return null;
}
