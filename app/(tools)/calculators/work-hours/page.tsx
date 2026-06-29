import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import WorkHoursClientWrapper from './WorkHoursClientWrapper';

const toolId = 'work-hours';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Work Hours Tracker"
      description="Log daily work sessions and track total hours and overtime."
      category={cat}
      toolId={toolId}
    >
      <WorkHoursClientWrapper />
    </ToolShell>
  );
}
