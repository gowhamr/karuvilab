import { Metadata } from 'next';
import { swiftMtMx } from '@/src/registry/tools/swift-mt-mx';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export const metadata: Metadata = generateToolMetadata(swiftMtMx.id);

export default function SwiftMtMxPage() {
  return (
    <ToolShell toolId={swiftMtMx.id}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
