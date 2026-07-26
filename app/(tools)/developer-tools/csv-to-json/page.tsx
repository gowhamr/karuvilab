import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import CsvToJsonWrapper from './CsvToJsonWrapper';

const toolId = 'csv-to-json';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="CSV to JSON Converter"
      description="Convert CSV to JSON and JSON to CSV."
      category={cat}
      toolId={toolId}
    >
      <CsvToJsonWrapper />

      <LearningHub title="Understanding CSV Parsing Algorithms">
        
        <LearningSection type="architecture" title="The Escaping Problem">
          <p>CSV (Comma-Separated Values) seems like the simplest format in the world: just split strings by commas. However, a naive <code>string.split(',')</code> algorithm fails immediately in the real world.</p>
          <p className="mt-2">What if a user's address is <code>"123 Main St, Apt 4"</code>? If you blindly split by commas, you just broke one column into two, corrupting the entire row's data mapping.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Quoting Rule (RFC 4180)">
          <p>To fix the comma problem, the CSV standard dictates that if a field contains a comma (or a newline), the entire field must be wrapped in double quotes: <code>"123 Main St, Apt 4"</code>.</p>
          <p className="mt-2">But what if the field itself contains a quote? E.g., <code>Bob "The Builder" Smith</code>. In CSV, internal quotes are escaped by doubling them up: <code>"Bob ""The Builder"" Smith"</code>.</p>
        </LearningSection>

        <LearningSection type="performance" title="State Machines vs Regex">
          <p>Because of these recursive escaping rules, you cannot reliably parse CSV with Regular Expressions.</p>
          <p className="mt-2">Robust CSV parsers (like the one powering this tool) use a <strong>State Machine</strong>. The parser iterates through the file character-by-character, keeping track of its current state (e.g., <code>isInsideQuotes = true</code>). When it sees a comma, it only splits the column if <code>isInsideQuotes</code> is false. This is computationally heavier than a regex split, but guarantees 100% data integrity.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does a naive 'string.split(',')' approach fail when parsing real-world CSV files?",
                options: [
                  "Because CSV files use semicolons, not commas.",
                  "Because real-world data often contains commas within the actual values (like addresses), which would falsely trigger a column split.",
                  "Because the split function is too slow for large files.",
                  "Because it deletes the header row."
                ],
                correctIndex: 1,
                explanation: "Values like 'Smith, John' will be split into two separate columns 'Smith' and ' John', ruining the structure of the data."
              },
              {
                question: "According to the CSV standard, how do you escape a double quote character inside a value?",
                options: [
                  "By using a backslash before the quote (\\\").",
                  "By doubling the double quote (\"\").",
                  "By wrapping the quote in single quotes ('\"').",
                  "You cannot use double quotes in a CSV file."
                ],
                correctIndex: 1,
                explanation: "Unlike JSON or C which use backslashes, CSV escapes double quotes by writing two double quotes in a row: \"He said \"\"Hello\"\"\"."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
