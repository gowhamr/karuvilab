import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import RegexTesterClientWrapper from './RegexTesterClientWrapper';

const toolId = 'regex';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Regex Tester"
      description="Test regular expressions with live match highlighting, match positions, and capture groups."
      category={cat}
      toolId={toolId}
    >
      <RegexTesterClientWrapper />
    </ToolShell>
  );
}
