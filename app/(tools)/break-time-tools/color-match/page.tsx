import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ColorMatchClientWrapper from './ColorMatchClientWrapper';

const toolId = 'color-match';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Color Match"
      description="Pick the exact matching color swatch from similar options under time pressure. Test and train your visual acuity and color sensitivity."
      category={cat}
      toolId={toolId}
    >
      <ColorMatchClientWrapper />
    </ToolShell>
  );
}
