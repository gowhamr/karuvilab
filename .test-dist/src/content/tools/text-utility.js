export const textUtility = {
    detailedDescription: "A Swiss-army-knife text manipulation tool covering case conversion (upper, lower, title, camel, snake, kebab), word and character counts, whitespace cleanup, line sorting, and duplicate removal. Ideal for quick text normalization tasks without writing any code.",
    howTo: [
        "Paste your text into the input area.",
        "Choose a transformation from the toolbar (e.g., 'Title Case', 'Remove Extra Spaces').",
        "The transformed text appears in the output area immediately.",
        "Chain multiple transformations by applying them one after another.",
        "Copy the final result using the copy button.",
    ],
    faq: [
        {
            question: "What is the difference between title case and sentence case?",
            answer: "Title case capitalizes the first letter of every major word. Sentence case capitalizes only the first word of each sentence.",
        },
        {
            question: "What does 'Remove extra whitespace' do?",
            answer: "It collapses multiple consecutive spaces and tabs into a single space, and removes leading/trailing whitespace from each line.",
        },
        {
            question: "Can I sort lines alphabetically?",
            answer: "Yes. Use the 'Sort Lines A→Z' or 'Sort Lines Z→A' option. You can also remove duplicate lines with 'Remove Duplicates'.",
        },
    ],
    useCases: [
        "Converting a list of names to title case for a report",
        "Counting words in an essay or article",
        "Removing blank lines from a pasted CSV",
        "Converting a camelCase variable name to snake_case",
    ],
    examples: [
        {
            label: "Convert to title case",
            input: "the quick brown fox jumps over the lazy dog",
            output: "The Quick Brown Fox Jumps Over The Lazy Dog",
        },
        {
            label: "camelCase to snake_case",
            input: "myVariableName",
            output: "my_variable_name",
        },
    ],
    commonErrors: [
        {
            error: "Title case capitalizes articles and prepositions",
            fix: "This is a known simplification. True title case rules (not capitalizing 'the', 'of', 'and') vary by style guide. Apply manual corrections for formal documents.",
        },
        {
            error: "Line count differs from word processor",
            fix: "Different tools count blank lines differently. The word count excludes blank lines; the line count includes them.",
        },
    ],
    alternatives: ["TextMechanic.com", "Convert Case", "Sublime Text multi-cursor editing"],
};
