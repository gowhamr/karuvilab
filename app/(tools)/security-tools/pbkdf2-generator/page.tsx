import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import Pbkdf2ClientWrapper from './Pbkdf2ClientWrapper';

const toolId = 'pbkdf2-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="PBKDF2 Key Derivation Generator"
      description="Derive cryptographically strong key bits using Password-Based Key Derivation Function 2 (PBKDF2)."
      category={cat}
      toolId={toolId}
    >
      <Pbkdf2ClientWrapper />
    </ToolShell>
  );
}
