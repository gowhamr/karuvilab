import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MarkdownEditor = dynamic(() => import("@/src/features/markdown/components/MarkdownEditor").then(mod => mod.MarkdownEditor), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const cat = CATEGORIES.find((c) => c.id === "utilities")!;

export const metadata: Metadata = generateToolMetadata("markdown");

export default function page() {
  return (
    <ToolShell
      title="Markdown Editor"
      description="Write, preview and export Markdown with support for Mermaid diagrams and syntax highlighting."
      category={cat}
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
      <MarkdownEditor />
    </ToolShell>
  );
}
