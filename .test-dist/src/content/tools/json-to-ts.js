export const jsonToTs = {
    detailedDescription: `
<p>The JSON to TypeScript tool is designed for developers who need to quickly generate TypeScript interfaces from JSON objects. It seamlessly handles deeply nested objects, arrays, and primitive values, inferring types on the fly.</p>

<p>Generating TypeScript types by hand for large API payloads can be tedious and error-prone. This browser-based utility automates the process completely on your device without sending any data to a remote server, ensuring data privacy.</p>
`,
    howTo: [
        "<strong>Input JSON:</strong> Paste your raw JSON data in the left panel.",
        "<strong>View Interfaces:</strong> The generated TypeScript interfaces will appear immediately in the right panel.",
        "<strong>Copy:</strong> Click the 'Copy' button to copy the TypeScript code to your clipboard."
    ],
    faq: [
        {
            question: "Is my JSON data sent to a server?",
            answer: "No, all processing happens entirely within your browser locally. No data is sent or stored externally."
        },
        {
            question: "How does it handle nested objects?",
            answer: "It automatically generates a separate interface for each nested object to keep your code clean and manageable."
        }
    ],
    useCases: [
        "Generating types from API payloads.",
        "Quickly typing configuration objects.",
        "Prototyping TypeScript data models."
    ],
    examples: [
        {
            input: '{"user": {"id": 1, "name": "John", "active": true}}',
            output: 'interface RootObject {\\n  user: User;\\n}\\n\\ninterface User {\\n  id: number;\\n  name: string;\\n  active: boolean;\\n}',
            description: "Generating types for a nested JSON object."
        }
    ],
    commonErrors: [
        {
            error: "Invalid JSON format",
            fix: "Ensure your JSON is well-formed with double quotes for keys and string values."
        }
    ],
    alternatives: ["MakeTypes", "quicktype"]
};
