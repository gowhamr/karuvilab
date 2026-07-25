import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { coreBankingParser } from '@/src/registry/tools/core-banking-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(coreBankingParser.id);

export default function CoreBankingParserPage() {
  return (
    <ToolShell 
      toolId={coreBankingParser.id}
      title={coreBankingParser.name}
      description={coreBankingParser.desc}
      category={cat}
    >
      <ToolClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-iso8583"
          title="How it Works: Legacy Mainframe Formats"
          preview="Learn why banks still use flat files instead of JSON."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If you look at the raw output of a core banking system, you won't see nicely formatted JSON or XML. You'll likely see a massive block of text where every character's position has a specific meaning. This is often based on or inspired by <strong>ISO-8583</strong>, the international standard for financial transaction card originated interchange messaging.
            </p>
            <h3>Fixed-Width vs Delimited</h3>
            <p>
              Legacy mainframes written in COBOL were built in an era where memory was incredibly expensive. To save space, they didn't use variable names like <code>"account_number": "12345"</code>.
            </p>
            <ul>
              <li><strong>Fixed-Width:</strong> The system simply knows that characters 1 through 16 are the account number, characters 17 through 28 are the balance, and characters 29 through 31 are the currency code.</li>
              <li><strong>Bitmap Routing:</strong> Modern variations use a "bitmap" (a string of 1s and 0s) at the start of the message. If the 3rd bit is a <code>1</code>, it means "Processing Code is present". If it's a <code>0</code>, the parser knows to skip it and look for the next data element.</li>
            </ul>
            <p>
              This parser tool reads these positional schemas and maps them back into human-readable tables so engineers can debug transaction failures without manually counting characters on a screen.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
