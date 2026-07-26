import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import JSONCSVConverterClientWrapper from './JSONCSVConverterClientWrapper';

const toolId = 'json-csv';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="JSON ↔ CSV Converter"
      description="Convert between JSON arrays and CSV format instantly with precision."
      category={cat}
      toolId={toolId}
    >
      <JSONCSVConverterClientWrapper />

      <LearningHub title="Understanding Data Serialization">
        
        <LearningSection type="architecture" title="3D vs 2D Data Structures">
          <p>JSON is a hierarchical (3D) data structure. A User object can contain an Address object, which can contain an Array of phone numbers.</p>
          <p className="mt-2">CSV (Comma-Separated Values), however, is strictly a flat (2D) table of rows and columns. When converting between the two, we face a fundamental dimensional mismatch.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Flattening Algorithm">
          <p>When converting JSON to CSV, the converter has to flatten the tree structure. It does this by creating composite column names using dot-notation.</p>
          <p className="mt-2">For example, if a JSON object is <code>{"{"} user: {"{"} name: "Alice" {"}"} {"}"}</code>, the resulting CSV column header becomes <code>user.name</code> and the row value is <code>Alice</code>.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Array Problem">
          <p>Nested objects are easily flattened with dot-notation, but <strong>Arrays</strong> are notoriously difficult to represent in CSV.</p>
          <p className="mt-2">If a user has 3 phone numbers, should the converter create 3 separate rows (duplicating the user's name), or does it create 1 row with a JSON-stringified array in the phone column? This converter uses stringified arrays for nested lists to ensure one JSON object strictly equals one CSV row.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is converting nested JSON to CSV inherently difficult?",
                options: [
                  "Because CSV does not support text encoding.",
                  "Because JSON is a hierarchical (tree) structure, while CSV is a strictly flat 2D table.",
                  "Because CSV files have a strict file size limit of 1MB.",
                  "Because JSON keys cannot be used as CSV column headers."
                ],
                correctIndex: 1,
                explanation: "Mapping an infinitely nestable tree structure into a flat grid of rows and columns requires complex flattening algorithms (like dot-notation keys)."
              },
              {
                question: "How does the flattening algorithm handle an object nested inside another object (e.g., address inside user)?",
                options: [
                  "It ignores the nested object entirely.",
                  "It creates a new, separate CSV file.",
                  "It creates a composite column header using dot-notation, such as 'user.address'.",
                  "It converts the entire JSON file into a single string."
                ],
                correctIndex: 2,
                explanation: "Dot notation (or bracket notation) is used to flatten nested keys into a single string that can act as a valid 2D column header."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
