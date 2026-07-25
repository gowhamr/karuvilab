import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import MetaTagsClientWrapper from './MetaTagsClientWrapper';

const toolId = 'meta-tags';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Meta Tags Generator"
      description="Build, preview, and generate meta tags for your website."
      category={cat}
      toolId={toolId}
    >
      <MetaTagsClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-og"
          title="How it Works: The Open Graph Protocol"
          preview="Learn how social media sites extract rich preview cards from your links."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you paste a link into iMessage, Twitter, or Slack, the app doesn't just show the raw URL. It instantly fetches a beautiful "preview card" with an image, title, and description. How does it know what image to use?
            </p>
            <h3>The Open Graph Standard</h3>
            <p>
              In 2010, Facebook introduced the <strong>Open Graph (OG) protocol</strong> to solve this exact problem. By adding specific <code>&lt;meta property="og:image"&gt;</code> tags to the <code>&lt;head&gt;</code> of your HTML, you can explicitly tell social scrapers exactly which title, description, and thumbnail represent that specific page.
            </p>
            <p>
              Because it was so effective, nearly every other platform (LinkedIn, Discord, Slack) adopted it. Twitter also created their own set of tags (<code>twitter:card</code>), but they will fall back to reading your <code>og:</code> tags if the Twitter ones are missing. Properly configuring these tags is arguably the single most important step for social media distribution.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
