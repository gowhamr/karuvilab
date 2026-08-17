export const jsonToXml = {
    detailedDescription: `
The **JSON / XML Converter** is a robust developer tool that provides bidirectional conversion between JavaScript Object Notation (JSON) and Extensible Markup Language (XML). 

While JSON is the standard for modern web APIs, XML remains heavily used in enterprise systems, RSS feeds, SOAP APIs, and legacy data integrations. This tool bridges that gap by seamlessly converting syntax formats in milliseconds.

It features advanced serialization options, allowing you to control indentation (minified, 2-spaces, or 4-spaces), set custom root node names, and safely handles edge cases like CDATA sections, inline attributes, and invalid XML node names.

As with all KaruviLab utilities, the conversion logic runs **100% locally in your browser**, ensuring your proprietary data or PII is never uploaded.
`,
    howTo: [
        "**Step 1:** Select your mode: **JSON to XML** or **XML to JSON**.",
        "**Step 2:** Paste your source code into the Input pane.",
        "**Step 3:** Use the Options panel to configure the 'Root Node Name' or change the output 'Indentation'.",
        "**Step 4:** The output updates instantly. Use the Download or Copy button to retrieve your converted data."
    ],
    faq: [
        {
            question: "Is my data sent to a server?",
            answer: "No. The parsing and conversion happen entirely in your browser using local Javascript execution. Your data is private and secure."
        },
        {
            question: "How are XML attributes converted to JSON?",
            answer: "When converting XML to JSON, inline attributes (like \`<user id='123'>\`) are preserved as JSON keys prefixed with an '@_' symbol (e.g., \`\"@_id\": \"123\"\`). When converting back, the tool recognizes this prefix and turns them back into XML attributes."
        },
        {
            question: "What happens to invalid XML tag names?",
            answer: "If your JSON keys contain spaces or start with numbers (which is invalid in XML), the tool automatically sanitizes them by replacing invalid characters with underscores to guarantee the output XML is valid."
        }
    ],
    useCases: [
        "System Integration: Converting modern JSON payloads into XML so they can be consumed by legacy enterprise SOAP systems.",
        "Feed Generation: Generating valid RSS or Sitemap XML files from a JSON database dump.",
        "Data Analysis: Flattening nested XML data feeds into JSON objects for easier querying in modern programming languages."
    ],
    commonErrors: [
        {
            error: "Error parsing XML",
            fix: "Check your XML for syntax errors, unclosed tags, or invalid character encoding. Ensure there is only one root node."
        }
    ],
    alternatives: ["CSV to JSON", "YAML to JSON Converter"]
};
