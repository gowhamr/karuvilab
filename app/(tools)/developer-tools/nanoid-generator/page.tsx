import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import NanoIdClientWrapper from './NanoIdClientWrapper';

const toolId = 'nanoid-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="NanoID Generator"
      description="Generate URL-friendly, cryptographically secure NanoIDs with customizable length and character sets."
      category={cat}
      toolId={toolId}
    >
      <NanoIdClientWrapper />

      <LearningHub title="Understanding NanoID vs UUID">
        
        <LearningSection type="architecture" title="The UUID Problem">
          <p>For decades, UUIDs (Universally Unique Identifiers) were the gold standard for generating IDs. However, standard UUIDs (like <code>123e4567-e89b-12d3-a456-426614174000</code>) are exactly 36 characters long.</p>
          <p className="mt-2">This is because they are strictly limited to a small hexadecimal alphabet (<code>0-9</code> and <code>a-f</code>). This length makes database indexing slightly slower and produces long, unwieldy REST API endpoints.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="Increasing the Alphabet">
          <p>NanoID solves the length problem by using a much larger alphabet. By utilizing 64 different characters (<code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>_</code>, <code>-</code>) instead of just 16, NanoID can pack the exact same amount of randomness (entropy) into a much smaller footprint.</p>
          <p className="mt-2">A standard 21-character NanoID has the exact same collision probability as a 36-character UUIDv4, making it 40% smaller to store in databases and transit over the network.</p>
        </LearningSection>

        <LearningSection type="standards" title="URL Safety">
          <p>Why not just use standard Base64 encoding to get a large alphabet? Because standard Base64 uses the <code>+</code> and <code>/</code> characters.</p>
          <p className="mt-2">If you put a <code>/</code> in a URL, the router thinks it's a new path segment. If you put a <code>+</code>, it often gets interpreted as a space. Standard Base64 strings must be URL-encoded (becoming <code>%2B</code> and <code>%2F</code>), which destroys their compactness. NanoID explicitly swaps these out for URL-safe <code>_</code> and <code>-</code> characters.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does NanoID achieve the same level of randomness (collision resistance) as a UUIDv4 while being 40% shorter?",
                options: [
                  "It uses a more advanced quantum random number generator.",
                  "It drops the dashes that UUIDs use.",
                  "It uses a significantly larger alphabet (64 characters vs 16), packing more entropy into each individual character.",
                  "It relies on a central server to ensure no duplicates are ever created."
                ],
                correctIndex: 2,
                explanation: "Because NanoID pulls from 64 possible characters per slot instead of just 16 (hexadecimal), each character holds significantly more combinations, allowing the overall string to be shorter."
              },
              {
                question: "Why does NanoID explicitly avoid using the '+' and '/' characters found in standard Base64 encoding?",
                options: [
                  "Because they are mathematically harder for the CPU to generate.",
                  "Because they are reserved characters in URLs and break routing unless heavily URL-encoded.",
                  "Because they are invalid in MySQL databases.",
                  "Because they are visually too similar to 't' and 'l'."
                ],
                correctIndex: 1,
                explanation: "NanoID is designed to be URL-safe so IDs can be dropped directly into REST API routes (e.g., /users/abc-123_xyz) without escaping. '+' and '/' break routing logic."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
