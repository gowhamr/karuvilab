import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import Base64UrlClientWrapper from './Base64UrlClientWrapper';

const toolId = 'base64url-converter';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Base64URL Converter"
      description="Bi-directional Base64URL (RFC 4648) encoder & decoder for JWTs, tokens, and web URLs with padding controls."
      category={cat}
      toolId={toolId}
    >
      <Base64UrlClientWrapper />

      <LearningHub title="Understanding Base64URL Encoding">
        
        <LearningSection type="architecture" title="Base64 vs Base64URL">
          <p>Standard Base64 encoding is used to safely transport binary data across text-based protocols. However, it uses two characters that conflict with web URLs: <code>+</code> (plus) and <code>/</code> (slash).</p>
          <p className="mt-2">If you put standard Base64 inside a URL query parameter without escaping it, web servers will misinterpret the <code>+</code> as a space, and the <code>/</code> as a directory separator, breaking the data.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Solution: RFC 4648">
          <p>To solve this, <strong>Base64URL</strong> was created. It is exactly the same algorithm as standard Base64, but with two simple character swaps:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The <code>+</code> character is replaced with <code>-</code> (minus).</li>
            <li>The <code>/</code> character is replaced with <code>_</code> (underscore).</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="Padding (=)">
          <p>Standard Base64 pads the end of the string with one or two <code>=</code> (equals) characters so the total length is a multiple of 4.</p>
          <p className="mt-2">In Base64URL, padding is strictly <strong>omitted</strong>. This is because <code>=</code> is a reserved character in URLs (used for query parameters like <code>?key=value</code>). Omitting it saves space and prevents parsing bugs in web frameworks.</p>
        </LearningSection>

        <LearningSection type="security" title="Real-World Usage (JWTs)">
          <p>JSON Web Tokens (JWTs) rely entirely on Base64URL encoding. A JWT consists of a Header, Payload, and Signature, each Base64URL encoded and separated by a period (<code>.</code>).</p>
          <p className="mt-2">Because they use Base64URL, JWTs can be safely passed in HTTP Authorization headers or URL parameters without breaking the HTTP protocol.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does Base64URL omit the '=' padding character?",
                options: [
                  "To save processing power during decoding.",
                  "Because '=' is a reserved character in URLs and can break query string parsing.",
                  "Because '=' is not an ASCII character.",
                  "To make the encoded string mathematically more secure."
                ],
                correctIndex: 1,
                explanation: "The equals sign '=' is used in HTTP queries (e.g. ?id=123). Including it inside the data payload would confuse URL parsers."
              },
              {
                question: "Which two characters from standard Base64 are replaced in Base64URL?",
                options: [
                  "+ and /",
                  "A and Z",
                  "- and _",
                  "0 and 9"
                ],
                correctIndex: 0,
                explanation: "Standard Base64 uses '+' and '/'. Base64URL replaces them with '-' and '_' respectively to ensure the string is URL-safe."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
