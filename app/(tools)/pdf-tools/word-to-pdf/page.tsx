import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-ooxml"
          title="How it Works: OOXML to PDF Mapping"
          preview="Learn the complex translation between a fluid Word document and a fixed PDF layout."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A <code>.docx</code> file is actually a ZIP archive containing XML files (following the Office Open XML standard). These XML files describe fluid text paragraphs, margins, and inline images, but they do <strong>not</strong> define exact pixel coordinates.
            </p>
            <p>
              A PDF, however, is a rigid coordinate system. To convert Word to PDF, our engine has to act like a mini web browser: it parses the XML, calculates the line-wrapping of paragraphs based on page margins, and translates those fluid paragraphs into exact <code>(X, Y)</code> coordinate plotting instructions required by the PDF format.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-fonts"
          title="Font Substitution & Privacy"
          preview="Why Word-to-PDF converters sometimes change your fonts."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If your Word document uses a proprietary font (like Microsoft Calibri or Times New Roman), the PDF needs to embed that font file so it renders correctly on devices that don't have it installed.
            </p>
            <ul>
              <li><strong>Zero Upload Privacy:</strong> Most Word-to-PDF converters upload your document to a cloud server (like AWS) which has Microsoft Office installed on it to generate the PDF. This exposes your private documents.</li>
              <li><strong>Local Rendering:</strong> Our tool renders the layout entirely in your browser. If a proprietary font isn't available on your local system, it automatically falls back to an open-source metric-compatible alternative (like Carlito for Calibri), ensuring perfect layout retention without sacrificing your privacy.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
