import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import CsrClientWrapper from './CsrClientWrapper';

const toolId = 'csr-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="CSR Generator & Inspector"
      description="Generate PKCS#10 Certificate Signing Requests (CSR) and private keys directly inside your browser."
      category={cat}
      toolId={toolId}
    >
      <CsrClientWrapper />

      <LearningHub title="Understanding Certificate Signing Requests (CSR)">
        
        <LearningSection type="architecture" title="What is a CSR?">
          <p>When you want to secure your website with HTTPS, you need a TLS certificate signed by a trusted Certificate Authority (CA) like Let's Encrypt or DigiCert. However, a certificate requires a <strong>Private Key</strong>.</p>
          <p className="mt-2">You must <strong>never</strong> send your Private Key to anyone, not even the CA. So, how does the CA sign a certificate for your key?</p>
          <p className="mt-2">The solution is the <strong>PKCS#10 Certificate Signing Request (CSR)</strong>. A CSR is a block of text that packages your Public Key and identity info together, proving to the CA that you own the Private Key without actually revealing it.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Anatomy of a CSR">
          <p>A standard CSR contains three main components:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li><strong>Subject Identity:</strong> Your Domain Name (Common Name), Organization, City, Country, etc.</li>
            <li><strong>Public Key:</strong> The public half of the cryptographic keypair you just generated.</li>
            <li><strong>Digital Signature:</strong> A cryptographic signature over the entire CSR, created using your <em>Private Key</em>.</li>
          </ol>
        </LearningSection>

        <LearningSection type="security" title="Proof of Possession">
          <p>The Digital Signature inside the CSR is the most critical security feature. It provides <strong>Proof of Possession (PoP)</strong>.</p>
          <p className="mt-2">When the CA receives your CSR, they use the included Public Key to verify the signature. Because the signature could only have been created by the corresponding Private Key, the CA has mathematical proof that you actually possess the Private Key you are claiming.</p>
        </LearningSection>

        <LearningSection type="failures" title="SANs (Subject Alternative Names)">
          <p>Historically, the <code>Common Name (CN)</code> field was used to dictate which domain the certificate covered. However, this is deprecated. Modern browsers require the use of the <strong>Subject Alternative Name (SAN)</strong> extension.</p>
          <p className="mt-2">A single CSR can request a certificate that covers multiple domains (e.g., <code>example.com</code> and <code>www.example.com</code>) by listing them all in the SAN extension.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What sensitive information is included inside a Certificate Signing Request (CSR)?",
                options: [
                  "The Private Key.",
                  "The Certificate Authority's root key.",
                  "No sensitive information is included; it contains the Public Key and a digital signature.",
                  "The symmetric AES session key."
                ],
                correctIndex: 2,
                explanation: "A CSR never contains the Private Key. It only contains your public identity, Public Key, and a signature proving you hold the Private Key."
              },
              {
                question: "How does the Certificate Authority know you actually own the Private Key for the certificate you are requesting?",
                options: [
                  "They email you a verification code.",
                  "They verify the digital signature on the CSR using the Public Key embedded within it.",
                  "They use DNS verification to check the Private Key.",
                  "They ask you to upload the Private Key temporarily."
                ],
                correctIndex: 1,
                explanation: "The CSR is self-signed by the Private Key. The CA verifies this signature (Proof of Possession) using the public key in the CSR."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
