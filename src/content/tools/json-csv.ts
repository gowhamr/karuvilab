import { ToolContent } from '../../registry/types';

export const jsonCsv: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Data Flattening & CSV Formula Injection

Welcome to the engineering guide to JSON-to-CSV conversion. This handbook explains the algorithmic challenge of flattening nested data, and exposes a devastating vulnerability involving Microsoft Excel.

---

## 1. Prerequisites: The Dimensionality Problem

**JSON** is a multi-dimensional, nested structure. A single User object can contain an array of 5 Friends, and each Friend can contain an Address object.
**CSV (Comma-Separated Values)** is strictly a flat, two-dimensional table (Rows and Columns).

**The Challenge:** How do you fit a 3D tree structure into a 2D table?

If you have:
\`\`\`json
{
  "name": "Alice",
  "location": { "city": "NYC", "zip": "10001" }
}
\`\`\`
A professional converter executes a **Recursive Flattening Algorithm**. It traverses the JSON tree and joins the nested keys using dot notation. The resulting CSV columns become \`name\`, \`location.city\`, and \`location.zip\`.

---

## 2. The Array Explosion Problem

What happens if the JSON contains an Array?
\`\`\`json
{
  "name": "Alice",
  "hobbies": ["Reading", "Running"]
}
\`\`\`

A generic converter will simply stringify the array, exporting a column called \`hobbies\` with the literal value \`["Reading", "Running"]\`. While technically correct, business analysts hate this because it breaks Excel filtering. 
Advanced converters use **Array Unwinding** (similar to a SQL \`JOIN\`), which duplicates the "Alice" row twice: one row for "Reading" and one row for "Running".

---

## 3. Threat Model: CSV Injection (Formula Injection)

When converting web data to CSV, developers often overlook a massive security vulnerability.

### The Attack
Imagine a hacker signs up for your website and sets their First Name to:
\`=cmd|' /C calc'!A0\`

Your backend database stores this as a standard JSON string. Later, an accountant clicks "Export Users to CSV". The backend naively converts the JSON to a CSV file.
When the accountant opens the CSV in **Microsoft Excel**, Excel sees the \`=\` sign and assumes it is a mathematical formula. Excel dynamically executes the command, immediately popping open the Windows Calculator (or, in a real attack, executing a malicious PowerShell script to steal the accountant's files).

**The Mitigation:** A secure JSON-to-CSV converter must sanitize all data. If a JSON value begins with \`=\`, \`+\`, \`-\`, or \`@\`, the exporter must prepend a single quote (\`'\`) to force Excel to treat the value strictly as text, neutralizing the execution.

---

## 4. Engineering Edge Cases

CSV is a surprisingly fragile format.
- **The Delimiter:** If the JSON string is \`"city": "Paris, France"\`, the comma in the string will break the CSV column alignment. The converter must wrap the entire value in double quotes: \`"Paris, France"\`.
- **The Double Quote:** If the JSON string actually contains double quotes \`"He said \"hello\""\`, the CSV standard (RFC 4180) requires escaping them by doubling them up: \`"He said ""hello"""\`.

---

## 5. Production Workflows

- **Data Science:** Machine Learning models (like Pandas in Python) ingest massive amounts of data. Engineers use automated pipelines to flatten complex JSON API responses into massive, millions-of-rows CSV files for fast, vectorized processing.
- **Business Intelligence:** Non-technical executives require data in Excel. Backend developers must build robust flattening algorithms to convert nested NoSQL MongoDB data into clean CSV exports for financial reporting.

---

## 6. Standards & References
- **RFC 4180:** Common Format and MIME Type for Comma-Separated Values (CSV) Files.

---

## 7. Interactive Quiz

**Beginner:**
1. What is the fundamental difference between JSON and CSV? *(Answer: JSON is a multi-dimensional, nested structure, whereas CSV is a strictly flat, two-dimensional table).*

**Intermediate:**
2. How do converters handle nested JSON objects, like an Address inside a User? *(Answer: They use a recursive flattening algorithm, combining the keys into dot-notation headers (e.g., \`User.Address.City\`)).*

**Advanced:**
3. What is CSV Injection (Formula Injection)? *(Answer: An attack where a hacker submits malicious data starting with an \`=\` sign. When the data is exported to CSV and opened in Excel, Excel executes the data as a formula, potentially triggering malware).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Select your conversion mode (JSON to CSV, or CSV to JSON).",
    "**Step 2:** Paste your payload.",
    "**Step 3:** (If converting to CSV) The engine recursively flattens your nested JSON objects into dot-notation headers and correctly escapes commas and quotes.",
    "**Step 4:** Download the resulting file or copy the text directly to your clipboard."
  ],
  faq: [
    {
      question: "How does the tool handle Arrays in JSON?",
      answer: "By default, the tool stringifies the array into a single CSV cell. Deep array unwinding (creating duplicate rows) is highly complex and depends on the specific structure of your dataset."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["YAML to JSON Converter", "XML Formatter"]
};
