import { Metadata } from 'next';
import { CATEGORIES, ALL_TOOLS } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';

const toolId = 'llms-txt-generator';

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  const cat = CATEGORIES.find(c => c.id === 'developer');
  const tool = ALL_TOOLS.find(t => t.id === 'llms-txt-generator');

  return (
    <ToolShell
      title="LLMs.txt Generator"
      description="Generate llms.txt files to provide instructions and metadata for AI Agents navigating your site."
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-llms-txt"
          title="How it Works: The llms.txt Standard"
          preview="Learn how to optimize your website for AI Agents and LLMs instead of human readers."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Just like <code>robots.txt</code> tells web crawlers (like Googlebot) what pages they are allowed to index, <code>llms.txt</code> tells AI Agents and Large Language Models (LLMs) how to read and summarize your website.
            </p>
            <h3>Why is this needed?</h3>
            <p>
              When an AI agent (like ChatGPT or an autonomous coding agent) visits your documentation, it doesn't need the CSS, the navigation bar, or the promotional banners. It just wants the raw context. The <code>llms.txt</code> file acts as a manifest, pointing the agent to simplified, Markdown-formatted versions of your content that are optimized for context windows.
            </p>
            <h3>The Format</h3>
            <p>
              The file is written in Markdown. It typically includes:
            </p>
            <ul>
              <li>A system prompt or summary of what the project is.</li>
              <li>Links to full, consolidated documentation files (often named <code>llms-full.txt</code>).</li>
              <li>Categorized links to specific API references or tutorials.</li>
            </ul>
            <p>
              By providing an <code>llms.txt</code> at the root of your domain (e.g., <code>https://example.com/llms.txt</code>), you ensure that AI tools provide much more accurate answers about your product to their users.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
