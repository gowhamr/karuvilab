import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
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
    </ToolShell>
  );
}
