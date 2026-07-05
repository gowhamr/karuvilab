import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import CardMaskerClientWrapper from './CardMaskerClientWrapper';

const toolId = 'card-masker';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Credit Card & PAN Masker"
      description="Mask primary account numbers (PAN) for PCI-DSS compliance and secure logging (First 6 / Last 4 formatting)."
      category={cat}
      toolId={toolId}
    >
      <CardMaskerClientWrapper />
    </ToolShell>
  );
}
