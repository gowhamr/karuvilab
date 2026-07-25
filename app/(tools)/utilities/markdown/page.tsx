import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import MarkdownEditorWrapper from '@/src/features/markdown/MarkdownEditorWrapper';

const toolId = 'markdown';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Markdown Editor"
      description="Write, preview and export Markdown with support for Mermaid diagrams and syntax highlighting."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "The KaruviLab Markdown Editor is a professional-grade tool designed for developers, technical writers, and students who need a fast, privacy-first environment for writing and documenting. Unlike traditional online editors, KaruviLab processes all your data locally in your browser. This means your sensitive notes, project plans, and documentation never leave your device, providing an unmatched level of security and peace of mind. The editor features a high-performance GitHub-style live preview, ensuring that what you see is exactly what you get. \n\nBeyond basic text formatting, our tool integrates Mermaid.js, allowing you to create complex flowcharts, sequence diagrams, and ER diagrams directly within your Markdown files. This makes it an essential tool for project planning and system architecture design. We've also included advanced productivity features like Find & Replace, scroll synchronization, and comprehensive word counts. Whether you're drafting a simple readme or a complex technical document, the KaruviLab Markdown Editor provides the precision and reliability you need to get the job done efficiently.",
        howTo: [
          "Type directly into the Live Editor or upload an existing .md file using the 'File Upload' tab.",
          "Use the enhanced toolbar to quickly insert formatting, tables, or complex Mermaid diagrams.",
          "Observe your changes in real-time in the Live Preview pane on the right.",
          "Utilize Find & Replace (Ctrl+F) to make batch changes to your document.",
          "Export your finished work as a standalone HTML file, a print-ready PDF, or a Microsoft Word (.docx) document."
        ],
        useCases: [
          "Technical documentation and README files with embedded flowcharts.",
          "Fast conversion of Markdown notes into styled HTML for web projects.",
          "System design visualization using Mermaid ER diagrams and sequence charts.",
          "Academic writing and note-taking in a secure, local-first environment."
        ],
        faq: [
          {
            question: "Is my documentation data uploaded to any server?",
            answer: "Absolutely not. All Markdown parsing, diagram rendering, and file processing happen entirely within your browser. We never see or store your data."
          },
          {
            question: "Does the editor work offline?",
            answer: "Yes, the editor is fully functional without an internet connection once the engine is loaded. You can continue writing and previewing your work anywhere."
          },
          {
            question: "Can I export my work to Word?",
            answer: "Yes, our tool supports native .docx export, allowing you to move your Markdown documents directly into Microsoft Word for further editing or sharing."
          },
          {
            question: "What types of diagrams are supported?",
            answer: "We support a wide range of Mermaid.js diagrams including Flowcharts, Sequence Diagrams, Gantt Charts, Pie Charts, and Entity Relationship (ER) Diagrams."
          }
        ],
        relatedTools: ["html-viewer", "code-minifier", "text-utility", "word-counter"]
      }}
    >
      <MarkdownEditorWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-markdown"
          title="How it Works: Markdown and Security"
          preview="Learn why writing Markdown can expose you to Cross-Site Scripting (XSS) attacks."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Markdown is a lightweight markup language created by John Gruber in 2004. Its purpose is to be easy to read in plain text format, while also being easily convertible into HTML for web publishing.
            </p>
            <h3>How Parsing Works</h3>
            <p>
              A parser reads your text line by line. When it sees a line starting with <code># Hello</code>, it recognizes the <code>#</code> syntax and replaces that entire line with <code>&lt;h1&gt;Hello&lt;/h1&gt;</code>.
            </p>
            <h3>The XSS Vulnerability</h3>
            <p>
              By design, Markdown allows you to use raw HTML within the document. If you type <code>&lt;button&gt;Click me&lt;/button&gt;</code>, the parser leaves it alone and it renders as a real button.
            </p>
            <p>
              This is incredibly dangerous in modern web apps. If you paste an infected Markdown file into an editor, and that file contains <code>&lt;script&gt;stealCookies()&lt;/script&gt;</code>, the parser will blindly output that script into the browser's DOM, executing malicious code instantly.
            </p>
            <p>
              <strong>The Solution:</strong> KaruviLab forces all rendered HTML through <code>DOMPurify</code>. Before the preview is shown to you, the purifier analyzes the HTML tree, strips out all <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code>, and <code>onclick=</code> attributes, and only permits safe display tags (like headings, bold, and images).
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
