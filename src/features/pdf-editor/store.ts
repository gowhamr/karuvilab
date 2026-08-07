import { create } from 'zustand';

export type ToolType = 'select' | 'text' | 'draw' | 'shape' | 'image' | 'blackout';

export interface BaseAnnotation {
  id: string;
  pageIndex: number;
  x: number; // percentage (0-100) of page width
  y: number; // percentage (0-100) of page height
  type: string;
}

export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  content: string;
  fontSize: number; // percentage of page height or static size
  color: string;
  width?: number; // percentage
  isEditing?: boolean;
}

export interface PathPoint {
  x: number; // percentage
  y: number; // percentage
}

export interface DrawAnnotation extends BaseAnnotation {
  type: 'draw';
  points: PathPoint[];
  color: string;
  strokeWidth: number; // percentage
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: 'shape';
  shapeType: 'rectangle' | 'circle';
  width: number; // percentage
  height: number; // percentage
  color: string;
  fill?: string;
  strokeWidth: number; // percentage
}

export interface ImageAnnotation extends BaseAnnotation {
  type: 'image';
  dataUrl: string; // Base64 or Blob URL
  width: number; // percentage
  height: number; // percentage
}

export interface BlackoutAnnotation extends BaseAnnotation {
  type: 'blackout';
  width: number; // percentage
  height: number; // percentage
}

export type Annotation = TextAnnotation | DrawAnnotation | ShapeAnnotation | ImageAnnotation | BlackoutAnnotation;

export interface PageState {
  id: string; // original page index as string "1", "2"
  originalIndex: number;
  rotation: number;
  isDeleted: boolean;
}

interface PdfEditorState {
  activeTool: ToolType;
  annotations: Annotation[];
  pages: PageState[];
  selectedAnnotationId: string | null;
  zoom: number;
  undoStack: Annotation[][];
  
  reset: () => void;
  setActiveTool: (tool: ToolType) => void;
  setSelectedAnnotation: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  clearAnnotations: () => void;
  undo: () => void;
  
  initPages: (numPages: number) => void;
  updatePage: (id: string, updates: Partial<PageState>) => void;
  reorderPages: (activeId: string, overId: string) => void;
}

export const useEditorStore = create<PdfEditorState>((set) => ({
  activeTool: 'select',
  annotations: [],
  pages: [],
  selectedAnnotationId: null,
  zoom: 1.0,
  undoStack: [],
  
  reset: () => set({
    activeTool: 'select',
    annotations: [],
    pages: [],
    selectedAnnotationId: null,
    zoom: 1.0,
    undoStack: []
  }),
  
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedAnnotation: (id) => set({ selectedAnnotationId: id }),
  setZoom: (zoom) => set({ zoom }),
  
  addAnnotation: (annotation) => set((state) => {
    const newUndoStack = [...state.undoStack, state.annotations].slice(-20);
    return {
      undoStack: newUndoStack,
      annotations: [...state.annotations, annotation]
    };
  }),
  
  updateAnnotation: (id, updates) => set((state) => {
    const newUndoStack = [...state.undoStack, state.annotations].slice(-20);
    return {
      undoStack: newUndoStack,
      annotations: state.annotations.map(a => 
        a.id === id ? { ...a, ...updates } as Annotation : a
      )
    };
  }),
  
  deleteAnnotation: (id) => set((state) => {
    const newUndoStack = [...state.undoStack, state.annotations].slice(-20);
    return {
      undoStack: newUndoStack,
      annotations: state.annotations.filter(a => a.id !== id)
    };
  }),
  
  clearAnnotations: () => set({ annotations: [] }),
  
  undo: () => set((state) => {
    if (state.undoStack.length === 0) return state;
    const newUndoStack = [...state.undoStack];
    const prevAnnotations = newUndoStack.pop();
    return {
      undoStack: newUndoStack,
      annotations: prevAnnotations || []
    };
  }),
  
  initPages: (numPages) => set({
    pages: Array.from({ length: numPages }, (_, i) => ({
      id: String(i + 1),
      originalIndex: i + 1,
      rotation: 0,
      isDeleted: false
    }))
  }),
  
  updatePage: (id, updates) => set((state) => ({
    pages: state.pages.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  reorderPages: (activeId, overId) => set((state) => {
    const oldIndex = state.pages.findIndex(p => p.id === activeId);
    const newIndex = state.pages.findIndex(p => p.id === overId);
    if (oldIndex === -1 || newIndex === -1) return state;
    
    const newPages = [...state.pages];
    const [moved] = newPages.splice(oldIndex, 1);
    if (moved) newPages.splice(newIndex, 0, moved);
    return { pages: newPages };
  })
}));
