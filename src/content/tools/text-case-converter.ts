import { ToolContent } from '../../registry/types';

export const textCaseConverter: ToolContent = {
  detailedDescription: "<p>The <strong>Text Case Converter</strong> is an incredibly fast, highly versatile text manipulation utility that operates completely locally on your device. Following KaruviLab's strict <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> standards, any text you paste into this tool is processed entirely in your browser. Whether you are dealing with sensitive client documents, proprietary source code, or personal notes, your information is never transmitted externally.</p><p>Built on the principles of <strong>Local-First Execution</strong>, our converter handles massive strings of text instantly without any server latency. It provides a wide array of formats, seamlessly transforming your inputs into UPPERCASE, lowercase, camelCase, snake_case, and more. This saves developers, writers, and editors valuable time while completely eliminating the risks associated with online text processing services.</p><p>Best of all, the Text Case Converter delivers true <strong>Offline Resilience</strong>. Once the application is loaded, you can safely disconnect from the internet and continue formatting documents. This offline capability ensures that you maintain an uninterrupted workflow, no matter where you are or what device you are using.</p>",
  howTo: [
    "Paste or type the text you wish to format directly into the designated input area.",
    "Select the desired text case format from the available options (e.g., Title Case, snake_case).",
    "Watch the output area update instantly as the text is processed locally.",
    "Review the resulting text to ensure it meets your formatting requirements.",
    "Click the 'Copy' button to quickly send the formatted text to your system clipboard."
  ],
  examples: [
    {
      label: "Convert to Title Case",
      description: "Capitalizes the first letter of each major word in a sentence.",
      input: "the quick brown fox jumps",
      output: "The Quick Brown Fox Jumps"
    },
    {
      label: "Format as snake_case",
      description: "Replaces spaces with underscores and converts to lowercase, perfect for programming.",
      input: "user account settings",
      output: "user_account_settings"
    },
    {
      label: "Fix Accidental Caps Lock",
      description: "Converts text typed with Caps Lock on into a readable Sentence case.",
      input: "tHIS IS A VERY IMPORTANT MESSAGE.",
      output: "This is a very important message."
    }
  ],
  faq: [
    {
      question: "Is my text sent to a server for processing?",
      answer: "No. Our tool uses a Zero-Server-Upload architecture. All text conversions happen through Local-First Execution in your browser, guaranteeing your data's privacy."
    },
    {
      question: "Can I use the Text Case Converter offline?",
      answer: "Yes. The tool features complete Offline Resilience. You can use it without an internet connection once the page is fully loaded."
    },
    {
      question: "What text cases are supported?",
      answer: "We support UPPERCASE, lowercase, Sentence case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and alternating case."
    },
    {
      question: "Is there a limit to how much text I can convert?",
      answer: "Because processing happens locally on your device, the limit is typically determined by your browser's memory capacity. It easily handles thousands of words instantly."
    },
    {
      question: "Will it preserve my line breaks and paragraphs?",
      answer: "Yes, the tool is designed to accurately preserve your original line breaks, spacing, and paragraph structures during the conversion process."
    }
  ],
  useCases: [
    "Software developers converting plain text into camelCase or snake_case for variable naming conventions.",
    "Copywriters standardizing the capitalization of article headlines using Title Case.",
    "Data entry professionals fixing large batches of text that were accidentally typed with Caps Lock on.",
    "Social media managers creating alternating case text for stylistic posts or memes."
  ],
  commonErrors: [
    {
      error: "Unexpected output with acronyms",
      fix: "When converting to Title Case or camelCase, acronyms might be forced into lowercase. You may need to manually adjust specific industry acronyms after conversion."
    },
    {
      error: "Clipboard access denied",
      fix: "If the 'Copy' button fails, ensure your browser has permission to access the clipboard, or manually highlight the output and press Ctrl+C / Cmd+C."
    }
  ]
};
