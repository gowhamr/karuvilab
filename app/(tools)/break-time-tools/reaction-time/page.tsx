import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding High-Resolution Time">
        
        <LearningSection type="architecture" title="The Measurement Problem">
          <p>To measure your reaction time, the code simply records the time when the screen turns green, records the time when you click, and subtracts the two numbers. However, the way you record that time matters significantly.</p>
        </LearningSection>
        
        <LearningSection type="security" title="Date.now() and System Clock Drift">
          <p>Many beginner JavaScript programs use <code>Date.now()</code>. This relies on the system clock. The problem is that the system clock can be adjusted mid-game (e.g., by an NTP server synchronizing your computer's time with the atomic clock).</p>
          <p className="mt-2">If the clock jumps forward 50ms while you are reacting, your score is ruined. Alternatively, a user could manipulate their system clock to fake a perfect score.</p>
        </LearningSection>

        <LearningSection type="api" title="The performance.now() API">
          <p>For precision measurements, browsers provide the <code>performance.now()</code> API. This represents a high-resolution, monotonically increasing timer.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Sub-millisecond precision:</strong> It can measure fractions of a millisecond (e.g., <code>150.45ms</code>).</li>
            <li><strong>Monotonicity:</strong> It is guaranteed to never go backwards, even if the user manually changes their system clock.</li>
          </ul>
          <p className="mt-2">This tool uses <code>performance.now()</code> to ensure that your reaction time is measured with hardware-level accuracy, unaffected by operating system clock drift.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why should you avoid using Date.now() to measure short durations like reaction times?",
                options: [
                  "Because it only works in Chrome.",
                  "Because it can be affected by the operating system adjusting the system clock, leading to inaccurate results.",
                  "Because it returns a string instead of a number.",
                  "Because it's deprecated in modern browsers."
                ],
                correctIndex: 1,
                explanation: "The system clock is constantly drifting and being corrected by NTP servers. A time adjustment happening exactly between your start and end points will corrupt the measurement."
              },
              {
                question: "What does it mean for a timer to be 'monotonically increasing'?",
                options: [
                  "It always increases by exactly 1.",
                  "It never goes backwards.",
                  "It counts in milliseconds instead of seconds.",
                  "It resets to zero when the page reloads."
                ],
                correctIndex: 1,
                explanation: "A monotonic timer only moves forward, guaranteeing that measuring the duration between two events will always yield a positive, accurate number regardless of clock tampering."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
