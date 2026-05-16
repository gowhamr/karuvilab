import { ToolContent } from '../../registry/types';

export const format: ToolContent = {
  detailedDescription:
    "A multi-language code formatter supporting JSON, HTML, CSS, SQL, and Markdown. Paste messy code and get properly indented, consistently styled output in one click using Prettier-compatible formatting rules. No code is sent to a server — formatting runs entirely in the browser.",
  howTo: [
    "Select the language from the format tabs (JSON, HTML, CSS, SQL, Markdown).",
    "Paste your unformatted code into the editor.",
    "Click 'Format' or wait for the auto-format trigger.",
    "Copy the formatted output or switch tabs to format another language.",
  ],
  faq: [
    {
      question: "Which formatter is used under the hood?",
      answer:
        "The tool uses Prettier (for JS/HTML/CSS/Markdown) and sql-formatter for SQL, compiled to WebAssembly so everything runs in the browser.",
    },
    {
      question: "Can I configure the indentation width?",
      answer:
        "Yes. Use the settings panel to set indent size (2 or 4 spaces, or tabs) and other style options.",
    },
    {
      question: "Does it support JSX or TypeScript?",
      answer:
        "TypeScript and JSX formatting may be available under the 'JS/TS' tab. Check the language selector for the full list.",
    },
  ],
  useCases: [
    "Cleaning up HTML copied from a CMS or email builder",
    "Formatting a long SQL query for readability",
    "Standardising CSS before a code review",
    "Rendering a Markdown document to check its preview",
  ],
  examples: [
    {
      label: "Format SQL",
      input: "select id,name from users where active=1 order by name",
      output: "SELECT\n  id,\n  name\nFROM users\nWHERE active = 1\nORDER BY name",
    },
  ],
  commonErrors: [
    {
      error: "Formatter does nothing to the input",
      fix: "Check that you selected the correct language tab. Formatting HTML as CSS (or vice versa) produces no output.",
    },
    {
      error: "SQL formatter reorders clauses unexpectedly",
      fix: "The SQL formatter normalises clause order per SQL standards. Verify your query logic is preserved — it should be.",
    },
  ],
  alternatives: ["Prettier.io", "SQL Formatter Online", "VS Code Prettier extension"],
};
