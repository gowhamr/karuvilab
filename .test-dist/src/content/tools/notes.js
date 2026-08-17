export const notesContent = {
    detailedDescription: "KV Secure Notes is a premium, zero-transmission note-taking tool designed for top-tier security, privacy, and speed. It allows you to protect your sensitive notes using military-grade AES-256 encryption with a password of your choice, ensuring that your data remains completely unreadable to unauthorized eyes. All notes are stored locally in your browser's IndexedDB, adhering to a strict local-only policy (zero servers, zero transmission). It supports full Markdown formatting, task checklists, tagging, and secure encrypted sharing. You can share any encrypted note by copying its ciphertext package; the recipient can decrypt and import it using the same password without any intermediate server.",
    howTo: [
        "Click the floating '+' button to create a new note.",
        "To encrypt a note, open it, click the three-dots menu, select 'Encrypt Note', and set a secure password.",
        "To view or edit a locked note, click on it and enter the correct password. It remains unlocked for the session.",
        "Toggle between 'Note' mode (Markdown) and 'Checklist' mode using the icons in the header.",
        "Add tags in the footer to categorize your notes. Just type and press Enter.",
        "To share a note securely, select 'Copy Ciphertext' from the three-dots menu. The recipient can click the 'Decrypt Note' button in the toolbar to import it.",
        "Pin important notes to keep them at the top of your list."
    ],
    faq: [
        {
            question: "How secure is the encryption?",
            answer: "We use industry-standard PBKDF2 with 100,000 iterations of SHA-256 to derive a 256-bit key from your password, and encrypt the data using AES-GCM 256-bit. All cryptographic operations run natively in your browser via the Web Crypto API."
        },
        {
            question: "Can anyone (including KaruviLab) recover my password?",
            answer: "No. KaruviLab operates on a strict zero-server policy. All encryption and decryption happen purely client-side, and your password never leaves your browser. Because of this, it is impossible for us to recover forgotten passwords."
        },
        {
            question: "Is my data stored on a server?",
            answer: "No. All notes (including encrypted ciphertext) are saved locally in your browser's IndexedDB database. Your data is 100% private and offline-first."
        },
        {
            question: "How does sharing work without a server?",
            answer: "When you share a note, you copy its ciphertext (an encrypted Base64 package containing the salt, initialization vector, and encrypted payload). You can send this text via any communication channel. The recipient enters the same password to decrypt and view it locally."
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
