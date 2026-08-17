export const jsonFormatter = {
    detailedDescription: `
<p>The JSON Formatter and Validator is a professional-grade development utility built to simplify the way you work with JSON data. Whether you are dealing with complex API responses, minified configuration files, or debugging data payloads, this tool provides an interactive environment to beautify, minify, and validate your code in real-time. Because it is a browser-first utility, you can handle sensitive data locally without ever worrying about external server uploads.</p>

<p>JSON (JavaScript Object Notation) is the backbone of modern web communication. However, raw JSON often lacks human-readable indentation and is difficult to parse visually. Our Formatter transforms dense, minified JSON into a cleanly structured, human-readable format. Additionally, our intelligent validation engine identifies syntax errors—such as missing quotes, trailing commas, or incorrect braces—and pinpoints their exact location, making it an indispensable debugger for developers and system administrators alike.</p>

<p>We've integrated an interactive tree view, allowing you to expand and collapse nested objects and arrays. This structural visualization makes exploring deeply nested data structures effortless. By keeping all processing local and providing robust error reporting, KaruviLab's JSON Formatter ensures your development workflow is as secure and efficient as possible.</p>
`,
    howTo: [
        "<strong>Input:</strong> Paste your raw JSON payload into the main editor area.",
        "<strong>Beautify:</strong> Click the 'Format' button to apply standard indentation and structure.",
        "<strong>Minify:</strong> Click 'Minify' to remove all whitespace for compact transmission.",
        "<strong>Validate:</strong> If there is a syntax error, the tool will automatically highlight the line and explain what's wrong.",
        "<strong>Navigate:</strong> Switch to 'Tree View' to explore complex, nested data objects interactively.",
    ],
    faq: [
        {
            question: "What makes JSON invalid?",
            answer: "JSON is strictly enforced. Common syntax errors include: unquoted keys, single quotes instead of double quotes, trailing commas after the last item in an array or object, and embedded comments (which are not supported in standard JSON).",
        },
        {
            question: "Is this tool suitable for huge JSON files?",
            answer: "For standard API responses and config files, this tool is excellent. Extremely large JSON files (tens of megabytes) may cause browser-based editors to lag. In such cases, a CLI tool like `jq` is recommended.",
        },
        {
            question: "Can I edit the JSON in Tree View?",
            answer: "No, the Tree View is designed for structural exploration and inspection. Please perform all edits in the raw text panel, which will trigger an automatic update in the Tree View.",
        },
        {
            question: "Does KaruviLab store my JSON data?",
            answer: "No. All formatting, minification, and validation logic runs entirely within your browser's local sandbox. Your data remains strictly on your device.",
        },
    ],
    useCases: [
        "Debugging error-prone API responses from backend services.",
        "Formatting minified JSON output for easier structural inspection.",
        "Verifying JSON integrity before committing to a version control system (Git).",
        "Understanding the hierarchical structure of large, unfamiliar data schemas.",
    ],
    examples: [
        {
            input: '{"id":1,"status":"active","tags":["dev","test"]}',
            output: '{\n  "id": 1,\n  "status": "active",\n  "tags": [\n    "dev",\n    "test"\n  ]\n}',
            description: "Demonstrating how the beautifier adds human-readable structure to a compact JSON object."
        }
    ],
    commonErrors: [
        {
            error: "Unexpected token at line X",
            fix: "This often indicates a trailing comma in an object or array. JSON standards do not permit a comma after the final key-value pair or array element.",
        },
        {
            error: "Syntax error: expected double-quoted key",
            fix: "JSON keys must always be enclosed in double quotes. Change any single-quoted keys (e.g., 'name') to double quotes (e.g., \"name\").",
        },
    ],
    alternatives: ["jsonlint.com", "JSONBeautifier.org", "VS Code Editor Formatter"],
};
