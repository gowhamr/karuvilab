import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const useTemplateStore = create()(persist((set, get) => ({
    templates: {},
    saveTemplate: (toolId, name, payload) => {
        const newTemplate = {
            id: Math.random().toString(36).substring(2, 9),
            toolId,
            name,
            payload,
            createdAt: Date.now()
        };
        set(state => ({
            templates: {
                ...state.templates,
                [toolId]: [...(state.templates[toolId] || []), newTemplate]
            }
        }));
    },
    deleteTemplate: (toolId, templateId) => {
        set(state => ({
            templates: {
                ...state.templates,
                [toolId]: (state.templates[toolId] || []).filter(t => t.id !== templateId)
            }
        }));
    },
    getTemplates: (toolId) => {
        return get().templates[toolId] || [];
    }
}), {
    name: 'kv-tool-templates',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage)
}));
