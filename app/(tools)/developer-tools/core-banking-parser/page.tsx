import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { coreBankingParser } from '@/src/registry/tools/core-banking-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(coreBankingParser.id);

export default function CoreBankingParserPage() {
  return (
    <ToolShell 
      toolId={coreBankingParser.id}
      title={coreBankingParser.name}
      description={coreBankingParser.desc}
      category={cat}
    >
      <ToolClientWrapper />
    </ToolShell>
  );
}
