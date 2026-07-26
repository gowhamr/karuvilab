import WorldClockClientWrapper from "./WorldClockClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

const toolId = "world-clock";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function WorldClock() {
  return (
    <ToolShell
      toolId={toolId}
      title="World Clock"
      description="Track time across multiple cities with business hour indicators. Ideal for global teams and meeting planning."
      category={cat}
    >
      <WorldClockClientWrapper />

      <LearningHub title="Understanding Global Timezones">
        
        <LearningSection type="architecture" title="The Nightmare of Timezones">
          <p>Displaying the time in another country seems like it should be simple arithmetic: <em>"Just take my time and add 4 hours."</em> In reality, timezone management is widely considered by programmers to be one of the hardest problems in computer science.</p>
          <p className="mt-2">It is a nightmare of politics, geography, and history that constantly changes.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The IANA Database">
          <p>To solve this, the entire internet relies on the <strong>IANA Time Zone Database (tz database)</strong>. Instead of hardcoding static offsets (like "UTC-5"), systems use geographic names like <code>America/New_York</code>.</p>
          <p className="mt-2">Why? Because <code>America/New_York</code> is UTC-5 in the winter, but UTC-4 in the summer due to <strong>Daylight Saving Time (DST)</strong>.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Daylight Saving Chaos">
          <p>Daylight Saving Time makes time non-linear. In countries that observe it, the clock suddenly jumps forward by an hour in spring (skipping an hour completely), and falls back in autumn (repeating an hour).</p>
          <p className="mt-2">To make matters worse, different countries start and end DST on completely different dates. Some countries cancel it, and then reinstate it years later. The IANA database is updated constantly by a dedicated team of volunteers to track these political changes so that tools like this one display the mathematically correct time without fail.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do programmers use location strings like 'America/New_York' instead of just hardcoding 'UTC-5' for their code?",
                options: [
                  "Because 'UTC-5' is too hard to read.",
                  "Because the actual offset for New York changes twice a year due to Daylight Saving Time, so 'UTC-5' is wrong for half the year.",
                  "Because IANA mandates it.",
                  "Because strings use less memory than numbers."
                ],
                correctIndex: 1,
                explanation: "Geographic identifiers allow the underlying timezone database to handle the complex, politically-driven shifts of Daylight Saving Time automatically."
              },
              {
                question: "What happens to the local clock when Daylight Saving Time 'springs forward'?",
                options: [
                  "The day becomes 25 hours long.",
                  "The clock skips an hour (e.g., jumps from 1:59 AM to 3:00 AM), making that day only 23 hours long locally.",
                  "The sun rises an hour earlier.",
                  "Servers crash globally."
                ],
                correctIndex: 1,
                explanation: "Springing forward literally skips an hour of local time, meaning 2:30 AM on that specific date technically does not exist."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
