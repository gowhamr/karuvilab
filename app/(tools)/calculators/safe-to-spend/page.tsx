import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import SafeToSpendClientWrapper from './SafeToSpendClientWrapper';

const toolId = 'safe-to-spend';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Safe-to-Spend"
      description="Plan your monthly budget and find your daily/weekly spending limit."
      category={cat}
      toolId={toolId}
    >
      <SafeToSpendClientWrapper />
    </ToolShell>
  );
}
