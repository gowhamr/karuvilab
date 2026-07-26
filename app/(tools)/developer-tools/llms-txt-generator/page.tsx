import { Metadata } from 'next';
import { CATEGORIES, ALL_TOOLS } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'llms-txt-generator';

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  const cat = CATEGORIES.find(c => c.id === 'developer');

  return (
    <ToolShell
      title="LLMs.txt Generator"
      description="Generate llms.txt files to provide instructions and metadata for AI Agents navigating your site."
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />

      <LearningHub title="Understanding the llms.txt Standard">
        
        <LearningSection type="architecture" title="Optimizing for AI Agents">
          <p>Just like <code>robots.txt</code> tells legacy web crawlers (like Googlebot) what pages they are allowed to index, <code>llms.txt</code> tells modern AI Agents and Large Language Models how to efficiently read and summarize your website.</p>
          <p className="mt-2">When an AI coding agent or chatbot visits your documentation, it doesn't need your CSS, React navigation bars, or promotional banners. Processing that HTML bloat wastes tokens and context window space. The <code>llms.txt</code> file acts as a manifest, pointing the agent directly to simplified, Markdown-formatted versions of your content.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="The Format Specification">
          <p>The <code>llms.txt</code> file is strictly written in Markdown and is conventionally placed at the root of your domain (e.g., <code>https://example.com/llms.txt</code>).</p>
          <p className="mt-2">It typically includes:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>A system prompt or high-level summary of what the project is.</li>
            <li>Links to consolidated, single-file documentation dumps (often named <code>llms-full.txt</code>).</li>
            <li>Categorized markdown links to specific API references, tutorials, or rule files.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Context Window Economics">
          <p>A standard web page might contain 500 words of actual text, but the underlying HTML could be 20,000 tokens of DOM nodes and inline styles. If an AI agent fetches the HTML, it burns through its context window limit extremely quickly.</p>
          <p className="mt-2">By providing markdown files via <code>llms.txt</code>, you guarantee a near 1:1 ratio of tokens to actual semantic information, drastically improving the intelligence and accuracy of the AI's responses about your product.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary purpose of an llms.txt file?",
                options: [
                  "To block AI scrapers from stealing your content.",
                  "To provide a manifest that points AI agents to clean, markdown-formatted versions of your documentation, saving them tokens.",
                  "To store API keys for OpenAI.",
                  "To train a new language model from scratch."
                ],
                correctIndex: 1,
                explanation: "It acts as a roadmap for AI agents, allowing them to bypass HTML bloat and ingest pure Markdown context."
              },
              {
                question: "Where should the llms.txt file conventionally be placed?",
                options: [
                  "Hidden deep in the /api/ folder.",
                  "At the root of the domain (e.g. example.com/llms.txt), similar to robots.txt.",
                  "In the database.",
                  "Inside a ZIP archive."
                ],
                correctIndex: 1,
                explanation: "Like robots.txt, it is placed at the domain root so automated agents can easily discover it without needing complex routing logic."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
