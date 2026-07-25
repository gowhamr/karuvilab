import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import URLEncoderClientWrapper from './URLEncoderClientWrapper';

const toolId = 'url-encoder';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="URL Encoder / Decoder"
      description="Encode or decode URL components using encodeURIComponent / decodeURIComponent."
      category={cat}
      toolId={toolId}
    >
      <URLEncoderClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-url"
          title="How it Works: URI vs URI Component"
          preview="Learn the difference between encodeURI and encodeURIComponent."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              URLs (Uniform Resource Locators) can only be sent over the Internet using the ASCII character-set. If a URL contains characters outside the ASCII set (like spaces or emojis), the browser must convert them into a valid ASCII format. This is done by replacing the unsafe character with a <code>%</code> followed by two hexadecimal digits.
            </p>
            <h3>encodeURI vs encodeURIComponent</h3>
            <p>
              Developers often confuse the two native JavaScript encoding functions, leading to broken links.
            </p>
            <ul>
              <li><strong>encodeURI():</strong> Used to encode an <em>entire</em> URL (like <code>https://example.com/my page</code>). It intentionally ignores characters that have special meaning in a URL, like <code>:</code>, <code>/</code>, <code>?</code>, and <code>&</code>, so the link still functions.</li>
              <li><strong>encodeURIComponent():</strong> Used to encode a specific <em>piece</em> of a URL (like a query parameter). It encodes everything, including <code>/</code> and <code>?</code>. If you try to pass an entire URL through this, it will break the <code>https://</code> into <code>https%3A%2F%2F</code>, destroying the link.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
