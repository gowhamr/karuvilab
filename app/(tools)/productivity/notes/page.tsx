import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import NotesPage from "@/src/features/notes/NotesPage";

const toolId = "notes";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = {
  title: "KV Notes — Secure, Browser-Native Note-Taking",
  description: "A private, offline-first note-taking tool. All notes are stored locally in your browser. Zero server uploads.",
};

export default function NotesToolPage() {
  return (
    <ToolShell
      title="KV Notes"
      description="Capture your thoughts privately. Fast, local, and offline-first."
      category={category}
      toolId={toolId}
    >
      <NotesPage />
    </ToolShell>
  );
}
