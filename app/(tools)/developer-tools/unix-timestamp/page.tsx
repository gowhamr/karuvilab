import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import UnixTimestampWrapper from './UnixTimestampWrapper';

const toolId = 'unix-timestamp';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and back."
      category={cat}
      toolId={toolId}
    >
      <UnixTimestampWrapper />
    </ToolShell>
  );
}
