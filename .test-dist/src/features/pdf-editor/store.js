import { create } from 'zustand';
export const useEditorStore = create((set) => ({
    activeTool: 'select',
    annotations: [],
    pages: [],
    selectedAnnotationId: null,
    zoom: 1.0,
    undoStack: [],
    isSignatureModalOpen: false,
    reset: () => set({
        activeTool: 'select',
        annotations: [],
        pages: [],
        selectedAnnotationId: null,
        zoom: 1.0,
        undoStack: [],
        isSignatureModalOpen: false
    }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    setSelectedAnnotation: (id) => set({ selectedAnnotationId: id }),
    setZoom: (zoom) => set({ zoom }),
    setSignatureModalOpen: (isOpen) => set({ isSignatureModalOpen: isOpen }),
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
            annotations: state.annotations.map(a => a.id === id ? { ...a, ...updates } : a)
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
        if (state.undoStack.length === 0)
            return state;
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
        if (oldIndex === -1 || newIndex === -1)
            return state;
        const newPages = [...state.pages];
        const [moved] = newPages.splice(oldIndex, 1);
        if (moved)
            newPages.splice(newIndex, 0, moved);
        return { pages: newPages };
    })
}));
