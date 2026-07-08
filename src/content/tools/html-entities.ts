import { ToolContent } from '../../registry/types';

export const htmlEntities: ToolContent = {
  detailedDescription:
    "Convert special HTML characters to their named or numeric entity equivalents (e.g., `<` → `&lt;`) and decode entities back to readable characters. Essential for safely embedding user-generated content in HTML without triggering XSS vulnerabilities. Runs entirely in the browser.",
  howTo: [
    "Select 'Encode' to escape HTML characters or 'Decode' to unescape entities.",
    "Paste your HTML snippet or plain text into the input box.",
    "The converted output appears instantly.",
    "Copy the result and use it in your code.",
  ],
  faq: [
    {
      question: "Why do I need HTML entities?",
      answer:
        "Characters like `<`, `>`, `&`, and `\"` have special meaning in HTML. Without encoding them, they can break page structure or enable cross-site scripting (XSS) attacks.",
    },
    {
      question: "What is the difference between named and numeric entities?",
      answer:
        "`&amp;` is a named entity; `&#38;` is the decimal numeric form; `&#x26;` is the hex form. They all produce the same character — `&`.",
    },
    {
      question: "Does this handle all Unicode characters?",
      answer:
        "Most Unicode characters do not need encoding in modern UTF-8 HTML. The tool focuses on the characters that must be escaped for safety: `<`, `>`, `&`, `\"`, `'`.",
    },
  ],
  useCases: [
    "Escaping user input before inserting it into an HTML page",
    "Decoding HTML entities in a scraped web page",
    "Preparing code samples to display in a blog post",
    "Fixing corrupted text that shows raw entity codes",
  ],
  examples: [
    {
      label: "Encode HTML special chars",
      input: "<script>toast('xss')</script>",
      output: "&lt;script&gt;toast(&#39;xss&#39;)&lt;/script&gt;",
    },
    {
      label: "Decode entities",
      input: "&copy; 2025 &mdash; All rights reserved",
      output: "© 2025 — All rights reserved",
    },
  ],
  commonErrors: [
    {
      error: "Double-encoding entities (e.g., `&amp;amp;`)",
      fix: "Decode the text first if it already contains entities before encoding again.",
    },
    {
      error: "Encoded output breaks inside a JavaScript string",
      fix: "HTML entity encoding is for HTML context only. Use JavaScript string escaping (e.g., `\\\"`) inside JS strings.",
    },
  ],
  alternatives: ["CyberChef", "htmlentities.com", "Character Map (OS utility)"],
};
