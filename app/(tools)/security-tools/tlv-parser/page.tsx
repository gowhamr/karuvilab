import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import TlvParserClientWrapper from './TlvParserClientWrapper';

const toolId = 'tlv-parser';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="EMV TLV Parser"
      description="Parse Tag-Length-Value (TLV / BER-TLV) hex data streams from EMV chip cards and payment terminals."
      category={cat}
      toolId={toolId}
    >
      <TlvParserClientWrapper />
    </ToolShell>
  );
}
