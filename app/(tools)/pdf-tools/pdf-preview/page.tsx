import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfPreviewClientWrapper from '@/src/features/pdf-preview/pdf-previewClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = "pdf-preview";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="PDF Viewer & Preview"
      description="Safely view PDF documents directly in your browser without Adobe Acrobat."
      category={cat}
    >
      <PdfPreviewClientWrapper />

      <LearningHub title="Understanding Secure PDF Rendering">
        
        <LearningSection type="security" title="The Historical Malware Vector">
          <p>Historically, desktop PDF readers like Adobe Acrobat were massive vectors for malware. Because PDFs can contain interactive JavaScript and complex font definitions, hackers would embed malicious payloads or exploit buffer overflows in the C++ font rendering engine to take over users' computers.</p>
        </LearningSection>
        
        <LearningSection type="architecture" title="Sandboxed Rendering">
          <p>When you view a PDF in our tool (which is powered by the Mozilla <code>PDF.js</code> engine), the document is parsed and rendered entirely within the rigid V8 JavaScript engine of your browser.</p>
          <p className="mt-2">This means the PDF parsing engine runs inside the browser's heavily fortified security sandbox.</p>
        </LearningSection>

        <LearningSection type="api" title="Canvas Isolation">
          <p>The PDF engine does not have direct access to your computer's filesystem, memory architecture, or operating system APIs. It is only permitted to draw geometric shapes and pixels onto an HTML5 <code>&lt;canvas&gt;</code> element.</p>
          <p className="mt-2">Even if a PDF contains a malicious exploit specifically designed to crash Adobe Acrobat or run a ransomware payload, our sandboxed browser viewer will safely ignore it, rendering it completely harmless.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is viewing a PDF in a modern browser generally safer than using legacy desktop software?",
                options: [
                  "Because browsers are faster.",
                  "Because browsers execute the PDF parsing within a secure, isolated JavaScript sandbox that cannot access the OS.",
                  "Because browsers delete the PDF immediately.",
                  "Because desktop software requires an internet connection."
                ],
                correctIndex: 1,
                explanation: "The browser sandbox ensures that even if the PDF parser crashes, the malicious code cannot escape the browser and infect the host operating system."
              },
              {
                question: "How does this tool display the PDF visually on the screen?",
                options: [
                  "By opening Adobe Acrobat in the background.",
                  "By parsing the vector instructions and drawing them onto an HTML5 Canvas.",
                  "By converting the entire PDF into a YouTube video.",
                  "By taking a screenshot using a remote server."
                ],
                correctIndex: 1,
                explanation: "PDF.js translates PDF drawing operators into standard HTML5 Canvas 2D API commands."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
