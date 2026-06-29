import { create } from 'zustand';
import { Note, Folder, NoteView, NoteFilter, NoteSortOption, NoteSortOrder } from './types';
import { saveNote, getNotes, deleteNote, saveFolder, getFolders, deleteFolder } from '@/src/lib/db';

interface NotesState {
  notes: Note[];
  folders: Folder[];
  viewMode: NoteView;
  filter: NoteFilter;
  isLoading: boolean;
  selectedNoteId: string | null;
  notePasswords: Record<string, string>; // In-memory passwords for unlocked notes

  // Actions
  setViewMode: (mode: NoteView) => void;
  setSearch: (search: string) => void;
  setTagFilter: (tag: string | null) => void;
  setFolderFilter: (folderId: string | null) => void;
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
  moveToFolder: (noteId: string, folderId: string | null) => Promise<void>;

  // Folder Actions
  fetchFolders: () => Promise<void>;
  addFolder: (folder: Omit<Folder, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFolder: (folder: Folder) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;

  // Encryption Actions
  encryptNote: (id: string, password: string) => Promise<void>;
  decryptNote: (id: string, password: string) => Promise<void>;
  unlockNote: (id: string, password: string) => Promise<boolean>;
  lockNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  folders: [],
  viewMode: 'grid',
  filter: {
    search: '',
    tag: null,
    folderId: null,
    sort: 'updatedAt',
    order: 'desc',
  },
  isLoading: false,
  selectedNoteId: null,
  notePasswords: {},

  setViewMode: (viewMode) => set({ viewMode }),
  setSearch: (search) => set(state => ({ filter: { ...state.filter, search } })),
  setTagFilter: (tag) => set(state => ({ filter: { ...state.filter, tag, folderId: null } })), // Clear folder filter if setting tag
  setFolderFilter: (folderId) => set(state => ({ filter: { ...state.filter, folderId, tag: null } })), // Clear tag filter if setting folder
  setSort: (sort, order) => set(state => ({ filter: { ...state.filter, sort, order } })),
  setSelectedNoteId: (selectedNoteId) => set({ selectedNoteId }),

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const [notes, folders] = await Promise.all([getNotes(), getFolders()]);
      set({ notes: notes as Note[], folders: folders as Folder[] });
    } catch (error) {
      console.error('Failed to fetch notes/folders:', error);
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

    if (updatedNote.isEncrypted) {
      const password = get().notePasswords[note.id];
      if (password) {
        try {
          const { encryptData } = await import('./crypto');
          const payloadToEncrypt = JSON.stringify({
            title: note.title,
            content: note.content,
            tags: note.tags,
            isChecklist: note.isChecklist,
            checklistItems: note.checklistItems
          });
          const encryptedString = await encryptData(payloadToEncrypt, password);
          
          const noteForDB: Note = {
            ...updatedNote,
            encryptedData: encryptedString,
            title: "🔒 Encrypted Note",
            content: "This note is encrypted.",
            tags: [],
            isChecklist: false,
            checklistItems: [],
            // Preserve folder
            folderId: note.folderId ?? null
          };
          await saveNote(noteForDB);
        } catch (err) {
          console.error("Failed to encrypt note for saving:", err);
          return;
        }
      } else {
        // If we don't have the password, save the placeholder record without modifying encryptedData
        const dbNotes = await getNotes();
        const existingNote = dbNotes.find(n => n.id === note.id);
        if (existingNote) {
          const noteForDB: Note = {
            ...updatedNote,
            title: existingNote.title,
            content: existingNote.content,
            tags: existingNote.tags,
            isChecklist: existingNote.isChecklist,
            checklistItems: existingNote.checklistItems,
            folderId: existingNote.folderId ?? null
          };
          if (existingNote.encryptedData) {
            noteForDB.encryptedData = existingNote.encryptedData;
          }
          await saveNote(noteForDB);
        }
      }
    } else {
      await saveNote(updatedNote);
    }

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
    if (updatedNote.isEncrypted) {
      // Just toggle pin and update DB safely
      const dbNotes = await getNotes();
      const existing = dbNotes.find(n => n.id === id);
      if (existing) {
        await saveNote({
          ...existing,
          pinned: updatedNote.pinned,
          updatedAt: updatedNote.updatedAt
        });
      }
    } else {
      await saveNote(updatedNote);
    }
    set(state => ({
      notes: state.notes.map(n => n.id === id ? updatedNote : n)
    }));
  },

