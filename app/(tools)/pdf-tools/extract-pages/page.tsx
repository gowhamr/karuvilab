import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ExtractPagesClientWrapper from './ExtractPagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'extract-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract PDF Pages"
      description="Extract selected pages into a new PDF document."
      category={cat}
      toolId={toolId}
    >
      <ExtractPagesClientWrapper />

      <LearningHub title="Understanding the PDF Page Tree">
        
        <LearningSection type="architecture" title="Not Just Screenshots">
          <p>When you extract a page from a PDF, we don't just "cut out" a visual image. A PDF is a relational database organized as a <strong>Page Tree</strong>.</p>
          <p className="mt-2">Every page is a dictionary node that points to shared resources like embedded Fonts, Images, and Color Spaces.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Shared Object Tables">
          <p>If a 100-page PDF uses the same 5MB font file on every page, the font is only embedded <strong>once</strong> in the entire file.</p>
          <p className="mt-2">When you extract 10 pages, our tool mathematically traces the dependency graph for each page. It identifies which shared resources (like that font) are actually used by those specific 10 pages and carefully copies them into the new file.</p>
        </LearningSection>

        <LearningSection type="performance" title="The File Size Reality">
          <p>This dependency copying is why extracting 10 pages from a 100-MB document might not result in a perfectly 10-MB file.</p>
          <p className="mt-2">The new extracted file must still include the heavy fonts, XObjects, and shared metadata dictionaries required to render those 10 pages perfectly.</p>
        </LearningSection>

        <LearningSection type="security" title="Zero Data Exfiltration">
          <p>Splitting and extracting PDFs usually requires heavy server-side tools like Ghostscript or Adobe Acrobat. We do it directly in your browser.</p>
          <p className="mt-2">By using WebAssembly to traverse the Page Tree locally in a Web Worker, your sensitive documents never leave your computer, and extracting pages from gigabyte-sized PDFs won't crash your browser tab.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a 50-page PDF contains a 10MB font used on every page, how many times is the font stored in the file?",
                options: [
                  "50 times (one per page).",
                  "1 time (as a shared resource in the Page Tree).",
                  "0 times (fonts are always loaded from the operating system).",
                  "It depends on the page size."
                ],
                correctIndex: 1,
                explanation: "PDFs use relational structures. Shared resources like fonts or logos are stored once and referenced by multiple pages to save space."
              },
              {
                question: "Why might extracting a single page from a PDF result in a surprisingly large file size?",
                options: [
                  "Because the extraction process adds invisible watermarks.",
                  "Because the new file must include a copy of any embedded fonts or images that the specific page relies on.",
                  "Because the tool converts the page into a high-resolution PNG.",
                  "Because the tool doesn't compress the file."
                ],
                correctIndex: 1,
                explanation: "Even a single page might require a massive embedded font dictionary to render properly, which must be copied over during extraction."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
