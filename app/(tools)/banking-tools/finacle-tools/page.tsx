import { Metadata } from 'next';
import { finacleTools } from '@/src/registry/tools/finacle-tools';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export const metadata: Metadata = generateToolMetadata(finacleTools);

export default function FinacleToolsPage() {
  return (
    <ToolShell toolId={finacleTools.id}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
