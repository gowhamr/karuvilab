import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import URLCleanerClientWrapper from './URLCleanerClientWrapper';

const toolId = 'url-cleaner';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="URL Cleaner / UTM Stripper"
      description="Remove UTM tags, fbclid, gclid and other tracking parameters from URLs."
      category={cat}
      toolId={toolId}
    >
      <URLCleanerClientWrapper />

      <LearningHub title="Understanding URL Tracking Parameters">
        
        <LearningSection type="architecture" title="UTM Parameters">
          <p>Have you ever noticed that when you click a link in an email, the URL expands to include a massive string of random characters?</p>
          <p className="mt-2"><code>https://example.com/shoes?utm_source=newsletter&utm_medium=email</code></p>
          <p className="mt-2">UTM (Urchin Tracking Module) parameters were created by Urchin Software (now Google Analytics). They allow marketers to track exactly where traffic comes from. If you copy that massive URL and send it to your friend, Google Analytics will record that <em>two</em> people clicked the newsletter link, artificially inflating their metrics and linking your friend's browsing session to yours.</p>
        </LearningSection>
        
        <LearningSection type="security" title="Click IDs (fbclid, gclid)">
          <p>Modern ad networks (like Facebook and Google Ads) go a step further. Instead of generic tags, they append a unique cryptographic identifier to every single click (e.g., <code>fbclid=IwAR3...</code>).</p>
          <p className="mt-2">This ID maps directly to your personal user profile in their database. If you share that URL on a public forum, anyone who clicks it might be incorrectly associated with your advertising profile by Facebook.</p>
        </LearningSection>

        <LearningSection type="api" title="URLSearchParams API">
          <p>This tool uses the native <code>URL</code> and <code>URLSearchParams</code> APIs built into the browser.</p>
          <p className="mt-2">It parses the query string, systematically iterates through the keys, and deletes any that match known tracking signatures. It then re-serializes the URL, leaving you with the original, clean canonical link, completely stripped of tracking telemetry.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What happens from a privacy perspective if you copy a URL containing a 'fbclid' parameter and text it to a friend?",
                options: [
                  "Nothing, it just makes the link longer.",
                  "Your friend's click will be tracked by Facebook and associated with YOUR personal advertising profile.",
                  "Facebook will block your friend from seeing the page.",
                  "The URL will expire after 5 minutes."
                ],
                correctIndex: 1,
                explanation: "The Click ID (fbclid) is unique to the original user who clicked the ad. Sharing it causes data pollution and privacy leaks."
              },
              {
                question: "What browser API makes it easy to parse and delete these parameters without using complex regex?",
                options: [
                  "RegExp",
                  "JSON.parse()",
                  "URLSearchParams",
                  "document.location"
                ],
                correctIndex: 2,
                explanation: "URLSearchParams is a native API that handles all the complexities of parsing, decoding, and modifying query strings."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
