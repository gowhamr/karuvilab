import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import PdfEditorClientWrapper from './PdfEditorClientWrapper';

const toolId = 'pdf-editor';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PDF Editor"
      description="View and annotate PDF documents. Add text, shapes, and black out sensitive information."
      category={cat}
      toolId={toolId}
    >
      <PdfEditorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-annotations"
          title="How it Works: The Annotations Array"
          preview="Learn the difference between editing a PDF and annotating it."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              True PDF "editing" (changing the original text of a document) is notoriously difficult because PDFs don't store fluid text; they store absolute X/Y coordinates for every letter.
            </p>
            <p>
              Instead of altering the underlying text stream, most PDF Editors (including this one) rely on <strong>Annotations</strong> (<code>/Annots</code>). When you draw a circle or add a text box over a PDF, the original document is untouched. The editor simply appends an Annotation dictionary to the page object. This is a non-destructive overlay that sits on top of the original canvas.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-flattening"
          title="Security Warning: Flattening vs Redaction"
          preview="Why drawing a black box over text does not actually erase it."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If you draw a black rectangle over a Social Security Number to censor it, the underlying text is still in the file. Anyone who opens the PDF can just move or delete your black rectangle.
            </p>
            <h3>Flattening</h3>
            <p>
              To make your drawings permanent, you must <strong>Flatten</strong> the PDF. Flattening takes all the interactive annotations and "bakes" them directly into the primary content stream, deleting the interactive objects. 
            </p>
            <p>
              <em>Note: Even flattening is not a true cryptographic redaction. The text underneath the black box may still exist in the data stream. For true redaction, use our Crop/Redact tools which physically scrub the underlying data.</em>
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
