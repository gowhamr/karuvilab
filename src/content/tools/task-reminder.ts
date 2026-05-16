import { ToolContent } from '../../registry/types';

export const taskReminder: ToolContent = {
  detailedDescription:
    "A lightweight to-do list manager that stores tasks in your browser's `localStorage` so they persist across page reloads — no account or server required. Add tasks with optional due dates, mark them complete, and delete them when done. Data stays on your device.",
  howTo: [
    "Type a task description in the input field and press Enter or click 'Add'.",
    "Optionally set a due date for the task.",
    "Click the checkbox next to a task to mark it as complete.",
    "Click the trash icon to delete a task.",
    "Tasks are automatically saved to localStorage and reload with the page.",
  ],
  faq: [
    {
      question: "Where is my data stored?",
      answer:
        "Tasks are saved in your browser's `localStorage`. They persist as long as you don't clear your browser data.",
    },
    {
      question: "Can I sync tasks across devices?",
      answer:
        "No. `localStorage` is device- and browser-specific. For cross-device sync, use a dedicated app like Todoist or Notion.",
    },
    {
      question: "What happens if I clear my browser data?",
      answer:
        "Clearing cookies and site data will erase your tasks. Export them before clearing if you want to keep them.",
    },
  ],
  useCases: [
    "Keeping a quick to-do list while working in the browser",
    "Tracking tasks for a single project session",
    "Making a shopping list accessible on your desktop",
    "Reminding yourself of steps in a workflow",
  ],
  commonErrors: [
    {
      error: "Tasks disappear after closing the browser",
      fix: "Ensure `localStorage` is not blocked by a browser extension or private/incognito mode. In incognito, `localStorage` is cleared on session end.",
    },
    {
      error: "Tasks don't save in Safari",
      fix: "Safari may block `localStorage` in certain privacy modes. Go to Safari Preferences → Privacy and disable 'Prevent cross-site tracking' for this site.",
    },
  ],
  alternatives: ["Google Tasks", "Todoist", "Apple Reminders"],
};
