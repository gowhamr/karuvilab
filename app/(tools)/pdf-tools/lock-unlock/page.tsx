import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import LockUnlockPdfClientWrapper from './LockUnlockPdfClientWrapper';

const toolId = 'lock-unlock';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lock / Unlock PDF"
      description="Add password protection to a PDF or remove it — all in your browser."
      category={cat}
      toolId={toolId}
    >
      <LockUnlockPdfClientWrapper />
    </ToolShell>
  );
}
