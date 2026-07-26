import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ISO8583ParserClientWrapper from './ISO8583ParserClientWrapper';

const toolId = 'iso8583-message-parser';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ISO 8583 Message Parser"
      description="Parse financial ISO 8583 payment messages, MTI, bitmaps, and data elements directly in your browser."
      category={cat}
      toolId={toolId}
    >
      <ISO8583ParserClientWrapper />

      <LearningHub title="Understanding ISO 8583 Messages">
        
        <LearningSection type="architecture" title="Message Type Indicator (MTI)">
          <p>The first 4 characters of any ISO 8583 message (like <code>0100</code> or <code>0210</code>) are the MTI. This defines the exact purpose of the message.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>0100:</strong> Authorization Request (asking if funds are available).</li>
            <li><strong>0110:</strong> Authorization Response (bank says yes/no).</li>
            <li><strong>0200:</strong> Financial Request (authorizing and charging the account).</li>
            <li><strong>0400:</strong> Reversal Request (cancelling a previous transaction).</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="api" title="Data Elements (Fields)">
          <p>After the MTI and the Bitmap, the message contains the actual data (Data Elements). The data format is extremely strict. Fields can be fixed-length (e.g., Field 4, Amount, is exactly 12 digits) or variable-length.</p>
          <p className="mt-2">Variable-length fields (like Field 2, the PAN) are prefixed with an LL or LLL (Length Indicator). For example, if a PAN is 16 digits, it is stored as <code>164111222233334444</code> (where the first two digits '16' tell the parser to read the next 16 characters).</p>
        </LearningSection>

        <LearningSection type="security" title="Security & PCI">
          <p>ISO 8583 messages traverse multiple networks (Merchant, Payment Gateway, Switch, Acquirer, Issuer). Because they contain the full PAN (Field 2) and Expiration Date (Field 14), these messages are highly sensitive.</p>
          <p className="mt-2">While the PIN block (Field 52) is strongly encrypted, the rest of the message is historically sent in plain text over dedicated lease-lines, though modern implementations wrap the TCP connection in mutually-authenticated TLS (mTLS).</p>
        </LearningSection>

        <LearningSection type="failures" title="Parsing Failures (Length Prefix Bugs)">
          <p>The most common crash when parsing ISO 8583 occurs in variable-length fields. If an LLVar field contains <code>05ABCDE</code>, the length is 5. If a developer accidentally writes code that assumes the length is fixed, or calculates the length indicator incorrectly, the parser pointer gets misaligned.</p>
          <p className="mt-2">Because there are no delimiters (like commas in CSV or brackets in JSON), a single misaligned byte will cause all subsequent fields to be populated with garbage data, failing the transaction.</p>
        </LearningSection>

        <LearningSection type="standards" title="Standards & References">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>ISO 8583-1:2003:</strong> The official international standard for financial transaction card originated messages.</li>
            <li><strong>PCI-DSS:</strong> Governs how the PAN (Field 2) and Track Data (Field 35) must be masked and secured at rest and in transit.</li>
            <li><strong>References:</strong> <a href="https://en.wikipedia.org/wiki/ISO_8583" target="_blank" rel="noreferrer" className="text-primary hover:underline">Wikipedia: ISO 8583</a></li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Real-World Examples">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>0100 Authorization:</strong> Used when a gas station puts a $50 hold on your card before you pump.</li>
            <li><strong>0400 Reversal:</strong> Used when an ATM fails to dispense cash, so the terminal automatically tells the bank to cancel the previous 0200 withdrawal.</li>
            <li><strong>0800 Network Echo:</strong> Used by terminals to ping the bank's servers every few minutes to ensure the network lease-line is still active.</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What does an MTI of '0200' indicate in ISO 8583?",
                options: [
                  "A Reversal Request",
                  "A Financial Transaction Request (Purchase)",
                  "A Network Management Message",
                  "A Response from the Bank"
                ],
                correctIndex: 1,
                explanation: "0200 is the standard request for a financial transaction. The '0' in the 3rd position indicates a Request. A '1' (0210) indicates a Response."
              },
              {
                question: "If Field 2 (Primary Account Number) is defined as 'LLVAR' (variable length up to 99), how does the parser know where the account number ends?",
                options: [
                  "It looks for a null-terminator byte (0x00) at the end of the string.",
                  "It reads the first two digits (LL) which specify exactly how many characters follow.",
                  "It parses exactly 16 characters because credit cards are always 16 digits.",
                  "It waits for a comma delimiter."
                ],
                correctIndex: 1,
                explanation: "LLVAR means the data is prefixed with a 2-digit length. If the data is 19 digits long, it will be prefixed with '19', telling the parser to read the next 19 bytes."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
