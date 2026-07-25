import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { track2Parser } from '@/src/registry/tools/track-2-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(track2Parser.id);

export default function Track2ParserPage() {
  return (
    <ToolShell title={track2Parser.name} toolId={track2Parser.id} category={cat}>
      <ToolClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-track2"
          title="How it Works: Magnetic Stripe Data"
          preview="Learn how the black strip on the back of your credit card stores your data."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The magnetic stripe on the back of a credit or debit card contains three distinct tracks of data. <strong>Track 2</strong> is the most critical for financial transactions because it is specifically designed to be read by ATMs and Point of Sale (POS) terminals.
            </p>
            <h3>The Format</h3>
            <p>
              Track 2 data is incredibly dense and limited to a very small character set (usually just numbers and the equal sign). A typical Track 2 string looks like this: <code>4000000000000000=2512101000000000000</code>.
            </p>
            <ul>
              <li><strong>PAN:</strong> The string up to the <code>=</code> (or <code>D</code> in hex) is the Primary Account Number (the 16-digit card number).</li>
              <li><strong>Separator:</strong> The <code>=</code> sign acts as a field separator.</li>
              <li><strong>Expiration Date:</strong> The next 4 digits represent YYMM (e.g., <code>2512</code> means December 2025).</li>
              <li><strong>Service Code:</strong> The next 3 digits define how the card can be used (e.g., requires PIN, international usage allowed, chip present).</li>
              <li><strong>Discretionary Data:</strong> The remaining digits are used by the issuing bank for things like CVV1 (which is different from the CVV2 printed on the back of the card) and PIN verification keys.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
