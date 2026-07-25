import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import NumeralConverterClientWrapper from './NumeralConverterClientWrapper';

const toolId = 'numeral-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Numeral & Encoding Converter"
      description="Universal encoding converter. Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text. Auto-detect format and convert to all others instantly."
      category={cat}
      toolId={toolId}
    >
      <NumeralConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-encodings"
          title="How it Works: Base64 vs Hexadecimal"
          preview="Learn why developers use Base64 to send images over text-only APIs."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Underneath everything, computers only understand binary (0s and 1s). However, humans and many internet protocols (like HTTP and JSON) are designed to handle standard text characters (A-Z, 0-9). 
            </p>
            <p>
              When a developer needs to send a binary file (like an Image or a PDF) inside a JSON payload, they must encode the binary data into text.
            </p>
            <h3>Hexadecimal (Base-16)</h3>
            <p>
              Hexadecimal uses 16 characters (0-9 and A-F) to represent binary data. Every byte (8 bits) can be perfectly represented by exactly 2 Hex characters (e.g., <code>11111111</code> becomes <code>FF</code>). 
            </p>
            <p>
              Hex is incredibly easy for programmers to read and debug, but it is highly inefficient for data transfer because it doubles the size of the payload.
            </p>
            <h3>Base64</h3>
            <p>
              Base64 was invented to fix the size problem. Instead of 16 characters, it uses 64 characters (A-Z, a-z, 0-9, +, /). Because it has a much larger dictionary, it can pack more binary data into fewer text characters.
            </p>
            <p>
              Base64 groups 24 bits (3 bytes) and translates them into 4 text characters. This means Base64 only increases the payload size by about 33%, making it the industry standard for embedding images directly into HTML/CSS files or sending files through text-based APIs.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
