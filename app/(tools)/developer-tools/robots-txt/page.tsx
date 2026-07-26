import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding The Robots Exclusion Standard">
        
        <LearningSection type="architecture" title="Controlling Crawlers">
          <p>Search engines like Google and Bing use automated bots (crawlers) to discover and index pages on the web. However, you don't always want every page indexed—for example, your site's admin dashboard, API endpoints, or private user profiles should not appear in Google search results.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="The robots.txt Protocol">
          <p>The <code>robots.txt</code> file is a simple text file placed at the root of your domain (e.g., <code>https://example.com/robots.txt</code>). It dictates the rules of engagement for these bots using a protocol called the Robots Exclusion Standard.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>User-agent:</strong> Specifies which bot the rule applies to. <code>*</code> means all bots, while <code>Googlebot</code> targets only Google.</li>
            <li><strong>Disallow:</strong> Tells the bot not to crawl a specific URL path.</li>
            <li><strong>Allow:</strong> Overrides a Disallow rule for a specific sub-path.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="The Security Anti-Pattern">
          <p>A very common and dangerous mistake is using <code>robots.txt</code> to "hide" secret URLs.</p>
          <p className="mt-2">If you write <code>Disallow: /secret-admin-login-panel</code>, a well-behaved bot like Google will ignore the page. However, <code>robots.txt</code> is a completely public file. Malicious hackers will immediately read your <code>robots.txt</code> file to find exactly where your sensitive endpoints are located. <strong>Never use robots.txt for security or access control.</strong></p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why should you never put sensitive URLs (like an admin panel path) in your robots.txt file?",
                options: [
                  "Because it will cause Google to index the admin panel immediately.",
                  "Because robots.txt is a public file, and hackers will read it to easily discover your hidden endpoints.",
                  "Because the robots.txt file cannot parse URLs with hyphens.",
                  "Because it will break your website's CSS styling."
                ],
                correctIndex: 1,
                explanation: "robots.txt is public and often the very first file a hacker checks during reconnaissance to see what you are trying to hide."
              },
              {
                question: "If a bot is malicious, will it obey the 'Disallow' rules in your robots.txt?",
                options: [
                  "Yes, the browser enforces the rules automatically.",
                  "Yes, it is illegal for bots to ignore it.",
                  "No, robots.txt relies purely on the honor system. Malicious bots will simply ignore the file and crawl the path anyway.",
                  "No, but your firewall will block them based on the robots.txt file."
                ],
                correctIndex: 2,
                explanation: "The Robots Exclusion Standard is strictly an honor system. Good actors (like Google) obey it. Bad actors (like scrapers or vulnerability scanners) completely ignore it."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
