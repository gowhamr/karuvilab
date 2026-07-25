import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import TextUtilityClientWrapper from './TextUtilityClientWrapper';

const toolId = 'text-utility';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Text Utility"
      description="Case conversion, line sorting, text cleaning, and character count — all in one place."
      category={cat}
      toolId={toolId}
    >
      <TextUtilityClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-text"
          title="How it Works: String Encoding and Invisible Characters"
          preview="Learn why deleting spaces sometimes doesn't work, and how computers actually store text."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you copy text from a PDF, a Microsoft Word document, or a bloated website, it rarely pastes cleanly into another application. It often contains weird line breaks, extra spaces, or strange symbols.
            </p>
            <h3>Invisible Characters</h3>
            <p>
              Text isn't just letters and numbers. There are dozens of "invisible" characters in the Unicode standard used for formatting. For example:
            </p>
            <ul>
              <li><strong>Zero-width space (U+200B)</strong>: Often inserted by text editors to allow line wrapping without a visible gap. If you paste this into a password field, it will fail, even though the password "looks" correct.</li>
              <li><strong>Non-breaking space (U+00A0)</strong>: Prevents two words from being split across a line break. Standard <code>trim()</code> functions sometimes ignore these.</li>
              <li><strong>Carriage Return (<code>\r</code>) vs Line Feed (<code>\n</code>)</strong>: Windows uses both (<code>\r\n</code>) to start a new line, while Linux/Mac just use <code>\n</code>. Pasting between them often results in double-spacing or completely missing breaks.</li>
            </ul>
            <p>
              This tool helps you normalize these hidden complexities by stripping out the invisible formatting and converting the string into standard UTF-8 text.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
