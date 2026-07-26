import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import EditMetadataClientWrapper from '@/src/features/edit-metadata/edit-metadataClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "edit-metadata";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Edit PDF Metadata"
      description="View and modify the hidden properties, author, and title of your PDF."
      category={cat}
    >
      <EditMetadataClientWrapper />

      <LearningHub title="Understanding the Document Information Dictionary">
        
        <LearningSection type="architecture" title="Hidden Properties">
          <p>Metadata isn't written on the physical pages of your PDF; it is stored in a hidden, internal data structure called the <strong>Document Information Dictionary</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Standard Dictionary Keys">
          <p>This dictionary contains standard keys defined by the PDF specification, such as <code>/Title</code>, <code>/Author</code>, <code>/Subject</code>, and <code>/Keywords</code>.</p>
          <p className="mt-2">When you edit the metadata using this tool, you are not modifying the visible text of the document. You are directly manipulating these raw dictionary entries in the file's trailer.</p>
        </LearningSection>

        <LearningSection type="performance" title="Strings and Text Encoding">
          <p>In a PDF, metadata strings can be tricky because they often use specific text encodings (like UTF-16BE) to support international characters, emojis, or symbols.</p>
          <p className="mt-2">Our WebAssembly engine handles this complex encoding translation automatically. When you type in a new Author name, the tool correctly encodes it into the PDF string format so you can safely enter foreign characters without corrupting the file structure.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Where is PDF metadata actually stored?",
                options: [
                  "On the first page of the document.",
                  "In the Document Information Dictionary.",
                  "In the filename.",
                  "In a separate .xml file attached to the PDF."
                ],
                correctIndex: 1,
                explanation: "The Document Information Dictionary is a specialized structure at the end of the PDF file (near the cross-reference table) that holds key-value pairs for metadata."
              },
              {
                question: "If you change the 'Title' metadata using this tool, what happens to the visible text on the cover page of the PDF?",
                options: [
                  "The cover page text is automatically updated.",
                  "Nothing. Metadata is independent of the visual page content.",
                  "The cover page text is deleted.",
                  "The font of the cover page changes."
                ],
                correctIndex: 1,
                explanation: "Metadata describes the document to the operating system and search engines. It does not affect the visual rendering instructions (text, paths, images) drawn on the pages."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
