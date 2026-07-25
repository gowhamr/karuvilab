import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import Base64ClientWrapper from './Base64ClientWrapper';

const toolId = 'base64';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to text. Supports standard and URL-safe variants."
      category={cat}
      toolId={toolId}
    >
      <Base64ClientWrapper />

      <LearningHub title="Base64 & Binary-to-Text Encoding" description="Understand the mathematics of the 6-bit translation, the purpose of padding, and why Base64 is strictly for encoding—not encryption.">
        
        <LearningSection type="architecture" title="How it Works: 3-to-4 Math" fullWidth>
          <p>
            Computers natively handle data in <strong>8-bit bytes</strong>. However, legacy systems (like early email routing) and some data formats (like JSON) are designed strictly for printable text. Base64 bridges this gap by translating binary bits into a safe, 64-character ASCII alphabet (<code>A-Z, a-z, 0-9, +, /</code>).
          </p>
          <p>
            Because there are 64 characters in the alphabet, each character represents exactly <strong>6 bits</strong> of data (2<sup>6</sup> = 64). The algorithm takes chunks of three 8-bit bytes (24 bits total) and splits them into four 6-bit pieces. Each piece is mapped to a Base64 character. As a result, Base64 encoding always increases file size by exactly <strong>33%</strong>.
          </p>
        </LearningSection>

        <LearningSection type="security" title="Security: Encoding vs Encryption">
          <p>
            <strong>Base64 is NOT Encryption.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>No Keys:</strong> Encryption (like AES or RSA) requires a secret key. Base64 is a fixed, public mathematical translation.</li>
            <li><strong>Obfuscation Only:</strong> Hiding a password or API key in Base64 (e.g., in a JWT payload or Basic Auth header) provides zero security. Anyone who sees the string can instantly decode it.</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Browser APIs">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>btoa() & atob():</strong> Legacy browser APIs for Base64. <code>btoa</code> (binary to ASCII) encodes, and <code>atob</code> (ASCII to binary) decodes.</li>
            <li><strong>Unicode Support:</strong> Native <code>btoa()</code> throws an error on Unicode strings (like emoji) because it only accepts 8-bit code points. This tool converts Unicode to UTF-8 byte arrays first before encoding.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="URL-Safe Variant">
          <p>
            Standard Base64 uses the characters <code>+</code> and <code>/</code>. Unfortunately, these characters have special meaning in web URLs (spaces and directories).
          </p>
          <p className="mt-2">
            <strong>URL-Safe Base64 (RFC 4648)</strong> replaces <code>+</code> with <code>-</code> (dash) and <code>/</code> with <code>_</code> (underscore), and omits the <code>=</code> padding. This allows Base64 strings to be safely passed in URL query parameters.
          </p>
        </LearningSection>

        <LearningSection type="failures" title="Padding (=)">
          <p>
            Base64 processes data in 3-byte blocks. What happens if your input is only 1 or 2 bytes long?
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>The algorithm adds zero-bits to reach the next 6-bit boundary.</li>
            <li>It then appends <code>=</code> characters at the end of the string to tell the decoder exactly how many padding bytes were added, so the decoder knows to discard them.</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="Why does encoding an image in Base64 make the web page load slower?"
            options={[
              { id: "a", text: "Because the browser has to spend CPU cycles decoding it before rendering.", isCorrect: false, explanation: "While decoding takes a few CPU cycles, the primary issue is file size and network transport." },
              { id: "b", text: "Because Base64 encoding increases the file size by 33%, forcing the user to download more bytes.", isCorrect: true, explanation: "Correct! The 3-to-4 bit translation math means 3 bytes of image data turn into 4 bytes of text. Over large images, this massively bloats the HTML/CSS payload." },
              { id: "c", text: "Because Base64 strings bypass browser caching mechanisms.", isCorrect: false, explanation: "Base64 strings are cached just like the rest of the HTML/CSS file they are embedded in." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
