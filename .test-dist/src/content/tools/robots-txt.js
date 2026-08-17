export const robotsTxt = {
    detailedDescription: "Generate a valid `robots.txt` file using a visual rule builder. Add allow/disallow rules for specific user agents (Googlebot, Bingbot, or all bots), set the sitemap URL, and set crawl delay. Download the ready-to-deploy file. All generation happens in the browser.",
    howTo: [
        "Add user agent rules using the form (choose 'All' or a specific bot).",
        "Add disallow and allow paths for each user agent.",
        "Optionally set a crawl delay and sitemap URL.",
        "Click 'Generate' to preview the `robots.txt` content.",
        "Download the file and upload it to your website's root directory.",
    ],
    faq: [
        {
            question: "Does robots.txt prevent pages from appearing in search results?",
            answer: "Blocking a page in robots.txt prevents crawling but does not always prevent indexing. If other sites link to the page, Google may still index it. Use `noindex` meta tags to prevent indexing.",
        },
        {
            question: "Is robots.txt case-sensitive?",
            answer: "The user agent names are case-insensitive, but the paths are case-sensitive on case-sensitive servers (e.g., Linux).",
        },
        {
            question: "Can I block a specific directory?",
            answer: "Yes. `Disallow: /private/` blocks all URLs under `/private/`. The trailing slash is important.",
        },
    ],
    useCases: [
        "Blocking search engines from indexing an admin panel",
        "Preventing crawlers from accessing test or staging directories",
        "Adding a sitemap reference to robots.txt",
        "Setting a crawl delay for a resource-constrained server",
    ],
    examples: [
        {
            label: "Block all bots from /admin/",
            input: "User-agent: *, Disallow: /admin/",
            output: "User-agent: *\nDisallow: /admin/",
        },
    ],
    commonErrors: [
        {
            error: "Robots.txt is blocking the entire site",
            fix: "`Disallow: /` blocks all content for the matched user agent. Verify you didn't accidentally use `/` as the disallow path.",
        },
        {
            error: "File is not being respected by a crawler",
            fix: "Ensure the file is at `https://yourdomain.com/robots.txt` (the exact root). Subdomains need their own robots.txt file.",
        },
    ],
    alternatives: ["robots-txt.com", "Google Search Console robots.txt tester", "SEMrush Site Audit"],
};
