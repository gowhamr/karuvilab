import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { m, AnimatePresence } from 'framer-motion';
import { X, Save, Undo, Trash2, Eraser, Pen } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface DrawingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dataUrl: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
  color: string;
  width: number;
  isEraser: boolean;
}

export function DrawingModal({ open, onOpenChange, onSave }: DrawingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [color, setColor] = useState('#ffffff');
  const [width, setWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!open) {
      Promise.resolve().then(() => {
        setPaths([]);
        setCurrentPath(null);
      });
    }
  }, [open]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = '#0F172A'; // kv-surface
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const allPaths = currentPath ? [...paths, currentPath] : paths;

    for (const path of allPaths) {
      if (path.points.length < 2) continue;
      
      ctx.beginPath();
      ctx.moveTo(path.points[0]!.x, path.points[0]!.y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i]!.x, path.points[i]!.y);
      }
      
      ctx.strokeStyle = path.isEraser ? '#0F172A' : path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [paths, currentPath]);

  useEffect(() => {
    redraw();
    const canvas = canvasRef.current;
    return () => {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [paths, currentPath, open, redraw]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0]!.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.touches[0]!.clientY - rect.top) * (canvas.height / rect.height)
      };
    } else if ('clientX' in e) {
      return {
        x: ((e as React.MouseEvent).clientX - rect.left) * (canvas.width / rect.width),
        y: ((e as React.MouseEvent).clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    return null;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getCoordinates(e);
    if (!pos) return;
    
    setIsDrawing(true);
    setCurrentPath({
      points: [pos],
      color,
      width: isEraser ? width * 3 : width,
      isEraser
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !currentPath) return;
    
    const pos = getCoordinates(e);
    if (!pos) return;

    setCurrentPath({
      ...currentPath,
      points: [...currentPath.points, pos]
    });
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    setPaths([...paths, currentPath]);
    setCurrentPath(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onOpenChange(false);
    toast("Sketch saved to note", "success");
  };

  const colors = [
    '#ffffff', // White
    '#94A3B8', // Slate 400
    '#F87171', // Red 400
    '#FBBF24', // Amber 400
    '#34D399', // Emerald 400
    '#60A5FA', // Blue 400
    '#A78BFA', // Violet 400
    '#F472B6', // Pink 400
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <m.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-modal-backdrop bg-bg/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <m.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-10 z-modal bg-surface border border-border shadow-2xl rounded-2xl md:rounded-3xl flex flex-col overflow-hidden outline-none"
              >
                <div className="flex items-center justify-between p-4 border-b border-border bg-bg/30">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Sketch</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPaths(paths.slice(0, -1))}
                      disabled={paths.length === 0}
                      className="p-2 rounded-lg hover:bg-bg/50 disabled:opacity-50 text-text transition-colors"
                      title="Undo"
                    >
                      <Undo size={18} />
                    </button>
                    <button 
                      onClick={() => setPaths([])}
                      disabled={paths.length === 0}
                      className="p-2 rounded-lg hover:bg-error/20 text-error disabled:opacity-50 transition-colors"
                      title="Clear All"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => onOpenChange(false)} className="p-2 rounded-lg hover:bg-bg/50 text-text-muted transition-colors ml-2">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative bg-surface overflow-hidden touch-none">
                  <canvas
                    ref={canvasRef}
                    width={1600}
                    height={1200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full object-contain cursor-crosshair"
                  />
                </div>

                <div className="p-4 border-t border-border bg-bg/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
                      <button
                        onClick={() => setIsEraser(false)}
                        className={cn("p-2 rounded-lg transition-colors", !isEraser ? "bg-blue/20 text-blue" : "text-text-muted hover:text-text")}
                        title="Pen"
                      >
                        <Pen size={18} />
                      </button>
                      <button
                        onClick={() => setIsEraser(true)}
                        className={cn("p-2 rounded-lg transition-colors", isEraser ? "bg-blue/20 text-blue" : "text-text-muted hover:text-text")}
                        title="Eraser"
                      >
                        <Eraser size={18} />
                      </button>
                    </div>

                    {!isEraser && (
                      <div className="flex items-center gap-2">
                        {colors.map(c => (
                          <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={cn(
                              "w-6 h-6 rounded-full transition-transform",
                              color === c ? "scale-110 ring-2 ring-white/50" : "hover:scale-110"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                    {!isEraser && (
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={width} 
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="w-24 md:w-32 accent-blue"
                      />
                    )}
                    
                    <button 
                      onClick={handleSave}
                      className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue text-white rounded-xl font-bold text-sm hover:bg-blue/90 transition-colors"
                    >
                      <Save size={16} />
                      Insert
                    </button>
                  </div>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
