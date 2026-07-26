import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import SeoTitleClientWrapper from './SeoTitleClientWrapper';

const toolId = 'seo-title';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SEO Title Tester & Pixel Width Counter"
      description="Test SEO title length, character count, and Google SERP pixel width bounds."
      category={cat}
      toolId={toolId}
    >
      <SeoTitleClientWrapper />

      <LearningHub title="Understanding Search Engine Results Pages (SERP)">
        
        <LearningSection type="architecture" title="The Character Count Myth">
          <p>When writing a <code>&lt;title&gt;</code> tag for SEO, the most common advice you will find online is to "keep it under 60 characters" to prevent Google from truncating it with an ellipsis (<code>...</code>).</p>
          <p className="mt-2">However, this advice is technically incorrect and heavily outdated.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="Google Counts Pixels, Not Characters">
          <p>Google Search results are rendered in a web browser using a proportional font (typically Arial, 20px). In a proportional font, a narrow character like <code>i</code> or <code>l</code> takes up significantly less physical space on the screen than a wide character like <code>W</code> or <code>M</code>.</p>
          <p className="mt-2">Google's rendering engine does not truncate based on a character limit; it truncates based on <strong>pixel width</strong>. The maximum width for a desktop search result title is roughly 600 pixels.</p>
        </LearningSection>

        <LearningSection type="performance" title="Measuring Pixel Bounds">
          <p>Consider two titles of completely different lengths:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><code>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</code> (40 characters) will be truncated because 40 'W's exceed 600 pixels.</li>
            <li><code>iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</code> (60 characters) will not be truncated because it is only about 170 pixels wide.</li>
          </ul>
          <p className="mt-2">This tool uses a hidden HTML5 Canvas to measure the exact pixel width of your string in the Arial font, simulating exactly how Google calculates the cutoff bound.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why might a 55-character SEO title get truncated by Google, while a different 62-character title does not?",
                options: [
                  "Google randomly truncates titles to test CTR.",
                  "Google truncates based on physical pixel width (max ~600px), not character count. The 55-character title likely contained wider letters like 'W' and 'M'.",
                  "Google penalizes titles that contain keywords.",
                  "Google truncates based on word count, not character count."
                ],
                correctIndex: 1,
                explanation: "In a proportional font like Arial, characters have different widths. A string with many wide characters will hit the 600-pixel limit much faster than a string with narrow characters."
              },
              {
                question: "How does this tool accurately determine if your title will be truncated without asking Google?",
                options: [
                  "It uses a machine learning model trained on Google results.",
                  "It just counts the characters and warns if it is over 60.",
                  "It renders the text onto a hidden HTML Canvas using Arial 20px and measures the exact physical pixel width.",
                  "It makes an API call to Google Search Console."
                ],
                correctIndex: 2,
                explanation: "The HTML Canvas API allows us to render text in memory and measure exactly how many pixels wide it is, perfectly simulating a browser rendering the Google SERP."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
