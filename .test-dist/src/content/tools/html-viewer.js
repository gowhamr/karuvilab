export const htmlViewer = {
    detailedDescription: "A professional-grade, live HTML, CSS, and JavaScript editor with a real-time sandboxed preview. Designed for developers and designers to quickly prototype, test snippets, or learn web technologies. Featuring Monaco Editor (the engine behind VS Code), syntax highlighting, auto-completion, and a secure execution environment.",
    howTo: [
        "Select a tab (HTML, CSS, or JS) to start writing code.",
        "The preview pane updates automatically as you type.",
        "Use the 'Libraries' menu to add external CSS or JS frameworks (e.g., Bootstrap, Tailwind).",
        "Open the 'Console' tab in the preview area to see logs and errors.",
        "Click 'Download' to save your work as a single, portable HTML file.",
        "Use 'Share' to generate a permanent link that contains your entire project in the URL.",
    ],
    faq: [
        {
            question: "Is my code secure?",
            answer: "Yes. The preview runs in a sandboxed iframe with strict security policies. Scripts are isolated and cannot access your main browser session or cookies.",
        },
        {
            question: "Can I use external libraries?",
            answer: "Absolutely. You can import any library available via CDN (like Google Fonts, Font Awesome, or React) through the project settings.",
        },
        {
            question: "Does it work offline?",
            answer: "The core editor and preview work offline once loaded. External libraries fetched via CDN will require an active internet connection.",
        },
    ],
    useCases: [
        "Quickly prototyping UI components",
        "Testing CSS layouts and animations",
        "Debugging JavaScript snippets",
        "Sharing code examples with colleagues",
        "Learning HTML5 and modern web standards",
    ],
    alternatives: ["CodePen", "JSFiddle", "StackBlitz", "PlayCode"],
};
