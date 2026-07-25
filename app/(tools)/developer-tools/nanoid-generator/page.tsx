import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import NanoIdClientWrapper from './NanoIdClientWrapper';

const toolId = 'nanoid-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="NanoID Generator"
      description="Generate URL-friendly, cryptographically secure NanoIDs with customizable length and character sets."
      category={cat}
      toolId={toolId}
    >
      <NanoIdClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-nanoid"
          title="How it Works: NanoID vs UUID"
          preview="Learn why modern developers are abandoning UUIDs for NanoIDs."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              For decades, UUIDs (Universally Unique Identifiers) were the gold standard for generating IDs. However, standard UUIDs are 36 characters long and strictly limited to hexadecimal characters (<code>0-9</code> and <code>a-f</code>).
            </p>
            <h3>Increasing the Alphabet</h3>
            <p>
              NanoID solves the length problem by using a much larger alphabet. By utilizing 64 different characters (<code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>_</code>, <code>-</code>) instead of just 16, NanoID can pack the exact same amount of randomness (entropy) into just 21 characters instead of 36.
            </p>
            <h3>URL Safety</h3>
            <p>
              Standard Base64 encoding uses <code>+</code> and <code>/</code>, which break URLs and require encoding (becoming <code>%2B</code> and <code>%2F</code>). NanoID swaps these out for <code>_</code> and <code>-</code>, ensuring the generated IDs can be safely dropped directly into REST API routes without any escaping.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
