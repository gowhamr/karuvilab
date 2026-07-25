import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import EcdsaClientWrapper from './EcdsaClientWrapper';

const toolId = 'ecdsa-sign';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ECDSA Sign & Verify"
      description="Generate Elliptic Curve keypairs (P-256, P-384, P-521), create ECDSA signatures, and verify messages natively."
      category={cat}
      toolId={toolId}
    >
      <EcdsaClientWrapper />

      <LearningHub title="Understanding Elliptic Curve Cryptography">
        <LearningSection type="architecture" title="The Shift Away from RSA">
          <p>For decades, RSA was the gold standard of public-key cryptography. However, RSA relies on the mathematical difficulty of factoring massively large prime numbers. As computers got faster, RSA keys had to get longer and longer to stay secure, bloating up to 2048 or 4096 bits.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Curve">
          <p>Elliptic Curve Cryptography (ECC) uses completely different math: the algebraic structure of elliptic curves over finite fields. The math is so structurally strong that a tiny 256-bit ECC key (using the P-256 curve) offers the exact same level of cryptographic security as a massive 3072-bit RSA key.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Speed & Size:</strong> Because the keys and signatures are a fraction of the size, they are vastly faster to generate, transmit, and verify.</li>
            <li><strong>Adoption:</strong> This is why Bitcoin (secp256k1), Apple's Secure Enclave, physical YubiKeys, and modern TLS connections have all migrated away from RSA to ECDSA (Elliptic Curve Digital Signature Algorithm).</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Web Crypto API vs Node.js">
          <p>When working with ECDSA in the browser via Web Crypto (<code>crypto.subtle.sign</code>), the signature output is returned as a <strong>Raw (IEEE P1363)</strong> format. This is simply the <code>r</code> and <code>s</code> values concatenated together (e.g., exactly 64 bytes for P-256).</p>
          <p className="mt-2">However, Node.js and OpenSSL default to the <strong>DER (ASN.1)</strong> format, which includes extra length bytes and headers. A signature generated in the browser will fail verification in Node (and vice-versa) unless you explicitly convert between Raw and DER formatting.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Nonce (k) Reuse Catastrophe">
          <p>When generating an ECDSA signature, the algorithm requires a completely random number <code>k</code> (a nonce) for that specific signature.</p>
          <p className="mt-2"><strong>The fatal flaw:</strong> If an implementer accidentally uses the exact same random number <code>k</code> to sign two different messages with the same private key, an attacker can use simple high-school algebra to instantly calculate the Private Key! This exact failure was famously exploited in 2010 to completely compromise the Sony PlayStation 3's master signing key.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why has modern cryptography largely shifted from RSA to ECDSA?",
                options: [
                  "Because RSA cannot be used to sign messages.",
                  "Because ECDSA provides the same level of security with significantly smaller keys and faster processing.",
                  "Because ECDSA is symmetric, whereas RSA is asymmetric.",
                  "Because RSA is patented and costs money to use."
                ],
                correctIndex: 1,
                explanation: "A 256-bit ECDSA key provides the same security as a 3072-bit RSA key. The smaller size drastically reduces bandwidth and CPU requirements, making it ideal for the modern web, IoT, and mobile devices."
              },
              {
                question: "What happens if a developer's random number generator is broken, causing them to reuse the same random nonce (k) for two different ECDSA signatures?",
                options: [
                  "The second signature simply fails to generate.",
                  "The verifier will reject the signature as invalid.",
                  "An attacker can use the two signatures to mathematically calculate the Private Key.",
                  "Nothing, it just generates the exact same signature twice."
                ],
                correctIndex: 2,
                explanation: "ECDSA's math relies on the uniqueness of the nonce. Reusing it across two signatures creates a solvable algebraic equation that reveals the private key. This is why deterministic ECDSA (RFC 6979) was invented to safely generate k via hashing."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
