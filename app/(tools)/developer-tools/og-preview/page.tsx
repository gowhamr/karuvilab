import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding Open Graph & Link Previews">
        
        <LearningSection type="architecture" title="How Scrapers Work">
          <p>When you paste a URL into a tweet or a Slack message, the app instantly generates a beautiful preview card with an image, a title, and a description. How does it know what image to use?</p>
          <p className="mt-2">The platform's backend sends an automated crawler (a bot) to fetch the raw HTML of your URL. It does not render the page or execute JavaScript; it simply parses the <code>&lt;head&gt;</code> of your document looking for specific metadata tags.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="The Open Graph Standard">
          <p>Created by Facebook in 2010, the <strong>Open Graph (OG)</strong> protocol is the industry standard for declaring this rich metadata.</p>
          <p className="mt-2">A typical implementation looks like this:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>&lt;meta property="og:title" content="My Article" /&gt;
&lt;meta property="og:description" content="A brief summary." /&gt;
&lt;meta property="og:image" content="https://example.com/hero.jpg" /&gt;</code></pre>
        </LearningSection>

        <LearningSection type="api" title="Twitter Cards">
          <p>While almost all platforms support standard OG tags, Twitter also maintains its own proprietary format called Twitter Cards (e.g., <code>twitter:card</code> or <code>twitter:image</code>).</p>
          <p className="mt-2">If you want the large, edge-to-edge image layout on Twitter, you must explicitly include <code>&lt;meta name="twitter:card" content="summary_large_image"&gt;</code>. If Twitter-specific tags are missing, Twitter's crawler is programmed to fall back and read your standard Open Graph tags instead.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How do platforms like Slack or Twitter fetch the image for a link preview?",
                options: [
                  "They take a screenshot of the webpage using a headless browser.",
                  "They use an AI model to guess the most important image on the page.",
                  "Their crawler parses the HTML <head> looking for specific Open Graph (<meta property='og:image'>) tags.",
                  "The user's browser uploads the image directly to Slack."
                ],
                correctIndex: 2,
                explanation: "Social platforms use lightweight crawlers that parse the raw HTML to extract OG tags. They do not render the page or take screenshots."
              },
              {
                question: "If you want your link to display as a large, full-width image on Twitter, which specific tag is required?",
                options: [
                  "<meta property='og:image:width' content='large'>",
                  "<meta name='twitter:card' content='summary_large_image'>",
                  "<meta property='og:card' content='full'>",
                  "<meta name='viewport' content='width=device-width'>"
                ],
                correctIndex: 1,
                explanation: "Twitter requires the specific 'twitter:card' tag set to 'summary_large_image' to trigger the large layout. Without it, it defaults to a small thumbnail."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
