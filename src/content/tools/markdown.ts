import { ToolContent } from '../../registry/types';

export const markdown: ToolContent = {
  detailedDescription:
    "A live Markdown editor with a split-pane preview that renders your Markdown to HTML in real time. Supports CommonMark spec including tables, code blocks with syntax highlighting, task lists, and footnotes. All rendering is done in the browser using a lightweight Markdown parser.",
  howTo: [
    "Type or paste your Markdown in the left editor pane.",
    "The rendered HTML preview updates instantly on the right.",
    "Use the toolbar buttons for common Markdown shortcuts (bold, italic, link, etc.).",
    "Copy the rendered HTML or download the `.md` file.",
  ],
  faq: [
    {
      question: "Which Markdown spec does this follow?",
      answer:
        "The tool follows CommonMark with GitHub Flavored Markdown (GFM) extensions, supporting tables, strikethrough, and task lists.",
    },
    {
      question: "Can I export to HTML or PDF?",
      answer:
        "You can copy the rendered HTML. For PDF export, use the browser's 'Print → Save as PDF' feature.",
    },
    {
      question: "Are HTML tags inside Markdown rendered?",
      answer:
        "Raw HTML within Markdown is allowed by CommonMark and is rendered. Be cautious with `<script>` tags.",
    },
  ],
  useCases: [
    "Writing and previewing a README before pushing to GitHub",
    "Drafting a blog post in Markdown",
    "Creating formatted documentation for a project",
    "Learning Markdown syntax interactively",
  ],
  examples: [
    {
      label: "Heading and bold",
      input: "## Hello\n**Bold** and _italic_.",
      output: "<h2>Hello</h2><p><strong>Bold</strong> and <em>italic</em>.</p>",
    },
  ],
  commonErrors: [
    {
      error: "Table does not render",
      fix: "Ensure each row has the same number of columns and the header separator row uses at least three dashes (`---`) per cell.",
    },
    {
      error: "Code block shows rendered HTML instead of raw code",
      fix: "Wrap the HTML inside a fenced code block with three backticks and specify the language: ```html ... ```.",
    },
  ],
  alternatives: ["StackEdit.io", "Dillinger.io", "Typora"],
};
