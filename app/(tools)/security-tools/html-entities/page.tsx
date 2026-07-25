import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import HTMLEntitiesClientWrapper from './HTMLEntitiesClientWrapper';

const toolId = 'html-entities';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="HTML Entities Converter"
      description="Encode special characters to HTML entities or decode HTML entities back to text."
      category={cat}
      toolId={toolId}
    >
      <HTMLEntitiesClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-entities"
          title="How it Works: Escaping Reserved Characters"
          preview="Learn how HTML entities prevent injection attacks."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              HTML is a markup language built heavily on a few reserved characters, most notably <code>&lt;</code>, <code>&gt;</code>, and <code>&amp;</code>. When a browser sees a <code>&lt;</code>, it assumes you are trying to open an HTML tag.
            </p>
            <h3>Displaying Code on the Web</h3>
            <p>
              But what if you are writing a programming tutorial and actually want to show the user the string <code>&lt;div&gt;</code> on the screen? If you put that directly into your HTML, the browser will interpret it as a real, invisible layout container instead of text.
            </p>
            <p>
              To fix this, you must "encode" the reserved characters. You replace <code>&lt;</code> with its HTML entity equivalent: <code>&amp;lt;</code>. The browser knows that <code>&amp;lt;</code> is meant to be displayed visually as a less-than sign, not executed as code.
            </p>
            <h3>Security (XSS)</h3>
            <p>
              Encoding is the primary defense against Cross-Site Scripting (XSS). If a malicious user sets their username to <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>, and you render it unencoded on their profile page, the browser will execute their script. If you encode it to <code>&amp;lt;script&amp;gt;...</code>, it safely renders as harmless text.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
