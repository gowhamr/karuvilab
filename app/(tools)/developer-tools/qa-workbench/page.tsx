import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import QAWorkbenchClientWrapper from '@/src/features/qa-workbench/components/QAWorkbenchClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("qa-workbench");
}

export default function Page() {
  return (
    <ToolShell toolId="qa-workbench" title="QA Workbench">
      <QAWorkbenchClientWrapper />
    </ToolShell>
  );
}
