import { ToolContent } from '../../registry/types';

export const jsonFormatter: ToolContent = {
  detailedDescription:
    "Beautify, minify, and validate JSON in real time with syntax highlighting and an interactive tree view. Instantly spot malformed JSON with descriptive error messages pointing to the exact line. All processing is local — your data never leaves the browser.",
  howTo: [
    "Paste your raw or minified JSON into the input panel.",
    "Click 'Format' to beautify, or 'Minify' to compact the JSON.",
    "Errors are highlighted inline with the line number and a description.",
    "Switch to 'Tree View' to expand and collapse nested objects.",
    "Copy the formatted output using the copy button.",
  ],
  faq: [
    {
      question: "What counts as valid JSON?",
      answer:
        "Valid JSON must use double-quoted keys, no trailing commas, and no JavaScript-style comments. Single-quoted strings and `undefined` values are not valid JSON.",
    },
    {
      question: "Can I format very large JSON files?",
      answer:
        "Yes, but files over a few megabytes may cause the browser to slow down. For huge files, consider a local tool like `jq`.",
    },
    {
      question: "Why does minified JSON not save space sometimes?",
      answer:
        "Whitespace-only savings are modest if the JSON contains mostly data. Minification primarily helps when JSON has lots of indentation and newlines.",
    },
    {
      question: "Does the tree view support editing?",
      answer:
        "The tree view is for inspection only. Edit in the text panel and the tree updates automatically.",
    },
  ],
  useCases: [
    "Debugging a malformed API response",
    "Reading a minified configuration file from a build artifact",
    "Validating JSON before committing to a repository",
    "Exploring a deeply nested JSON structure interactively",
  ],
  examples: [
    {
      label: "Beautify minified JSON",
      input: '{"name":"Alice","age":30,"city":"Chennai"}',
      output: '{\n  "name": "Alice",\n  "age": 30,\n  "city": "Chennai"\n}',
    },
  ],
  commonErrors: [
    {
      error: "Unexpected token at line N",
      fix: "Look for a trailing comma after the last item in an array or object — JSON does not allow trailing commas.",
    },
    {
      error: "Keys are not quoted or use single quotes",
      fix: "JSON requires all keys and string values to use double quotes. Replace `'key'` with `\"key\"`.",
    },
    {
      error: "Formatter outputs nothing for a seemingly valid input",
      fix: "Check for a byte-order mark (BOM) at the start of the pasted text. Copy the JSON again from the source.",
    },
  ],
  alternatives: ["jsonlint.com", "JSONBeautifier.org", "VS Code built-in formatter"],
};
