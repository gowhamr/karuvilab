import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import HashGeneratorClientWrapper from './HashGeneratorClientWrapper';

const toolId = 'hash-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or file input."
      category={cat}
      toolId={toolId}
    >
      <HashGeneratorClientWrapper />
      
      <LearningHub title="Understanding Cryptographic Hashes">
        <LearningSection type="architecture" title="What is a Hash?">
          <p>A cryptographic hash function is a mathematical algorithm that maps data of arbitrary size to a bit array of a fixed size. It is a <strong>one-way function</strong>, meaning it is practically impossible to reverse the process to find the original data.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Deterministic:</strong> The same message always results in the same hash.</li>
            <li><strong>Quick:</strong> It is fast to compute the hash for any given message.</li>
            <li><strong>Avalanche Effect:</strong> A small change to a message changes the hash value so extensively that the new hash appears uncorrelated to the old hash.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="security" title="Collision Resistance">
          <p>A collision occurs when two different inputs produce the exact same hash output. Cryptographic hashes must be <strong>collision-resistant</strong>.</p>
          <p className="mt-2">MD5 and SHA-1 have been mathematically broken because researchers proved they can generate collisions much faster than brute force. They should never be used for digital signatures or certificates, though they are still sometimes used for non-security checksums (like verifying a file downloaded correctly).</p>
        </LearningSection>

        <LearningSection type="api" title="Web Crypto API (SubtleCrypto)">
          <p>Modern browsers process hashes extremely fast using the native <code>crypto.subtle.digest()</code> API. It processes data locally in the browser memory using the OS's native cryptographic libraries.</p>
          <pre className="mt-2 bg-surface border border-border p-3 rounded-lg overflow-x-auto text-xs font-mono">
{`const encoder = new TextEncoder();
const data = encoder.encode("hello");
const hashBuffer = await crypto.subtle.digest("SHA-256", data);
// Convert buffer to hex...`}
          </pre>
        </LearningSection>

        <LearningSection type="failures" title="Common Security Failures">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Password Storage:</strong> Plain hashes (like SHA-256) are too fast and vulnerable to brute-force and rainbow table attacks. Always use a Key Derivation Function (KDF) like bcrypt, Argon2, or PBKDF2 with a salt for passwords.</li>
            <li><strong>Length Extension Attacks:</strong> SHA-1, SHA-256, and SHA-512 are vulnerable to length extension attacks if used as a naive MAC (e.g., <code>hash(secret || message)</code>). Always use HMAC instead.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="NIST Hash Standards">
          <p>The Secure Hash Algorithms (SHA) are published by NIST. SHA-2 (which includes SHA-256 and SHA-512) is the current industry standard. SHA-3 is the newest standard (based on Keccak) offering different mathematical properties that make it immune to length-extension attacks.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which of the following hash algorithms is currently considered secure against collision attacks?",
                options: ["MD5", "SHA-1", "SHA-256", "CRC32"],
                correctIndex: 2,
                explanation: "SHA-256 (part of the SHA-2 family) is secure. MD5 and SHA-1 are cryptographically broken, and CRC32 is just an error-detecting code, not a cryptographic hash."
              },
              {
                question: "Why should you NOT use SHA-256 to hash user passwords in a database?",
                options: [
                  "It is vulnerable to collision attacks",
                  "It is too fast, making brute-force and dictionary attacks easy",
                  "It produces output that is too short",
                  "It is a reversible algorithm"
                ],
                correctIndex: 1,
                explanation: "Cryptographic hashes like SHA-256 are designed to be fast. For passwords, you need slow hashing algorithms (like Argon2 or bcrypt) designed to intentionally slow down brute-force attackers."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
