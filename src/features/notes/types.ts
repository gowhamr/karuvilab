export type NoteView = "grid" | "list";

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
}

export type NoteSortOption = "updatedAt" | "createdAt" | "title";
export type NoteSortOrder = "asc" | "desc";

export interface NoteFilter {
  search: string;
  tag: string | null;
  sort: NoteSortOption;
  order: NoteSortOrder;
}
