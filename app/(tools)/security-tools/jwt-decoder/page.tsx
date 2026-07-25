import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import JWTDecoderClientWrapper from './JWTDecoderClientWrapper';

const toolId = 'jwt-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens — header, payload claims, and expiry status."
      category={cat}
      toolId={toolId}
    >
      <JWTDecoderClientWrapper />

      <LearningHub title="JWT & Stateless Authentication" description="Learn the anatomy of JSON Web Tokens, the risks of the 'none' algorithm, and why you should never store sensitive data in claims.">
        
        <LearningSection type="architecture" title="Token Anatomy" fullWidth>
          <p>
            A JSON Web Token (JWT) is split into three parts separated by dots (<code>.</code>): <strong>Header.Payload.Signature</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Header:</strong> A JSON object defining the token type (JWT) and the signing algorithm used (e.g., HS256, RS256).</li>
            <li><strong>Payload (Claims):</strong> A JSON object containing the actual data (e.g., user ID, roles) and standard claims like <code>exp</code> (expiration).</li>
            <li><strong>Signature:</strong> A cryptographic hash of the Header and Payload, signed using a secret key. This proves the token hasn't been tampered with.</li>
          </ul>
          <p className="mt-2">
            The Header and Payload are encoded using <strong>Base64Url</strong>, which means they are publicly readable by anyone.
          </p>
        </LearningSection>

        <LearningSection type="security" title="Security Vulnerabilities">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>The "None" Algorithm:</strong> Historically, some JWT libraries blindly trusted the <code>alg: "none"</code> header. Attackers could decode a token, elevate their privileges in the payload, set the algorithm to "none", and strip the signature entirely to bypass authentication.</li>
            <li><strong>Secret Exposure:</strong> Never put passwords, API keys, or PII (Personally Identifiable Information) in a JWT payload. The payload is merely Base64-encoded, NOT encrypted.</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Stateless Validation">
          <p>
            JWTs are popular because they are stateless. The backend server does not need to look up a session ID in a database. Instead, it simply verifies the cryptographic signature of the token using its secret key (or public key for RSA). If the signature is valid, the claims inside the token are trusted.
          </p>
        </LearningSection>

        <LearningSection type="standards" title="Standards (RFC 7519)">
          <p>
            The JWT standard defines several reserved "Claims" (keys in the payload JSON):
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><code>iss</code> (Issuer): Who created the token.</li>
            <li><code>sub</code> (Subject): Who the token refers to (usually the User ID).</li>
            <li><code>exp</code> (Expiration Time): A Unix timestamp of when the token expires.</li>
            <li><code>aud</code> (Audience): Who the token is intended for.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common Failure Cases">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Ignoring Expiration:</strong> Trusting a token without explicitly checking if the current time is past the <code>exp</code> claim.</li>
            <li><strong>Weak HMAC Keys:</strong> Using a short, easily guessable secret key (like "secret123") for HS256. Attackers can brute-force the signature offline and then forge their own valid tokens.</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="If you intercept a JWT over the network, can you read the data inside the payload?"
            options={[
              { id: "a", text: "Yes, the payload is simply Base64Url encoded and can be decoded by anyone.", isCorrect: true, explanation: "Correct. JWTs (unless specifically using JWE - JSON Web Encryption) do not encrypt the payload. They only sign it." },
              { id: "b", text: "No, the payload is encrypted using the Signature.", isCorrect: false, explanation: "The signature only guarantees integrity, not confidentiality." },
              { id: "c", text: "Only if you have the secret key from the server.", isCorrect: false, explanation: "The secret key is needed to VERIFY or FORGE the token, not to read it." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
