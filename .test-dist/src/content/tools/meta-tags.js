export const metaTags = {
    detailedDescription: "Generate complete HTML meta tag markup for a web page including title, description, Open Graph, Twitter Card, and basic SEO tags. Preview how the tags will appear in search results and social media shares. Copy the generated HTML and paste it into your page's `<head>`.",
    howTo: [
        "Fill in the page title, description, URL, and optional image URL.",
        "Select the content type (website, article, product).",
        "Preview the search snippet and social media card previews.",
        "Click 'Copy HTML' to copy all meta tags ready to paste.",
    ],
    faq: [
        {
            question: "What is the ideal meta description length?",
            answer: "Google typically displays up to 155–160 characters. Keep descriptions between 120–155 characters for best display across devices.",
        },
        {
            question: "Do meta keywords still matter for SEO?",
            answer: "No. Google, Bing, and other major search engines have ignored the `keywords` meta tag for many years. Focus on title and description.",
        },
        {
            question: "What is the difference between og:image and twitter:image?",
            answer: "They serve the same purpose but for different platforms. Twitter Card tags take precedence on Twitter; og: tags are used by Facebook, LinkedIn, and others.",
        },
    ],
    useCases: [
        "Adding Open Graph tags to a new landing page",
        "Generating Twitter Card markup for article pages",
        "Creating consistent meta tags across a site",
        "Auditing what meta tags a page currently has before adding more",
    ],
    examples: [
        {
            label: "Basic page meta tags",
            input: 'Title: "KaruviLab Tools", Desc: "Free browser-based tools for developers"',
            output: '<meta name="description" content="Free browser-based tools for developers">\n<meta property="og:title" content="KaruviLab Tools">',
        },
    ],
    commonErrors: [
        {
            error: "og:image not showing on social media",
            fix: "The image must be an absolute URL (starting with https://). Local or relative paths do not work. Also ensure the image is at least 1200×630 pixels.",
        },
        {
            error: "Title is truncated in search results",
            fix: "Keep the title under 60 characters. Google truncates titles longer than approximately 580px wide.",
        },
    ],
    alternatives: ["Metatags.io", "HeyMeta.com", "Yoast SEO"],
};
