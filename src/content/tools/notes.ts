import { ToolContent } from '../../registry/types';

export const notesContent: ToolContent = {
  detailedDescription: "KV Notes is a premium, offline-first note-taking tool designed for speed, privacy, and simplicity. It allows you to capture thoughts, create checklists, and organize your ideas without ever leaving your browser. With full Markdown support, beautiful glassmorphism design, and local-only storage using IndexedDB, your data remains 100% private and accessible even without an internet connection. It features powerful searching, pinning for important notes, and status management for archiving or trashing old thoughts.",
  howTo: [
    "Click the floating '+' button to create a new note.",
    "Toggle between 'Note' mode (Markdown) and 'Checklist' mode.",
    "Add a title and start writing your content. It auto-saves every 1.5 seconds of inactivity.",
    "Use the 'Preview' mode to see your Markdown rendered beautifully.",
    "Add tags in the footer to categorize your notes. Just type and press Enter.",
    "Pin important notes to keep them at the top of your list.",
    "Search for notes using the global search bar in the header."
  ],
  faq: [
    {
      question: "Is my data stored on a server?",
      answer: "No. KaruviLab operates on a 'Zero-Server-Upload' policy. All your notes, tags, and settings are stored locally in your browser's IndexedDB. We never see, track, or store your data."
    },
    {
      question: "Can I use this tool offline?",
      answer: "Yes! KV Notes is designed to be fully functional offline. Once you've visited the site, you can continue taking and editing notes even without an internet connection."
    },
    {
      question: "What is Markdown?",
      answer: "Markdown is a lightweight markup language that allows you to format text using simple symbols (e.g., # for headers, * for italics, ** for bold). It's great for structured note-taking."
    },
    {
      question: "How do checklists work?",
      answer: "Checklist mode turns each line into a checkable item. You can track progress on tasks and easily toggle back to regular note mode if needed."
    }
  ],
  useCases: [
    "Quickly capturing ideas and brainstorming sessions",
    "Managing daily to-do lists and grocery lists",
    "Writing structured documentation with Markdown",
    "Private journaling and personal reflection",
    "Temporary data storage for links, snippets, and research"
  ],
  examples: [
    { label: "Markdown", input: "# Meeting Notes\n- Task 1\n- Task 2", output: "Rendered HTML with headers and lists" },
    { label: "Checklist", input: "Item 1 (checked)\nItem 2", output: "Interactive list with checkable items" }
  ]
};
