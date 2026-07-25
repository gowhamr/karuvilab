import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
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
      content={{
        detailedDescription: "The Date Calculator is a versatile utility for all your calendar-based calculations. Whether you need to find the exact number of days between two historical events, calculate your project's deadline by adding business days, or determine exactly how many weeks have passed since a specific milestone, this tool provides precise answers. It handles complex calendar logic like varying month lengths and leap years automatically, giving you a detailed breakdown in years, months, weeks, and total days.",
        howTo: [
          "Use the 'Date Difference' tab to find the time elapsed between two specific dates.",
          "Select a 'From Date' and a 'To Date' using the calendar pickers.",
          "The 'Add / Subtract' tab allows you to calculate a future or past date by adding or removing a specific duration.",
          "Choose an operation (Add or Subtract), enter the amount, and select the unit (Days, Months, or Years).",
          "Copy the results instantly using the summary copy button."
        ],
        faq: [
          {
            question: "Is the end date included in the difference calculation?",
            answer: "By default, the difference is calculated as the total time elapsed between the two dates (exclusive of the start date itself)."
          },
          {
            question: "Does this account for leap years?",
            answer: "Yes, the calculator uses the standard Gregorian calendar logic which correctly accounts for February 29th in leap years."
          },
          {
            question: "Can I calculate negative differences?",
            answer: "The tool shows the absolute difference between two dates and indicates whether the second date is in the past or future relative to the first."
          }
        ],
        relatedTools: ["age-calculator", "time-calculator", "world-clock"]
      }}
    >
      <DateCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-date-math"
          title="How it Works: The Epoch Timestamp"
          preview="Learn how computers store dates internally as a single, massive number."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a computer looks at the date "October 4th, 2026", it doesn't see words or calendar pages. It sees a single integer: <code>1791110400000</code>.
            </p>
            <h3>The Unix Epoch</h3>
            <p>
              To make date math fast and uniform, the computer science industry agreed on a standard called the <strong>Unix Epoch</strong>. Every date is stored simply as the number of milliseconds that have passed since Midnight on January 1st, 1970 (UTC).
            </p>
            <p>
              Because every date is just a number, finding the exact number of days between two dates becomes incredibly easy for a CPU:
            </p>
            <ol>
              <li>Convert Date A to milliseconds (e.g., <code>1500000000000</code>).</li>
              <li>Convert Date B to milliseconds (e.g., <code>1600000000000</code>).</li>
              <li>Subtract A from B (<code>100000000000</code>).</li>
              <li>Divide the result by the number of milliseconds in a day (<code>1000 * 60 * 60 * 24 = 86400000</code>).</li>
            </ol>
            <p>
              This absolute time approach inherently bypasses all the complex rules of leap years and varying month lengths, giving you a perfect answer every time.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
