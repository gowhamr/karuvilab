import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfAttachmentsClientWrapper from '@/src/features/pdf-attachments/pdf-attachmentsClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "pdf-attachments";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="PDF Attachments"
      description="View, extract, or remove hidden files attached inside your PDF."
      category={cat}
    >
      <PdfAttachmentsClientWrapper />

      <LearningHub title="Understanding the /EmbeddedFiles Tree">
        
        <LearningSection type="architecture" title="PDFs as Archives">
          <p>Most people think of a PDF as digital paper, but it can actually act a lot like a ZIP archive.</p>
          <p className="mt-2">The PDF specification explicitly allows you to embed arbitrary external files (like Word documents, Excel spreadsheets, XML data, or even other PDFs) completely inside the host file's structure.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Name Tree">
          <p>These attached files are not drawn or stored on the visual pages themselves. They are stored in a specialized data structure in the document's root dictionary called the <strong>Name Tree</strong>.</p>
          <p className="mt-2">Specifically, attachments live in the <code>/EmbeddedFiles</code> node. Each attached file is stored as a compressed binary stream accompanied by a dictionary containing metadata like the filename, creation date, and MIME type.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="Extraction and Decompression">
          <p>When you use this tool to extract an attachment, we use WebAssembly to parse this Name Tree and locate the binary stream associated with the file you clicked.</p>
          <p className="mt-2">If the stream is compressed (usually using the <code>FlateDecode</code> algorithm, which is standard zlib compression), our engine decompresses it in memory and triggers a standard browser download of the raw binary data.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Where are attached files (like an embedded Excel sheet) stored inside a PDF?",
                options: [
                  "As an XObject on Page 1.",
                  "In the /EmbeddedFiles node of the Name Tree.",
                  "In the document's Title metadata.",
                  "At the very end of the file after the EOF marker."
                ],
                correctIndex: 1,
                explanation: "Attachments are kept separate from the visual page content. They are managed by the document-level Name Tree under /EmbeddedFiles."
              },
              {
                question: "If a PDF has a 10MB video attached to it, will the video play automatically when viewing Page 1?",
                options: [
                  "Yes, if the viewer supports video.",
                  "No, attachments are hidden data files that must be explicitly opened or extracted.",
                  "Yes, but only in Adobe Acrobat.",
                  "No, videos cannot be attached to PDFs."
                ],
                correctIndex: 1,
                explanation: "Attachments in the Name Tree are like files inside a ZIP. They do not appear on the pages unless specifically configured as a Rich Media Annotation."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
