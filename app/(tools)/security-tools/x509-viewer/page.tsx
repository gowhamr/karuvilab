import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import X509ClientWrapper from './X509ClientWrapper';

const toolId = 'x509-viewer';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="X.509 Certificate Viewer & Decoder"
      description="Inspect SSL/TLS X.509 certificates, view Subject, Issuer, Validity periods, Extensions, and calculate Fingerprints."
      category={cat}
      toolId={toolId}
    >
      <X509ClientWrapper />

      <LearningHub title="Understanding X.509 Certificates">
        
        <LearningSection type="architecture" title="The Digital Passport">
          <p>An X.509 Certificate is essentially a digital passport. It cryptographically binds a <strong>Public Key</strong> to an identity (like a domain name, email, or organization).</p>
          <p className="mt-2">When you visit a website (e.g., <code>google.com</code>), the server sends your browser its certificate. This allows your browser to encrypt the initial TLS handshake using the public key, ensuring only Google's server (which holds the private key) can decrypt it.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Chain of Trust">
          <p>How does your browser know the certificate isn't fake? It looks at the <strong>Issuer</strong> and the <strong>Digital Signature</strong>.</p>
          <p className="mt-2">The certificate is cryptographically signed by a Certificate Authority (CA) like Let's Encrypt. Your browser then looks at the CA's certificate, which is signed by a higher CA, forming a <strong>Chain of Trust</strong>.</p>
          <p className="mt-2">This chain eventually ends at a "Root CA". Your operating system (Windows, macOS) or browser (Firefox) comes pre-installed with a list of trusted Root CAs. If the chain links back to a trusted root, you get the padlock icon. If not, you get a giant red warning screen.</p>
        </LearningSection>

        <LearningSection type="api" title="Important X.509 Extensions">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Subject Alternative Name (SAN):</strong> Lists all the domain names this certificate covers. Browsers ignore the legacy "Common Name" field and only look here.</li>
            <li><strong>Key Usage:</strong> Defines what the public key can be used for (e.g., Digital Signature, Key Encipherment).</li>
            <li><strong>Basic Constraints:</strong> Crucial extension that dictates whether this certificate is allowed to act as a CA and sign <em>other</em> certificates.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Revocation: CRL & OCSP">
          <p>If a private key is hacked or stolen, the certificate must be invalidated before its expiration date. This is called <strong>Revocation</strong>.</p>
          <p className="mt-2">Certificates include extensions pointing to the CA's <strong>CRL (Certificate Revocation List)</strong> or <strong>OCSP (Online Certificate Status Protocol)</strong> endpoints. Browsers query these endpoints in real-time to ask "Is this certificate still valid today?"</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does a browser decide if it should trust a website's TLS certificate?",
                options: [
                  "It checks if the certificate was generated in the last 90 days.",
                  "It verifies the digital signature chain up to a Root CA pre-installed on your device.",
                  "It asks a central DNS server if the certificate is legitimate.",
                  "It checks if the domain name matches the IP address."
                ],
                correctIndex: 1,
                explanation: "Trust is anchored in the Root CA list pre-installed in your OS/browser. If the signature chain traces back to a trusted root, the certificate is trusted."
              },
              {
                question: "If a web server is serving a single certificate for three different domains (e.g., example.com, example.org, example.net), where are those domains listed in the X.509 certificate?",
                options: [
                  "The Common Name (CN) field.",
                  "The Issuer field.",
                  "The Subject Alternative Name (SAN) extension.",
                  "The Key Usage extension."
                ],
                correctIndex: 2,
                explanation: "Modern browsers require all valid domain names for a certificate to be listed in the Subject Alternative Name (SAN) extension."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
