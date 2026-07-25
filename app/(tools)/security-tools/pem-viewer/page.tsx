import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import PemViewerClientWrapper from './PemViewerClientWrapper';

const toolId = 'pem-viewer';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="PEM Viewer & Inspector"
      description="Inspect PEM blocks, decode Base64 payloads, analyze ASN.1 structure, and format raw DER keys."
      category={cat}
      toolId={toolId}
    >
      <PemViewerClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-pem"
          title="How it Works: The PEM Format"
          preview="Learn why your SSH keys and TLS certificates are wrapped in dashes."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When dealing with cryptographic keys, certificates, or SSH credentials, you will almost always encounter files containing blocks like <code>-----BEGIN CERTIFICATE-----</code>. This is the PEM format (Privacy-Enhanced Mail).
            </p>
            <h3>DER vs PEM</h3>
            <p>
              At its core, a cryptographic key is just a sequence of raw bytes encoded in a format called ASN.1 DER (Distinguished Encoding Rules). However, raw binary bytes (DER) cannot be safely copy-pasted into text editors, emails, or JSON payloads without being corrupted by hidden characters and null bytes.
            </p>
            <p>
              To make these keys text-safe, developers convert the raw DER bytes into a Base64 string. They then wrap that string in the familiar <code>-----BEGIN...</code> and <code>-----END...</code> headers. This finalized text representation is called PEM.
            </p>
            <h3>What this tool does</h3>
            <p>
              This tool reverses the process. It strips the headers, decodes the Base64 back into raw DER bytes, and then recursively parses the ASN.1 tree structure to show you the mathematical integers, object identifiers (OIDs), and sequences that make up the actual key.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
