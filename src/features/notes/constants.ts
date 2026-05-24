import { NoteSortOption } from "./types";

export const SORT_OPTIONS: { label: string; value: NoteSortOption }[] = [
  { label: "Last Modified", value: "updatedAt" },
  { label: "Date Created", value: "createdAt" },
  { label: "Title", value: "title" },
];

export const AUTO_SAVE_DELAY = 1500;
export const TRASH_AUTO_EMPTY_DAYS = 30;

export const DEFAULT_NOTE_COLOR = "indigo";
export const TAG_COLORS = [
  "indigo",
  "blue",
  "emerald",
  "amber",
  "rose",
  "violet",
  "cyan",
];
