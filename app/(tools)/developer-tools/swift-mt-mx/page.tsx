import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { swiftMtMx } from '@/src/registry/tools/swift-mt-mx';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ToolClientWrapper from './ToolClientWrapper';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(swiftMtMx.id);

export default function SwiftMtMxPage() {
  return (
    <ToolShell title={swiftMtMx.name} toolId={swiftMtMx.id} category={cat}>
      <ToolClientWrapper />

      <LearningHub title="Understanding Global Financial Messaging">
        
        <LearningSection type="architecture" title="How Banks Talk to Each Other">
          <p>When a bank in New York sends a billion dollars to a bank in London, they don't send a JSON payload over a standard REST API. They use the SWIFT network (Society for Worldwide Interbank Financial Telecommunication), an incredibly secure messaging system that connects over 11,000 financial institutions.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="MT (Message Text)">
          <p>Created in the 1970s, the SWIFT MT format is heavily optimized for telex machines. An MT103 (Single Customer Credit Transfer) is composed of numeric tags like <code>:20:</code> (Sender's Reference) and <code>:32A:</code> (Value Date, Currency, Amount).</p>
          <p className="mt-2">Because bandwidth was incredibly expensive when this protocol was designed, MT messages are highly compressed and completely unreadable to the untrained eye, relying heavily on character position limits rather than named fields.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Migration to MX (ISO 20022)">
          <p>The global financial system is currently migrating to the ISO 20022 standard, known in SWIFT as MX messages. Unlike the cryptic MT tags, MX messages are heavily structured XML documents.</p>
          <p className="mt-2">While they consume significantly more bandwidth and storage, MX allows for much richer, nested data payloads (like full structured addresses, end-to-end IDs, and detailed remittance information). This rich data is essential for modern Anti-Money Laundering (AML) regulations and automated compliance screening, which MT messages fundamentally cannot support due to length limits.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does the legacy SWIFT MT format use cryptic tags like ':32A:' instead of readable JSON keys like 'transactionAmount'?",
                options: [
                  "To encrypt the data so hackers cannot read it.",
                  "Because it was designed in the 1970s when network bandwidth and storage were incredibly expensive, necessitating extreme compression.",
                  "Because XML had not been invented yet.",
                  "To make it easier for humans to memorize the fields."
                ],
                correctIndex: 1,
                explanation: "The MT protocol was built for Telex machines. Every byte was expensive, so field names were replaced with 2-digit numbers and strict character limits."
              },
              {
                question: "Why is the financial industry forcing a global migration from MT to the new XML-based MX (ISO 20022) format?",
                options: [
                  "Because XML is faster to parse than MT messages.",
                  "Because the new MX format allows for much richer, structured data payloads necessary for modern anti-money laundering (AML) compliance screening.",
                  "Because SWIFT lost the rights to the MT format.",
                  "To reduce the bandwidth used by financial transactions."
                ],
                correctIndex: 1,
                explanation: "Modern regulations require banks to know exactly who is sending and receiving money. The legacy MT format simply didn't have enough characters to fit full structured addresses, whereas the XML MX format does."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
