import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import QRCodeGeneratorClientWrapper from './QRCodeGeneratorClientWrapper';

const toolId = 'qrcode';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="QR Code Generator"
      description="Generate QR codes from any URL or text. Processing is 100% local — no internet access required."
      category={cat}
      toolId={toolId}
    >
      <QRCodeGeneratorClientWrapper />

      <LearningHub title="Understanding QR Codes and Error Correction">
        
        <LearningSection type="architecture" title="2D Matrices vs Barcodes">
          <p>Unlike standard 1D barcodes that usually just hold a short string of numbers, QR (Quick Response) codes are essentially 2D matrices that can store entire URLs, paragraphs of text, or binary data up to a few kilobytes.</p>
          <p className="mt-2">But their most powerful feature—and the reason they are so ubiquitous in the real world—is <strong>Error Correction</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Reed-Solomon Error Correction">
          <p>When a QR code is generated, the underlying algorithm (Reed-Solomon) doesn't just encode your data; it adds mathematical backup data (parity).</p>
          <p className="mt-2">This means that if a physical QR code is scratched, printed poorly, or partially ripped, a scanner can use the surviving data points to mathematically reconstruct the missing parts.</p>
        </LearningSection>

        <LearningSection type="performance" title="Error Correction Levels">
          <p>You can configure how much backup data to include, which determines how "dense" (complex) the QR code looks:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Low (L)</strong>: Restores ~7% of missing data. Creates a simpler code, best for small, clean screens.</li>
            <li><strong>Medium (M)</strong>: Restores ~15% of missing data. The standard default for most generators.</li>
            <li><strong>Quartile (Q)</strong>: Restores ~25% of missing data.</li>
            <li><strong>High (H)</strong>: Restores ~30% of missing data. Creates a very dense code, best for industrial environments where the code might get dirty.</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How are marketers able to place their brand logo right in the middle of a QR code (obscuring the pixels there) without breaking the code?",
                options: [
                  "The scanner ignores the center of the code.",
                  "They use Error Correction Level High (H), so the scanner mathematically reconstructs the data hidden beneath the logo.",
                  "The logo is made of special transparent pixels.",
                  "The QR code links to an AI that guesses the missing parts."
                ],
                correctIndex: 1,
                explanation: "By utilizing 30% error correction, you can safely 'destroy' the middle 10% of the code by placing a logo over it, and scanners will still read it perfectly."
              },
              {
                question: "Which algorithm provides the error correction capability for QR codes?",
                options: [
                  "RSA Encryption",
                  "AES-256",
                  "Reed-Solomon",
                  "Brotli Compression"
                ],
                correctIndex: 2,
                explanation: "The Reed-Solomon error correction algorithm is what allows 2D barcodes, CDs, and DVDs to recover from physical scratches and data loss."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
