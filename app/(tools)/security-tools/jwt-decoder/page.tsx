import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import JWTDecoderClientWrapper from './JWTDecoderClientWrapper';

const toolId = 'jwt-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens — header, payload claims, and expiry status."
      category={cat}
      toolId={toolId}
    >
      <JWTDecoderClientWrapper />
    </ToolShell>
  );
}
