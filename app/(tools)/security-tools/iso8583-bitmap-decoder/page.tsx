import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ISO8583BitmapClientWrapper from './ISO8583BitmapClientWrapper';

const toolId = 'iso8583-bitmap-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ISO 8583 Bitmap Decoder & Builder"
      description="Decode ISO 8583 primary and secondary hex bitmaps into field presence indicators, or build hex bitmaps visually."
      category={cat}
      toolId={toolId}
    >
      <ISO8583BitmapClientWrapper />
    </ToolShell>
  );
}
