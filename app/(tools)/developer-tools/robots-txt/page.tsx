import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import RobotsTxtClientWrapper from './RobotsTxtClientWrapper';

const toolId = 'robots-txt';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Robots.txt Generator"
      description="Visual robots.txt generator. Create rules for search engines and crawlers."
      category={cat}
      toolId={toolId}
    >
      <RobotsTxtClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-robots"
          title="How it Works: The Robots Exclusion Standard"
          preview="Learn how to control which parts of your site Google is allowed to see."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Search engines like Google and Bing use automated bots (crawlers) to discover and index pages on the web. However, you don't always want every page indexed—for example, your site's admin dashboard, API endpoints, or private user profiles.
            </p>
            <h3>The robots.txt file</h3>
            <p>
              The <code>robots.txt</code> file is a simple text file placed at the root of your domain (e.g., <code>https://example.com/robots.txt</code>). It dictates the rules of engagement for these bots using a protocol called the Robots Exclusion Standard.
            </p>
            <h3>Syntax Basics</h3>
            <ul>
              <li><strong>User-agent:</strong> Specifies which bot the rule applies to. <code>*</code> means all bots, while <code>Googlebot</code> targets only Google.</li>
              <li><strong>Disallow:</strong> Tells the bot not to crawl a specific URL path.</li>
              <li><strong>Allow:</strong> Overrides a Disallow rule for a specific sub-path.</li>
            </ul>
            <p>
              <strong>Security Warning:</strong> <code>robots.txt</code> is a public file. You should never use it to hide secret URLs (like <code>Disallow: /secret-admin-login</code>), as attackers will read the file to find exactly where your sensitive endpoints are located.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
