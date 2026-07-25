import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import LoremIpsumWrapper from './LoremIpsumWrapper';

const toolId = 'lorem-ipsum';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text."
      category={cat}
      toolId={toolId}
    >
      <LoremIpsumWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-lorem"
          title="How it Works: The Purpose of Placeholder Text"
          preview="Learn why designers have used scrambled Latin since the 1500s."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. It comes from Cicero's "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil).
            </p>
            <h3>Visual Design vs Content</h3>
            <p>
              When a designer is building a layout, they need text to test fonts, line heights, and spacing. If they use real English text (like "Welcome to our website..."), reviewers inevitably get distracted reading the content and arguing about the copywriting instead of evaluating the visual design.
            </p>
            <p>
              If they use "asdf asdf asdf", the word lengths are unnatural, ruining the visual distribution of letters. Lorem Ipsum provides the perfect balance: a normal distribution of letters and word lengths that looks exactly like real language, but is completely unreadable, forcing the brain to focus entirely on the typography.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
