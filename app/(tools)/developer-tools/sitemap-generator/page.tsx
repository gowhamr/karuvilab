import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import SitemapClientWrapper from './SitemapClientWrapper';

const toolId = 'sitemap-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="XML Sitemap Generator"
      description="Generate XML sitemaps for websites with custom URL priorities and change frequencies."
      category={cat}
      toolId={toolId}
    >
      <SitemapClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-sitemap"
          title="How it Works: XML Sitemaps"
          preview="Learn how to tell Google exactly what is on your website without waiting for it to crawl."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you launch a new website, search engines like Google don't automatically know it exists. They have to discover it by following a link from another site that they already index. This process can take weeks.
            </p>
            <h3>The Sitemap Protocol</h3>
            <p>
              An XML Sitemap is a highly structured document that lists every public URL on your website. By submitting this file directly to Google Search Console (or linking it in your <code>robots.txt</code>), you explicitly tell the search engine exactly what pages exist, bypassing the discovery phase.
            </p>
            <h3>Metadata Properties</h3>
            <p>
              Sitemaps don't just list URLs; they provide context using specific XML tags:
            </p>
            <ul>
              <li><code>&lt;lastmod&gt;</code>: Tells the crawler exactly when the content was last updated. If it hasn't changed since the last crawl, Google can save resources by skipping it.</li>
              <li><code>&lt;changefreq&gt;</code>: A hint about how often the page changes (e.g., a news homepage might be <code>hourly</code>, while an old blog post is <code>yearly</code>).</li>
              <li><code>&lt;priority&gt;</code>: A scale from 0.0 to 1.0 indicating how important this page is <em>relative to other pages on your site</em>. It does not affect how you rank against competitors.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
