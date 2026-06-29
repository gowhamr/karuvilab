import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import CrontabEditorWrapper from './CrontabEditorWrapper';

const toolId = 'crontab-editor';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Crontab Editor"
      description="Visual cron schedule editor. Build and understand cron expressions instantly with human-readable preview and next run times. 100% browser-native."
      category={cat}
      toolId={toolId}
    >
      <CrontabEditorWrapper />
    </ToolShell>
  );
}
