import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import GSTCalculatorClientWrapper from './GSTCalculatorClientWrapper';

const toolId = 'gst-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="GST Calculator"
      description="Add or remove GST from any amount. View all GST slab breakdowns."
      category={cat}
      toolId={toolId}
    >
      <GSTCalculatorClientWrapper />
    </ToolShell>
  );
}
