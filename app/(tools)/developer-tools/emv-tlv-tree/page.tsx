import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { emvTlvTree } from '@/src/registry/tools/emv-tlv-tree';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ToolClientWrapper from './ToolClientWrapper';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(emvTlvTree.id);

export default function EmvTlvTreePage() {
  return (
    <ToolShell title={emvTlvTree.name} toolId={emvTlvTree.id} category={cat}>
      <ToolClientWrapper />

      <LearningHub title="Understanding EMV and TLV Protocols">
        
        <LearningSection type="architecture" title="What is TLV?">
          <p>When you insert a chip card into a payment terminal, the card and the terminal do not exchange JSON or XML. They exchange highly compressed binary data formatted in a standard called <strong>EMV (Europay, Mastercard, and Visa)</strong>.</p>
          <p className="mt-2">EMV uses a <strong>TLV (Tag-Length-Value)</strong> encoding scheme. Every piece of data is serialized into three distinct, consecutive parts.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Three Parts">
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Tag:</strong> A 1 or 2 byte hexadecimal identifier (e.g., <code>9F02</code> represents the Amount Authorized).</li>
            <li><strong>Length:</strong> A byte indicating exactly how many bytes the Value payload occupies (e.g., <code>06</code> means the next 6 bytes belong to this tag).</li>
            <li><strong>Value:</strong> The actual data payload (e.g., <code>000000001500</code> representing $15.00).</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="Why use TLV?">
          <p>Smart card microchips have kilobytes of memory and tiny processors powered solely by the electrical contact from the terminal.</p>
          <p className="mt-2">A TLV parser reads a hex string left-to-right. When it sees a Tag, it reads the Length byte, and uses that integer to slice exactly that many bytes forward in memory to extract the Value. It then immediately expects the next byte to be the start of a new Tag. This forward-only, pointer-based parsing is incredibly fast and requires almost zero RAM overhead compared to parsing the brackets and quotes of a JSON string.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In the context of EMV chip cards, what does TLV stand for?",
                options: [
                  "Transaction-Level-Verification",
                  "Tag-Length-Value",
                  "Terminal-Link-Validation",
                  "Total-Ledger-Volume"
                ],
                correctIndex: 1,
                explanation: "Tag-Length-Value is the binary encoding scheme where every data point is prefixed by its identifier (Tag) and its size (Length)."
              },
              {
                question: "Why do EMV cards use TLV instead of JSON?",
                options: [
                  "Because JSON cannot represent hexadecimal numbers.",
                  "Because TLV is a proprietary encrypted format that hackers cannot read.",
                  "Because TLV is extremely memory and CPU efficient, which is required for low-power smart card chips.",
                  "Because JSON was invented by a competing credit card company."
                ],
                correctIndex: 2,
                explanation: "JSON carries heavy text overhead (quotes, braces, verbose keys) and requires complex memory allocation to parse. TLV is lean binary data that can be parsed instantly."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
