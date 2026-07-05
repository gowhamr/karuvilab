import { Metadata } from 'next';
import { coreBankingParser } from '@/src/registry/tools/core-banking-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export const metadata: Metadata = generateToolMetadata(coreBankingParser);

export default function CoreBankingParserPage() {
  return (
    <ToolShell toolId={coreBankingParser.id}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
