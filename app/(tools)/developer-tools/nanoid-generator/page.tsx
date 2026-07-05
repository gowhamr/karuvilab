import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import NanoIdClientWrapper from './NanoIdClientWrapper';

const toolId = 'nanoid-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="NanoID Generator"
      description="Generate URL-friendly, cryptographically secure NanoIDs with customizable length and character sets."
      category={cat}
      toolId={toolId}
    >
      <NanoIdClientWrapper />
    </ToolShell>
  );
}
