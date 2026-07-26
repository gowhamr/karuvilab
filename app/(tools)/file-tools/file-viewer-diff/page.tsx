import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import FileViewerDiffClientWrapper from "./FileViewerDiffClientWrapper";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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
    >
      <FileViewerDiffClientWrapper />

      <LearningHub title="Understanding File Diffs and Sequence Alignment">
        
        <LearningSection type="architecture" title="Local-First Processing">
          <p>Traditional online diff tools require you to upload your source code, server logs, or sensitive documents to their backend servers. This poses a severe security risk for proprietary code and confidential text.</p>
          <p className="mt-2">This tool completely eliminates that risk by performing all file reading and diffing directly in the browser's memory. Once the page is loaded, your files never leave your device.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Diff Algorithm">
          <p>Under the hood, this tool uses a variation of <strong>Myers' Diff Algorithm</strong>, invented by Eugene W. Myers in 1986. This is the exact same algorithm that powers Git.</p>
          <p className="mt-2">Its goal is to find the Longest Common Subsequence (LCS) between two files to determine the minimum number of insertions and deletions needed to transform file A into file B.</p>
        </LearningSection>

        <LearningSection type="performance" title="Line Tokenization">
          <p>If we ran Myers' algorithm character-by-character on a 10,000-line log file, the browser would freeze. The time complexity of the algorithm is roughly O(ND) where N is the sum of the lengths of the sequences and D is the size of the minimum edit script.</p>
          <p className="mt-2">To solve this, the tool performs <strong>Line Tokenization</strong>. It splits the file by newlines and treats each entire line as a single "token" (like a single character). It then runs the algorithm on those tokens. This reduces a 1,000,000-character comparison into a 10,000-line comparison, making it thousands of times faster and enabling real-time diffing in the browser.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does this tool use 'Line Tokenization' before running the diff algorithm?",
                options: [
                  "To encrypt the file contents before comparison.",
                  "Because comparing two massive files character-by-character would cause the browser to freeze due to the algorithm's time complexity.",
                  "To fix character encoding issues like UTF-8 vs ASCII.",
                  "Because Git requires it."
                ],
                correctIndex: 1,
                explanation: "By treating entire lines as single tokens, the algorithm has to process significantly fewer items, keeping the main thread responsive."
              },
              {
                question: "Which famous algorithm forms the foundation of modern diff tools like this one and Git?",
                options: [
                  "Dijkstra's Shortest Path Algorithm",
                  "The A* Search Algorithm",
                  "Myers' Diff Algorithm",
                  "The Fast Fourier Transform"
                ],
                correctIndex: 2,
                explanation: "Myers' Diff Algorithm (1986) provides an efficient way to find the minimum number of insertions and deletions between two sequences."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
