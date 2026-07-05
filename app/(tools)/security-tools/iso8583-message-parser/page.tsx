import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ISO8583ParserClientWrapper from './ISO8583ParserClientWrapper';

const toolId = 'iso8583-message-parser';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ISO 8583 Message Parser"
      description="Parse financial ISO 8583 payment messages, MTI, bitmaps, and data elements directly in your browser."
      category={cat}
      toolId={toolId}
    >
      <ISO8583ParserClientWrapper />
    </ToolShell>
  );
}
