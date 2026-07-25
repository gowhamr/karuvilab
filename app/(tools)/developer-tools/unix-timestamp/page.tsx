import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import UnixTimestampWrapper from './UnixTimestampWrapper';

const toolId = 'unix-timestamp';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and back."
      category={cat}
      toolId={toolId}
    >
      <UnixTimestampWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-y2k38"
          title="How it Works: The Year 2038 Problem"
          preview="Learn why 32-bit systems will crash on January 19, 2038."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A Unix timestamp is simply the number of seconds that have elapsed since midnight (UTC) on January 1, 1970. This date is known as the <strong>Unix Epoch</strong>.
            </p>
            <h3>Integer Overflow</h3>
            <p>
              Historically, operating systems stored this timestamp as a signed 32-bit integer. A signed 32-bit integer has a maximum value of <code>2,147,483,647</code>. If you add that many seconds to the Unix Epoch, you arrive exactly at 03:14:07 UTC on January 19, 2038.
            </p>
            <p>
              When a clock hits this maximum value and ticks forward one more second, an <strong>Integer Overflow</strong> occurs. The number flips to its maximum negative value (<code>-2,147,483,648</code>). For an operating system, this means the clock will instantly time-travel backward to December 13, 1901.
            </p>
            <p>
              This is known as the <strong>Y2K38 problem</strong>. To fix this, modern operating systems and databases have migrated to 64-bit integers, which won't overflow for another 292 billion years.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
