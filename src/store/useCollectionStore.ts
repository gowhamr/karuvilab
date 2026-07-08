"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "./idb-storage";

export interface ToolCollection {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  icon: string;
  color: string;
  isPinned: boolean;
  createdAt: number;
}

interface CollectionState {
  collections: ToolCollection[];
  
  // Actions
  createCollection: (collection: Omit<ToolCollection, "id" | "createdAt" | "isPinned">) => void;
  updateCollection: (id: string, updates: Partial<ToolCollection>) => void;
  deleteCollection: (id: string) => void;
  addToolToCollection: (collectionId: string, toolId: string) => void;
  removeToolFromCollection: (collectionId: string, toolId: string) => void;
  togglePinCollection: (id: string) => void;
  reorderCollections: (orderedIds: string[]) => void;
  importCollections: (data: string) => boolean;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collections: [
        {
          id: "dev-col",
          name: "Developer Tools",
          description: "Essential utilities for formatting and debugging code.",
          toolIds: ["json-formatter", "base64", "jwt-decoder", "uuid-generator", "regex"],
          icon: "💻",
          color: "#6366F1",
          isPinned: true,
          createdAt: Date.now()
        },
        {
          id: "image-col",
          name: "Image Editing",
          description: "Crop, resize, and remove backgrounds completely offline.",
          toolIds: ["bg-remover", "image-resizer", "compress", "image-crop", "image-converter"],
          icon: "🖼",
          color: "#BE123C",
          isPinned: false,
          createdAt: Date.now()
        }
      ],

      createCollection: (col) => set((state) => {
        const newCol: ToolCollection = {
          ...col,
          id: Math.random().toString(36).substring(2, 9),
          isPinned: false,
          createdAt: Date.now()
        };
        return { collections: [...state.collections, newCol] };
      }),

      updateCollection: (id, updates) => set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? { ...c, ...updates } : c))
      })),

      deleteCollection: (id) => set((state) => ({
        collections: state.collections.filter((c) => c.id !== id)
      })),

      addToolToCollection: (collectionId, toolId) => set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== collectionId) return c;
          if (c.toolIds.includes(toolId)) return c;
          return { ...c, toolIds: [...c.toolIds, toolId] };
        })
      })),

      removeToolFromCollection: (collectionId, toolId) => set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== collectionId) return c;
          return { ...c, toolIds: c.toolIds.filter((id) => id !== toolId) };
        })
      })),

      togglePinCollection: (id) => set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
      })),

      reorderCollections: (orderedIds) => set((state) => {
        const map = new Map(state.collections.map((c) => [c.id, c]));
        const sorted = orderedIds.map((id) => map.get(id)).filter(Boolean) as ToolCollection[];
        const remaining = state.collections.filter((c) => !orderedIds.includes(c.id));
        return { collections: [...sorted, ...remaining] };
      }),

      importCollections: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.every(c => c.name && Array.isArray(c.toolIds))) {
            const sanitized = parsed.map(c => ({
              id: c.id || Math.random().toString(36).substring(2, 9),
              name: c.name,
              description: c.description || "",
              toolIds: c.toolIds,
              icon: c.icon || "📦",
              color: c.color || "#4F46E5",
              isPinned: !!c.isPinned,
              createdAt: c.createdAt || Date.now()
            }));

            set((state) => {
              // Merge, avoiding duplicates by ID
              const existingIds = state.collections.map(ec => ec.id);
              const filteredNew = sanitized.filter(nc => !existingIds.includes(nc.id));
              return { collections: [...state.collections, ...filteredNew] };
            });
            return true;
          }
        } catch {}
        return false;
      }
    }),
    {
      name: "kv-tool-collections",
      storage: createJSONStorage(() => idbStorage),
      version: 1
    }
  )
);
