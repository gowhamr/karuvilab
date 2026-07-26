import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RemovePagesClientWrapper from './RemovePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'remove-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Remove PDF Pages"
      description="Remove unnecessary pages from your PDF file securely."
      category={cat}
      toolId={toolId}
    >
      <RemovePagesClientWrapper />

      <LearningHub title="Understanding Page Deletion & Garbage Collection">
        
        <LearningSection type="architecture" title="The /Kids Array">
          <p>In the PDF specification, the document's page order is dictated by an array of object references called the <code>/Kids</code> array inside the Pages dictionary.</p>
          <p className="mt-2">When you "delete" a page, the first step is simply removing its reference from this array. To the PDF viewer, the page instantly vanishes.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Orphaned Objects">
          <p>However, simply removing the reference pointer is not enough. If the deleted page contained a 5MB high-resolution image, that image data (stored as an <code>XObject</code>) is still buried inside the file's binary stream, taking up space.</p>
          <p className="mt-2">Because nothing points to it anymore, it is known as an <strong>orphaned object</strong>.</p>
        </LearningSection>

        <LearningSection type="performance" title="Garbage Collection">
          <p>To ensure the final file size actually shrinks, our engine performs a Garbage Collection pass before saving.</p>
          <p className="mt-2">It traverses the entire object tree, identifying any fonts, images, or vector paths that belonged <em>exclusively</em> to the pages you just deleted, and permanently scrubs those binary chunks from the file, optimizing the final size.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a PDF tool only removes a page's reference from the /Kids array without doing garbage collection, what happens?",
                options: [
                  "The file size shrinks to 0 bytes.",
                  "The page disappears visually, but the file size remains exactly the same because the images/fonts are still embedded.",
                  "The PDF becomes corrupted.",
                  "The page turns blank but is still visible."
                ],
                correctIndex: 1,
                explanation: "PDFs use relational pointers. Deleting the pointer hides the page, but the heavy assets remain in the file until explicitly garbage-collected."
              },
              {
                question: "What is an 'orphaned object' in a PDF?",
                options: [
                  "A piece of data (like an image) that exists in the file but is no longer referenced by any page.",
                  "A font without a license.",
                  "A page without a number.",
                  "A corrupted JavaScript function."
                ],
                correctIndex: 0,
                explanation: "Orphaned objects take up wasted space and must be cleaned up to reduce file size."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
