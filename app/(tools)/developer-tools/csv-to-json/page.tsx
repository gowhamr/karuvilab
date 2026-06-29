import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
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
    </ToolShell>
  );
}
