import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import TextSorterDeduperClient from "./TextSorterDeduperClient";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "text-sorter-deduper";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TextSorterDeduperPage() {
  return (
    <ToolShell
      title="Text Sorter & Deduplicator"
      description="Clean up your lists and data. Sort alphabetically, by length, or remove redundant entries with one click."
      category={category}
      toolId={toolId}
    >
      <TextSorterDeduperClient />

      <LearningHub title="Understanding Sorting & Deduplication">
        
        <LearningSection type="architecture" title="The Power of Sets">
          <p>Removing duplicate items from a list of 100,000 entries using a naive "check every item against every other item" loop (O(n²) complexity) would freeze your browser. </p>
          <p className="mt-2">Instead, modern JavaScript uses the <code>Set</code> data structure. A Set is a collection of <em>unique</em> values. By simply passing a massive array into <code>new Set(array)</code>, the browser's optimized engine instantly drops all duplicates in O(n) time, operating thousands of times faster than a manual loop.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Locale-Aware Sorting">
          <p>Standard alphabetical sorting in JavaScript (<code>array.sort()</code>) uses ASCII character codes. This means uppercase "Zebra" will be sorted <em>before</em> lowercase "apple", because capital Z (code 90) comes before lowercase a (code 97).</p>
          <p className="mt-2">Furthermore, ASCII sorting completely breaks when handling accented characters like "é" or "ñ". Professional sorting tools use <code>localeCompare()</code> to sort strings alphabetically according to human language rules, completely ignoring case and handling accents correctly.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the most efficient way to remove all duplicates from a large JavaScript array?",
                options: [
                  "Use two nested 'for' loops to check each item against all others.",
                  "Upload it to a Python server.",
                  "Convert the array into a Set, then back into an array: Array.from(new Set(array)).",
                  "Use the built-in array.removeDuplicates() method."
                ],
                correctIndex: 2,
                explanation: "Sets inherently only allow unique values and process insertions with near-instant O(1) time complexity, making them the fastest deduplication method."
              },
              {
                question: "Why does the standard JavaScript array.sort() method put 'Zoo' before 'ant'?",
                options: [
                  "Because Z comes before A.",
                  "Because it sorts by string length first.",
                  "Because it sorts by ASCII character codes, and uppercase letters have lower numeric values than lowercase letters.",
                  "Because 'Zoo' is a proper noun."
                ],
                correctIndex: 2,
                explanation: "ASCII sorts strictly by numerical character codes. 'Z' is 90, and 'a' is 97. To sort like a human dictionary, you must use string.localeCompare()."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
