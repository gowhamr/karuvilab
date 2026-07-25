import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import CodeMinifierClientWrapper from './CodeMinifierClientWrapper';

const toolId = 'code-minifier';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Code Minifier"
      description="Remove comments and whitespace from CSS, JavaScript, and HTML. Basic minification — not full AST-level."
      category={cat}
      toolId={toolId}
    >
      <CodeMinifierClientWrapper />

      <LearningHub title="Code Minification & Compilers" description="Learn how minifiers shrink file sizes, the difference between regex-based minification and AST-based mangling, and why performance matters.">
        
        <LearningSection type="architecture" title="How it Works" fullWidth>
          <p>
            Minification is the process of removing all unnecessary characters from source code without changing its functionality. This tool uses a fast, regex-based approach to strip whitespace, newlines, and comments. 
          </p>
          <p>
            Advanced bundlers (like Webpack or Vite) use <strong>Abstract Syntax Trees (ASTs)</strong>. They parse your JavaScript into a tree structure, allowing them to safely rename variables to single letters (<code>mangling</code>) and remove unreachable code (<code>Dead Code Elimination / Tree Shaking</code>).
          </p>
        </LearningSection>

        <LearningSection type="performance" title="Performance & Bandwidth">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Network Latency:</strong> Minifying files can reduce their size by 30-70%. Smaller files transfer over the network faster, drastically improving Time to Interactive (TTI) for users on slower 3G/4G connections.</li>
            <li><strong>Gzip/Brotli:</strong> Minification works incredibly well alongside compression algorithms. Removing entropy (like unique variable names) allows gzip to achieve much higher compression ratios.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="Security & Obfuscation">
          <p>
            <strong>Minification is NOT Security!</strong>
          </p>
          <p className="mt-2">
            While minified code is harder to read, it can easily be reversed using formatting tools (like the JSON Formatter or JS Beautifier). You must never hardcode secrets, API keys, or proprietary business logic in client-side code, as anyone can inspect it using browser developer tools.
          </p>
        </LearningSection>

        <LearningSection type="api" title="Implementation Details">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Regex Fallbacks:</strong> Since this tool runs directly in the browser and must be fast, it uses highly optimized Regular Expressions to target block comments <code>/* ... */</code> and line comments <code>// ...</code>.</li>
            <li><strong>Web Workers:</strong> If the text payload is extremely large, the stripping process is offloaded to a background thread to prevent UI freezing.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="Tooling Ecosystem">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Terser:</strong> The modern standard for JS minification (a fork of UglifyJS that supports ES6+).</li>
            <li><strong>SWC / esbuild:</strong> Next-generation minifiers written in Rust and Go, offering 10x-100x performance improvements over JS-based tools.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common Failure Cases">
          <p>
            Regex-based minifiers can break code if not careful:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Strings containing comments:</strong> If you have a string <code>let url = "http://example.com";</code>, a naive regex minifier might see <code>//</code> and delete the rest of the line!</li>
            <li><strong>ASI (Automatic Semicolon Insertion):</strong> JS relies on line breaks for semicolons. Removing all line breaks can cause syntax errors if semicolons are missing.</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="What is the difference between Minification and Obfuscation?"
            options={[
              { id: "a", text: "Minification reduces file size for performance; Obfuscation deliberately makes code hard to reverse-engineer to protect intellectual property.", isCorrect: true, explanation: "Correct. Minifiers just strip characters and shorten names to save bytes. Obfuscators introduce complex, confusing logic to deter hackers." },
              { id: "b", text: "Minification is for JavaScript, while Obfuscation is for HTML.", isCorrect: false, explanation: "Both concepts can apply to many languages." },
              { id: "c", text: "They are the exact same thing.", isCorrect: false, explanation: "While minified code is hard to read, its primary goal is performance, not security." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
