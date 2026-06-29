import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import StopwatchClientWrapper from './StopwatchClientWrapper';

const toolId = 'stopwatch';
const cat = CATEGORIES.find(c => c.id === 'productivity');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Stopwatch"
      description="A precise, professional stopwatch with lap tracking and fullscreen dashboard mode."
      category={cat}
      toolId={toolId}
    >
      <StopwatchClientWrapper />
    </ToolShell>
  );
}
