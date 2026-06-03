import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const FileViewerDiffClient = dynamic(() => import("@/components/tools/file-viewer-diff/FileViewerDiffClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

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
      <FileViewerDiffClient />
    </ToolShell>
  );
}
