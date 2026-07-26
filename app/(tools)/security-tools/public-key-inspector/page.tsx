import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import PublicKeyClientWrapper from './PublicKeyClientWrapper';

const toolId = 'public-key-inspector';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Public Key Inspector"
      description="Inspect SPKI / RSA / EC public keys, calculate fingerprints, and verify public key parameter formats."
      category={cat}
      toolId={toolId}
    >
      <PublicKeyClientWrapper />

      <LearningHub title="Understanding Public Keys & SPKI">
        
        <LearningSection type="architecture" title="The SPKI Standard">
          <p>Public keys are designed to be shared openly. However, just sending the raw mathematical numbers (like an RSA modulus) isn't enough—the receiving computer needs to know what algorithm to use.</p>
          <p className="mt-2">To solve this, public keys are universally formatted using <strong>Subject Public Key Info (SPKI)</strong> (part of the X.509 standard). The SPKI structure contains two parts:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Algorithm Identifier:</strong> An OID (like 1.2.840.113549.1.1.1 for RSA) that tells the parser exactly what math to use.</li>
            <li><strong>Subject Public Key:</strong> A bit string containing the actual mathematical key material.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="api" title="Key Fingerprints">
          <p>A Public Key is hundreds or thousands of characters long. If you want to verify that a server gave you the correct public key over the phone, reading it out loud is impossible.</p>
          <p className="mt-2">Instead, we generate a <strong>Fingerprint</strong> (or Thumbprint). We take the raw DER bytes of the SPKI file and hash them using SHA-256. This produces a short, fixed-length hexadecimal string (e.g., <code>a1:b2:c3...</code>). If two keys have the same fingerprint, they are mathematically guaranteed to be the exact same key.</p>
        </LearningSection>

        <LearningSection type="failures" title="SSH Key Formats">
          <p>A common friction point for developers is that OpenSSH (used for GitHub or connecting to Linux servers) uses a completely different, proprietary format for public keys (e.g., <code>ssh-rsa AAAAB3Nza...</code>).</p>
          <p className="mt-2">SSH public keys do not use SPKI or ASN.1 DER. They use a simple length-prefixed string format. If you try to pass an SSH public key to an SSL/TLS system (which expects SPKI/PEM), it will fail to parse.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary purpose of the SPKI format?",
                options: [
                  "To encrypt the public key so attackers cannot read it.",
                  "To package the raw key material alongside an Algorithm Identifier so parsers know how to use it.",
                  "To compress the public key into a smaller size for faster transmission.",
                  "To combine a public and private key into a single file."
                ],
                correctIndex: 1,
                explanation: "SPKI (Subject Public Key Info) bundles the raw math (the key) with metadata (the OID) so the recipient knows if it's an RSA key, an Elliptic Curve key, etc."
              },
              {
                question: "How is a public key fingerprint calculated?",
                options: [
                  "By taking the first and last 8 characters of the PEM file.",
                  "By running the raw key bytes through a cryptographic hash function like SHA-256.",
                  "By asking a Certificate Authority to assign a random ID to the key.",
                  "By decrypting the private key."
                ],
                correctIndex: 1,
                explanation: "A fingerprint is simply the cryptographic hash (usually SHA-256 or MD5) of the raw binary (DER) public key, creating a short verifiable identity."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
