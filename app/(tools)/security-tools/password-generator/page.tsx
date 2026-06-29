import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import PasswordGeneratorClientWrapper from './PasswordGeneratorClientWrapper';

const toolId = 'password-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Password Generator"
      description="Generate strong, random passwords with customizable options."
      category={cat}
      toolId={toolId}
    >
      <PasswordGeneratorClientWrapper />
    </ToolShell>
  );
}
