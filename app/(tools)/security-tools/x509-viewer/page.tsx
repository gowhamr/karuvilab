import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-x509"
          title="How it Works: The Chain of Trust"
          preview="Learn how your browser actually knows that Google.com is really Google."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              An X.509 Certificate is essentially a digital passport. It binds a cryptographic Public Key to an identity (like a domain name). When you visit <code>google.com</code>, Google's server sends your browser its certificate.
            </p>
            <h3>Signatures and Issuers</h3>
            <p>
              But how does your browser know the certificate isn't fake? It looks at the <strong>Issuer</strong>. The certificate is cryptographically signed by a Certificate Authority (CA) like Let's Encrypt or DigiCert. Your browser then asks, "Who signed the CA's certificate?"
            </p>
            <p>
              This forms a Chain of Trust. The chain eventually ends at a "Root CA". Your operating system and web browser come pre-installed with a list of trusted Root CAs. If the chain links back to one of these pre-installed roots, the browser displays the padlock icon. If it doesn't, you get a giant red warning screen.
            </p>
            <h3>Certificate Revocation</h3>
            <p>
              If a private key is compromised, the certificate must be revoked before its expiration date. This tool shows you the extensions like CRL (Certificate Revocation List) and OCSP (Online Certificate Status Protocol) endpoints that browsers use to check if a certificate is still valid in real-time.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