  toggleArchive: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const updatedNote = { ...note, isArchived: !note.isArchived, updatedAt: Date.now() };
    if (updatedNote.isEncrypted) {
      const dbNotes = await getNotes();
      const existing = dbNotes.find(n => n.id === id);
      if (existing) {
        await saveNote({
          ...existing,
          isArchived: updatedNote.isArchived,
          updatedAt: updatedNote.updatedAt
        });
      }
    } else {
      await saveNote(updatedNote);
    }
    set(state => ({
      notes: state.notes.map(n => n.id === id ? updatedNote : n)
    }));
  },

  toggleDelete: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const updatedNote = { ...note, isDeleted: !note.isDeleted, updatedAt: Date.now() };
    if (updatedNote.isEncrypted) {
      const dbNotes = await getNotes();
      const existing = dbNotes.find(n => n.id === id);
      if (existing) {
        await saveNote({
          ...existing,
          isDeleted: updatedNote.isDeleted,
          updatedAt: updatedNote.updatedAt
        });
      }
    } else {
      await saveNote(updatedNote);
    }
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

  moveToFolder: async (noteId, folderId) => {
    const note = get().notes.find(n => n.id === noteId);
    if (!note) return;
    await get().updateNote({ ...note, folderId });
  },

  fetchFolders: async () => {
    const folders = await getFolders();
    set({ folders: folders as Folder[] });
  },

  addFolder: async (folderData) => {
    const now = Date.now();
    const newFolder: Folder = {
      ...folderData,
      createdAt: now,
      updatedAt: now,
    };
    await saveFolder(newFolder);
    set(state => ({ folders: [...state.folders, newFolder] }));
  },

  updateFolder: async (folder) => {
    const updatedFolder = {
      ...folder,
      updatedAt: Date.now(),
    };
    await saveFolder(updatedFolder);
    set(state => ({
      folders: state.folders.map(f => f.id === folder.id ? updatedFolder : f)
    }));
  },

  removeFolder: async (id) => {
    await deleteFolder(id);
    
    // Unlink notes
    const notesToUpdate = get().notes.filter(n => n.folderId === id);
    for (const note of notesToUpdate) {
      await get().updateNote({ ...note, folderId: null });
    }

    set(state => ({
      folders: state.folders.filter(f => f.id !== id),
      notes: state.notes.map(n => n.folderId === id ? { ...n, folderId: null } : n)
    }));
  },

  encryptNote: async (id, password) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;

    try {
      const { encryptData } = await import('./crypto');
      const payloadToEncrypt = JSON.stringify({
        title: note.title,
        content: note.content,
        tags: note.tags,
        isChecklist: note.isChecklist,
        checklistItems: note.checklistItems
      });

      const encryptedString = await encryptData(payloadToEncrypt, password);

      const updatedNote: Note = {
        ...note,
        isEncrypted: true,
        encryptedData: encryptedString,
        updatedAt: Date.now()
      };

      const noteForDB: Note = {
        ...updatedNote,
        title: "🔒 Encrypted Note",
        content: "This note is encrypted.",
        tags: [],
        isChecklist: false,
        checklistItems: [],
        folderId: note.folderId ?? null
      };
      await saveNote(noteForDB);

      set(state => ({
        notePasswords: { ...state.notePasswords, [id]: password },
        notes: state.notes.map(n => n.id === id ? updatedNote : n)
      }));
    } catch (err) {
      console.error("Encryption failed:", err);
      throw err;
    }
  },

  decryptNote: async (id, password) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;

    let decryptedNote = { ...note };

    if (note.isEncrypted && note.encryptedData) {
      const { decryptData } = await import('./crypto');
      try {
        const decryptedPayload = await decryptData(note.encryptedData, password);
        const data = JSON.parse(decryptedPayload);
        decryptedNote = {
          ...decryptedNote,
          isEncrypted: false,
          title: data.title,
          content: data.content,
          tags: data.tags,
          isChecklist: data.isChecklist,
          checklistItems: data.checklistItems,
          updatedAt: Date.now()
        };
        delete decryptedNote.encryptedData;
      } catch (err) {
        throw new Error("Incorrect password");
      }
    }

    await saveNote(decryptedNote);

    const nextPasswords = { ...get().notePasswords };
    delete nextPasswords[id];

    set(state => ({
      notePasswords: nextPasswords,
      notes: state.notes.map(n => n.id === id ? decryptedNote : n)
    }));
  },

  unlockNote: async (id, password) => {
    const note = get().notes.find(n => n.id === id);
    if (!note || !note.isEncrypted || !note.encryptedData) return false;

    const { decryptData } = await import('./crypto');
    try {
      const decryptedPayload = await decryptData(note.encryptedData, password);
      const data = JSON.parse(decryptedPayload);
      
      const decryptedNote: Note = {
        ...note,
        title: data.title,
        content: data.content,
        tags: data.tags,
        isChecklist: data.isChecklist,
        checklistItems: data.checklistItems
      };

      set(state => ({
        notePasswords: { ...state.notePasswords, [id]: password },
        notes: state.notes.map(n => n.id === id ? decryptedNote : n)
      }));
      return true;
    } catch (err) {
      console.error("Unlock failed:", err);
      return false;
    }
  },

  lockNote: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note || !note.isEncrypted) return;

    // Save current decrypted state back to DB as encrypted first
    await get().updateNote(note);

    const dbNotes = await getNotes();
    const dbNote = dbNotes.find(n => n.id === id);
    
    if (dbNote) {
      const nextPasswords = { ...get().notePasswords };
      delete nextPasswords[id];

      set(state => ({
        notePasswords: nextPasswords,
        notes: state.notes.map(n => n.id === id ? (dbNote as Note) : n)
      }));
    }
  },
}));
