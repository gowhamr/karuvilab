export const sitemapGenerator = {
    detailedDescription: "Build a standards-compliant XML sitemap by entering your URLs along with priority, change frequency, and last modification date. Download the ready-to-upload `sitemap.xml` file. The sitemap is generated entirely in the browser — no crawling or server-side processing required.",
    howTo: [
        "Enter your website's base URL.",
        "Add URLs one by one using the form, or paste a list of URLs.",
        "For each URL, set the priority (0.1 to 1.0) and change frequency.",
        "Click 'Generate Sitemap' to produce the XML.",
        "Download `sitemap.xml` and upload it to your website's root directory.",
    ],
    faq: [
        {
            question: "Does Google require a sitemap?",
            answer: "Not strictly, but a sitemap helps Google discover all pages on your site, especially for large or new sites with few inbound links.",
        },
        {
            question: "What is the priority attribute used for?",
            answer: "Priority (0.1–1.0) indicates the relative importance of pages on your site. It only affects how Google prioritizes crawling your own pages — it has no impact on ranking.",
        },
        {
            question: "How do I submit the sitemap to Google?",
            answer: "Upload `sitemap.xml` to your site root, then submit the URL (e.g., `https://yourdomain.com/sitemap.xml`) via Google Search Console under Sitemaps.",
        },
        {
            question: "What is the maximum number of URLs in a sitemap?",
            answer: "A single sitemap file can contain up to 50,000 URLs and must be under 50 MB uncompressed. For larger sites, use a sitemap index file.",
        },
    ],
    useCases: [
        "Creating a sitemap for a new website before launch",
        "Regenerating a sitemap after adding new pages",
        "Submitting additional URLs to Google Search Console",
        "Building a sitemap for a static site that has no CMS plugin",
    ],
    commonErrors: [
        {
            error: "Google rejects the sitemap with 'Could not fetch'",
            fix: "Ensure the sitemap file is uploaded to the website's root at the exact URL you submitted. Also check that the file is publicly accessible.",
        },
        {
            error: "URLs with query strings are not indexing",
            fix: "Canonicalize parameterized URLs and include only the canonical version in the sitemap. Use `<link rel='canonical'>` on the pages themselves.",
        },
    ],
    alternatives: ["XML-Sitemaps.com", "Screaming Frog (crawl-based)", "Yoast SEO (WordPress)"],
};
