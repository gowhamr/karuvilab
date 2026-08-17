export const markdown = {
    detailedDescription: `
<p>The KaruviLab Markdown Editor is a professional, browser-native writing environment designed for developers, technical writers, and content creators. Markdown has become the industry-standard syntax for documentation, README files, and blog posts because it is lightweight, human-readable, and easily convertible to HTML. Our tool provides a live, side-by-side preview experience, allowing you to see your rendered output the instant you type.</p>

<p>By operating locally within your web browser, our Markdown editor offers a distraction-free space to document your projects without the latency of cloud-based editors. Whether you are drafting a new technical article, creating project documentation for GitHub, or simply learning Markdown syntax, this editor supports CommonMark and GitHub Flavored Markdown (GFM) extensions, including tables, task lists, and syntax-highlighted code blocks.</p>

<p>We prioritize both convenience and portability. You can copy the rendered HTML directly for use in your website's CMS, or download your work as a <code>.md</code> file for version control. This tool is built to integrate seamlessly into your existing development workflow, offering a fast, reliable, and entirely private platform for all your documentation needs.</p>
`,
    howTo: [
        "<strong>Start Typing:</strong> Enter your text in the left editor pane using standard Markdown syntax (e.g., `# Heading`, `**Bold**`).",
        "<strong>Preview:</strong> The right pane renders your content into clean HTML in real-time.",
        "<strong>Use Shortcuts:</strong> Utilize the built-in toolbar buttons to quickly insert bold, italic, list, or code formatting tags.",
        "<strong>Export:</strong> Once your document is ready, click 'Copy HTML' to use the code, or download your work as a `.md` file.",
    ],
    faq: [
        {
            question: "What Markdown standard is used?",
            answer: "We support CommonMark, which is the most widely adopted standard. We also include GitHub Flavored Markdown (GFM) features like tables, task lists, and code blocks.",
        },
        {
            question: "Can I save my work?",
            answer: "This is an editor, not a document manager. Please be sure to save your work by downloading the `.md` file or copying the HTML before closing your browser tab.",
        },
        {
            question: "Does it support syntax highlighting?",
            answer: "Yes. Fenced code blocks (` ```language `) are automatically rendered with syntax highlighting for popular programming languages.",
        },
        {
            question: "Are there any privacy concerns?",
            answer: "None. All rendering and processing occur locally. Your writing never leaves your computer.",
        },
    ],
    useCases: [
        "Writing and previewing README files for GitHub projects.",
        "Drafting technical blog posts or newsletters.",
        "Creating well-formatted project documentation offline.",
        "Learning and practicing Markdown syntax in a live, interactive environment.",
    ],
    examples: [
        {
            label: "Heading and bold",
            input: "## Project Overview\n**This tool** is *excellent*.",
            output: "<h2>Project Overview</h2><p><strong>This tool</strong> is <em>excellent</em>.</p>",
            description: "A simple demonstration of heading and inline formatting."
        }
    ],
    commonErrors: [
        {
            error: "Tables look disorganized",
            fix: "Markdown tables require a specific syntax. Ensure you include the pipe `|` characters for columns and a delimiter row (e.g., `|---|`) between your header and the table body.",
        },
        {
            error: "Code blocks look strange",
            fix: "Use triple backticks (```) followed by the language name on a new line to start the block, and another triple backtick on a new line to close it.",
        },
    ],
    alternatives: ["StackEdit.io", "Dillinger.io", "Typora"],
};
