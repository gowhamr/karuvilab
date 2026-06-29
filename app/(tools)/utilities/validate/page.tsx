import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import FileValidatorClientWrapper from './FileValidatorClientWrapper';

const toolId = 'validate';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="File Validator"
      description="Inspect file metadata, verify magic bytes against extension, and check image dimensions."
      category={cat}
      toolId={toolId}
    >
      <FileValidatorClientWrapper />
    </ToolShell>
  );
}
