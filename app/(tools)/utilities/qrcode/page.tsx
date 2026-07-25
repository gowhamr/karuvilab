import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-qrcode"
          title="How it Works: Error Correction in QR Codes"
          preview="Learn how a QR code can still be scanned even if part of it is ripped off or covered."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike standard barcodes that just hold a number, QR (Quick Response) codes are essentially 2D matrices that can store entire URLs or paragraphs of text. But their most magical feature is <strong>Error Correction</strong>.
            </p>
            <h3>Reed-Solomon Error Correction</h3>
            <p>
              When a QR code is generated, the underlying algorithm (Reed-Solomon) doesn't just encode your data; it adds mathematical backup data (parity). This means that if a physical QR code is scratched, dirty, or ripped, a scanner can use the surviving data points to mathematically reconstruct the missing parts.
            </p>
            <h3>Error Correction Levels</h3>
            <p>
              You can choose how much backup data to include, which determines how "dense" the QR code looks:
            </p>
            <ul>
              <li><strong>Low (L)</strong>: Can restore ~7% of missing data. Best for small, clean screens.</li>
              <li><strong>Medium (M)</strong>: Can restore ~15% of missing data. The standard default.</li>
              <li><strong>Quartile (Q)</strong>: Can restore ~25% of missing data.</li>
              <li><strong>High (H)</strong>: Can restore ~30% of missing data. Best for industrial environments where the code might get dirty.</li>
            </ul>
            <p>
              Because of Error Correction Level H, marketers are able to place their logos smack in the middle of a QR code (obscuring the pixels there) while the code remains perfectly scannable.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
