export const qaWorkbench = {
    id: "qa-workbench",
    name: "QA Workbench",
    desc: "Unified testing suite for developers: API requests, Regex, Text Diff, JSON formatting, and Mock Data.",
    href: "/developer-tools/qa-workbench/",
    category: "developer",
    icon: null,
    color: null,
    featured: true,
    popular: false,
    status: "beta",
    lastAdded: "2026-07-25",
    keywords: ["qa", "workbench", "testing", "regex", "diff", "json", "mock data", "api tester"],
    input: "text",
    output: "text",
    difficulty: "intermediate",
    subCategory: "Developer",
    seoContent: {
        detailedDescription: "An all-in-one quality assurance workbench for developers. Test regex, generate mock data, format JSON, test APIs, and compare text differences directly in your browser. Switch seamlessly between JSON validation, Regex testing, Text diffing, Mock Data generation, and API request testing.",
        howTo: [
            "Select a Tool: Choose the testing utility you need from the workbench sidebar or tabs.",
            "Configure Input: Paste your data, regex pattern, or configure your API request details.",
            "Execute locally: Run tests or generate data instantly in your browser without server uploads.",
            "Review Results: View formatted JSON, diff comparisons, regex matches, or API responses."
        ],
        faq: [
            {
                question: "Is my testing data secure?",
                answer: "Yes. All data processing (except external API requests you intentionally make) happens entirely inside your browser. We do not store or track your inputs."
            },
            {
                question: "Can I test local APIs?",
                answer: "Yes, if your local API supports CORS or if you are running a local proxy. Otherwise, browser security policies may block direct requests to localhost from this page."
            }
        ]
    },
    related: ["regex-tester", "json-formatter", "text-diff", "fake-data-generator"]
};
