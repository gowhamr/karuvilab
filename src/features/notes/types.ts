export type NoteView = "grid" | "list";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown string
  tags: string[];
  pinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isChecklist: boolean;
  checklistItems: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
  isEncrypted?: boolean;
  encryptedData?: string;
  folderId?: string | null;
}

export type NoteSortOption = "updatedAt" | "createdAt" | "title";
export type NoteSortOrder = "asc" | "desc";

export interface NoteFilter {
  search: string;
  tag: string | null;
  folderId: string | null;
  sort: NoteSortOption;
  order: NoteSortOrder;
}
