import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import RegexTesterClientWrapper from './RegexTesterClientWrapper';

const toolId = 'regex';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Regex Tester"
      description="Test regular expressions with live match highlighting, match positions, and capture groups."
      category={cat}
      toolId={toolId}
    >
      <RegexTesterClientWrapper />

      <LearningHub title="Regular Expressions (Regex) Engineering" description="Master pattern matching algorithms, state machines, and the security risks associated with catastrophic backtracking.">
        
        <LearningSection type="architecture" title="How it Works" fullWidth>
          <p>
            This tool evaluates Regular Expressions dynamically against your input text. 
            When you type a regex pattern, it compiles it into a Non-deterministic Finite Automaton (NFA) or a Deterministic Finite Automaton (DFA) depending on the browser's underlying JavaScript engine (like V8 for Chrome).
          </p>
          <p>
            The matching algorithm traverses the input string character by character, attempting to transition through the states of the compiled state machine. Capture groups are preserved in memory to allow backreferencing and structured extraction.
          </p>
        </LearningSection>

        <LearningSection type="api" title="Browser APIs Used">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>RegExp Object:</strong> The native JavaScript `RegExp` class is used to compile the patterns. Flags like <code>g</code> (global), <code>i</code> (case-insensitive), and <code>m</code> (multiline) modify the state machine behavior.</li>
            <li><strong>String.prototype.matchAll():</strong> Used to extract all matches along with their indices and capture groups, enabling the rich UI highlighting you see above.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="Security Review (ReDoS)">
          <p>
            Regex can be a severe security vulnerability known as <strong>Regular Expression Denial of Service (ReDoS)</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Catastrophic Backtracking:</strong> Patterns like <code>^(a+)+$</code> applied to the string <code>"aaaaX"</code> will cause the regex engine to try every possible grouping combination before failing, leading to O(2^N) time complexity.</li>
            <li><strong>Mitigation:</strong> Never execute user-supplied regex on a backend server without a strict timeout or using a safe engine (like RE2) that guarantees O(N) complexity by dropping backreferences.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Performance & Complexity">
          <p>
            A well-written regex executes in <strong>O(N)</strong> time where N is the length of the string. 
          </p>
          <p className="mt-2">
            However, heavy use of lookaheads <code>(?=...)</code>, lookbehinds <code>(?&lt;=...)</code>, and nested quantifiers can degrade performance to polynomial or exponential time. In JavaScript, regex evaluation blocks the main thread.
          </p>
        </LearningSection>

        <LearningSection type="standards" title="Standards & Flavors">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>ECMAScript Regex:</strong> This tool uses the JS flavor of regex. It lacks some features found in PCRE (PHP/Perl) or .NET, such as atomic groups.</li>
            <li><strong>Unicode Property Escapes:</strong> The tool supports the unicode <code>u</code> flag, allowing patterns like <code>\p{'{'}Emoji{'}'}</code>.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common Failure Cases">
          <p>
            Regex bugs are notoriously difficult to spot:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Greedy vs Lazy:</strong> <code>.*</code> will match as much as possible. If you want it to stop at the first match, you must use <code>.*?</code>.</li>
            <li><strong>Escaping:</strong> Forgetting to escape special characters like <code>.</code> (which matches any character) when you actually meant a literal dot.</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="What is the root cause of Catastrophic Backtracking (ReDoS)?"
            options={[
              { id: "a", text: "The regex string is too long for memory allocation.", isCorrect: false, explanation: "Memory limits are rarely the issue in ReDoS. It's a CPU issue." },
              { id: "b", text: "Nested quantifiers (e.g., (a+)+) forcing the engine to evaluate exponential permutations on a failing match.", isCorrect: true, explanation: "When the engine fails to match the end of a string, it backtracks and tries every combination of the inner and outer quantifiers, leading to O(2^N) complexity." },
              { id: "c", text: "Compiling regexes dynamically inside a loop.", isCorrect: false, explanation: "This hurts performance (creates new objects), but does not cause the O(2^N) exponential lockup of ReDoS." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
