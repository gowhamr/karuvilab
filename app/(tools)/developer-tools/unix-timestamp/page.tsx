import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding Unix Time and the Y2K38 Problem">
        
        <LearningSection type="architecture" title="The Unix Epoch">
          <p>A Unix timestamp is simply the number of seconds that have elapsed since midnight (UTC) on January 1, 1970. This specific moment in time is known as the <strong>Unix Epoch</strong>.</p>
          <p className="mt-2">By storing time as a single integer rather than a complex string (like "January 14, 2024 15:30:00"), computers can perform date math (e.g., adding 7 days) instantly using basic arithmetic rather than complex calendar parsing algorithms.</p>
        </LearningSection>
        
        <LearningSection type="failures" title="Integer Overflow (Y2K38)">
          <p>Historically, operating systems and databases stored this timestamp as a <strong>signed 32-bit integer</strong>.</p>
          <p className="mt-2">A signed 32-bit integer has a maximum positive value of <code>2,147,483,647</code>. If you add that many seconds to the Unix Epoch, you arrive exactly at 03:14:07 UTC on <strong>January 19, 2038</strong>.</p>
          <p className="mt-2">When a 32-bit clock hits this maximum value and ticks forward one more second, an Integer Overflow occurs. The binary number wraps around to its maximum negative value (<code>-2,147,483,648</code>). For an operating system, this means the clock will instantly time-travel backward 136 years to December 13, 1901.</p>
        </LearningSection>

        <LearningSection type="security" title="The Solution">
          <p>This is known as the <strong>Y2K38 problem</strong>. It is significantly more dangerous than the original Y2K bug because it happens at the hardware/OS level, not just in application code.</p>
          <p className="mt-2">To fix this, modern systems have migrated their timestamp variables to <strong>64-bit integers</strong>. A 64-bit Unix timestamp will not overflow for another 292 billion years.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What exact event occurs to trigger the Year 2038 problem?",
                options: [
                  "The internet runs out of IPv4 addresses.",
                  "A 32-bit signed integer storing the Unix timestamp reaches its maximum value and overflows into a negative number.",
                  "The leap second algorithm causes a division by zero error in Linux kernels.",
                  "Satellites lose synchronization with UTC."
                ],
                correctIndex: 1,
                explanation: "At 03:14:07 UTC on January 19, 2038, the 32-bit integer overflows, causing systems to interpret the date as the year 1901."
              },
              {
                question: "What is the 'Unix Epoch'?",
                options: [
                  "The exact moment the first Unix computer was turned on.",
                  "January 1, 1970 at 00:00:00 UTC.",
                  "The time when the Year 2038 problem will occur.",
                  "January 1, 2000."
                ],
                correctIndex: 1,
                explanation: "The Unix Epoch (Jan 1, 1970) is the arbitrary anchor point used by POSIX systems to start counting seconds."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
