import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import DiffCheckerClientWrapper from './DiffCheckerClientWrapper';

const toolId = 'diff-checker';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Diff Checker"
      description="Compare two text blocks line by line. Added lines in green, removed in red."
      category={cat}
      toolId={toolId}
    >
      <DiffCheckerClientWrapper />
    </ToolShell>
  );
}
