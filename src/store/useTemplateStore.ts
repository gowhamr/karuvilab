import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

export interface ToolTemplate {
  id: string;
  toolId: string;
  name: string;
  payload: any;
  createdAt: number;
}

interface TemplateStore {
  templates: Record<string, ToolTemplate[]>;
  saveTemplate: (toolId: string, name: string, payload: any) => void;
  deleteTemplate: (toolId: string, templateId: string) => void;
  getTemplates: (toolId: string) => ToolTemplate[];
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: {},
      saveTemplate: (toolId, name, payload) => {
        const newTemplate: ToolTemplate = {
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
    }),
    {
      name: 'kv-tool-templates',
      storage: createJSONStorage(() => idbStorage)
    }
  )
);
