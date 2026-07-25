import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import OgPreviewClientWrapper from './OgPreviewClientWrapper';

const toolId = 'og-preview';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Open Graph Preview"
      description="Preview how your web page appears when shared on social platforms like Twitter, Facebook, and LinkedIn."
      category={cat}
      toolId={toolId}
    >
      <OgPreviewClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-og"
          title="How it Works: The Open Graph Protocol"
          preview="Learn how social media platforms generate rich preview cards when you paste a link."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you paste a URL into a tweet or a Slack message, the app instantly generates a beautiful preview card with an image, a title, and a description. How does it know what image to use?
            </p>
            <h3>The Open Graph Protocol (OG)</h3>
            <p>
              Created by Facebook in 2010, the Open Graph protocol allows webmasters to declare rich metadata about their pages using hidden <code>&lt;meta&gt;</code> tags in the HTML <code>&lt;head&gt;</code>.
            </p>
            <p>
              A typical OG implementation looks like this:
            </p>
            <pre><code>
&lt;meta property="og:title" content="My Amazing Article" /&gt;
&lt;meta property="og:description" content="A brief summary." /&gt;
&lt;meta property="og:image" content="https://example.com/hero.jpg" /&gt;
            </code></pre>
            <h3>Twitter Cards</h3>
            <p>
              While almost all platforms support OG tags, Twitter also has its own proprietary format called Twitter Cards (e.g., <code>&lt;meta name="twitter:card" content="summary_large_image"&gt;</code>). If Twitter tags are missing, Twitter will usually fall back to the Open Graph tags.
            </p>
            <p>
              This tool fetches the raw HTML of a target URL, parses the <code>&lt;head&gt;</code>, and simulates how different platforms will render the resulting preview card based on their specific rules and image aspect ratios.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
