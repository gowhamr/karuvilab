import MergePdfClientWrapper from "./MergePdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-merging"
          title="How it Works: Object Deduplication"
          preview="Learn why merging PDFs is more complex than just appending files together."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Merging PDFs isn't like concatenating video or audio files. Because PDFs are highly structured relational databases, merging requires parsing multiple cross-reference tables (XRef tables) and building a unified Object Stream.
            </p>
            <h3>Resource Deduplication</h3>
            <p>
              When combining two PDFs that share the exact same embedded font (e.g., Arial), the merging algorithm intelligently deduplicates the resources. Instead of storing two identical 5MB font files, it rewrites the internal dictionary pointers of both documents to share a single font object in the merged output.
            </p>
            <h3>Incremental Saving (Fast Web View)</h3>
            <p>
              By default, this tool processes PDFs to optimize them for "Fast Web View" (Linearization). This restructures the resulting merged PDF so that when you upload it to a web server, browsers can download and display the first page immediately before the rest of the document finishes loading.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-memory"
          title="Performance & Memory Management"
          preview="How we safely merge massive documents in a browser."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Loading multiple PDFs into a browser's RAM can easily cause an Out-Of-Memory (OOM) crash, especially on mobile devices.
            </p>
            <ul>
              <li><strong>Sequential Processing:</strong> Our Web Worker processes the merge one document at a time. It loads a file, copies its pages into the master document, and then immediately flags the original file for garbage collection.</li>
              <li><strong>Zero-Copy ArrayBuffers:</strong> Data is passed between the UI thread and the worker thread using Transferable Objects, ensuring memory is moved (not cloned).</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
