import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import RemoveMetadataClientWrapper from '@/src/features/remove-metadata/remove-metadataClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "remove-metadata";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Remove PDF Metadata"
      description="Scrub hidden information, author details, and XMP data from your PDFs."
      category={cat}
    >
      <RemoveMetadataClientWrapper />

      <LearningHub title="Understanding Hidden PDF Data">
        
        <LearningSection type="architecture" title="The Info Dictionary">
          <p>When you create or edit a PDF, software often embeds invisible tracking and author data. This data is stored in a simple key-value dictionary (the legacy PDF 1.0 system).</p>
          <p className="mt-2">It stores fields like <code>/Author</code>, <code>/Title</code>, <code>/Creator</code> (the software used to make the file), and <code>/CreationDate</code>. This tool systematically deletes these keys from the file's root dictionary structure.</p>
        </LearningSection>
        
        <LearningSection type="api" title="XMP Metadata Streams">
          <p>Introduced later by Adobe, <strong>XMP (Extensible Metadata Platform)</strong> is a massive XML payload embedded as a binary stream inside the PDF.</p>
          <p className="mt-2">XMP can contain incredibly detailed histories, including the specific software version used, color swatches, layer names, and even the ID of the camera used to take embedded photos. Our tool locates the <code>/Metadata</code> stream pointer and safely nullifies it, completely destroying the XML payload.</p>
        </LearningSection>

        <LearningSection type="security" title="Why Local Scrubbing is Critical">
          <p>If you are stripping metadata from a document, you are likely doing it for privacy reasons (e.g., whistleblowing, legal discovery, or anonymity).</p>
          <p className="mt-2"><strong>It is highly insecure to upload a document to a remote server to "scrub" it.</strong> The server you upload it to could easily log the exact metadata you are trying to hide before deleting it. By using WebAssembly, this tool performs the memory manipulation entirely on your device. Zero data is transmitted over the internet.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is XMP in the context of a PDF file?",
                options: [
                  "An encryption algorithm.",
                  "A massive XML payload containing detailed history, software versions, and tracking data.",
                  "A type of vector graphic.",
                  "A compression format."
                ],
                correctIndex: 1,
                explanation: "XMP (Extensible Metadata Platform) is an XML-based metadata standard that can embed highly detailed tracking information into the file."
              },
              {
                question: "Why should you never use a cloud-based server to remove metadata from a sensitive document?",
                options: [
                  "Because cloud servers are too slow.",
                  "Because the server could easily log and save the sensitive metadata before deleting it.",
                  "Because it will corrupt the fonts.",
                  "Because it costs too much money."
                ],
                correctIndex: 1,
                explanation: "Uploading a file to a third-party server to 'protect your privacy' defeats the purpose, as the third-party now has full access to the data you were trying to hide."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
