import { ToolContent } from '../../registry/types';

export const jsonCsv: ToolContent = {
  detailedDescription:
    "Convert a JSON array of objects to a CSV file and back with a single click. The tool automatically infers column headers from the JSON keys. Supports nested value flattening and custom delimiters. Everything runs in the browser — your data is never uploaded.",
  howTo: [
    "Select the conversion direction: 'JSON → CSV' or 'CSV → JSON'.",
    "Paste your JSON array or CSV text into the input panel.",
    "The converted output appears in the right panel.",
    "Download the result as a file or copy it to the clipboard.",
  ],
  faq: [
    {
      question: "Does the JSON input need to be an array?",
      answer:
        "Yes. The input must be a JSON array of objects where each object represents a row. A single object or nested arrays are not directly supported.",
    },
    {
      question: "What happens to nested objects in JSON?",
      answer:
        "Nested objects are flattened using dot notation (e.g., `address.city`) or stringified, depending on the tool's setting.",
    },
    {
      question: "Can I change the CSV delimiter?",
      answer:
        "Yes. Switch from comma to semicolon or tab to handle regional CSV variants or TSV files.",
    },
    {
      question: "Will special characters in values break the CSV?",
      answer:
        "Values containing commas or quotes are automatically wrapped in double quotes and internal quotes are escaped per RFC 4180.",
    },
  ],
  useCases: [
    "Exporting API data to Excel for reporting",
    "Importing a CSV dataset into a JavaScript application as JSON",
    "Preparing data for a spreadsheet from a REST API",
    "Converting a database export between formats",
  ],
  examples: [
    {
      label: "JSON array to CSV",
      input: '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',
      output: "name,age\nAlice,30\nBob,25",
    },
  ],
  commonErrors: [
    {
      error: "JSON input is not an array",
      fix: "Wrap your object in square brackets: `[{ ... }]`. The tool expects an array of objects.",
    },
    {
      error: "CSV output has misaligned columns",
      fix: "Ensure all JSON objects have the same keys. Missing keys produce empty cells, which may shift columns in some spreadsheet apps.",
    },
    {
      error: "Non-ASCII characters appear garbled in Excel",
      fix: "Open the CSV in Excel using the import wizard and select UTF-8 encoding. Or add a UTF-8 BOM at the start of the file.",
    },
  ],
  alternatives: ["csvjson.com", "ConvertCSV.com", "Python pandas"],
};
