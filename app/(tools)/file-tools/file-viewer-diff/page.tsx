import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import FileViewerDiffClientWrapper from "./FileViewerDiffClientWrapper";

const toolId = "file-viewer-diff";
const cat = CATEGORIES.find((c) => c.id === "developer")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function FileViewerDiffPage() {
  return (
    <ToolShell
      title="File Viewer & Diff"
      description="Professional-grade file analysis suite. View, edit, and compare text or code files with secure local-only processing."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Traditional online diff tools require you to upload your source code or sensitive documents to their servers. KV File Viewer & Diff changes that by performing all calculations locally in your browser. Your data never leaves your device, making it safe for proprietary code, logs, and confidential text.",
        useCases: [
          "Comparing two versions of a source code file",
          "Reviewing log files for differences and errors",
          "Editing text files without installing a local editor",
          "Formatting and inspecting JSON or XML data",
          "Securely analyzing sensitive configuration files"
        ],
        howTo: [
          "Upload your primary file using the 'Open File' button.",
          "Switch to the 'Compare' tab to select a second file.",
          "Click 'Compare' to see the side-by-side or inline difference.",
          "Use the editor to make live changes to either file.",
          "Download the modified files directly to your device."
        ],
        faq: [
          {
            question: "Does this tool work offline?",
            answer: "Yes. Once the page is loaded, you can disconnect from the internet. All file reading, editing, and diffing logic is self-contained and runs in your browser."
          },
          {
            question: "What is the maximum file size?",
            answer: "For optimal performance, we recommend files up to 10MB. Larger files might cause memory constraints in some mobile browsers."
          },
          {
            question: "Can I use this on my phone?",
            answer: "Absolutely. The editor is designed to be mobile-responsive, providing a consistent experience across all devices."
          }
        ],
        relatedTools: ["diff-checker", "code-minifier", "json-formatter"]
      }}
    >
      <FileViewerDiffClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-diff"
          title="How it Works: Line Tokenization"
          preview="Learn why comparing files character-by-character is a bad idea."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a developer wants to see what changed in a file, they usually care about line-level changes, not character-level changes.
            </p>
            <h3>The Diff Algorithm</h3>
            <p>
              Under the hood, this tool uses a variation of Myers' Diff Algorithm. If we ran this algorithm character-by-character on a 10,000 line log file, it would take an astronomical amount of time because the time complexity is related to the sequence length.
            </p>
            <p>
              To solve this, the tool first performs <strong>Line Tokenization</strong>. It splits the file by newlines, treats each entire line as a single "token", and then runs the diff algorithm on those tokens. This reduces a 1,000,000 character comparison into a 10,000 line comparison, making it thousands of times faster and enabling real-time diffing in the browser.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
