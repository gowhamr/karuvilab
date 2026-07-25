import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import SeoTitleClientWrapper from './SeoTitleClientWrapper';

const toolId = 'seo-title';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SEO Title Tester & Pixel Width Counter"
      description="Test SEO title length, character count, and Google SERP pixel width bounds."
      category={cat}
      toolId={toolId}
    >
      <SeoTitleClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-seo-title"
          title="How it Works: Pixel Width vs Character Count"
          preview="Learn why Google truncates your titles even if they are under 60 characters."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When writing a <code>&lt;title&gt;</code> tag for SEO, the common advice is to keep it under 60 characters to prevent Google from truncating it in the search results with an ellipsis (<code>...</code>). However, this advice is technically incorrect.
            </p>
            <h3>Google doesn't count characters</h3>
            <p>
              Google Search results are rendered in a web browser using a proportional font (Arial, typically). In a proportional font, a narrow character like <code>i</code> or <code>l</code> takes up significantly less physical space than a wide character like <code>W</code> or <code>M</code>.
            </p>
            <p>
              Google doesn't truncate based on characters; it truncates based on <strong>pixels</strong>. The maximum width for a desktop search result title is roughly 600 pixels.
            </p>
            <ul>
              <li><code>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</code> (40 characters) will be truncated because it exceeds 600 pixels.</li>
              <li><code>iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</code> (60 characters) will not be truncated because it's only about 170 pixels wide.</li>
            </ul>
            <p>
              This tool uses an invisible canvas and the Arial font to measure the exact pixel width of your string, simulating exactly how Google's rendering engine will calculate the bounds.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
