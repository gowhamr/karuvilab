import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import URLEncoderClientWrapper from './URLEncoderClientWrapper';

const toolId = 'url-encoder';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="URL Encoder / Decoder"
      description="Encode or decode URL components using encodeURIComponent / decodeURIComponent."
      category={cat}
      toolId={toolId}
    >
      <URLEncoderClientWrapper />
    </ToolShell>
  );
}
