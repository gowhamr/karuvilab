export const seoTitle = {
    detailedDescription: "Preview how your page title and meta description will appear in Google Search results with a pixel-accurate SERP snippet simulator. Get real-time character and pixel-width counters to stay within Google's display limits. Runs entirely in the browser.",
    howTo: [
        "Type your page title in the title field.",
        "Type your meta description in the description field.",
        "The SERP preview updates in real time below.",
        "Adjust the text until the preview shows no truncation.",
        "Copy the title and description for use in your CMS.",
    ],
    faq: [
        {
            question: "What is the maximum title length?",
            answer: "Google displays titles up to approximately 600 pixels wide (~55–60 characters in a standard font). The tool shows a pixel-width indicator.",
        },
        {
            question: "What is the ideal description length?",
            answer: "Descriptions should be 120–155 characters. Google may display up to 920 pixels of description (~155–160 characters) on desktop.",
        },
        {
            question: "Does Google always use my title tag?",
            answer: "No. Google may rewrite your title based on the page content if it considers the tag misleading or too generic. Write accurate, descriptive titles.",
        },
        {
            question: "Do special characters in titles cause issues?",
            answer: "Most characters are fine. Pipes (`|`), dashes (`–`), and colons (`:`) are commonly used as separators. Avoid ALL CAPS as Google may rewrite the title.",
        },
    ],
    useCases: [
        "Optimising a page title to fit within Google's display limit",
        "Writing a compelling meta description to improve click-through rate",
        "Reviewing titles across a site before a content audit",
        "Training a content team on SERP best practices",
    ],
    examples: [
        {
            label: "Well-formed SERP title",
            input: "Free JSON Formatter & Validator | KaruviLab",
            output: "[SERP preview: full title visible, no truncation]",
        },
    ],
    commonErrors: [
        {
            error: "Title appears truncated in the preview",
            fix: "Shorten the title or move the most important keyword earlier. Truncation happens at the pixel limit, not a fixed character count.",
        },
        {
            error: "Description is being rewritten by Google",
            fix: "Ensure the description accurately summarises the page content. Google rewrites descriptions it deems irrelevant to the search query.",
        },
    ],
    alternatives: ["Portent SERP Preview Tool", "Moz Title Tag Preview", "Yoast SEO plugin"],
};
