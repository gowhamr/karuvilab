import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SamlClientWrapper from './SamlClientWrapper';

const toolId = 'saml-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SAML Request & Assertion Decoder"
      description="Decode Base64/URL encoded SAML2 Requests and Responses into formatted XML with extracted attributes."
      category={cat}
      toolId={toolId}
    >
      <SamlClientWrapper />
    </ToolShell>
  );
}
