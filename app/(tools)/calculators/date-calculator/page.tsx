
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import DateCalculatorClientWrapper from "./DateCalculatorClientWrapper";

const toolId = "date-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function DateCalculator() {
  return (
    <ToolShell
      title="Date Calculator"
      description="Calculate date differences or add/subtract time from any date."
      category={cat}
      toolId={toolId}
    >
      <DateCalculatorClientWrapper />

      <LearningHub title="Understanding Computer Date Mathematics">
        
        <LearningSection type="architecture" title="The Problem with Calendars">
          <p>When a human looks at the date "October 4th, 2026", they inherently understand months, years, and leap days. But when a computer processes a date, dealing with "months" that have varying lengths (28, 29, 30, or 31 days) makes complex math incredibly slow and error-prone.</p>
        </LearningSection>
        
        <LearningSection type="standards" title="The Unix Epoch">
          <p>To make date math fast and uniform, the computer science industry agreed on a standard called the <strong>Unix Epoch</strong>. Every single date is stored internally as a massive integer representing the total number of milliseconds that have passed since Midnight on January 1st, 1970 (UTC).</p>
          <p className="mt-2">So to a computer, "October 4th, 2026" is just <code>1791110400000</code>.</p>
        </LearningSection>

        <LearningSection type="performance" title="Calculating Differences">
          <p>Because every date is just an absolute number, finding the exact number of days between two dates becomes incredibly easy for a CPU:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Convert Date A to milliseconds (e.g., <code>1500000000000</code>).</li>
            <li>Convert Date B to milliseconds (e.g., <code>1600000000000</code>).</li>
            <li>Subtract A from B to find the raw difference (<code>100000000000</code>).</li>
            <li>Divide the result by the exact number of milliseconds in a single day (<code>1000 * 60 * 60 * 24 = 86400000</code>).</li>
          </ol>
          <p className="mt-2">This absolute-time approach inherently bypasses all the complex rules of leap years and varying month lengths, giving you a mathematically perfect answer every single time.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How do modern computers internally store and process dates like 'March 5th, 2024'?",
                options: [
                  "As a string of text that the CPU parses.",
                  "As three separate variables: Year, Month, and Day.",
                  "As a single massive integer representing the total milliseconds elapsed since January 1st, 1970 (the Unix Epoch).",
                  "Using a specialized hardware chip called a Calendar Processing Unit."
                ],
                correctIndex: 2,
                explanation: "By converting everything to a single number (milliseconds since the Epoch), date math becomes simple arithmetic rather than complex calendar logic."
              },
              {
                question: "Why is calculating the difference between two dates using Unix timestamps more accurate than trying to count months?",
                options: [
                  "Because months have variable lengths (28, 29, 30, 31 days), making it mathematically impossible to use '1 month' as a fixed unit of subtraction.",
                  "Because Unix timestamps are synchronized with atomic clocks.",
                  "Because Unix timestamps automatically adjust for Daylight Saving Time.",
                  "Because it is required by the JavaScript specification."
                ],
                correctIndex: 0,
                explanation: "Because a month is not a fixed amount of time, you cannot reliably do math with it. Milliseconds are absolute, making subtraction flawless."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
