import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding PEM and ASN.1">
        
        <LearningSection type="architecture" title="What is a PEM file?">
          <p>When dealing with cryptographic keys, TLS certificates, or SSH credentials, you will almost always encounter files containing blocks like <code>-----BEGIN CERTIFICATE-----</code>. This text format is called PEM (Privacy-Enhanced Mail).</p>
          <p className="mt-2">PEM was originally designed in the 1990s to secure email. While the email system failed to gain traction, its encoding format survived and became the de-facto standard for storing cryptographic objects as text.</p>
        </LearningSection>
        
        <LearningSection type="api" title="DER vs PEM">
          <p>At its core, a cryptographic key is just a sequence of raw binary bytes structured using a format called <strong>ASN.1 DER</strong> (Distinguished Encoding Rules).</p>
          <p className="mt-2">However, raw binary bytes cannot be safely copy-pasted into terminals, email, or JSON payloads without being corrupted. To make the keys "text-safe", the raw DER bytes are Base64 encoded, and wrapped in standard <code>-----BEGIN...</code> and <code>-----END...</code> headers. That finalized string is a PEM block.</p>
        </LearningSection>

        <LearningSection type="failures" title="Hidden Newlines">
          <p>A common engineering bug occurs when parsing PEM keys passed via environment variables (e.g., in Docker or CI/CD). PEM strictly requires line breaks (newlines) to separate the header, the 64-character wrapped Base64 payload, and the footer.</p>
          <p className="mt-2">If an environment variable flattens the string and replaces actual newlines (<code>\n</code>) with literal text <code>\n</code> or spaces, the crypto library will fail to parse it, throwing an "Invalid PEM" error. Developers often have to write manual string replacements to un-flatten keys injected by deployment pipelines.</p>
        </LearningSection>

        <LearningSection type="standards" title="Parsing the Payload">
          <p>Once you strip the PEM headers and decode the Base64, you get the raw DER payload. This payload is an ASN.1 tree structure (similar to a binary JSON). It contains hierarchical data like Sequence, Integer, BitString, and Object Identifier (OID). The OID is crucial because it tells the computer what <em>type</em> of key this is (e.g., RSA vs Elliptic Curve).</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the relationship between PEM and DER?",
                options: [
                  "PEM is an encrypted version of DER.",
                  "PEM is simply a DER binary file that has been Base64-encoded and wrapped in text headers.",
                  "They are completely unrelated encryption algorithms.",
                  "DER is used for private keys, while PEM is used for public keys."
                ],
                correctIndex: 1,
                explanation: "PEM is purely a text-safe wrapper around a binary DER payload. You can seamlessly convert between them without altering the underlying cryptographic key."
              },
              {
                question: "Why do developers frequently encounter errors when passing PEM strings through CI/CD environment variables?",
                options: [
                  "Because environment variables are too small to hold a 2048-bit key.",
                  "Because the CI/CD pipeline encrypts the environment variable.",
                  "Because environment variable systems often flatten newlines, which breaks the strict multi-line format required by PEM parsers.",
                  "Because PEM files require a .pem file extension to be read."
                ],
                correctIndex: 2,
                explanation: "PEM strictly relies on actual newline characters (\\n). Many env-var systems flatten these into literal '\\n' strings or spaces, which corrupts the parsing logic of crypto libraries."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
