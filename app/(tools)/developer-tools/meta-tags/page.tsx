import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding The Open Graph Protocol">
        
        <LearningSection type="architecture" title="The Link Preview Problem">
          <p>When you paste a link into iMessage, WhatsApp, or Slack, the app doesn't just show the raw URL. It instantly fetches a beautiful "preview card" with an image, a bold title, and a description. How does it know what image and text to use?</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Solution: Open Graph">
          <p>In 2010, Facebook introduced the <strong>Open Graph (OG) protocol</strong> to solve this exact problem. By adding specific <code>&lt;meta property="og:..."&gt;</code> tags to the <code>&lt;head&gt;</code> of your HTML, you can explicitly tell social media scrapers exactly which metadata represents that specific page.</p>
          <p className="mt-2">For example, <code>&lt;meta property="og:image" content="https://example.com/thumbnail.png"&gt;</code> dictates the exact image to use on the preview card.</p>
        </LearningSection>

        <LearningSection type="standards" title="Universal Adoption">
          <p>Because the OG protocol was so effective, nearly every other platform (LinkedIn, Discord, Slack, iMessage) adopted it as the defacto standard for link previews.</p>
          <p className="mt-2">Twitter created their own set of tags (<code>twitter:card</code>, <code>twitter:image</code>), but they are designed to fall back to reading your <code>og:</code> tags if the specific Twitter tags are missing. Properly configuring these tags is arguably the single most important step for social media distribution and click-through rates.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary purpose of Open Graph (og:) meta tags?",
                options: [
                  "To encrypt the HTML of a webpage.",
                  "To tell search engines like Google which keywords to rank the page for.",
                  "To dictate the title, description, and image that appear when the link is shared on social platforms or messaging apps.",
                  "To inject CSS styles into the webpage."
                ],
                correctIndex: 2,
                explanation: "Social media scrapers look specifically for Open Graph tags in your HTML head to populate the rich 'preview card' UI when someone pastes your link."
              },
              {
                question: "If you only implement 'og:' tags and skip the specific 'twitter:' tags, what will happen when your link is shared on Twitter/X?",
                options: [
                  "Twitter will refuse to display the link.",
                  "Twitter will show a blank card with no image.",
                  "Twitter will gracefully fall back to reading your 'og:' tags to build the preview card.",
                  "Twitter will automatically generate an image using AI."
                ],
                correctIndex: 2,
                explanation: "Twitter's crawler is designed to look for 'twitter:' tags first, but if they are missing, it falls back to standard Open Graph tags, ensuring your preview still looks good."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
