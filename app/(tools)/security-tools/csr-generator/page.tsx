import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import CsrClientWrapper from './CsrClientWrapper';

const toolId = 'csr-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="CSR Generator & Inspector"
      description="Generate PKCS#10 Certificate Signing Requests (CSR) and private keys directly inside your browser."
      category={cat}
      toolId={toolId}
    >
      <CsrClientWrapper />
    </ToolShell>
  );
}
