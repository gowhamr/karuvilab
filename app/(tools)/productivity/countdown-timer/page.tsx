import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import CountdownTimerClientWrapper from './CountdownTimerClientWrapper';

const toolId = 'countdown-timer';
const cat = CATEGORIES.find(c => c.id === 'productivity');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Countdown Timer"
      description="A professional countdown timer with fullscreen dashboard mode and custom alarm sounds."
      category={cat}
      toolId={toolId}
    >
      <CountdownTimerClientWrapper />

      <LearningHub title="Understanding Browser Time Throttling">
        
        <LearningSection type="architecture" title="The setInterval Problem">
          <p>When building a timer, the most obvious JavaScript approach is to use <code>setInterval()</code> to subtract 1 second every 1,000 milliseconds. But if you rely on this, your timer will inevitably break.</p>
        </LearningSection>
        
        <LearningSection type="failures" title="Background Tab Throttling">
          <p>To save battery and CPU power, modern browsers (Chrome, Safari, Firefox) aggressively throttle JavaScript execution when a tab is put in the background. A <code>setInterval</code> designed to fire every 1 second might be throttled by the browser to fire only once every 10 seconds, or even 1 minute.</p>
          <p className="mt-2">If your timer logic relies on subtracting 1 second every time the interval fires, a 10-minute timer might actually take 20 minutes to finish if the user switches tabs!</p>
        </LearningSection>

        <LearningSection type="api" title="The Delta-Time Solution">
          <p>To fix this, professional timers never trust the interval tick. Instead, they calculate time using <strong>Delta-Time</strong> against the system clock.</p>
          <p className="mt-2">When the timer starts, the code records the exact <code>Target End Time (Date.now() + duration)</code>. Every time the screen updates (using <code>requestAnimationFrame</code>), it simply calculates <code>Target End Time - Date.now()</code>. Even if the browser pauses the tab for 5 minutes, the moment the tab is opened again, the timer calculates the exact mathematically correct remaining time instantly.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is it dangerous to rely purely on setInterval() for a precise countdown timer on the web?",
                options: [
                  "Because setInterval() is illegal in modern JavaScript.",
                  "Because browsers aggressively throttle background tabs to save battery, meaning your interval won't fire on time.",
                  "Because the interval counts up instead of down.",
                  "Because it causes memory leaks immediately."
                ],
                correctIndex: 1,
                explanation: "Background throttling means you can never trust an interval to fire at exactly the millisecond you requested."
              },
              {
                question: "What is the professional 'Delta-Time' solution to build a bulletproof timer?",
                options: [
                  "Constantly subtract the current System Clock time from a fixed Target End Time to dynamically calculate exactly what is left.",
                  "Use two intervals at the same time.",
                  "Ping a server to ask for the time.",
                  "Turn off background throttling."
                ],
                correctIndex: 0,
                explanation: "By relying on the absolute System Clock (Date.now()) rather than counting ticks, your timer becomes immune to pausing, lagging, and background throttling."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
