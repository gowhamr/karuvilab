import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import AesClientWrapper from './AesClientWrapper';

const toolId = 'aes-encrypt-decrypt';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AES Encrypt / Decrypt"
      description="Encrypt and decrypt text using AES-256-GCM or AES-256-CBC with PBKDF2 key derivation. 100% browser-native & private."
      category={cat}
      toolId={toolId}
    >
      <AesClientWrapper />

      <LearningHub title="Understanding Symmetric Encryption">
        <LearningSection type="architecture" title="What is AES?">
          <p>The Advanced Encryption Standard (AES) is a symmetric encryption algorithm established by NIST in 2001. "Symmetric" means the exact same key is used to both encrypt and decrypt the data.</p>
          <p className="mt-2">AES is a <strong>block cipher</strong>. It doesn't encrypt the data letter by letter; instead, it breaks the plaintext into 128-bit blocks and scrambles each block through a complex mathematical process (substitution, permutation, and mixing) over multiple rounds.</p>
        </LearningSection>

        <LearningSection type="security" title="GCM vs CBC Modes">
          <p>Because encrypting the exact same block of text with the same key always produces the exact same output, block ciphers use "modes of operation" and an Initialization Vector (IV) to introduce randomness.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>CBC (Cipher Block Chaining):</strong> XORs the previous encrypted block with the current unencrypted block. It provides confidentiality but lacks built-in integrity checking.</li>
            <li><strong>GCM (Galois/Counter Mode):</strong> The modern standard. It encrypts the data and simultaneously generates an <strong>Authentication Tag</strong>. This guarantees <em>Authenticated Encryption</em>—if an attacker alters even a single bit of the encrypted payload, the decryption function will instantly reject it.</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Key Derivation (PBKDF2)">
          <p>AES mathematically requires a cryptographic key of an exact length (e.g., 256 bits). However, humans use passwords of varying lengths. To solve this, we use a <strong>Key Derivation Function (KDF)</strong> like PBKDF2.</p>
          <p className="mt-2">PBKDF2 takes the human password, adds a random Salt, and hashes it thousands of times (iterations) to stretch it into a perfect 256-bit AES key while intentionally slowing down brute-force attackers.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Initialization Vector (IV) Trap">
          <p>When using AES-GCM, the Initialization Vector (IV) must be strictly unique (a <em>nonce</em>) for every single encryption operation using the same key.</p>
          <p className="mt-2"><strong>Catastrophic Failure:</strong> If you ever reuse the exact same IV and Key combination twice in AES-GCM, an attacker can mathematically recover the authentication key and easily forge messages! Never hardcode the IV; always generate a new random IV using <code>crypto.getRandomValues()</code> for every encryption.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary advantage of AES-GCM over AES-CBC?",
                options: [
                  "GCM is a public key algorithm, while CBC is symmetric.",
                  "GCM provides Authenticated Encryption (integrity), rejecting tampered data automatically.",
                  "GCM does not require an Initialization Vector (IV).",
                  "GCM can encrypt data without a password."
                ],
                correctIndex: 1,
                explanation: "GCM provides both confidentiality and data integrity by generating an authentication tag. CBC only provides confidentiality."
              },
              {
                question: "What happens if you accidentally reuse the same Initialization Vector (IV) multiple times with the same key in AES-GCM?",
                options: [
                  "The encryption becomes slightly slower.",
                  "The browser throws an 'InvalidStateError'.",
                  "It causes a catastrophic security failure, allowing attackers to forge messages.",
                  "Nothing, it is perfectly safe to reuse IVs as long as the key is secret."
                ],
                correctIndex: 2,
                explanation: "AES-GCM turns into a stream cipher. Reusing the nonce destroys the security of the authentication tag, allowing attackers to manipulate the ciphertext."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
