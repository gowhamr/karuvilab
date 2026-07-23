import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import RobotsTxtClientWrapper from './RobotsTxtClientWrapper';

const toolId = 'robots-txt';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Robots.txt Generator"
      description="Visual robots.txt generator. Create rules for search engines and crawlers."
      category={cat}
      toolId={toolId}
    >
      <RobotsTxtClientWrapper />
    </ToolShell>
  );
}
