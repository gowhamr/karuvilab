import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import CipherToolsWrapper from './CipherToolsWrapper';

const toolId = 'cipher-tools';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Text Cipher Tools"
      description="Caesar, ROT13, Vigenere, XOR ciphers."
      category={cat}
      toolId={toolId}
    >
      <CipherToolsWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-ciphers"
          title="How it Works: Historical Substitution Ciphers"
          preview="Learn why ancient cryptography is easily broken today."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Classical ciphers like the Caesar and Vigenère cipher paved the way for modern cryptography. They are known as <strong>Substitution Ciphers</strong> because they substitute one letter for another based on a specific algorithm.
            </p>
            <h3>The Caesar Cipher (Shift)</h3>
            <p>
              Used by Julius Caesar to send military messages, this cipher simply shifts every letter in the alphabet by a fixed number. If the shift is 3, 'A' becomes 'D'. Because there are only 25 possible shifts in the English alphabet, this cipher can be broken in seconds using a brute-force attack.
            </p>
            <h3>Frequency Analysis</h3>
            <p>
              Even if a substitution cipher uses a random mapping (e.g. 'A' maps to 'Q', 'B' maps to 'X'), it is still insecure. In the English language, the letter 'E' appears about 12.7% of the time. 'T' appears 9%. By analyzing a large block of ciphertext and counting the frequency of the letters, cryptanalysts can quickly deduce the mapping. This technique, known as <strong>Frequency Analysis</strong>, rendered simple substitution ciphers obsolete by the 9th century.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
