import MergePdfClientWrapper from "./MergePdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

export const metadata: Metadata = generateToolMetadata("merge-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      toolId="merge-pdf"
      title="Merge PDF"
      description="Combine multiple PDF files into one — all processing happens in your browser."
      category={cat}
    >
      <MergePdfClientWrapper />

      <LearningHub title="Understanding PDF Object Deduplication">
        
        <LearningSection type="architecture" title="Not Just Appending Files">
          <p>Merging PDFs isn't like concatenating video or audio files. Because PDFs are highly structured relational databases, merging requires parsing multiple cross-reference tables (XRef tables) and building an entirely new, unified Object Stream.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Resource Deduplication">
          <p>When combining two PDFs that share the exact same embedded resource (for example, the Arial font or a company logo), the merging algorithm intelligently deduplicates the resources.</p>
          <p className="mt-2">Instead of storing two identical 5MB font files in the new document, it rewrites the internal dictionary pointers of both documents to share a single font object in the merged output, drastically reducing the final file size.</p>
        </LearningSection>

        <LearningSection type="performance" title="Memory Management">
          <p>Loading multiple large PDFs into a browser's RAM simultaneously can easily cause an Out-Of-Memory (OOM) crash, especially on mobile devices.</p>
          <p className="mt-2">To prevent this, our Web Worker processes the merge sequentially. It loads a file, safely copies its necessary objects into the master document, and then immediately flags the original file for garbage collection. Data is passed between the UI and worker using zero-copy Transferable Objects.</p>
        </LearningSection>

        <LearningSection type="api" title="Incremental Saving (Fast Web View)">
          <p>By default, this tool processes PDFs to optimize them for "Fast Web View" (also known as Linearization).</p>
          <p className="mt-2">This restructures the resulting merged PDF so that when you upload it to a web server, browsers can download and display the first page immediately while the rest of the document finishes loading in the background.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you merge two 10MB PDFs that use the exact same embedded font file, why might the merged file be only 11MB?",
                options: [
                  "Because merging automatically lowers image quality.",
                  "Because the algorithm deduplicates shared resources like fonts, storing them only once in the new file.",
                  "Because it compresses the files into a ZIP.",
                  "Because it removes all metadata."
                ],
                correctIndex: 1,
                explanation: "PDF merging rewrites the document structure. If multiple pages rely on the same resource, the new PDF only embeds it once and points to it multiple times."
              },
              {
                question: "What is 'Fast Web View' (Linearization)?",
                options: [
                  "A feature that converts PDFs to HTML.",
                  "A structural optimization that allows a web browser to display the first page of a PDF before downloading the entire file.",
                  "A compression algorithm used by Adobe.",
                  "A way to bypass passwords."
                ],
                correctIndex: 1,
                explanation: "Linearization moves critical rendering objects (like fonts and page 1 text) to the very beginning of the file byte-stream, optimizing it for HTTP range requests."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
