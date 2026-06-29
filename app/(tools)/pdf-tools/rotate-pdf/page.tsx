import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import RotatePdfClientWrapper from './RotatePdfClientWrapper';

const toolId = 'rotate-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Rotate PDF"
      description="Rotate one or all pages of a PDF by 90°, 180°, or 270°."
      category={cat}
      toolId={toolId}
    >
      <RotatePdfClientWrapper />
    </ToolShell>
  );
}
