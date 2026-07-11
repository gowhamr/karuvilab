import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ReactionTimeClientWrapper from './ReactionTimeClientWrapper';

const toolId = 'reaction-time';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Reaction Time Test"
      description="Test your visual reflexes and measure your reaction time in milliseconds. Track your best and average scores locally."
      category={cat}
      toolId={toolId}
    >
      <ReactionTimeClientWrapper />
    </ToolShell>
  );
}
