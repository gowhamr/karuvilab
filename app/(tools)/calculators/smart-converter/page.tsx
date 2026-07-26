import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import SmartConverterClientWrapper from './SmartConverterClientWrapper';

const toolId = 'smart-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Smart Unit Converter"
      description="Type a natural language conversion query like '5 kg to lbs' or '100 USD to EUR'."
      category={cat}
      toolId={toolId}
    >
      <SmartConverterClientWrapper />

      <LearningHub title="Understanding Text Parsing">
        
        <LearningSection type="architecture" title="No AI Required">
          <p>When you type "5 kg to lbs", you might assume there is an AI model or LLM running in the background to interpret your intent. But this tool relies on a much older, faster, and more deterministic technology: <strong>Regular Expressions</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Parsing Intent with Regex">
          <p>A regular expression (Regex) is a sequence of characters that specifies a search pattern in text. This tool runs your input against a mathematical pattern that looks roughly like this:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>/^([\d\.]+)\s*([a-zA-Z]+)\s*(?:to|in)\s*([a-zA-Z]+)$/</code></pre>
          <p className="mt-4">This formula breaks down the sentence into strict capture groups:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><code>([\d\.]+)</code>: Capture any numbers or decimals at the start (e.g., "5").</li>
            <li><code>([a-zA-Z]+)</code>: Capture the letters immediately following the number (e.g., "kg").</li>
            <li><code>(?:to|in)</code>: Match but ignore the joining words "to" or "in".</li>
            <li><code>([a-zA-Z]+)</code>: Capture the final set of letters (e.g., "lbs").</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The Speed Advantage">
          <p>Because Regex runs directly natively in the browser's JavaScript engine (which is highly optimized in V8/WebKit), the text parsing happens in a fraction of a millisecond. It requires zero server cost, works completely offline, and never hallucinates.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary advantage of using Regex over an AI model for a simple tool like this?",
                options: [
                  "Regex can understand tone and emotion.",
                  "Regex runs instantly in the browser with zero server costs or API latency.",
                  "Regex can invent new units of measurement.",
                  "Regex automatically downloads the latest exchange rates."
                ],
                correctIndex: 1,
                explanation: "For rigid, predictable text structures, Regex is infinitely faster and cheaper than an LLM."
              },
              {
                question: "In the Regex pattern used here, what does the '?' in '(?:to|in)' do?",
                options: [
                  "It makes the group 'non-capturing', meaning it checks for the word but doesn't save it as a variable.",
                  "It acts as a wildcard for any character.",
                  "It checks if the text is a question.",
                  "It deletes the words from the screen."
                ],
                correctIndex: 0,
                explanation: "The ?: syntax creates a non-capturing group. The engine requires the word 'to' or 'in' to be there for a match, but won't extract it for the final array."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
