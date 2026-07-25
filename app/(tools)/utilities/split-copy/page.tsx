import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import SplitCopyClientWrapper from './SplitCopyClientWrapper';

const toolId = 'split-copy';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Split & Copy"
      description="Break long text into chunks and copy each part individually."
      category={cat}
      toolId={toolId}
    >
      <SplitCopyClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-clipboard"
          title="How it Works: The Async Clipboard API"
          preview="Learn how modern web browsers handle copying to your system clipboard securely."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In the past, websites used a hacky command called <code>document.execCommand('copy')</code> to copy text. This worked by creating an invisible text input, focusing it, selecting the text, and simulating a Ctrl+C keystroke. It was unreliable and synchronous (blocking the main thread).
            </p>
            <h3>The Modern Approach</h3>
            <p>
              This tool uses the modern <code>navigator.clipboard.writeText()</code> API. It is <strong>asynchronous</strong>, meaning it doesn't freeze the page while it waits for the operating system to confirm the copy operation.
            </p>
            <h3>Security Constraints</h3>
            <p>
              The Clipboard API is powerful, so browsers restrict it heavily:
            </p>
            <ul>
              <li><strong>Secure Context:</strong> It only works on pages served over HTTPS (or localhost).</li>
              <li><strong>Transient Activation:</strong> You cannot trigger a copy operation programmatically on a timer. The API will immediately throw a <code>NotAllowedError</code> unless the copy was triggered by a direct user gesture (like a click event).</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
