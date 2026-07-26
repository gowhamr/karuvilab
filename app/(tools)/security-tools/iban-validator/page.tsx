import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import IbanClientWrapper from './IbanClientWrapper';

const toolId = 'iban-validator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="IBAN & SWIFT/BIC Code Validator"
      description="Validate International Bank Account Numbers (IBAN) using ISO 13616 Mod-97 and verify SWIFT/BIC codes."
      category={cat}
      toolId={toolId}
    >
      <IbanClientWrapper />

      <LearningHub title="Understanding IBAN and Mod-97">
        
        <LearningSection type="architecture" title="The Global Standard">
          <p>The International Bank Account Number (IBAN) is an internationally agreed system of identifying bank accounts across national borders to facilitate the communication and processing of cross-border transactions.</p>
          <p className="mt-2">It consists of up to 34 alphanumeric characters comprising a Country Code, two Check Digits, and a Basic Bank Account Number (BBAN) containing bank and routing details.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Modulo 97 Checksum (ISO 13616)">
          <p>How does a payment form instantly know you mistyped your IBAN without making a slow network request to a bank?</p>
          <p className="mt-2">It uses the <strong>Mod-97-10</strong> algorithm. To validate an IBAN, the algorithm moves the four initial characters (Country Code and Check Digits) to the end of the string. It converts the letters to integers (A=10, B=11, Z=35), resulting in a massive integer.</p>
          <p className="mt-2">It then performs a modulo 97 operation (<code>number % 97</code>). If the remainder is exactly <strong>1</strong>, the IBAN is mathematically valid.</p>
        </LearningSection>

        <LearningSection type="performance" title="Handling Massive Integers">
          <p>The integer generated during the Mod-97 check can be over 60 digits long. This introduces a major engineering problem in JavaScript.</p>
          <p className="mt-2">JavaScript's native <code>Number</code> type is a double-precision float. It loses precision (corrupting the math) for any integer larger than <code>9,007,199,254,740,991</code> (16 digits). To correctly calculate the modulo of a 60-digit number in the browser, modern implementations must use the <code>BigInt</code> primitive (e.g., <code>123456789n % 97n === 1n</code>).</p>
        </LearningSection>

        <LearningSection type="failures" title="Validation vs Verification">
          <p>A common misconception in fintech engineering is confusing validation with verification. The Mod-97 algorithm <strong>validates</strong> the checksum—it proves the number was typed correctly.</p>
          <p className="mt-2">It does <strong>not verify</strong> that the bank account actually exists, that it belongs to the user, or that it is open and active. Verification always requires a backend network request to a banking API.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If the Mod-97 checksum calculation on an IBAN returns a remainder of 1, what does that mean?",
                options: [
                  "The bank account is active and funded.",
                  "The IBAN is mathematically valid and does not contain typographical errors.",
                  "The bank account belongs to a corporate entity.",
                  "The IBAN is invalid and contains a typo."
                ],
                correctIndex: 1,
                explanation: "A remainder of 1 strictly proves that the check digits match the rest of the account number, confirming no typos were made."
              },
              {
                question: "Why must you use the BigInt data type when writing a JavaScript function to validate an IBAN?",
                options: [
                  "Because IBANs contain letters, and normal Numbers only support digits.",
                  "Because BigInt is faster than the native Number type.",
                  "Because the converted IBAN integer is up to 60 digits long, far exceeding JavaScript's max safe integer limit.",
                  "Because Mod-97 requires cryptographic precision."
                ],
                correctIndex: 2,
                explanation: "Standard JS Numbers lose precision after 16 digits. A 60-digit number would be rounded, completely breaking the modulo calculation. BigInt is required."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
