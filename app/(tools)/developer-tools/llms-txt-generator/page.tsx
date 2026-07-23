import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';

const toolId = 'llms-txt-generator';
const cat = CATEGORIES.find(c => c.id === 'seo');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="LLMs.txt Generator"
      description="Generate llms.txt files to provide instructions and metadata for AI Agents navigating your site."
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />
    </ToolShell>
  );
}
