import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import EcdhClientWrapper from './EcdhClientWrapper';

const toolId = 'ecdh-key-exchange';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ECDH Key Exchange Demo"
      description="Simulate Elliptic Curve Diffie-Hellman (ECDH) key exchange between Party A and Party B to derive a matching shared secret."
      category={cat}
      toolId={toolId}
    >
      <EcdhClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-ecdh"
          title="How it Works: The Magic of Key Exchange"
          preview="Learn how two computers can agree on a secret key while a hacker watches everything."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you connect to your bank's website using HTTPS, your browser and the bank's server need to encrypt data using AES. But AES requires both sides to have the exact same secret key. How do they agree on a secret key over the open Internet without a hacker intercepting it?
            </p>
            <h3>Elliptic Curve Diffie-Hellman (ECDH)</h3>
            <p>
              The solution is a mathematical magic trick called Key Exchange. The process works like this:
            </p>
            <ol>
              <li><strong>Party A</strong> generates a private key and mathematically derives a public key from it. They send the public key to Party B over the open internet.</li>
              <li><strong>Party B</strong> does the exact same thing, sending their public key to Party A.</li>
              <li>Here is the magic: Party A takes their own Private Key, and multiplies it by Party B's Public Key. Party B takes their own Private Key, and multiplies it by Party A's Public Key.</li>
            </ol>
            <p>
              Due to the properties of Elliptic Curve mathematics, both parties will independently arrive at the exact same number (the Shared Secret). Even if a hacker intercepts both public keys in transit, they cannot calculate the shared secret without possessing at least one of the private keys.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
