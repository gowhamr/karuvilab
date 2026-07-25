import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-csv"
          title="How it Works: The Escaping Problem"
          preview="Learn why writing a reliable CSV parser is harder than it looks."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              CSV (Comma-Separated Values) seems like the simplest format in the world: just split strings by commas. However, naive <code>string.split(',')</code> fails immediately in the real world.
            </p>
            <h3>The Quoting Rule</h3>
            <p>
              What if a user's address is <code>"123 Main St, Apt 4"</code>? If you split by commas, you just broke one column into two. To fix this, CSV uses quotes. If a field contains a comma, the entire field must be wrapped in double quotes. 
            </p>
            <p>
              But what if the field itself contains a quote? E.g. <code>"Bob \"The Builder\" Smith"</code>. In CSV, quotes are escaped by doubling them up: <code>"Bob ""The Builder"" Smith"</code>.
            </p>
            <p>
              Because of this, reliable CSV parsers must use state machines (reading character by character) rather than simple regex, keeping track of whether they are currently "inside" a quoted string block or "outside" it when they encounter a comma or newline.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
