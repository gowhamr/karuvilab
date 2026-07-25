import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import JSONFormatterClientWrapper from './JSONFormatterClientWrapper';

const toolId = 'json-formatter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="JSON Formatter"
      description="Beautify, minify, validate JSON and explore it as a tree."
      category={cat}
      toolId={toolId}
    >
      <JSONFormatterClientWrapper />
      
      <LearningHub title="JSON & Data Serialization Engineering" description="Understand the architecture, parsing algorithms, and security implications of JSON processing in modern web applications.">
        
        <LearningSection type="architecture" title="How it Works" fullWidth>
          <p>
            The JSON Formatter operates entirely in your browser using a combination of the native <code>JSON.parse()</code> API for small payloads and a dedicated <strong>Web Worker</strong> for payloads exceeding 500KB. 
          </p>
          <p>
            When processing large JSON files (up to 5MB), the data is transferred to a background worker to prevent the main UI thread from freezing. This ensures the browser remains responsive (60fps) even while parsing millions of tokens.
          </p>
        </LearningSection>

        <LearningSection type="api" title="Browser APIs Used">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>JSON Object:</strong> Uses standard <code>JSON.parse()</code> and <code>JSON.stringify()</code> with spacing arguments for beautification.</li>
            <li><strong>Web Workers:</strong> Offloads heavy AST construction to a background thread to adhere to the <code>PERF-01</code> (No main thread lock) rule.</li>
            <li><strong>AbortController:</strong> Ensures that if you change inputs rapidly, previous stalled worker parses are instantly canceled to free up memory.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="Security Review">
          <p>
            JSON parsing is vulnerable to <strong>Prototype Pollution</strong> and <strong>Denial of Service (DoS)</strong> if not handled properly.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>No Data Exfiltration:</strong> Because this runs 100% offline via Web Workers, sensitive payloads (e.g., JWTs, API keys) never leave your machine.</li>
            <li><strong>Max Depth:</strong> Deeply nested JSON can cause Stack Overflow errors during parsing. This tool mitigates this by restricting payloads over 5MB.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Performance & Complexity">
          <p>
            Standard JSON parsing runs in <strong>O(N)</strong> time complexity, where N is the length of the string. However, sorting keys (A-Z) requires recursive traversal, increasing complexity to <strong>O(N log K)</strong> where K is the number of keys per object.
          </p>
          <p className="mt-2">
            By shifting this computation to a Web Worker, we protect the UI thread. The memory cost is essentially 2-3x the file size because of the DOM String allocation, AST object creation, and final string serialization.
          </p>
        </LearningSection>

        <LearningSection type="standards" title="Standards & RFCs">
          <ul className="list-disc pl-5 space-y-2">
            <li><a href="https://datatracker.ietf.org/doc/html/rfc8259" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">RFC 8259</a>: The JavaScript Object Notation (JSON) Data Interchange Format.</li>
            <li><strong>ECMA-404:</strong> The official JSON data interchange syntax standard.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common Failure Cases">
          <p>
            JSON parsing commonly fails on:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Trailing Commas:</strong> Valid in JS, but strictly forbidden in RFC 8259 JSON.</li>
            <li><strong>Unquoted Keys:</strong> Keys must be wrapped in double quotes <code>"key"</code>, not single quotes or unquoted.</li>
            <li><strong>BigInt Loss:</strong> Native <code>JSON.parse</code> rounds large numbers (exceeding <code>Number.MAX_SAFE_INTEGER</code>). For financial data, strings are safer.</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="Why might parsing a 10MB JSON file directly on the main thread be a bad idea?"
            options={[
              { id: "a", text: "Because JSON.parse cannot handle strings larger than 1MB.", isCorrect: false, explanation: "JSON.parse can technically handle large strings, but doing so blocks the thread." },
              { id: "b", text: "It blocks the main UI thread, causing the browser to freeze and animations to drop frames.", isCorrect: true, explanation: "Parsing large strings is an O(N) synchronous operation. If it takes longer than 50ms, it creates noticeable UI stutter." },
              { id: "c", text: "It causes memory leaks that can never be garbage collected.", isCorrect: false, explanation: "Memory will eventually be garbage collected, but the freeze is the immediate issue." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
