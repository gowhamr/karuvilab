import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ImageSeoClientWrapper from './ImageSeoClientWrapper';

const toolId = 'image-seo';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Image SEO & File Renamer"
      description="Generate SEO alt text and optimized filenames for images, PDF, and documents."
      category={cat}
      toolId={toolId}
    >
      <ImageSeoClientWrapper />
    </ToolShell>
  );
}
