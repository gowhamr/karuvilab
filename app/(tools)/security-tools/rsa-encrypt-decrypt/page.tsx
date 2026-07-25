import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import RsaCryptClientWrapper from './RsaCryptClientWrapper';

const toolId = 'rsa-encrypt-decrypt';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="RSA Encrypt / Decrypt"
      description="Encrypt text using an RSA Public Key (OAEP padding) and decrypt using an RSA Private Key. 100% browser execution."
      category={cat}
      toolId={toolId}
    >
      <RsaCryptClientWrapper />

      <LearningHub title="Understanding RSA Encryption">
        <LearningSection type="architecture" title="How Asymmetric Encryption Works">
          <p>RSA encryption allows anyone to encrypt a message using the recipient's <strong>Public Key</strong>. However, only the recipient, holding the mathematically linked <strong>Private Key</strong>, can decrypt and read the message.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Importance of Padding (OAEP)">
          <p>Raw ("textbook") RSA is deterministic and highly vulnerable to chosen-ciphertext attacks. To fix this, padding schemes introduce randomness before encryption.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>PKCS#1 v1.5:</strong> An older padding scheme. It is vulnerable to Bleichenbacher's oracle attacks and is no longer recommended.</li>
            <li><strong>OAEP (Optimal Asymmetric Encryption Padding):</strong> The modern standard. It uses a hash function (like SHA-256) and a mask generation function (MGF1) to securely scramble the plaintext before RSA mathematical operations.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="The Payload Size Limit">
          <p>A common misconception is that RSA can encrypt files. <strong>RSA cannot encrypt data larger than its key size</strong> (minus padding overhead). For a 2048-bit key using OAEP with SHA-256, the maximum payload is just 190 bytes!</p>
          <p className="mt-2 text-sm text-text-4"><em>Real-world usage:</em> Instead of encrypting the actual file with RSA, systems use <strong>Hybrid Encryption</strong>. They generate a random symmetric key (like AES-256), encrypt the large file rapidly with AES, and then use RSA to encrypt <em>only the AES key</em>.</p>
        </LearningSection>

        <LearningSection type="api" title="Web Crypto implementation">
          <pre className="mt-2 bg-surface border border-border p-3 rounded-lg overflow-x-auto text-xs font-mono">
{`const encrypted = await crypto.subtle.encrypt(
  {
    name: "RSA-OAEP" // Required modern padding
  },
  publicKey,
  encodedData
);`}
          </pre>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you have a 1GB video file that you want to send securely to Alice, how should you use RSA?",
                options: [
                  "Encrypt the 1GB video directly using Alice's RSA Public Key.",
                  "Encrypt the video with AES, then encrypt the AES key with Alice's RSA Public Key.",
                  "Encrypt the video with Alice's Private Key.",
                  "Break the 1GB video into 190-byte chunks and encrypt each chunk with RSA."
                ],
                correctIndex: 1,
                explanation: "Hybrid encryption is the industry standard. RSA is too slow and has severe size limits, so we use fast symmetric encryption (AES) for the data, and RSA to securely transmit the symmetric key."
              },
              {
                question: "Why is 'padding' required when encrypting with RSA?",
                options: [
                  "To make the output string look nicer in Base64.",
                  "To compress the payload before encryption.",
                  "To add randomness, preventing attackers from guessing the plaintext or exploiting mathematical patterns.",
                  "Padding is optional and only used for legacy systems."
                ],
                correctIndex: 2,
                explanation: "Without padding (like OAEP), RSA is deterministic: the same message encrypted with the same public key always yields the same ciphertext, making it vulnerable to analysis and attacks."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
