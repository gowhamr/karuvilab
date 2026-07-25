import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import RsaKeyGenClientWrapper from './RsaKeyGenClientWrapper';

const toolId = 'rsa-key-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="RSA Key Generator"
      description="Generate RSA Public & Private keypairs (1024, 2048, 3072, 4096-bit) in PEM format. 100% private local Web Crypto generation."
      category={cat}
      toolId={toolId}
    >
      <RsaKeyGenClientWrapper />

      <LearningHub title="Understanding RSA Cryptography">
        <LearningSection type="architecture" title="Asymmetric Cryptography">
          <p>RSA (Rivest-Shamir-Adleman) is an <strong>asymmetric</strong> cryptographic algorithm. This means it uses a pair of mathematically linked keys: a <strong>Public Key</strong> (which can be shared with anyone) and a <strong>Private Key</strong> (which must be kept secret).</p>
          <p className="mt-2">Data encrypted with the public key can only be decrypted by the private key. Conversely, data signed by the private key can be verified by the public key.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Math Behind RSA">
          <p>RSA's security relies on the practical difficulty of factoring the product of two very large prime numbers (the "factoring problem").</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Key Size:</strong> A 1024-bit key is no longer considered secure against well-funded attackers. 2048-bit is the current minimum standard, and 4096-bit is used for highly sensitive systems.</li>
            <li><strong>Public Exponent (e):</strong> Usually set to 65537 (0x10001). This prime number offers a great balance of fast encryption and strong security against certain attacks.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="PEM Format (PKCS#8 & SPKI)">
          <p>PEM (Privacy-Enhanced Mail) is a Base64 encoded format with header and footer lines.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>PKCS#8:</strong> A standard syntax for storing private key information (<code>BEGIN PRIVATE KEY</code>).</li>
            <li><strong>SPKI (Subject Public Key Info):</strong> The standard structure for public keys (<code>BEGIN PUBLIC KEY</code>), typically found in X.509 certificates.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Quantum Computing Threat">
          <p>Shor's algorithm, running on a sufficiently powerful quantum computer, could factor the large primes used in RSA exponentially faster than classical computers, completely breaking RSA security. This is driving the current industry shift towards <strong>Post-Quantum Cryptography (PQC)</strong> algorithms.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If Alice wants to send a secret encrypted message to Bob using RSA, which key should she use to encrypt the message?",
                options: ["Alice's Private Key", "Alice's Public Key", "Bob's Private Key", "Bob's Public Key"],
                correctIndex: 3,
                explanation: "Alice encrypts the message with Bob's Public Key. That way, only Bob (who possesses the corresponding Private Key) can decrypt and read it."
              },
              {
                question: "Why is a 1024-bit RSA key no longer recommended for production use?",
                options: [
                  "It is too slow to generate",
                  "It cannot encrypt files larger than 1MB",
                  "Advances in computing power have made it feasible to factor 1024-bit moduli",
                  "It is incompatible with modern browsers"
                ],
                correctIndex: 2,
                explanation: "Moore's Law and distributed computing have made factoring 1024-bit numbers feasible for well-resourced attackers. 2048-bit or higher is required today."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
