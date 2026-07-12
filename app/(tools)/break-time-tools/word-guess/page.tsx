import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import WordGuessClientWrapper from './WordGuessClientWrapper';

const toolId = 'word-guess';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Word Guess"
      description="Guess the secret 5-letter word in 6 attempts. Classic Wordle gameplay with statistics and offline support."
      category={cat}
      toolId={toolId}
    >
      <WordGuessClientWrapper />
    </ToolShell>
  );
}
