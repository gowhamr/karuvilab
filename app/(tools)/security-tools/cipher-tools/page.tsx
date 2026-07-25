import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding Historical Ciphers">
        
        <LearningSection type="architecture" title="Substitution Ciphers">
          <p>Classical ciphers like the Caesar and Vigenère cipher paved the way for modern cryptography. They are known as <strong>Substitution Ciphers</strong> because they substitute one letter for another based on a specific algorithmic mapping.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Caesar Cipher (Shift)">
          <p>Used by Julius Caesar to send military messages, this cipher simply shifts every letter in the alphabet by a fixed number. If the shift is 3, 'A' becomes 'D', 'B' becomes 'E', and so on.</p>
          <p className="mt-2">Because there are only 25 possible shifts in the English alphabet, this cipher offers zero real security and can be broken in milliseconds using a brute-force attack.</p>
        </LearningSection>

        <LearningSection type="failures" title="Frequency Analysis">
          <p>Even if a substitution cipher uses a completely random mapping (e.g. 'A' maps to 'Q', 'B' maps to 'X'), it is still inherently insecure.</p>
          <p className="mt-2">In the English language, the letter 'E' appears about 12.7% of the time, while 'T' appears 9%. By analyzing a large block of ciphertext and counting the frequency of the letters, cryptanalysts can quickly deduce the mapping. This technique, known as <strong>Frequency Analysis</strong>, rendered simple substitution ciphers obsolete by the 9th century.</p>
        </LearningSection>

        <LearningSection type="security" title="The Vigenère Cipher">
          <p>To defeat frequency analysis, the Vigenère cipher uses a repeating keyword to apply <em>different</em> Caesar shifts to different letters. It is a <strong>Polyalphabetic Substitution Cipher</strong>.</p>
          <p className="mt-2">While considered "unbreakable" for 300 years, it was eventually broken using the Kasiski examination, which mathematically determines the length of the keyword by looking for repeated sequences in the ciphertext.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is a monoalphabetic substitution cipher (like assigning a random distinct letter to every letter in the alphabet) insecure?",
                options: [
                  "Because computers can brute force the key space in seconds.",
                  "Because it can easily be broken using frequency analysis of the underlying language.",
                  "Because the ciphertext is longer than the plaintext.",
                  "Because it requires a prime number as the key."
                ],
                correctIndex: 1,
                explanation: "Even with 26! (factorial) possible keys preventing brute force, the natural frequency of letters in a language (like 'e' being the most common) shines right through the cipher."
              },
              {
                question: "Which of the following ciphers applies a variable shift to each letter based on a repeating keyword?",
                options: [
                  "Caesar Cipher",
                  "ROT13",
                  "Vigenère Cipher",
                  "AES"
                ],
                correctIndex: 2,
                explanation: "The Vigenère Cipher is a polyalphabetic cipher that changes the shift for every letter using a keyword, historically defeating basic frequency analysis."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
