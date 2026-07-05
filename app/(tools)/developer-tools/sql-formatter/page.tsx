import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SqlFormatterClientWrapper from './SqlFormatterClientWrapper';

const toolId = 'sql-formatter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SQL Formatter & Beautifier"
      description="Format, indent, and beautify SQL queries with custom keyword capitalization and indent spaces."
      category={cat}
      toolId={toolId}
    >
      <SqlFormatterClientWrapper />
    </ToolShell>
  );
}
