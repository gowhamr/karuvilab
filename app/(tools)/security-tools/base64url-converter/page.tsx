import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import Base64UrlClientWrapper from './Base64UrlClientWrapper';

const toolId = 'base64url-converter';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Base64URL Converter"
      description="Bi-directional Base64URL (RFC 4648) encoder & decoder for JWTs, tokens, and web URLs with padding controls."
      category={cat}
      toolId={toolId}
    >
      <Base64UrlClientWrapper />
    </ToolShell>
  );
}
