import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';

const toolId = 'super-resolution';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AI Image Upscaler"
      description="Upscale and enhance images 2x or 4x locally in your browser using Real-ESRGAN local AI"
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />
    </ToolShell>
  );
}
