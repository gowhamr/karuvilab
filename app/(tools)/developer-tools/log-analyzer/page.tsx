import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import LogAnalyzerClientWrapper from './LogAnalyzerClientWrapper';

const toolId = 'log-analyzer';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Log File Analyzer & Parser"
      description="Parse, search, filter by severity level, extract IP metrics, and analyze server and application logs locally."
      category={cat}
      toolId={toolId}
    >
      <LogAnalyzerClientWrapper />
    </ToolShell>
  );
}
