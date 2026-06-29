import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import CodeFormatterClientWrapper from './CodeFormatterClientWrapper';

const toolId = 'format';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Code Formatter"
      description="Format JSON, HTML, CSS, SQL, and Markdown. Note: for production-quality formatting, consider Prettier locally."
      category={cat}
      toolId={toolId}
    >
      <CodeFormatterClientWrapper />
    </ToolShell>
  );
}
