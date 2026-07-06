import { Metadata } from 'next';
import { emvTlvTree } from '@/src/registry/tools/emv-tlv-tree';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export const metadata: Metadata = generateToolMetadata(emvTlvTree.id);

export default function EmvTlvTreePage() {
  return (
    <ToolShell title={emvTlvTree.name} toolId={emvTlvTree.id}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
