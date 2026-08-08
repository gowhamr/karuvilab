"use client";
import React, { useRef, useState, useCallback } from "react";
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
  const setSelectedAnnotation = useEditorStore(state => state.setSelectedAnnotation);
  const setActiveTool = useEditorStore(state => state.setActiveTool);
  
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
    if (activeTool === 'select') {
      if (layerRef.current && e.target === layerRef.current) {
        setSelectedAnnotation(null);
      }
      return;
    }
    
    if (layerRef.current && e.target !== layerRef.current) return;
    
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
      } as TextAnnotation);
      setSelectedAnnotation(id);
      setActiveTool('select');
    } else if (activeTool === 'shape') {
      addAnnotation({
        id, pageIndex, x, y,
        type: 'shape',
        shapeType: 'rectangle',
        width: 15, height: 10,
        color: '#4F46E5',
        strokeWidth: 3
      } as ShapeAnnotation);
      setSelectedAnnotation(id);
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
      setSelectedAnnotation(id);
    } else if (activeTool === 'blackout') {
      addAnnotation({
        id, pageIndex, x, y,
        type: 'blackout',
        width: 15, height: 5,
      } as BlackoutAnnotation);
      setSelectedAnnotation(id);
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

  const isDrawingTool = activeTool === 'draw' || activeTool === 'shape' || activeTool === 'blackout';

  return (
    <div 
      ref={layerRef}
      className={`absolute inset-0 z-content ${isDrawingTool ? 'touch-none' : ''}`}
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
  const selectedAnnotationId = useEditorStore(state => state.selectedAnnotationId);
  const setSelectedAnnotation = useEditorStore(state => state.setSelectedAnnotation);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(
    annotation.type === 'text' ? Boolean((annotation as TextAnnotation).isEditing) : false
  );
  const lastTapRef = useRef<number>(0);

  const isSelectMode = activeTool === 'select';
  const isSelected = selectedAnnotationId === annotation.id;

  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    deleteAnnotation(annotation.id);
  };

  const handlePointerDown = (e: React.PointerEvent<Element>) => {
    if (!isSelectMode || isEditing) return;

    e.stopPropagation();
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
    if (!parent) return;

    try {
      target.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startAnnX = annotation.x;
    const startAnnY = annotation.y;
    const initialPoints = annotation.type === 'draw' ? [...annotation.points] : [];
    const rect = parent.getBoundingClientRect();

    const onMove = (ev: any) => {
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

    const onUp = (ev: any) => {
      setIsDragging(false);
      try {
        target.releasePointerCapture(ev.pointerId);
      } catch {}
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
      } else {
        updateAnnotation(annotation.id, { isEditing: false });
      }
    }
  };

  const handleResizeDown = useCallback((e: React.PointerEvent, handleId: string) => {
    e.stopPropagation();
    const target = e.currentTarget;
    const layerElement = target.closest('.z-content') || target.parentElement?.parentElement;
    if (!layerElement) return;

    try {
      target.setPointerCapture(e.pointerId);
    } catch {}

    const startX = e.clientX;
    const startY = e.clientY;
    const startAnnX = annotation.x;
    const startAnnY = annotation.y;
    const startWidth = (annotation as any).width;
    const startHeight = (annotation as any).height;
    const rect = layerElement.getBoundingClientRect();

    const onMove = (ev: any) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;

      let newX = startAnnX;
      let newY = startAnnY;
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (handleId.includes('left')) {
        newX = startAnnX + dx;
        newWidth = startWidth - dx;
      } else {
        newWidth = startWidth + dx;
      }

      if (handleId.includes('top')) {
        newY = startAnnY + dy;
        newHeight = startHeight - dy;
      } else {
        newHeight = startHeight + dy;
      }

      if (newWidth < 2) {
        if (handleId.includes('left')) newX = startAnnX + startWidth - 2;
        newWidth = 2;
      }
      if (newHeight < 2) {
        if (handleId.includes('top')) newY = startAnnY + startHeight - 2;
        newHeight = 2;
      }

      updateAnnotation(annotation.id, { x: newX, y: newY, width: newWidth, height: newHeight });
    };

    const onUp = (ev: any) => {
      try {
        target.releasePointerCapture(ev.pointerId);
      } catch {}
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  }, [annotation, updateAnnotation]);

  const renderResizeHandles = () => {
    if (!isSelectMode || !isSelected || isEditing) return null;
    if (annotation.type !== 'shape' && annotation.type !== 'blackout' && annotation.type !== 'image') return null;

    const handles = [
      { id: 'top-left', style: { top: 0, left: 0 }, cursor: 'nwse-resize' },
      { id: 'top-right', style: { top: 0, left: '100%' }, cursor: 'nesw-resize' },
      { id: 'bottom-left', style: { top: '100%', left: 0 }, cursor: 'nesw-resize' },
      { id: 'bottom-right', style: { top: '100%', left: '100%' }, cursor: 'nwse-resize' },
    ];

    return (
      <>
        {handles.map(h => (
          <div
            key={h.id}
            onPointerDown={(e) => handleResizeDown(e, h.id)}
            className="absolute flex items-center justify-center pointer-events-auto"
            style={{ 
              ...h.style, 
              width: '44px', 
              height: '44px',
              cursor: h.cursor,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
            aria-label={`Resize ${h.id}`}
          >
            <div className="w-4 h-4 bg-white border-2 border-blue rounded-full shadow-sm" />
          </div>
        ))}
      </>
    );
  };

  const renderControls = () => {
    if (!isSelectMode || !isSelected || isEditing) return null;
    return (
      <div className="absolute -top-14 -right-4 flex items-center gap-2 z-content bg-surface p-1 rounded-lg shadow-lg pointer-events-auto">
        {annotation.type === 'text' && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            aria-label="Edit text"
            title="Edit text"
            className="bg-blue text-white rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue"
          >✏️</button>
        )}
        <button 
          onClick={handleDelete}
          onTouchEnd={handleDelete}
          aria-label="Delete annotation"
          title="Delete"
          className="bg-red-500 text-white rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
        >✕</button>
      </div>
    );
  };

  if (annotation.type === 'text') {
    return (
      <div 
        onPointerDown={handlePointerDown}
        className={`absolute pointer-events-auto ${isSelectMode && !isEditing ? 'group cursor-move' : ''}`}
        style={{
          left: `${annotation.x}%`,
          top: `${annotation.y}%`,
          color: annotation.color,
          fontSize: `${Math.max(16, window.innerHeight * (annotation.fontSize / 100))}px`,
          fontWeight: 'bold',
          whiteSpace: 'pre-wrap',
        }}
      >
        <div className={`p-1 transition-colors relative border-2 ${isSelected && !isEditing ? 'border-blue' : 'border-transparent'}`}>
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={annotation.content}
              onChange={(e) => updateAnnotation(annotation.id, { content: e.target.value })}
              onBlur={handleFinishEditing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  handleFinishEditing();
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-surface-elevated text-text border-2 border-blue px-2 py-1 rounded shadow-md focus:outline-none min-w-[140px]"
            />
          ) : (
            (annotation.content || "Tap to edit")
          )}
          {renderControls()}
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
          borderRadius: isCircle ? '50%' : '0',
          outline: isSelected ? '2px solid #4F46E5' : 'none',
          outlineOffset: '2px'
        }}
      >
        {renderControls()}
        {renderResizeHandles()}
      </div>
    );
  }

  if (annotation.type === 'draw') {
    if (annotation.points.length < 2) return null;
    
    const minX = Math.min(...annotation.points.map(p => p.x));
    const minY = Math.min(...annotation.points.map(p => p.y));
    const maxX = Math.max(...annotation.points.map(p => p.x));
    const maxY = Math.max(...annotation.points.map(p => p.y));
    
    const width = Math.max(maxX - minX, 0.1);
    const height = Math.max(maxY - minY, 0.1);

    const polylinePoints = annotation.points.map(p => `${p.x - minX},${p.y - minY}`).join(' ');
    
    return (
      <div
        onPointerDown={handlePointerDown}
        className={`absolute overflow-visible pointer-events-auto ${isSelectMode ? 'group cursor-move' : ''}`}
        style={{
          left: `${minX}%`,
          top: `${minY}%`,
          width: `${width}%`,
          height: `${height}%`,
          border: isSelected ? '2px solid #4F46E5' : '2px solid transparent',
        }}
      >
        <svg
          className="w-full h-full overflow-visible pointer-events-none"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
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
        </svg>
        {renderControls()}
      </div>
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
          outline: isSelected ? '2px solid #4F46E5' : 'none',
          outlineOffset: '2px'
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wLDggTDgsMCB6IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />
        {renderControls()}
        {renderResizeHandles()}
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
          outline: isSelected ? '2px solid #4F46E5' : 'none',
          outlineOffset: '2px'
        }}
      >
        <img 
          src={annotation.dataUrl} 
          alt="User annotation" 
          className="w-full h-full object-contain pointer-events-none" 
        />
        {renderControls()}
        {renderResizeHandles()}
      </div>
    );
  }

  return null;
}
