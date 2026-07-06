import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { emvTlvTree } from '@/src/registry/tools/emv-tlv-tree';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(emvTlvTree.id);

export default function EmvTlvTreePage() {
  return (
    <ToolShell title={emvTlvTree.name} toolId={emvTlvTree.id} category={cat}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
