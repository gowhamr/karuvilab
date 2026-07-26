import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import PrivateKeyClientWrapper from './PrivateKeyClientWrapper';

const toolId = 'private-key-checker';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Private Key Checker"
      description="Check PKCS#8 & PKCS#1 private key syntax, structure, bit lengths, and security parameters 100% locally."
      category={cat}
      toolId={toolId}
    >
      <PrivateKeyClientWrapper />

      <LearningHub title="Understanding Private Keys (PKCS)">
        
        <LearningSection type="architecture" title="PKCS#1 vs PKCS#8">
          <p>When you generate an RSA private key (e.g., using OpenSSL or ssh-keygen), it is usually formatted according to Public-Key Cryptography Standards (PKCS).</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>PKCS#1:</strong> An older standard specifically for RSA keys. The PEM header explicitly says <code>BEGIN RSA PRIVATE KEY</code>.</li>
            <li><strong>PKCS#8:</strong> A modern, universal standard that can hold ANY type of private key (RSA, Elliptic Curve, Ed25519). The PEM header generically says <code>BEGIN PRIVATE KEY</code>. Inside the binary payload, an Object Identifier (OID) tells the parser which algorithm to use.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="api" title="Extracting the Public Key">
          <p>A mathematical quirk of RSA is that the Private Key file actually contains all the numbers necessary to recreate the Public Key.</p>
          <p className="mt-2">An RSA private key payload stores several massive integers: the modulus (n), the public exponent (e), and the private exponent (d). Because the modulus and public exponent are physically present inside the private key file, tools (like this one or OpenSSL) can instantly derive and output the matching public key.</p>
        </LearningSection>

        <LearningSection type="security" title="Client-Side Validation">
          <p>Uploading a highly sensitive Private Key to a remote server just to "check" its format is a catastrophic security failure. If the server logs it, your infrastructure is compromised.</p>
          <p className="mt-2">This tool uses modern WebAssembly (WASM) and JavaScript libraries to parse the ASN.1/DER binary structure 100% locally in your browser memory. The key never touches a network request.</p>
        </LearningSection>

        <LearningSection type="failures" title="Encrypted Keys">
          <p>Keys generated with passwords (encrypted keys) have different headers like <code>BEGIN ENCRYPTED PRIVATE KEY</code>. The binary payload is scrambled using algorithms like PBKDF2 and AES. You cannot parse the structure of an encrypted key without supplying the password first to decrypt the payload back into standard PKCS#8.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary difference between a PKCS#1 and a PKCS#8 private key file?",
                options: [
                  "PKCS#8 is strictly for public keys, while PKCS#1 is for private keys.",
                  "PKCS#1 is exclusively for RSA keys, while PKCS#8 is a universal container for any algorithm (RSA, EC, etc).",
                  "PKCS#1 is encrypted, PKCS#8 is always plaintext.",
                  "PKCS#8 is deprecated and replaced by PKCS#1."
                ],
                correctIndex: 1,
                explanation: "PKCS#8 uses an algorithm identifier (OID) to support multiple cryptography types, whereas PKCS#1 was hardcoded for RSA."
              },
              {
                question: "If you lose your Public Key file but you still have your RSA Private Key file, can you recover the public key?",
                options: [
                  "Yes, the RSA private key contains the modulus and public exponent needed to derive the public key.",
                  "No, the public key must be re-generated from scratch.",
                  "Only if you have the certificate authority's root key.",
                  "Yes, but only by brute-forcing the prime numbers."
                ],
                correctIndex: 0,
                explanation: "An RSA private key data structure intrinsically stores the public components (n and e) alongside the private components, making derivation trivial."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
