// src/tool-engine/store/toolStore.ts
import { create } from "zustand";
import type { ToolResult } from "../types/ToolResult";
import type { LastSession } from "../types";

interface ToolState {
  phase:       "idle" | "validating" | "processing" | "done" | "error";
  progress:    number;
  result:      ToolResult | null;
  error:       string | null;
  dragState:   "idle" | "hover" | "over" | "rejected";
  lastSession: LastSession | null;
}

interface ToolActions {
  setPhase:       (phase: ToolState["phase"]) => void;
  setProgress:    (progress: number) => void;
  setResult:      (result: ToolResult) => void;
  setError:       (error: string) => void;
  setDragState:   (state: ToolState["dragState"]) => void;
  setLastSession: (session: LastSession | null) => void;
  reset:          () => void;
}

export const useToolStore = create<ToolState & ToolActions>((set) => ({
  phase: "idle",
  progress: 0,
  result: null,
  error: null,
  dragState: "idle",
  lastSession: null,

  setPhase:       (phase) => set({ phase }),
  setProgress:    (progress) => set({ progress }),
  setResult:      (result) => set({ result, phase: "done" }),
  setError:       (error) => set({ error, phase: "error" }),
  setDragState:   (dragState) => set({ dragState }),
  setLastSession: (lastSession) => set({ lastSession }),
  reset:          () => set({
    phase: "idle",
    progress: 0,
    result: null,
    error: null,
    dragState: "idle",
    lastSession: null
  }),
}));
