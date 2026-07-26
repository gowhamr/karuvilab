import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding XML Sitemaps">
        
        <LearningSection type="architecture" title="The Discovery Problem">
          <p>When you launch a new website or publish a new page, search engines like Google don't automatically know it exists. They have to discover it by following a link from another site that they already index. This organic discovery process can take days or weeks.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The XML Solution">
          <p>An XML Sitemap is a highly structured document that explicitly lists every public URL on your website. By submitting this file directly to Google Search Console (or referencing it in your <code>robots.txt</code>), you proactively tell the search engine exactly what pages exist, completely bypassing the slow discovery phase.</p>
        </LearningSection>

        <LearningSection type="standards" title="Sitemap Metadata">
          <p>Sitemaps don't just list URLs; they provide context using specific XML tags:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><code>&lt;lastmod&gt;</code>: Tells the crawler exactly when the content was last updated. If it hasn't changed since the last crawl, Google saves resources by skipping it.</li>
            <li><code>&lt;changefreq&gt;</code>: A hint about how often the page changes (e.g., a news homepage might be <code>hourly</code>, while an old blog post is <code>yearly</code>).</li>
            <li><code>&lt;priority&gt;</code>: A scale from 0.0 to 1.0 indicating how important this page is <strong>relative to other pages on your own site</strong>. (It does not affect how you rank against competitors).</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary benefit of submitting an XML Sitemap to Google Search Console?",
                options: [
                  "It guarantees that Google will rank your site on the first page.",
                  "It allows you to bypass the slow process of organic link discovery, telling Google exactly where your pages are immediately.",
                  "It prevents malicious bots from scraping your website.",
                  "It converts your HTML pages into XML."
                ],
                correctIndex: 1,
                explanation: "Sitemaps explicitly hand the search engine a map of your site, ensuring all URLs are discovered instantly without waiting for the crawler to find them via links."
              },
              {
                question: "If you set the <priority> tag of a page to '1.0' (the maximum), what happens?",
                options: [
                  "Google will rank that page above your competitors in search results.",
                  "Google will crawl that page more frequently.",
                  "It signals to Google that this page is the most important page relative to the *other* pages on your own site.",
                  "It forces Google to index the page immediately."
                ],
                correctIndex: 2,
                explanation: "The priority tag is strictly relative to your own domain. Setting everything to 1.0 is useless. It helps Google decide which of YOUR pages to crawl first if it has limited time."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
