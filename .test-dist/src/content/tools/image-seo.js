export const imageSeo = {
    detailedDescription: `
Optimizing your images for search engines (SEO) is one of the most overlooked aspects of digital marketing and website performance. While many focus on text-based content, search engines like Google and Bing rely heavily on image filenames and "alt" (alternative) text to understand the context of your media. Our **Image SEO & File Renamer Tool** is a comprehensive, local-first utility designed to help you generate descriptive, keyword-rich metadata and clean filenames entirely within your browser.

By converting generic, automated filenames like "IMG_5678.jpg" into meaningful strings like "sustainable-leather-boots-black.jpg", you provide search crawlers with essential signals that can improve your ranking in image search results. Furthermore, high-quality alt text is not just an SEO requirement; it is a fundamental pillar of web accessibility. This tool ensures that your images are "readable" for screen readers, providing a better experience for visually impaired users while simultaneously reinforcing your page's topical authority.

### The Importance of SEO-Friendly Filenames
A descriptive filename acts as a "mini-headline" for your image. Search engines utilize the words in your filename to categorize and index your content. Best practices dictate that filenames should be entirely lowercase, use hyphens instead of underscores (as hyphens are treated as word separators by Google), and avoid special characters. Our tool automates this process using a professional-grade "slugification" algorithm, ensuring your files are always web-ready.

### Crafting Perfect Alt Text
Alt text should provide a literal and contextual description of the image. Instead of keyword stuffing, which can lead to search penalties, you should aim for natural language that describes the visual details. For example, instead of "shoes for sale cheap", a better alt text would be "A pair of navy blue athletic running shoes with white soles displayed on a mahogany desk." Our **Natural Language Alt Generator** helps you structure these descriptions to satisfy both search algorithms and accessibility standards (WCAG 2.1).

### 100% Local and Private
In line with KaruviLab's core philosophy, all processing for this **image metadata editor** happens locally on your device. We do not use cloud-based APIs to analyze your images, and your files are never uploaded to our servers. This ensures that your private photos, proprietary product shots, or sensitive documents remain 100% under your control. By leveraging the power of your browser's CPU, we provide instant results without the latency or privacy risks of traditional server-side tools.
`,
    howTo: [
        "**Step 1:** Upload your image or select multiple files for batch processing using the 'Select Files' button.",
        "**Step 2:** Provide a brief context or description of what is happening in the image.",
        "**Step 3:** Click 'Generate SEO Plan' to create a natural language alt text string and a clean, hyphenated filename slug.",
        "**Step 4:** For individual files, download the optimized version instantly. For batch tasks, use the 'Batch Renamer' tab to process entire folders with consistent naming conventions.",
        "**Step 5:** Use the 'SEO Analyzer' to verify the health of your existing alt tags against character count and keyword density benchmarks.",
    ],
    faq: [
        {
            question: "Why should I use hyphens instead of underscores in filenames?",
            answer: "Search engines, specifically Google, treat hyphens as spaces between words. Underscores are often treated as part of a single continuous string. Using hyphens (e.g., 'blue-shoes') ensures crawlers see two distinct keywords.",
        },
        {
            question: "What is the ideal length for image alt text?",
            answer: "Ideally, alt text should be between 5 and 125 characters. Anything longer may be truncated by certain screen readers or flagged as keyword stuffing by search algorithms.",
        },
        {
            question: "Does this tool strip EXIF metadata from my images?",
            answer: "Yes. When you download a renamed image through our tool, it essentially creates a clean copy, which can help reduce file size and protect your privacy by removing location and camera settings.",
        },
        {
            question: "Is batch renaming supported for all file types?",
            answer: "Our renamer is optimized for web-standard image formats (JPG, PNG, WebP, SVG), but it can also handle document formats like PDF and DOCX for general file organization.",
        },
        {
            question: "Will this tool help my site load faster?",
            answer: "Renaming alone won't reduce load times, but stripping unnecessary metadata can save a few kilobytes. For significant performance gains, we recommend pairing this with our 'Bulk Image Compressor' tool.",
        },
    ],
    useCases: [
        "E-commerce SEO: Optimizing product catalogs for Google Image search to drive organic traffic.",
        "Blogger Workflow: Quickly renaming raw camera uploads into descriptive, SEO-friendly assets for WordPress or Next.js.",
        "Accessibility Audits: Using the SEO Analyzer to refine alt text for compliance with WCAG standards.",
        "Developer Productivity: Batch renaming assets for code projects using consistent, slugified naming patterns.",
    ],
    examples: [
        {
            label: "Product Shot",
            input: "Model 24 Leather Wallet - Brown",
            output: "model-24-leather-wallet-brown.jpg",
            description: "Converts a marketing title into a clean, searchable filename with appropriate extension handling.",
        },
        {
            label: "Social Media Asset",
            input: "Team celebrating 10th anniversary at the office",
            output: "Alt: A diverse team of employees celebrating their 10th company anniversary with cake in a modern office setting.",
            description: "Transforms a simple context string into descriptive, accessible alt text for screen readers.",
        },
        {
            label: "Scientific Diagram",
            input: "Fig 1.2 - Mitochondrial DNA Structure",
            output: "mitochondrial-dna-structure-fig-1-2.png",
            description: "Normalizes complex academic labels into URL-safe filenames while preserving important identification numbers.",
        },
    ],
    commonErrors: [
        {
            error: "Using 'image of' or 'picture of' in alt text",
            fix: "Screen readers already announce that the element is an image. Start your description directly with the subject (e.g., 'A golden retriever' instead of 'An image of a golden retriever').",
        },
        {
            error: "Keyword Stuffing",
            fix: "Avoid long lists of comma-separated keywords. Use complete, natural sentences that actually describe what the user sees.",
        },
    ],
    alternatives: ["Adobe Bridge (Desktop)", "FileRenamer (CLI)", "SEO Image Optimizer (WordPress Plugin)"],
};
