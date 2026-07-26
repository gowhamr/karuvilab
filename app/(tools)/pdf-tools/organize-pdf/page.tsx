import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import OrganizePdfClientWrapper from '@/src/features/organize-pdf/organize-pdfClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "organize-pdf";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Organize PDF Pages"
      description="Reorder, delete, or rotate individual pages in a PDF document visually."
      category={cat}
    >
      <OrganizePdfClientWrapper />

      <LearningHub title="Understanding the Document Hierarchy">
        
        <LearningSection type="architecture" title="The Pages Dictionary">
          <p>When you drag a page to a new position using this tool, the visual change is immediate. But behind the scenes, we are actually modifying the structural hierarchy of the PDF document.</p>
          <p className="mt-2">In the PDF specification, the document structure is governed by a <strong>Pages Dictionary</strong>. This dictionary contains an array called <code>/Kids</code>, which holds references to every single page in the document in strict sequential order.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Swapping Pointers">
          <p>If you move Page 5 to position 2, we don't have to rewrite the heavy graphics data of Page 5.</p>
          <p className="mt-2">We simply take the reference pointer to Page 5 and insert it into the 2nd slot of the <code>/Kids</code> array. When we save the file, the PDF viewer reads the new array order and displays the pages accordingly.</p>
        </LearningSection>

        <LearningSection type="performance" title="Garbage Collection">
          <p>If you delete a page from the UI, we remove its reference from the <code>/Kids</code> array. However, doing only this would leave "orphaned" objects taking up space.</p>
          <p className="mt-2">To ensure the final file size actually shrinks, our engine traverses the entire object tree before saving, identifying any orphaned fonts, images, or vector paths that belonged <em>exclusively</em> to that deleted page, and permanently scrubs them from the file.</p>
        </LearningSection>

        <LearningSection type="api" title="Lazy Canvas Rendering">
          <p>To show you a visual drag-and-drop interface, we have to render every page of the PDF into an image thumbnail.</p>
          <p className="mt-2">For a 100-page document, doing this synchronously would freeze the browser. We use the <code>IntersectionObserver</code> API to lazily render thumbnails only when they are about to scroll into view, ensuring the UI remains perfectly smooth.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What array inside the PDF controls the visual order of the pages?",
                options: [
                  "The /Order array",
                  "The /Kids array",
                  "The /Pages array",
                  "The /Index array"
                ],
                correctIndex: 1,
                explanation: "The /Kids array inside the Pages dictionary holds the sequential references to the page objects."
              },
              {
                question: "When you delete a page, how does the tool ensure the file size shrinks?",
                options: [
                  "By compressing the entire file into a ZIP.",
                  "By traversing the object tree and garbage-collecting orphaned resources (like images) that were only used on that page.",
                  "By lowering the resolution of remaining pages.",
                  "By stripping out all metadata."
                ],
                correctIndex: 1,
                explanation: "Proper PDF manipulation requires garbage collection to remove unreachable objects, otherwise the deleted page's images and fonts remain hidden inside the file."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
