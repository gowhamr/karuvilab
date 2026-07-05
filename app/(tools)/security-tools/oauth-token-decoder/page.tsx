import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import OAuthClientWrapper from './OAuthClientWrapper';

const toolId = 'oauth-token-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="OAuth 2.0 Token Decoder & Inspector"
      description="Inspect OAuth 2.0 access tokens, identity tokens, scopes, claims, client IDs, and expiration status."
      category={cat}
      toolId={toolId}
    >
      <OAuthClientWrapper />
    </ToolShell>
  );
}
