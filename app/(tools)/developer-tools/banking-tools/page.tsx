import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import BankingToolsClientWrapper from './BankingToolsClientWrapper';

const toolId = 'banking-tools';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Banking Tools"
      description="Advanced financial data parsers for EMV, SWIFT, and core banking logs."
      category={cat}
      toolId={toolId}
    >
      <BankingToolsClientWrapper />
    </ToolShell>
  );
}
