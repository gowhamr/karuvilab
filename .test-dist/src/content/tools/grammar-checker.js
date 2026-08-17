export const grammarChecker = {
    detailedDescription: "Check your text for common grammar, spelling, and punctuation issues using a client-side rule engine. Highlights potential errors with suggested corrections. Suitable for quick proofreading of short documents. Note: this is a rule-based checker, not an AI model — for advanced grammar, consider a dedicated tool.",
    howTo: [
        "Paste or type your text into the editor.",
        "Click 'Check Grammar' to run the analysis.",
        "Highlighted errors appear with suggested corrections in a tooltip.",
        "Click a suggestion to apply the correction automatically.",
        "Review all changes before copying the final text.",
    ],
    faq: [
        {
            question: "Does this use an AI language model?",
            answer: "No. The tool uses a rule-based grammar engine running locally in the browser. It catches common mistakes but is not as comprehensive as AI-powered tools.",
        },
        {
            question: "Is my text sent to a server?",
            answer: "No. All grammar checking runs in your browser. Your text remains private.",
        },
        {
            question: "Can it check non-English text?",
            answer: "Currently, the checker is optimized for English. Support for other languages is limited.",
        },
    ],
    useCases: [
        "Quick proofreading of an email before sending",
        "Catching common typos in a blog post draft",
        "Checking subject-verb agreement in a short paragraph",
        "Spotting double words or missing articles",
    ],
    commonErrors: [
        {
            error: "Tool flags correctly spelled words as errors",
            fix: "The dictionary may not include proper nouns or technical terms. Use 'Ignore' to dismiss false positives.",
        },
        {
            error: "No errors found but the text reads awkwardly",
            fix: "Rule-based checkers miss stylistic issues. Use an AI writing assistant like Grammarly or LanguageTool for deeper analysis.",
        },
    ],
    alternatives: ["Grammarly", "LanguageTool", "Hemingway Editor"],
};
