import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

import StopwatchClientWrapper from './StopwatchClientWrapper';

const toolId = 'stopwatch';
const cat = CATEGORIES.find(c => c.id === 'productivity');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Stopwatch"
      description="A precise, professional stopwatch with lap tracking and fullscreen dashboard mode."
      category={cat}
      toolId={toolId}
    >
      <StopwatchClientWrapper />

      <LearningHub title="Understanding Browser Time Precision">
        
        <LearningSection type="api" title="Date.now() vs. performance.now()">
          <p>When building a precise stopwatch in JavaScript, you have two choices for getting the current time: <code>Date.now()</code> and <code>performance.now()</code>. Professional timing tools always use the latter.</p>
          <p className="mt-2"><code>Date.now()</code> relies on the system clock. If your computer's clock syncs with an internet time server while the stopwatch is running, or if Daylight Saving Time occurs, <code>Date.now()</code> can jump backwards or forwards, completely ruining your stopwatch calculation.</p>
        </LearningSection>
        
        <LearningSection type="architecture" title="Monotonic Clocks">
          <p><code>performance.now()</code> uses a <strong>Monotonic Clock</strong>. A monotonic clock is guaranteed to never go backwards and is entirely independent of the system's timezone or wall-clock time.</p>
          <p className="mt-2">It represents the exact number of milliseconds that have passed since the web page was loaded (the navigation start time), often with sub-millisecond precision (e.g., <code>1045.234ms</code>). By subtracting the <code>performance.now()</code> value at the moment the user clicks "Start" from the current <code>performance.now()</code> value, you get an ultra-precise elapsed time.</p>
        </LearningSection>

        <LearningSection type="failures" title="The React Re-render Trap">
          <p>A common mistake when building a stopwatch in React is putting the current elapsed time in a standard state variable (<code>useState</code>) and updating it every 10 milliseconds.</p>
          <p className="mt-2">React state updates trigger a re-render of the entire component tree. Forcing React to calculate virtual DOM diffs 100 times a second will cause massive CPU spikes, battery drain, and stuttering UI. High-performance stopwatches bypass React's render cycle by mutating a DOM element's <code>textContent</code> directly inside a <code>requestAnimationFrame</code> loop.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why should you use performance.now() instead of Date.now() for measuring elapsed time?",
                options: [
                  "Because performance.now() relies on a Monotonic Clock that never jumps backwards if the system time is updated.",
                  "Because Date.now() returns seconds instead of milliseconds.",
                  "Because performance.now() works offline.",
                  "Because Date.now() doesn't work in Safari."
                ],
                correctIndex: 0,
                explanation: "System clocks can be adjusted manually or automatically via NTP syncs, ruining elapsed time calculations. Monotonic clocks are immune to this."
              },
              {
                question: "Why is it a bad idea to use React's useState to update a fast-moving stopwatch display (e.g., every 10ms)?",
                options: [
                  "Because useState can't hold numbers.",
                  "Because triggering the React render cycle 100 times a second causes severe CPU spikes and poor performance.",
                  "Because useState is only available in Class components.",
                  "Because the numbers won't update on mobile devices."
                ],
                correctIndex: 1,
                explanation: "React's declarative rendering is too heavy for rapid, continuous animation loops. Direct DOM manipulation is necessary for optimal performance here."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
