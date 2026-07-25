import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-jsoncsv"
          title="How it Works: Flattening Nested Structures"
          preview="Learn how 3D JSON data is squashed into 2D CSV tables."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              JSON is a hierarchical (3D) data structure. A user object can contain an address object, which can contain an array of phone numbers. CSV, however, is strictly a flat (2D) table of rows and columns.
            </p>
            <h3>The Flattening Algorithm</h3>
            <p>
              When converting JSON to CSV, the converter has to flatten this tree structure. It does this by creating composite column names using dot-notation. For example, if a JSON object has <code>{"{"} user: {"{"} name: "Alice" {"}"} {"}"}</code>, the CSV column header becomes <code>user.name</code>.
            </p>
            <p>
              However, arrays inside JSON are notoriously difficult to represent in CSV. If a user has 3 phone numbers, does the converter create 3 separate rows (duplicating the user's name), or does it create 1 row with a JSON-stringified array in the phone column? This converter uses stringified arrays for nested lists to ensure one JSON object strictly equals one CSV row.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
