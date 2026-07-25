import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import GrammarCheckerClientWrapper from '@/src/features/grammar-checker/GrammarCheckerClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("grammar-checker");
}

export default function Page() {
  return (
    <ToolShell toolId="grammar-checker" title="Grammar & Spell Checker">
      <GrammarCheckerClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-grammar"
          title="How it Works: Natural Language Processing (NLP)"
          preview="Learn how algorithms check your grammar without reading your text like a human."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you use a tool like Grammarly, your text is sent to a remote server where massive AI models analyze it. While powerful, this means a third-party company is logging everything you write.
            </p>
            <h3>Rule-Based Parsing</h3>
            <p>
              This tool takes a different approach by utilizing <strong>LanguageTool</strong>, an open-source grammar checker. Rather than relying entirely on AI, it uses thousands of hand-crafted XML rules written by linguists to detect patterns.
            </p>
            <p>
              For example, it has a rule that says: <em>If the word "an" is followed by a word starting with a consonant sound, flag it as an error.</em>
            </p>
            <h3>Privacy First</h3>
            <p>
              By using an open-source API (or running it locally in a WASM environment when supported), your sensitive emails and documents are checked against these linguistic rules without being fed into a permanent machine learning training dataset.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
