import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Reminder | KaruviLab",
  description: "A lightweight, private to-do list stored in your browser. No account needed, no data sent.",
  keywords: ["task reminder", "to do list", "browser todo", "private tasks", "task manager"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
