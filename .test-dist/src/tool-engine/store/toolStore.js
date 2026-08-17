// src/tool-engine/store/toolStore.ts
import { create } from "zustand";
export const useToolStore = create((set) => ({
    phase: "idle",
    progress: 0,
    result: null,
    error: null,
    dragState: "idle",
    lastSession: null,
    setPhase: (phase) => set({ phase }),
    setProgress: (progress) => set({ progress }),
    setResult: (result) => set({ result, phase: "done" }),
    setError: (error) => set({ error, phase: "error" }),
    setDragState: (dragState) => set({ dragState }),
    setLastSession: (lastSession) => set({ lastSession }),
    reset: () => set({
        phase: "idle",
        progress: 0,
        result: null,
        error: null,
        dragState: "idle",
        lastSession: null
    }),
}));
