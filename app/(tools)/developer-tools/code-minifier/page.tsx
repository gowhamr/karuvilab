import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import CodeMinifierClientWrapper from './CodeMinifierClientWrapper';

const toolId = 'code-minifier';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Code Minifier"
      description="Remove comments and whitespace from CSS, JavaScript, and HTML. Basic minification — not full AST-level."
      category={cat}
      toolId={toolId}
    >
      <CodeMinifierClientWrapper />
    </ToolShell>
  );
}
