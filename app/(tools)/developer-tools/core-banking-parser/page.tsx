import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { coreBankingParser } from '@/src/registry/tools/core-banking-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ToolClientWrapper from './ToolClientWrapper';

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

      <LearningHub title="Understanding Legacy Mainframe Formats">
        
        <LearningSection type="architecture" title="Fixed-Width Data">
          <p>If you look at the raw output of a core banking system or legacy mainframe, you won't see nicely formatted JSON or XML. You'll likely see a massive block of text where every character's position has a specific meaning. This is often based on or inspired by <strong>ISO-8583</strong>, the international standard for financial transaction messaging.</p>
          <p className="mt-2">Legacy mainframes written in COBOL were built in an era where memory was incredibly expensive. To save space, they didn't use variable names like <code>"account_number": "12345"</code>. The system simply knows that characters 1 through 16 are the account number, characters 17 through 28 are the balance, and so on.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Bitmap Routing">
          <p>Modern variations of these fixed-width schemas use a "bitmap" (a string of 1s and 0s) at the start of the message.</p>
          <p className="mt-2">If the 3rd bit of the bitmap is a <code>1</code>, it means "Data Element 3 (Processing Code) is present in this message". If it's a <code>0</code>, the parser knows to skip it and immediately look for the next data element. This creates a highly compressed, dynamic message structure.</p>
        </LearningSection>

        <LearningSection type="performance" title="Why not migrate to JSON?">
          <p>Many core banking systems process thousands of transactions per second. JSON parsing is extremely CPU intensive compared to reading fixed-width strings from memory offsets.</p>
          <p className="mt-2">Furthermore, rewriting the core ledger logic of a bank (which has run flawlessly for 40 years) introduces massive, unacceptable risk just for the sake of modernizing a data format. Thus, these formats persist today.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do legacy banking systems use fixed-width or bitmap-driven formats instead of JSON?",
                options: [
                  "JSON was not invented when they were built, and fixed-width is far more memory-efficient.",
                  "Fixed-width files are natively encrypted.",
                  "JSON cannot store numbers larger than 32-bit.",
                  "COBOL does not support text."
                ],
                correctIndex: 0,
                explanation: "Legacy systems were built in the 70s and 80s when memory was measured in kilobytes. Fixed-width strips all identifying overhead (like keys and quotes) to save space."
              },
              {
                question: "What is the purpose of a 'bitmap' in an ISO-8583-like financial message?",
                options: [
                  "To store a small profile picture of the customer.",
                  "To encrypt the transaction payload.",
                  "To act as a boolean index indicating exactly which data elements are present in the following payload.",
                  "To map the geographic coordinates of the ATM."
                ],
                correctIndex: 2,
                explanation: "A bitmap (e.g., 10100...) tells the parser exactly which fields are included in the message, allowing the message to be dynamic without using JSON keys."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
