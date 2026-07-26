import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding PDF Editing vs Annotating">
        
        <LearningSection type="architecture" title="Why Editing is Hard">
          <p>True PDF "editing" (like deleting or rewriting the original text of a document) is notoriously difficult because PDFs don't store fluid paragraphs of text.</p>
          <p className="mt-2">A PDF stores absolute X/Y coordinates for almost every letter. If you change a word from "cat" to "elephant", the PDF engine has to recalculate the coordinates for the rest of the line and potentially re-flow the entire page, which is highly complex.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Annotations Array">
          <p>Instead of altering the underlying text stream, most PDF Editors (including this one) rely on <strong>Annotations</strong> (<code>/Annots</code>).</p>
          <p className="mt-2">When you draw a circle or add a text box over a PDF, the original document's content stream is untouched. The editor simply appends an Annotation dictionary to the page object. This acts as a non-destructive, transparent overlay that sits on top of the original canvas.</p>
        </LearningSection>

        <LearningSection type="security" title="Warning: Flattening vs Redaction">
          <p>Because annotations are overlays, if you draw a black rectangle over a Social Security Number to censor it, the underlying text is still embedded in the file. Anyone who opens the PDF in Acrobat can simply select and delete your black rectangle to reveal the text.</p>
          <p className="mt-2">To make drawings permanent, you must <strong>Flatten</strong> the PDF. Flattening takes all interactive annotations and "bakes" them directly into the primary content stream. <em>Note: For true cryptographic redaction (permanently scrubbing the underlying data bytes), use our Redact tool instead of this Editor.</em></p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What happens technically when you draw a shape in this PDF Editor?",
                options: [
                  "The shape becomes part of the original image.",
                  "An Annotation dictionary is appended to the page, acting as an overlay.",
                  "The PDF is converted into a Word document.",
                  "The shape replaces the text underneath it."
                ],
                correctIndex: 1,
                explanation: "Annotations are separate objects overlaid on top of the original page contents, meaning they are non-destructive and editable."
              },
              {
                question: "Is drawing a black box over sensitive text enough to secure it?",
                options: [
                  "Yes, it hides the text from everyone.",
                  "No, the original text is still underneath the overlay and can be exposed if the file is not flattened or properly redacted.",
                  "Yes, as long as you save the file.",
                  "No, because the black box will turn transparent when printed."
                ],
                correctIndex: 1,
                explanation: "Annotations are overlays. Without flattening or explicit redaction, the text remains fully intact and searchable in the file's data stream."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
