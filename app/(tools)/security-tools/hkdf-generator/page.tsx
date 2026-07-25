import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding HKDF (Extract and Expand)">
        <LearningSection type="architecture" title="PBKDF2 vs HKDF">
          <p>Both PBKDF2 and HKDF are Key Derivation Functions (KDFs). They both take some input material and output a cryptographic key. However, they solve two entirely different problems.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>PBKDF2 is for Passwords:</strong> It is designed for low-entropy inputs like human passwords. Its goal is to be <em>intentionally slow</em> (key stretching) to prevent brute-force attacks.</li>
            <li><strong>HKDF is for Protocols:</strong> It is designed to take a high-entropy, but unevenly distributed input (like a shared secret generated from an ECDH key exchange) and perfectly "smooth it out" into multiple secure cryptographic keys. HKDF is <em>extremely fast</em>.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="security" title="The Two Phases: Extract and Expand">
          <p>HKDF operates in two distinct mathematical phases:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li><strong>Extract:</strong> Takes the initial key material and "extracts" a fixed-length pseudorandom key (PRK) using a cryptographic salt. This acts as a cryptographic mixer, concentrating the entropy.</li>
            <li><strong>Expand:</strong> Takes that PRK and "expands" it into multiple keys using specific <strong>info strings</strong>. For example, passing the string "client_write_key" derives one AES key, and passing "server_write_key" derives a completely different AES key, both from the exact same master secret.</li>
          </ol>
        </LearningSection>

        <LearningSection type="api" title="Real-World Usage">
          <p>Because of its speed and mathematical properties, HKDF is a core component of modern secure protocols:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>TLS 1.3:</strong> Uses HKDF extensively to derive the session keys that secure the modern web.</li>
            <li><strong>Signal Protocol:</strong> Uses HKDF as part of its ratcheting mechanism to derive new encryption keys for every single message sent.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Missing the Info String">
          <p>When calling the <em>Expand</em> phase, the <strong>Info</strong> parameter is technically optional, but omitting it is a serious architectural failure in complex protocols.</p>
          <p className="mt-2">The Info string ensures <strong>context separation</strong>. If two different subsystems (e.g., encryption and MAC generation) both request a key from the same master secret without providing a unique Info string, they will receive the exact same key. This violates cryptographic isolation principles.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which Key Derivation Function should you use when hashing a user's password for storage in a database?",
                options: [
                  "HKDF, because it is extremely fast.",
                  "PBKDF2 (or Argon2), because they are intentionally slow to thwart brute-force attacks.",
                  "AES-GCM, because it provides Authenticated Encryption.",
                  "ECDH, because it generates a shared secret."
                ],
                correctIndex: 1,
                explanation: "HKDF is fast and designed for high-entropy protocol keys. Passwords require slow, key-stretching functions like PBKDF2 or Argon2 to defend against offline brute-force attacks."
              },
              {
                question: "In HKDF, what is the purpose of the 'Info' string during the Expand phase?",
                options: [
                  "To encrypt the output key.",
                  "To act as the salt for the Extract phase.",
                  "To provide context separation, allowing the derivation of multiple distinct keys from the same master secret.",
                  "To pad the input material to match the block size."
                ],
                correctIndex: 2,
                explanation: "By changing the Info string (e.g., 'encryption_key' vs 'mac_key'), you can generate an infinite number of completely independent keys from a single master secret, ensuring strict cryptographic isolation between subsystems."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
