import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageBase64ClientWrapper from './ImageBase64ClientWrapper';

const toolId = 'image-base64';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image to Base64"
      description="Encode images as Base64 data URIs or decode data URIs back to images."
      category={cat}
      toolId={toolId}
    >
      <ImageBase64ClientWrapper />
    </ToolShell>
  );
}
