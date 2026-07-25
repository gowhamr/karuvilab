import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import RsaSignClientWrapper from './RsaSignClientWrapper';

const toolId = 'rsa-sign-verify';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="RSA Sign / Verify"
      description="Create RSASSA-PKCS1-v1_5 digital signatures with a private key and verify them with a public key."
      category={cat}
      toolId={toolId}
    >
      <RsaSignClientWrapper />

      <LearningHub title="Understanding Digital Signatures">
        <LearningSection type="architecture" title="Encryption vs Signing">
          <p>In public-key cryptography (like RSA), you have two keys: a Public Key (shared with the world) and a Private Key (kept secret). Most people associate RSA with encryption, but it is equally important for <strong>Authentication</strong>.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Encryption:</strong> Someone uses your Public Key to lock a message. Only you can unlock it with your Private Key. This provides <em>confidentiality</em>.</li>
            <li><strong>Signing:</strong> You use your Private Key to "lock" (sign) a message. Anyone in the world can "unlock" (verify) it using your Public Key. This provides <em>authenticity</em>.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="security" title="The Signing Process">
          <p>Because RSA operations are mathematically slow and have strict size limits, we rarely sign the entire message directly. Instead, the process works like this:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li>The computer hashes the original message using an algorithm like SHA-256.</li>
            <li>The computer encrypts that small, fixed-length hash using your Private Key. This encrypted hash is the "Signature".</li>
            <li>To verify it, the receiver decrypts the signature using your Public Key to get the hash. They then hash the message themselves. If the two hashes match perfectly, it guarantees that (a) you wrote the message, and (b) nobody altered it in transit.</li>
          </ol>
        </LearningSection>

        <LearningSection type="api" title="RSASSA-PKCS1-v1_5 vs PSS">
          <p>When creating a signature, Web Crypto offers two main RSA padding schemes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>RSASSA-PKCS1-v1_5:</strong> The older, extremely common standard (this is what JSON Web Tokens use for the RS256 algorithm).</li>
            <li><strong>RSA-PSS (Probabilistic Signature Scheme):</strong> A newer, more robust standard that introduces randomness into the signature process, meaning signing the same message twice yields different signatures (yet both remain mathematically valid).</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "When creating a digital signature, which key must the sender use?",
                options: ["The Sender's Public Key", "The Sender's Private Key", "The Receiver's Public Key", "The Receiver's Private Key"],
                correctIndex: 1,
                explanation: "The sender uses their own Private Key to create the signature. This proves they are the only person who could have created it, ensuring authenticity."
              },
              {
                question: "Why do we hash the message before signing it with RSA, rather than signing the message directly?",
                options: [
                  "Because hashing makes the signature look like Base64.",
                  "Because RSA can only encrypt very small amounts of data (smaller than the key size).",
                  "Because hashes are reversible, allowing the receiver to read the message.",
                  "Because hashing encrypts the message securely."
                ],
                correctIndex: 1,
                explanation: "RSA has a strict payload size limit (e.g., 256 bytes for a 2048-bit key). By hashing a 1GB file down to a 32-byte SHA-256 hash, we can easily sign the hash to securely verify the entire 1GB file."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
