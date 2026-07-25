import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import UuidGeneratorWrapper from './UuidGeneratorWrapper';

const toolId = 'uuid-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="UUID Generator"
      description="Generate RFC-compliant UUIDs (v1, v4, v5, v7)."
      category={cat}
      toolId={toolId}
    >
      <UuidGeneratorWrapper />

      <LearningHub title="UUIDs & Cryptographic Randomness" description="Understand the architecture of Universally Unique Identifiers, why v4 vs v7 matters for database performance, and the security of PRNGs.">
        
        <LearningSection type="architecture" title="How UUIDs Work" fullWidth>
          <p>
            A Universally Unique Identifier (UUID) is a 128-bit number used to identify information in computer systems. Because the number of possible UUIDs is so vast (2<sup>122</sup> for version 4), they can be generated independently across distributed systems without needing a central authority to prevent collisions.
          </p>
          <p>
            Not all UUIDs are the same. <strong>UUID v4</strong> is completely random (except for 6 bits used for versioning). <strong>UUID v7</strong>, recently standardized, embeds a Unix timestamp in the first 48 bits, making it time-ordered and much friendlier for database indexing.
          </p>
        </LearningSection>

        <LearningSection type="security" title="Security Review">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Math.random() vs Crypto:</strong> <code>Math.random()</code> is not cryptographically secure. An attacker can predict future outputs if they observe enough generated numbers. True UUID v4 generation must rely on <code>crypto.getRandomValues()</code> to ensure unpredictable entropy.</li>
            <li><strong>Information Leakage:</strong> UUID v1 uses the MAC address of the generating computer and the exact time. This can unintentionally leak the physical machine identity of the creator, which is why v4 or v7 are preferred today.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Database Performance (v4 vs v7)">
          <p>
            Using a random <strong>UUID v4</strong> as a Primary Key in a SQL database (like PostgreSQL or MySQL) can cause severe fragmentation in B-Tree indexes. Since the IDs are inserted in a random order, the database must constantly split pages on disk.
          </p>
          <p className="mt-2">
            <strong>UUID v7</strong> solves this by placing a timestamp at the start of the ID. New IDs are always "greater" than old IDs, allowing sequential, append-only disk writes that vastly improve insert performance.
          </p>
        </LearningSection>

        <LearningSection type="api" title="Browser APIs Used">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Web Crypto API:</strong> Uses <code>window.crypto.randomUUID()</code> when available, which natively relies on the OS-level entropy pool (e.g., <code>/dev/urandom</code>) to generate secure v4 UUIDs.</li>
            <li><strong>Bitwise Operations:</strong> For v7, this tool manually manipulates 8-bit unsigned integer arrays (<code>Uint8Array</code>) to splice the current epoch time into the random byte array.</li>
          </ul>
        </LearningSection>

        <LearningSection type="standards" title="Standards & RFCs">
          <ul className="list-disc pl-5 space-y-2">
            <li><a href="https://datatracker.ietf.org/doc/html/rfc4122" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">RFC 4122</a>: The original standard defining UUIDs.</li>
            <li><a href="https://datatracker.ietf.org/doc/html/rfc9562" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">RFC 9562</a>: The updated 2024 standard that officially introduces time-ordered UUIDs like v7.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Common Failure Cases">
          <p>
            Common mistakes when implementing UUIDs:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Insufficient Entropy:</strong> Using a polyfill that falls back to <code>Math.random()</code> if the Crypto API is unavailable, dramatically increasing the risk of collisions.</li>
            <li><strong>Collisions in v4:</strong> The chance of a collision is astronomical. You would need to generate 1 billion UUIDs per second for 85 years to have a 50% chance of a single collision.</li>
          </ul>
        </LearningSection>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <QuizWidget 
            question="Why is UUID v7 heavily recommended over UUID v4 for SQL database Primary Keys?"
            options={[
              { id: "a", text: "Because UUID v7 contains more bits (256-bit) ensuring a lower collision rate.", isCorrect: false, explanation: "All standard UUIDs are 128-bit." },
              { id: "b", text: "Because UUID v7 starts with a timestamp, allowing databases to insert rows sequentially, preventing B-Tree index fragmentation.", isCorrect: true, explanation: "Correct! The time-ordered nature of v7 ensures inserts happen at the end of the index, making disk operations much faster." },
              { id: "c", text: "Because UUID v7 is strictly designed to be harder to guess (more secure) than v4.", isCorrect: false, explanation: "Actually, v7 is more predictable because the first 48 bits are just the current time. If you need absolute unpredictability (e.g., for password reset tokens), v4 is better." }
            ]}
          />
        </div>

      </LearningHub>
    </ToolShell>
  );
}
