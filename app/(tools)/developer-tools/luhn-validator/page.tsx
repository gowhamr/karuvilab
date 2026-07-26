import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import LuhnClientWrapper from './LuhnClientWrapper';

const toolId = 'luhn-validator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Luhn Algorithm Checksum Validator"
      description="Validate credit card numbers, IMEIs, and account IDs using the Luhn Mod 10 checksum algorithm."
      category={cat}
      toolId={toolId}
    >
      <LuhnClientWrapper />

      <LearningHub title="Understanding the Luhn Algorithm">
        
        <LearningSection type="architecture" title="Not Cryptography">
          <p>Invented by IBM scientist Hans Peter Luhn in 1954, the Luhn Algorithm (Modulus 10) is a simple checksum formula used to validate a variety of identification numbers, such as credit card numbers and IMEI numbers.</p>
          <p className="mt-2">It is critical to understand that the Luhn algorithm is <strong>not</strong> designed to be a cryptographically secure hash. Its sole purpose is to protect against accidental human errors, such as a user swapping two adjacent digits (typing 45 instead of 54) or mistyping a single digit during checkout.</p>
        </LearningSection>
        
        <LearningSection type="api" title="How the Math Works">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Starting from the rightmost digit (the check digit) and moving left, double the value of every second digit.</li>
            <li>If the result of a doubling is greater than 9, add the digits of the product together (e.g., 8 * 2 = 16, then 1 + 6 = 7).</li>
            <li>Take the sum of all the resulting digits.</li>
            <li>If the total modulo 10 is equal to 0 (the sum ends in 0), the number is mathematically valid.</li>
          </ol>
        </LearningSection>

        <LearningSection type="performance" title="Client-Side Validation">
          <p>Why do e-commerce sites use this? Because it prevents unnecessary network requests.</p>
          <p className="mt-2">By running the Luhn check locally in JavaScript in the user's browser, the application can instantly alert the user of a typo. If they didn't use this, they would have to send the mistyped card number to the payment gateway (like Stripe or Visa), wait for a network response, and pay a potential API fee just to be told the number was invalid.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary purpose of the Luhn Algorithm?",
                options: [
                  "To encrypt the credit card number before it is sent over the network.",
                  "To verify that the credit card has not been reported stolen.",
                  "To detect accidental transcription errors, like mistyping a single digit.",
                  "To determine the CVV security code of the card."
                ],
                correctIndex: 2,
                explanation: "The Luhn algorithm is a simple checksum. It detects typos (which happens frequently) before making expensive API calls to the bank."
              },
              {
                question: "If a credit card number passes the Luhn check, does that mean the card is authorized and has funds?",
                options: [
                  "Yes, the Luhn check guarantees the card is active.",
                  "No, it only means the number is mathematically well-formed according to the checksum formula.",
                  "Yes, but only for Visa and Mastercard.",
                  "No, it means the card is expired."
                ],
                correctIndex: 1,
                explanation: "Passing the Luhn check simply means the number conforms to the mathematical format. It does not mean the card actually exists in a bank's database or has sufficient funds."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
