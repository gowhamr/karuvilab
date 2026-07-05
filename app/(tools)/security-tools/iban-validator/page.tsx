import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import IbanClientWrapper from './IbanClientWrapper';

const toolId = 'iban-validator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="IBAN & SWIFT/BIC Code Validator"
      description="Validate International Bank Account Numbers (IBAN) using ISO 13616 Mod-97 and verify SWIFT/BIC codes."
      category={cat}
      toolId={toolId}
    >
      <IbanClientWrapper />
    </ToolShell>
  );
}
