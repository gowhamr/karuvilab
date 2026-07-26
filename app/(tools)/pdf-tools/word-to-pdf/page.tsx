import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import WordToPdfClientWrapper from "./WordToPdfClientWrapper";

const toolId = "word-to-pdf";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function WordToPdfPage() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Word to PDF"
      description="Convert Microsoft Word documents (.docx) to high-quality PDF files instantly. 100% private, browser-based conversion."
      category={cat}
      toolId={toolId}
    >
      <WordToPdfClientWrapper />

      <LearningHub title="Understanding Document Layout Conversion">
        
        <LearningSection type="architecture" title="Fluid vs Fixed Layouts">
          <p>A <code>.docx</code> file is actually a ZIP archive containing XML files (following the Office Open XML standard). These XML files describe fluid text paragraphs, margins, and inline images, but they do <strong>not</strong> define exact pixel coordinates on a page.</p>
          <p className="mt-2">A PDF, however, is a rigid coordinate system. To convert Word to PDF, our engine has to act like a mini web browser: it parses the XML, calculates the line-wrapping of paragraphs based on page margins, and translates those fluid paragraphs into exact <code>(X, Y)</code> coordinate plotting instructions required by the PDF format.</p>
        </LearningSection>
        
        <LearningSection type="security" title="Zero Upload Privacy">
          <p>Most Word-to-PDF converters upload your document to a cloud server (often running Microsoft Office or LibreOffice) to generate the PDF. This exposes your private documents to third parties.</p>
          <p className="mt-2">Our tool parses the OOXML data and renders the layout <strong>entirely inside your browser</strong> using WebAssembly. Your Word document is never uploaded to any server, guaranteeing total privacy.</p>
        </LearningSection>

        <LearningSection type="api" title="Font Substitution Mapping">
          <p>If your Word document uses a proprietary font (like Microsoft Calibri or Times New Roman), the PDF needs to embed that font file so it renders correctly on devices that don't have it installed.</p>
          <p className="mt-2">Because your browser cannot legally extract proprietary fonts from your operating system, our layout engine automatically maps requested fonts to open-source metric-compatible alternatives (like Carlito for Calibri). This ensures perfect line-wrapping and layout retention without violating font licenses or compromising privacy.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary difference between a Word document (.docx) and a PDF file?",
                options: [
                  "Word documents are encrypted, PDFs are not.",
                  "Word documents are fluid XML structures that re-flow text, while PDFs are rigid coordinate-based rendering instructions.",
                  "Word documents can hold images, PDFs only hold text.",
                  "PDFs are made by Microsoft, Word is made by Adobe."
                ],
                correctIndex: 1,
                explanation: "A .docx file just says 'here is a paragraph'. A PDF file says 'draw these specific letters at exact X/Y coordinates on page 2'."
              },
              {
                question: "Why might a browser-based converter use 'Carlito' instead of 'Calibri' when generating a PDF?",
                options: [
                  "Because Carlito is a metric-compatible open-source font that preserves the document's layout without requiring a license for Microsoft's proprietary font.",
                  "Because Carlito looks better.",
                  "Because Calibri is not supported by PDF.",
                  "Because the browser only supports fonts that start with the letter C."
                ],
                correctIndex: 0,
                explanation: "Using metric-compatible open-source fonts allows the tool to generate perfectly laid-out PDFs locally in your browser without needing to upload the file to a licensed server."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
