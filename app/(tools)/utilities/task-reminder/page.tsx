import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const TaskReminderClient = dynamic(() => import("./TaskReminderClient"), {
  loading: () => <ToolSkeleton />,
});

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "task-reminder";
const cat = CATEGORIES.find(c => c.id === "utilities")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TaskReminder() {
  return (
    <ToolShell
      title="Task Reminder"
      description="A simple local to-do list stored in your browser. No account required."
      category={cat}
      content={{
        detailedDescription: "Task Reminder is a privacy-first productivity tool designed for quick, ephemeral to-do lists. Unlike traditional task managers that require accounts and sync your data to a cloud, this tool operates entirely within your browser's local storage. This means your tasks never leave your device, ensuring total privacy. It's perfect for daily punch lists, temporary reminders, or managing focus during a single work session without the overhead of a complex project management system.",
        howTo: [
          "Type your task description in the 'What needs to be done?' field.",
          "Optionally select a due date to track upcoming deadlines.",
          "Click 'Add Task' or press Enter to save the task to your local list.",
          "Use the status filters (All, Active, Completed) to organize your view.",
          "Mark tasks as complete using the checkbox, or remove them entirely using the '×' button."
        ],
        faq: [
          {
            question: "Where is my data stored?",
            answer: "Your tasks are stored in your browser's 'localStorage'. This is a private area on your hard drive managed by your browser."
          },
          {
            question: "Will my tasks be available on my other devices?",
            answer: "No. Since the data is stored locally on this specific browser and device, it does not sync across other computers or phones."
          },
          {
            question: "Is there a limit to how many tasks I can add?",
            answer: "The limit is based on your browser's local storage capacity (typically around 5MB), which is enough for thousands of simple text tasks."
          }
        ],
        relatedTools: ["split-copy", "text-utility", "grammar-checker"]
      }}
    >
      <TaskReminderClient />
    </ToolShell>
  );
}
