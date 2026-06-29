import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import GrammarCheckerClientWrapper from './GrammarCheckerClientWrapper';

const toolId = 'grammar-checker';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Grammar Checker"
      description="Basic grammar and spelling check. For comprehensive checking, use Grammarly or LanguageTool."
      category={cat}
      toolId={toolId}
    >
      <GrammarCheckerClientWrapper />
    </ToolShell>
  );
}
