import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { swiftMtMx } from '@/src/registry/tools/swift-mt-mx';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(swiftMtMx.id);

export default function SwiftMtMxPage() {
  return (
    <ToolShell title={swiftMtMx.name} toolId={swiftMtMx.id} category={cat}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
