import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { emvTlvTree } from '@/src/registry/tools/emv-tlv-tree';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(emvTlvTree.id);

export default function EmvTlvTreePage() {
  return (
    <ToolShell title={emvTlvTree.name} toolId={emvTlvTree.id} category={cat}>
      <ToolClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-tlv"
          title="How it Works: Tag-Length-Value"
          preview="Learn the binary protocol that powers every chip card on earth."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you insert a chip card into a payment terminal, they do not exchange JSON or XML. They exchange binary data formatted in a standard called <strong>EMV (Europay, Mastercard, and Visa)</strong>, which uses a <strong>TLV (Tag-Length-Value)</strong> encoding scheme.
            </p>
            <h3>Parsing TLV</h3>
            <p>
              A TLV structure is exactly what it sounds like. Every piece of data is sent in three consecutive parts:
            </p>
            <ol>
              <li><strong>Tag:</strong> A 1 or 2 byte identifier (e.g. <code>9F02</code> represents the Amount Authorized).</li>
              <li><strong>Length:</strong> A byte indicating exactly how many bytes the Value is (e.g. <code>06</code> means the next 6 bytes are the value).</li>
              <li><strong>Value:</strong> The actual data payload (e.g. <code>000000001500</code> for $15.00).</li>
            </ol>
            <p>
              This parser reads a hex string left-to-right. When it sees a Tag, it reads the Length byte, and uses that integer to slice exactly that many bytes forward to extract the Value. It then immediately expects the next byte to be the start of a new Tag. This makes parsing incredibly fast and space-efficient for smart cards with tiny processors.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
