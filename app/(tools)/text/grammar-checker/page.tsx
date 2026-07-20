import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import GrammarCheckerClientWrapper from '@/src/features/grammar-checker/GrammarCheckerClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("grammar-checker");
}

export default function Page() {
  return (
    <ToolShell toolId="grammar-checker" title="Grammar & Spell Checker">
      <GrammarCheckerClientWrapper />
    </ToolShell>
  );
}
