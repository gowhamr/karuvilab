import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import HmacGeneratorWrapper from './HmacGeneratorWrapper';

const toolId = 'hmac-generator';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="HMAC Generator"
      description="Generate HMAC signatures."
      category={cat}
      toolId={toolId}
    >
      <HmacGeneratorWrapper />

      <LearningHub title="Understanding HMAC">
        <LearningSection type="architecture" title="What is an HMAC?">
          <p>HMAC (Hash-based Message Authentication Code) is a specific construction for calculating a message authentication code involving a cryptographic hash function (like SHA-256) in combination with a secret cryptographic key.</p>
          <p className="mt-2">It simultaneously verifies both the <strong>data integrity</strong> (the message hasn't been altered) and the <strong>authenticity</strong> (the message comes from someone who knows the secret key).</p>
        </LearningSection>
        
        <LearningSection type="security" title="Why not just hash(secret + message)?">
          <p>A naive approach to authentication is appending the secret to the message and hashing it (e.g., <code>SHA-256(secret || message)</code>). However, this is critically vulnerable to <strong>Length Extension Attacks</strong>.</p>
          <p className="mt-2">An attacker who intercepts the hash and the original message can append extra data and compute a valid hash for the new message <em>without ever knowing the secret</em>.</p>
          <p className="mt-2">HMAC solves this by hashing the secret twice in a nested structure: <code>H(Key XOR opad, H(Key XOR ipad, message))</code>, rendering length extension mathematically impossible.</p>
        </LearningSection>

        <LearningSection type="api" title="Real-world usage: Webhooks & JWTs">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Webhook Signatures:</strong> Services like Stripe or GitHub send an HMAC signature in the HTTP headers (e.g., <code>X-Hub-Signature</code>). Your server recalculates the HMAC using the payload and your shared secret, comparing it to the header to prove Stripe sent it.</li>
            <li><strong>JWTs (JSON Web Tokens):</strong> When a JWT uses the "HS256" algorithm, the signature part of the token is simply an HMAC-SHA256 of the header and payload using the server's secret key.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Timing Attacks">
          <p>When verifying an HMAC, if you use standard string equality (<code>if (received_hmac === calculated_hmac)</code>), the comparison fails immediately upon the first mismatched character. An attacker can measure this microsecond difference to guess the HMAC character by character (a Timing Attack).</p>
          <p className="mt-2"><strong>Fix:</strong> Always use a constant-time comparison function (like <code>crypto.subtle.verify</code> or Node's <code>crypto.timingSafeEqual</code>) which takes the exact same amount of time regardless of where the mismatch occurs.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What security vulnerability does HMAC specifically protect against that naive hashing (hash(secret + message)) does not?",
                options: [
                  "Brute-force attacks",
                  "Length extension attacks",
                  "Cross-Site Scripting (XSS)",
                  "Man-in-the-Middle (MITM) attacks"
                ],
                correctIndex: 1,
                explanation: "Standard hashes like SHA-256 are vulnerable to length extension attacks if used as naive MACs. HMAC's nested hashing structure completely prevents this."
              },
              {
                question: "When verifying an HMAC signature on your server, how should you compare the received string with your calculated string?",
                options: [
                  "Using the standard strict equality operator (===)",
                  "By checking the lengths first, then using (===)",
                  "Using a constant-time string comparison function (timingSafeEqual)",
                  "By hashing both strings again and comparing them"
                ],
                correctIndex: 2,
                explanation: "Standard string equality fails fast, allowing attackers to measure processing time and guess the signature one character at a time. A constant-time comparison is mandatory."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
