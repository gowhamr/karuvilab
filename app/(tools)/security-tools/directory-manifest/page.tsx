import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import DirectoryManifestClientWrapper from './DirectoryManifestClientWrapper';

const toolId = 'directory-manifest';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Directory Hash Manifest"
      description="Compute cryptographic hashes (MD5, SHA-256, SHA-512) for all files in a folder and generate a verification manifest."
      category={cat}
      toolId={toolId}
    >
      <DirectoryManifestClientWrapper />

      <LearningHub title="Understanding File Integrity Manifests">
        
        <LearningSection type="architecture" title="Verifying Large Downloads">
          <p>When you download a 4GB operating system ISO or a large software distribution, how do you know the file wasn't corrupted in transit or maliciously altered by a hacker intercepting the connection?</p>
          <p className="mt-2">You use a cryptographic checksum. A hashing algorithm (like SHA-256) takes an input of any size and produces a fixed-length string of characters. Crucially, if even a single bit in the 4GB file is changed, the resulting hash will be completely different.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Manifest File">
          <p>To secure a large folder of files, developers generate a <strong>Manifest</strong>. This is a simple text file listing every file and its exact hash.</p>
          <p className="mt-2">They publish this manifest in a secure, authenticated location (like a signed GitHub release). After you download the files, you can run a tool to independently calculate the hashes on your machine and compare them to the manifest. If they match perfectly, you have mathematical proof that the files are intact.</p>
        </LearningSection>

        <LearningSection type="performance" title="Browser API (WebCrypto)">
          <p>Calculating the SHA-256 hash of a large file requires reading the entire file byte-by-byte. In JavaScript, doing this synchronously would freeze the browser tab entirely.</p>
          <p className="mt-2">Modern implementations use the <code>SubtleCrypto.digest()</code> API along with <strong>Streams</strong> or <strong>Web Workers</strong>. By processing the file in small chunks (e.g., 5MB at a time) and updating the hash state progressively, the browser can securely hash gigabytes of data without locking the UI thread.</p>
        </LearningSection>

        <LearningSection type="failures" title="MD5 Collisions">
          <p>Historically, MD5 was the most common algorithm for file checksums. However, MD5 is cryptographically broken. It is vulnerable to <strong>Collision Attacks</strong>.</p>
          <p className="mt-2">A hacker can mathematically construct two entirely different files (one safe, one malware) that produce the exact same MD5 hash. For this reason, MD5 is now banned for security purposes, and SHA-256 or SHA-512 must be used to guarantee integrity.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is MD5 no longer recommended for verifying the security and integrity of downloaded files?",
                options: [
                  "Because it is too slow to calculate on modern CPUs.",
                  "Because it produces hashes that are too long to easily verify.",
                  "Because attackers can create two different files that produce the exact same MD5 hash (a collision).",
                  "Because MD5 is a symmetric encryption algorithm, not a hashing algorithm."
                ],
                correctIndex: 2,
                explanation: "MD5 collisions can be generated in seconds on modern hardware. This allows an attacker to substitute a malicious file that perfectly matches the expected MD5 hash of a safe file."
              },
              {
                question: "How should a web browser hash a 5GB file without freezing the UI thread?",
                options: [
                  "Load the entire 5GB into memory using a FileReader, then hash it synchronously.",
                  "Read the file in small chunks using Streams or Web Workers and progressively update the hash.",
                  "Send the file to a backend server to calculate the hash.",
                  "Web browsers cannot calculate hashes for files over 100MB."
                ],
                correctIndex: 1,
                explanation: "Progressive chunking via Streams or offloading to Web Workers prevents the JavaScript main thread from blocking, keeping the UI responsive during heavy I/O and computation."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
