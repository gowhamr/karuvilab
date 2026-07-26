import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import ClientWrapper from './ClientWrapper';

const toolId = 'hash-map-visualizer';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Hash Map Visualizer"
      description="Interactive visualization of Hash Tables, collision resolution, and load factors."
      category={cat}
      toolId={toolId}
    >
      <ClientWrapper />

      <LearningHub title="Understanding Hash Maps & O(1) Lookups">
        
        <LearningSection type="architecture" title="The Problem">
          <p>Imagine searching for a specific book in a library where millions of books are piled in a random line (an Array). You'd have to check them one by one until you found it (O(n) time). This is incredibly slow for large datasets.</p>
          <p className="mt-2">A <strong>Hash Map</strong> (or Hash Table) solves this. It guarantees <strong>O(1) constant time</strong> lookups, meaning it takes the exact same fraction of a millisecond to find a record whether the map holds 10 items or 10 billion items.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Hashing Algorithm">
          <p>When you insert a Key-Value pair (like <code>"John": 25</code>), the map doesn't just put it at the end of a list.</p>
          <p className="mt-2">It passes the key ("John") through a mathematical <strong>Hash Function</strong>. This function deterministically spits out a pseudo-random integer. That integer is then used as an exact memory index (a "bucket") in the underlying array. To read "John" later, the map simply re-hashes the string, gets the same integer, and jumps directly to that memory address instantly.</p>
        </LearningSection>

        <LearningSection type="failures" title="Collisions & Resolution">
          <p>Because the underlying array is fixed in size (say, 16 buckets), eventually two entirely different keys will hash to the exact same bucket. This is called a <strong>Collision</strong>.</p>
          <p className="mt-2">Maps must gracefully handle this. The two most common strategies are:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Chaining:</strong> Storing a Linked List inside the bucket. If two keys land there, they just link together.</li>
            <li><strong>Open Addressing (Linear Probing):</strong> If the bucket is full, simply check the next adjacent bucket until an empty one is found.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The Load Factor (Resizing)">
          <p>As a hash map fills up, collisions happen more frequently, destroying the O(1) performance guarantee because the program has to search through long chains.</p>
          <p className="mt-2">To prevent this, maps monitor their <strong>Load Factor</strong> (Items / Total Buckets). When the map is typically 75% full, it triggers a "Rehash". It allocates a brand new array twice the size, recalculates the hash for every single item, and moves them. This is an extremely expensive O(n) operation, which is why pre-allocating map sizes is a vital performance optimization in languages like Java or Go.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What does an O(1) lookup time mean in the context of a Hash Map?",
                options: [
                  "It takes 1 second to find the data.",
                  "The lookup time remains constantly fast regardless of how many items are stored in the map.",
                  "The map can only hold 1 item per bucket.",
                  "It takes O(N) time to find the first item."
                ],
                correctIndex: 1,
                explanation: "O(1) means constant time. The algorithm jumps directly to the memory address via the hash, bypassing the need to search."
              },
              {
                question: "What happens when a Hash Map reaches its 'Load Factor' threshold (typically 0.75)?",
                options: [
                  "It stops accepting new data and throws an error.",
                  "It deletes the oldest data to make room (LRU Cache).",
                  "It allocates a new, much larger array and expensively re-hashes all existing items into it.",
                  "It compresses the data using ZIP."
                ],
                correctIndex: 2,
                explanation: "To prevent performance degradation from collisions, the map must resize. This 'rehash' operation is computationally heavy, which is why sizing your maps correctly on initialization is critical."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
