import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-hashmaps"
          title="How it Works: O(1) Lookups"
          preview="Learn the computer science data structure that powers modern software."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A Hash Map (or Hash Table) is arguably the most important data structure in computer science. It allows you to store and retrieve data in <strong>O(1) constant time</strong>, meaning it takes the same amount of time to find a record whether there are 10 items or 10 billion items in the table.
            </p>
            <h3>The Hashing Algorithm</h3>
            <p>
              When you insert a Key-Value pair (like <code>"John": 25</code>), the map doesn't just put it at the end of a list. It passes the key ("John") through a mathematical Hash Function. This function spits out a pseudo-random integer, which is then mapped to a specific index (bucket) in the underlying array.
            </p>
            <h3>Collisions</h3>
            <p>
              Because the array is fixed in size, eventually two different keys will hash to the exact same bucket. This is called a <strong>Collision</strong>. Modern hash maps usually resolve this using <em>Chaining</em> (storing a Linked List at that bucket) or <em>Open Addressing</em> (scanning forward to find the next empty bucket).
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
