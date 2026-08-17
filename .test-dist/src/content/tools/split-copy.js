export const splitCopy = {
    detailedDescription: "Split a long block of text into equal-sized chunks of N characters, useful for pasting into character-limited inputs like SMS, Twitter (legacy), or form fields. Each chunk is displayed separately and can be individually copied. Runs entirely in the browser.",
    howTo: [
        "Paste your long text into the input field.",
        "Set the chunk size (number of characters per chunk).",
        "The text is split and each chunk is displayed with its index.",
        "Copy individual chunks using each chunk's copy button.",
    ],
    faq: [
        {
            question: "Does the splitter cut words mid-way?",
            answer: "By default, yes — it splits at exactly N characters. Enable 'Split at word boundary' to avoid cutting words in half.",
        },
        {
            question: "What is a good chunk size for SMS?",
            answer: "Standard SMS supports 160 characters. If you use Unicode/emoji, the limit drops to 70 characters per segment.",
        },
        {
            question: "Can I split by line count instead of character count?",
            answer: "Most implementations split by character. For line-based splitting, use the Text Utility tool's line operations.",
        },
    ],
    useCases: [
        "Splitting a long message to send over SMS",
        "Breaking a prompt into chunks for a character-limited API",
        "Dividing a large text for manual entry into multiple fields",
        "Preparing paginated content for a multi-step form",
    ],
    examples: [
        {
            label: "Split at 10 chars",
            input: "Hello, this is a long message.",
            output: "Chunk 1: 'Hello, thi' | Chunk 2: 's is a lon' | Chunk 3: 'g message.'",
        },
    ],
    commonErrors: [
        {
            error: "Last chunk is empty",
            fix: "This happens when the total length is an exact multiple of the chunk size. The tool may generate a trailing empty chunk — safely ignore it.",
        },
        {
            error: "Emoji characters cause misaligned chunks",
            fix: "Emoji are multi-byte characters. If character count matters, count code points, not bytes. Enable Unicode-aware mode if available.",
        },
    ],
    alternatives: ["TextMechanic.com", "TextSplit.net", "Manual copy-paste"],
};
