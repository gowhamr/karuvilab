import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-luhn"
          title="How it Works: The Luhn Algorithm"
          preview="Learn how e-commerce sites instantly know you typed your credit card number incorrectly."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Invented by IBM scientist Hans Peter Luhn in 1954, the Luhn Algorithm (or Modulus 10 algorithm) is a simple checksum formula used to validate a variety of identification numbers, such as credit card numbers and IMEI numbers.
            </p>
            <h3>It is not Cryptography</h3>
            <p>
              The Luhn algorithm is <strong>not</strong> designed to be a cryptographically secure hash to protect against hackers. Its sole purpose is to protect against accidental errors, such as a user swapping two adjacent digits (e.g., typing 45 instead of 54) or mistyping a single digit.
            </p>
            <h3>How the Math Works</h3>
            <ol>
              <li>Starting from the rightmost digit (the check digit) and moving left, double the value of every second digit.</li>
              <li>If the result of a doubling is greater than 9, add the digits of the product together (e.g., 8 * 2 = 16, then 1 + 6 = 7).</li>
              <li>Take the sum of all the digits.</li>
              <li>If the total modulo 10 is equal to 0 (the sum ends in 0), the number is valid according to the Luhn formula.</li>
            </ol>
            <p>
              By checking this locally in JavaScript using a tool like this, applications can alert the user of a typo instantly without having to make a slow, expensive API call to a payment gateway.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
