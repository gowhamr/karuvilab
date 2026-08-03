import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';

const toolId = 'ai-pdf-cleanup';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AI PDF Cleanup & Document Intelligence"
      description="Clean, deskew, denoise, and make scanned PDF documents searchable using in-browser computer vision"
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />
    </ToolShell>
  );
}
