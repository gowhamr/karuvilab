import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import ReactionTimeClientWrapper from './ReactionTimeClientWrapper';

const toolId = 'reaction-time';
const cat = CATEGORIES.find(c => c.id === 'break-time');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Reaction Time Test"
      description="Test your visual reflexes and measure your reaction time in milliseconds. Track your best and average scores locally."
      category={cat}
      toolId={toolId}
    >
      <ReactionTimeClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-performance"
          title="How it Works: High-Resolution Time"
          preview="Learn why standard clock time is not accurate enough for measuring human reflexes."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              To measure your reaction time, the code simply records the time when the screen turns green, records the time when you click, and subtracts the two numbers. However, the way you record that time matters significantly.
            </p>
            <h3>Date.now() vs performance.now()</h3>
            <p>
              Many beginner JavaScript programs use <code>Date.now()</code>. This relies on the system clock. The problem is that the system clock can be adjusted mid-game (e.g., by an NTP server synchronizing your computer's time with the atomic clock). If the clock jumps forward 50ms while you are reacting, your score is ruined.
            </p>
            <p>
              For precision measurements, browsers provide the <code>performance.now()</code> API. This represents a high-resolution, monotonically increasing timer. 
            </p>
            <ul>
              <li><strong>Sub-millisecond precision:</strong> It can measure fractions of a millisecond (e.g., <code>150.45ms</code>).</li>
              <li><strong>Monotonicity:</strong> It is guaranteed to never go backwards, even if the user manually changes their system clock.</li>
            </ul>
            <p>
              This tool uses <code>performance.now()</code> to ensure that your reaction time is measured with hardware-level accuracy, unaffected by operating system clock drift.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
