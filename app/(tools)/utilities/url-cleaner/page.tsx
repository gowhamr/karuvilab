import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import URLCleanerClientWrapper from './URLCleanerClientWrapper';

const toolId = 'url-cleaner';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="URL Cleaner / UTM Stripper"
      description="Remove UTM tags, fbclid, gclid and other tracking parameters from URLs."
      category={cat}
      toolId={toolId}
    >
      <URLCleanerClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-utm"
          title="How it Works: URL Tracking Parameters"
          preview="Learn how companies track you across the internet using just the URL string."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Have you ever noticed that when you click a link on Twitter or in an email, the URL suddenly expands to include a massive string of random characters? For example:
            </p>
            <p><code>https://example.com/shoes?utm_source=twitter&amp;utm_medium=social&amp;utm_campaign=summer_sale</code></p>
            <h3>UTM Parameters</h3>
            <p>
              UTM (Urchin Tracking Module) parameters were created by Urchin Software (which was later acquired and became Google Analytics). They allow marketers to track exactly where a user came from. If you copy that massive URL and send it to your friend in iMessage, Google Analytics will record that <em>two</em> people clicked the link on Twitter, artificially inflating their social media metrics and linking your friend's browsing session to yours.
            </p>
            <h3>Click IDs (fbclid, gclid)</h3>
            <p>
              Modern ad networks (like Facebook and Google Ads) go a step further. Instead of generic tags, they append a unique cryptographic identifier to every single click (e.g., <code>fbclid=IwAR3...</code>). This ID maps directly to your personal user profile in their database.
            </p>
            <p>
              This tool parses the <code>URLSearchParams</code> of the string and systematically strips out known tracking parameter keys, leaving you with the original, clean canonical URL.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
