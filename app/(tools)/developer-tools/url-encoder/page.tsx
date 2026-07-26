import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import URLEncoderClientWrapper from './URLEncoderClientWrapper';

const toolId = 'url-encoder';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="URL Encoder / Decoder"
      description="Encode or decode URL components using encodeURIComponent / decodeURIComponent."
      category={cat}
      toolId={toolId}
    >
      <URLEncoderClientWrapper />

      <LearningHub title="Understanding URL Encoding">
        
        <LearningSection type="architecture" title="The ASCII Constraint">
          <p>URLs (Uniform Resource Locators) can only be sent over the Internet using the standard ASCII character-set.</p>
          <p className="mt-2">If a URL contains characters outside the ASCII set (like spaces, accented letters, or emojis), the browser must convert them into a valid ASCII format. This is done through "Percent-encoding"—replacing the unsafe character with a <code>%</code> followed by two hexadecimal digits representing its byte value.</p>
        </LearningSection>
        
        <LearningSection type="api" title="encodeURI vs encodeURIComponent">
          <p>Developers frequently confuse the two native JavaScript encoding functions, leading to broken links and API failures.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>encodeURI():</strong> Used to encode an <em>entire</em> URL (like <code>https://example.com/my page</code>). It intentionally ignores characters that have special structural meaning in a URL, like <code>:</code>, <code>/</code>, <code>?</code>, and <code>&</code>, so the link still functions as a valid address.</li>
            <li><strong>encodeURIComponent():</strong> Used to encode a specific <em>piece</em> of a URL (like a query parameter value). It ruthlessly encodes everything, including <code>/</code> and <code>?</code>.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Double Encoding Bugs">
          <p>If you try to pass an entire URL string through <code>encodeURIComponent()</code>, it will break the protocol string <code>https://</code> into <code>https%3A%2F%2F</code>, destroying the link's structural validity.</p>
          <p className="mt-2">Conversely, if you encode a URL, and then accidentally encode it again later in the pipeline, the <code>%</code> characters themselves get encoded into <code>%25</code>, resulting in corrupted data like <code>%2520</code> instead of <code>%20</code> (a space).</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which JavaScript function should you use to encode a search term before attaching it to a query parameter (e.g. ?search=TERM)?",
                options: [
                  "encodeURI()",
                  "encodeURIComponent()",
                  "escape()",
                  "btoa()"
                ],
                correctIndex: 1,
                explanation: "You must use encodeURIComponent for query parameters. If the user searches for 'A & B', the '&' must be encoded so it doesn't break the URL's query string structure."
              },
              {
                question: "Why must spaces be encoded as '%20' or '+' in a URL?",
                options: [
                  "Because spaces take up too much bandwidth.",
                  "Because the HTTP protocol requires URLs to be transmitted without spaces, using a strict subset of ASCII characters.",
                  "To encrypt the URL from hackers.",
                  "Because spaces are illegal in all programming languages."
                ],
                correctIndex: 1,
                explanation: "The HTTP specification dictates that URLs cannot contain spaces. Percent-encoding provides a standardized way to safely transmit unsafe characters over the wire."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
