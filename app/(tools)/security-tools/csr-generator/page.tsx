import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-csr"
          title="How it Works: Certificate Signing Requests"
          preview="Learn how to get a TLS certificate without giving the Certificate Authority your private key."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you want to secure your website with HTTPS, you need a TLS certificate signed by a trusted Certificate Authority (CA). However, a certificate requires a Private Key—and you should <strong>never</strong> send your Private Key to anyone, not even the CA.
            </p>
            <h3>The Solution: PKCS#10</h3>
            <p>
              Instead of sending the Private Key, you generate a Certificate Signing Request (CSR). A CSR is a block of text (formatted using the PKCS#10 standard) that contains:
            </p>
            <ol>
              <li>Your Public Key.</li>
              <li>Your identifying information (Domain Name, Organization, Country).</li>
              <li>A digital signature (created using your Private Key).</li>
            </ol>
            <h3>The Verification Process</h3>
            <p>
              You send this CSR to the Certificate Authority. The CA uses the included Public Key to verify the digital signature on the CSR. This mathematically proves to the CA that you possess the corresponding Private Key, without you ever having to reveal it. Once verified, the CA signs your Public Key, creating your final X.509 Certificate.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
