import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import DiffCheckerClientWrapper from './DiffCheckerClientWrapper';

const toolId = 'diff-checker';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Diff Checker"
      description="Compare two text blocks line by line. Added lines in green, removed in red."
      category={cat}
      toolId={toolId}
      fullWidth
    >
      <DiffCheckerClientWrapper />

      <LearningHub title="Diff Algorithms & Version Control" description="Understand how algorithms like Myers' Diff calculate the shortest edit script to transform one document into another.">
        
        <LearningSection type="architecture" title="How it Works" fullWidth>
          <p>
            When comparing two blocks of text, we want to find the minimal number of insertions and deletions required to turn the Original text into the Modified text. This is a classic computer science problem known as the <strong>Longest Common Subsequence (LCS)</strong> problem.
          </p>
          <p>
            Most modern Diff tools (including Git and this one) use a variation of <strong>Myers' Diff Algorithm</strong>. Instead of naively comparing every line against every other line (which is O(N*M)), the algorithm builds an edit graph and searches for the shortest path from the top-left to the bottom-right, taking diagonal steps whenever lines match.
          </p>
        </LearningSection>

        <LearningSection type="api" title="Implementation Details">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Line Tokenization:</strong> The text is first split by newline characters (<code>\n</code>). Comparing chunks of text is faster than comparing character-by-character.</li>
            <li><strong>Diff Match Patch:</strong> Often, the core algorithm used in JS is a port of Google's <code>diff-match-patch</code> library, which implements Myers' algorithm combined with some heuristics to speed up common cases (like stripping matching prefixes and suffixes first).</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Performance & Complexity">
          <p>
            The basic Myers algorithm has a time and space complexity of <strong>O(N * D)</strong>, where N is the sum of the lengths of both texts, and D is the size of the minimal edit script (the number of differences).
          </p>
          <p className="mt-2">
            If two files are completely different, D approaches N, meaning the algorithm degrades to <strong>O(N²)</strong>. For massive files (100k+ lines), this can crash a browser, which is why diff limits and Web Workers are critical.
          </p>
        </LearningSection>

        <LearningSection type="standards" title="Unified Diff Format">
          <p>
            The output of diff algorithms is often serialized into a standard format so patch programs can read it.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Unified Format:</strong> Introduced in the 1990s. Starts with <code>--- original</code> and <code>+++ modified</code>, followed by "hunks" denoted by <code>@@ -start,count +start,count @@</code>.</li>
            <li>This is the exact format Git uses to display your commit changes!</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common Failure Cases">
          <p>
            Diffing can yield technically correct but human-unreadable results:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Whitespace shifts:</strong> If a developer changes indentation across a whole file, the diff will show every line as replaced, masking the actual logic changes. (Hence the "ignore whitespace" flag in Git).</li>
            <li><strong>Code blocks swapped:</strong> If you swap the order of two functions, the diff often shows one being deleted and inserted, rather than a clean "move".</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="In the context of the Myers Diff Algorithm, what does D represent in the O(N*D) time complexity?"
            options={[
              { id: "a", text: "The length of the Longest Common Subsequence.", isCorrect: false, explanation: "LCS is related, but D is the number of differences (edit distance)." },
              { id: "b", text: "The number of differences (insertions and deletions) between the two texts.", isCorrect: true, explanation: "Correct! If the files are very similar, D is small, making the algorithm perform closer to O(N)." },
              { id: "c", text: "The Depth of the file directory structure.", isCorrect: false, explanation: "Myers operates on individual files/strings, not directories." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
