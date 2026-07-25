import { ToolContent } from '../../registry/types';

export const csvToJson: ToolContent = {
  detailedDescription: `
The **CSV to JSON Converter** is a high-performance developer utility for transforming tabular comma-separated values (CSV) into structured JavaScript Object Notation (JSON) format, and vice-versa.

Data migration and API integration often require shifting between these two dominant data formats. This tool processes text bidirectionally in milliseconds. It automatically parses headers into object keys, handles escaped quotes, and formats the output perfectly.

Because it operates entirely in your browser memory, it is the safest way to convert datasets containing PII (Personally Identifiable Information), customer records, or internal financial data without risking exposure to a third-party server.
`,
  howTo: [
    "**Step 1:** Select your mode using the top toggle: **CSV to JSON** or **JSON to CSV**.",
    "**Step 2:** Paste your data into the Input textarea on the left.",
    "**Step 3:** The tool will instantly convert and format the output on the right.",
    "**Step 4:** Click the 'Download' icon to save it as a file, or the 'Copy' icon to place it on your clipboard."
  ],
  faq: [
    {
      question: "Are my CSV datasets uploaded to a server?",
      answer: "No. The entire conversion happens securely and locally in your browser. Your data never leaves your computer."
    },
    {
      question: "Does it support custom delimiters?",
      answer: "Currently, it assumes standard comma (,) delimitation and standard double-quotes for escaping strings."
    },
    {
      question: "How are nested JSON objects converted to CSV?",
      answer: "Since CSV is a flat tabular format, nested JSON structures are converted into JSON strings or flattened depending on the complexity of the object."
    }
  ],
  useCases: [
    "API Development: Converting raw spreadsheet exports into JSON payloads for database seeding or API requests.",
    "Data Analysis: Transforming JSON API responses back into CSVs so they can be analyzed in Excel or Google Sheets.",
    "Data Migration: Moving legacy database dumps into modern NoSQL document stores."
  ],
  commonErrors: [
    {
      error: "Error parsing JSON",
      fix: "Ensure your JSON is perfectly valid. It must use double quotes for keys, and not contain trailing commas."
    },
    {
      error: "Malformed CSV output",
      fix: "Ensure your input JSON is a flat Array of Objects (e.g., `[{name: 'A'}, {name: 'B'}]`). Trying to convert a single object or deeply nested tree into CSV may yield unpredictable results."
    }
  ],
  alternatives: ["JSON to XML", "YAML to JSON Converter"]
};
