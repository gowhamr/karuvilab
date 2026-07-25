import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import CardMaskerClientWrapper from './CardMaskerClientWrapper';

const toolId = 'card-masker';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Credit Card & PAN Masker"
      description="Mask primary account numbers (PAN) for PCI-DSS compliance and secure logging (First 6 / Last 4 formatting)."
      category={cat}
      toolId={toolId}
    >
      <CardMaskerClientWrapper />

      <LearningHub title="Understanding Data Masking and PCI-DSS">
        
        <LearningSection type="standards" title="PCI-DSS Compliance">
          <p>The Payment Card Industry Data Security Standard (PCI-DSS) is a set of strict security standards designed to ensure that all companies that accept, process, store or transmit credit card information maintain a secure environment.</p>
          <p className="mt-2">A core rule of PCI-DSS is that the Primary Account Number (PAN) must be unreadable anywhere it is stored, including application logs, databases, and receipts.</p>
        </LearningSection>
        
        <LearningSection type="architecture" title="The First 6 / Last 4 Rule">
          <p>When masking a PAN for display (like on a printed receipt or an online checkout page), PCI-DSS explicitly allows displaying the <strong>First 6</strong> and the <strong>Last 4</strong> digits of the card (e.g., <code>411122******1111</code>).</p>
          <p className="mt-2">The First 6 digits represent the Bank Identification Number (BIN) and the Last 4 digits are used by the customer to identify which card they used. The middle digits (the specific account number) must always be masked.</p>
        </LearningSection>

        <LearningSection type="failures" title="Logging Disasters">
          <p>A common engineering failure occurs when developers log the entire HTTP request or API payload to a central logging system (like Datadog or Splunk) for debugging purposes.</p>
          <p className="mt-2">If that payload contains an unmasked PAN, the entire logging cluster instantly falls under PCI compliance scope, which is a catastrophic compliance violation. Proper middleware must always redact or mask PANs <em>before</em> they are sent to logs.</p>
        </LearningSection>

        <LearningSection type="api" title="Luhn Algorithm Validation">
          <p>Before masking or processing a card, systems often use the <strong>Luhn Algorithm</strong> (Modulus 10). It is a simple checksum formula used to validate a variety of identification numbers.</p>
          <p className="mt-2">It detects accidental typos (like entering a 4 instead of a 5). It does <em>not</em> detect malicious attacks or verify that the card is actually authorized by the bank—it simply confirms the number is mathematically possible.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "According to PCI-DSS, which digits of a Primary Account Number (PAN) are you generally allowed to display in plain text on a receipt?",
                options: [
                  "The First 4 and Last 4.",
                  "The First 6 and Last 4.",
                  "Only the Last 4.",
                  "You must mask the entire number."
                ],
                correctIndex: 1,
                explanation: "PCI-DSS allows the First 6 (BIN) and Last 4 to be displayed. The middle digits must be masked to protect the account number."
              },
              {
                question: "What is the primary purpose of the Luhn Algorithm in credit card processing?",
                options: [
                  "To encrypt the credit card number before transmission.",
                  "To securely verify the user's PIN.",
                  "To catch accidental typos or transcription errors by validating the checksum.",
                  "To check if the user's bank account has sufficient funds."
                ],
                correctIndex: 2,
                explanation: "The Luhn Algorithm is a checksum. It protects against accidental errors (like a user mistyping a digit), but offers no cryptographic security."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
