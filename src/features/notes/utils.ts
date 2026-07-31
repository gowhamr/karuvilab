import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { sanitizeHtml } from "@/src/lib/security";

export async function renderMarkdown(markdown: string): Promise<string> {
  const { marked } = await import("marked");
  const rawHtml = await marked.parse(markdown);
  return sanitizeHtml(rawHtml);
}

export function generateId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 11);
}

export function formatNoteDate(timestamp: number): string {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MMM d, yyyy");
}

export function formatFullDate(timestamp: number): string {
  return format(new Date(timestamp), "MMMM d, yyyy 'at' h:mm a");
}

export function getRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
