import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import Pbkdf2ClientWrapper from './Pbkdf2ClientWrapper';

const toolId = 'pbkdf2-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="PBKDF2 Key Derivation Generator"
      description="Derive cryptographically strong key bits using Password-Based Key Derivation Function 2 (PBKDF2)."
      category={cat}
      toolId={toolId}
    >
      <Pbkdf2ClientWrapper />

      <LearningHub title="Understanding Key Derivation (PBKDF2)">
        <LearningSection type="architecture" title="The Password Problem">
          <p>When an application encrypts your data (like a password manager vault), it needs a cryptographic key of an exact length (usually 256 bits). However, humans cannot memorize random 256-bit binary strings. We use passwords instead.</p>
          <p className="mt-2">Passwords have dangerously low entropy (randomness). If we simply hashed a password once using SHA-256 to create an encryption key, an attacker with a modern GPU rig could guess billions of passwords per second until they found a match.</p>
        </LearningSection>
        
        <LearningSection type="security" title="Key Stretching">
          <p>To fix this, PBKDF2 introduces <strong>Key Stretching</strong>. It hashes the password, then hashes the resulting hash, and hashes it again... thousands or millions of times in a loop (the <em>Iteration Count</em>). It also mixes in a random <em>Salt</em> to defeat rainbow table attacks.</p>
          <p className="mt-2">By mathematically forcing the computer to run the hash 600,000 times to derive a single key, it intentionally slows down the process. For a legitimate user logging in, a 1-second delay is unnoticeable. But for a hacker trying to brute-force a billion passwords, that 1-second delay makes the attack mathematically impossible.</p>
        </LearningSection>

        <LearningSection type="standards" title="Current Standards">
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>OWASP Recommendation:</strong> As of 2024, the recommended minimum iteration count for PBKDF2-HMAC-SHA256 is <strong>600,000</strong> iterations.</li>
            <li><strong>Salt Size:</strong> The salt must be at least 128 bits (16 bytes) and generated randomly using a Cryptographically Secure Pseudorandom Number Generator (CSPRNG) for <em>every</em> user.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="GPU Acceleration Threat">
          <p>While PBKDF2 is an established standard, it relies purely on CPU processing time (it is "CPU-hard"). Modern GPUs are incredibly efficient at running parallel hashing operations, giving attackers an asymmetric advantage against PBKDF2.</p>
          <p className="mt-2">Newer algorithms like <strong>Argon2</strong> and <strong>scrypt</strong> are "Memory-hard", meaning they require large amounts of RAM to compute. GPUs have very little memory per core, making Argon2 drastically more resistant to GPU brute-forcing than PBKDF2.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary purpose of the 'Iteration Count' in PBKDF2?",
                options: [
                  "To make the resulting key longer.",
                  "To intentionally slow down the algorithm, thwarting brute-force attacks.",
                  "To encrypt the salt before hashing.",
                  "To satisfy NIST compliance without adding security."
                ],
                correctIndex: 1,
                explanation: "Key stretching algorithms are designed to be intentionally slow. A high iteration count turns a process that would take microseconds into one that takes hundreds of milliseconds, crippling brute-force attempts."
              },
              {
                question: "Why are newer algorithms like Argon2 considered superior to PBKDF2?",
                options: [
                  "Argon2 requires less memory to run.",
                  "Argon2 produces a 1024-bit key, whereas PBKDF2 maxes out at 256 bits.",
                  "Argon2 is 'memory-hard', making it highly resistant to the massively parallel GPU attacks that PBKDF2 is vulnerable to.",
                  "PBKDF2 has been mathematically cracked, while Argon2 has not."
                ],
                correctIndex: 2,
                explanation: "GPUs can run PBKDF2 extremely fast because it only requires CPU cycles. Argon2 requires allocating large blocks of RAM, which GPUs lack per-core, neutralizing their advantage."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
