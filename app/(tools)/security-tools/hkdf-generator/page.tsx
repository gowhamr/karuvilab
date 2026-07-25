import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import HkdfClientWrapper from './HkdfClientWrapper';

const toolId = 'hkdf-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="HKDF Key Derivation Generator"
      description="Derive keys using HMAC-based Extract-and-Expand Key Derivation Function (HKDF, RFC 5869)."
      category={cat}
      toolId={toolId}
    >
      <HkdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-hkdf"
          title="How it Works: PBKDF2 vs HKDF"
          preview="Learn why HKDF is used for protocols like TLS 1.3 instead of PBKDF2."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Both PBKDF2 and HKDF are Key Derivation Functions (KDFs). They both take some input material and output a cryptographic key. However, they solve two entirely different problems.
            </p>
            <h3>PBKDF2 is for Passwords</h3>
            <p>
              As the name implies (Password-Based Key Derivation Function), PBKDF2 is designed for low-entropy inputs like human passwords. Its goal is to be intentionally slow (key stretching) to prevent brute-force attacks.
            </p>
            <h3>HKDF is for Protocols</h3>
            <p>
              HKDF is designed to take a high-entropy, but perhaps unevenly distributed input (like a shared secret generated from an ECDH key exchange) and perfectly "smooth it out" into multiple secure cryptographic keys.
            </p>
            <p>
              Unlike PBKDF2, HKDF is extremely fast. It operates in two phases:
            </p>
            <ol>
              <li><strong>Extract:</strong> Takes the initial key material and "extracts" a fixed-length pseudorandom key (PRK) using a salt.</li>
              <li><strong>Expand:</strong> Takes that PRK and "expands" it into multiple keys (e.g., an encryption key and a separate HMAC signature key) using specific info strings.</li>
            </ol>
            <p>
              Because of its speed and mathematical properties, HKDF is a core component of modern secure protocols like TLS 1.3 and Signal.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
