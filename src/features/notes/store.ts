import { create } from 'zustand';
import { Note, NoteView, NoteFilter, NoteSortOption, NoteSortOrder } from './types';
import { saveNote, getNotes, deleteNote } from '@/src/lib/db';

interface NotesState {
  notes: Note[];
  viewMode: NoteView;
  filter: NoteFilter;
  isLoading: boolean;
  selectedNoteId: string | null;

  // Actions
  setViewMode: (mode: NoteView) => void;
  setSearch: (search: string) => void;
  setTagFilter: (tag: string | null) => void;
  setSort: (sort: NoteSortOption, order: NoteSortOrder) => void;
  setSelectedNoteId: (id: string | null) => void;

  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  toggleDelete: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  viewMode: 'grid',
  filter: {
    search: '',
    tag: null,
    sort: 'updatedAt',
    order: 'desc',
  },
  isLoading: false,
  selectedNoteId: null,

  setViewMode: (viewMode) => set({ viewMode }),
  setSearch: (search) => set(state => ({ filter: { ...state.filter, search } })),
  setTagFilter: (tag) => set(state => ({ filter: { ...state.filter, tag } })),
  setSort: (sort, order) => set(state => ({ filter: { ...state.filter, sort, order } })),
  setSelectedNoteId: (selectedNoteId) => set({ selectedNoteId }),

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await getNotes();
      set({ notes: notes as Note[] });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (noteData) => {
    const now = Date.now();
    const newNote: Note = {
      ...noteData,
      createdAt: now,
      updatedAt: now,
    };
    await saveNote(newNote);
    set(state => ({ notes: [newNote, ...state.notes] }));
  },

  updateNote: async (note) => {
    const updatedNote = {
      ...note,
      updatedAt: Date.now(),
    };
    await saveNote(updatedNote);
    set(state => ({
      notes: state.notes.map(n => n.id === note.id ? updatedNote : n)
    }));
  },

  removeNote: async (id) => {
    await deleteNote(id);
    set(state => ({
      notes: state.notes.filter(n => n.id !== id)
    }));
  },

  togglePin: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const updatedNote = { ...note, pinned: !note.pinned, updatedAt: Date.now() };
    await saveNote(updatedNote);
    set(state => ({
      notes: state.notes.map(n => n.id === id ? updatedNote : n)
    }));
  },

  toggleArchive: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const updatedNote = { ...note, isArchived: !note.isArchived, updatedAt: Date.now() };
    await saveNote(updatedNote);
    set(state => ({
      notes: state.notes.map(n => n.id === id ? updatedNote : n)
    }));
  },

  toggleDelete: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const updatedNote = { ...note, isDeleted: !note.isDeleted, updatedAt: Date.now() };
    await saveNote(updatedNote);
    set(state => ({
      notes: state.notes.map(n => n.id === id ? updatedNote : n)
    }));
  },

  emptyTrash: async () => {
    const trashNotes = get().notes.filter(n => n.isDeleted);
    for (const note of trashNotes) {
      await deleteNote(note.id);
    }
    set(state => ({
      notes: state.notes.filter(n => !n.isDeleted)
    }));
  },
}));
