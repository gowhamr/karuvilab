import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import OgPreviewClientWrapper from './OgPreviewClientWrapper';

const toolId = 'og-preview';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Open Graph Preview"
      description="Preview how your web page appears when shared on social platforms like Twitter, Facebook, and LinkedIn."
      category={cat}
      toolId={toolId}
    >
      <OgPreviewClientWrapper />
    </ToolShell>
  );
}
