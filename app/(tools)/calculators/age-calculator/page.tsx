
import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import AgeCalculatorClientWrapper from './AgeCalculatorClientWrapper';

const toolId = 'age-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Age Calculator"
      description="Calculate exact age in years, months, and days."
      category={cat}
      toolId={toolId}
    >
      <AgeCalculatorClientWrapper />

      <LearningHub title="Understanding Date Mathematics">
        
        <LearningSection type="architecture" title="The Problem with 'Months'">
          <p>Calculating age seems like simple subtraction. But if you were born on January 31st, and today is March 1st, are you exactly 1 month old? How many days are left over?</p>
          <p className="mt-2">Unlike seconds or minutes, a "month" is not a fixed unit of time. It can be 28, 29, 30, or 31 days long. Therefore, simply subtracting two Unix timestamps gives you an absolute number of milliseconds, which cannot be perfectly divided into months.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Calendar Algorithm">
          <p>To get an exact "Years, Months, Days" breakdown, developers have to use calendar-aware math instead of absolute timestamps:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li><strong>Calculate Years:</strong> Subtract birth year from current year. Adjust down by 1 if the current month/day is before the birth month/day.</li>
            <li><strong>Calculate Months:</strong> Subtract birth month from current month. If the result is negative, add 12 and borrow a year from the total.</li>
            <li><strong>Calculate Days:</strong> Subtract birth day from current day. If negative, borrow 1 month, and add the <em>exact number of days in the previous month</em> to the day total.</li>
          </ol>
        </LearningSection>

        <LearningSection type="failures" title="The Leap Year Trap">
          <p>Step 3 in the algorithm above is where most custom scripts fail. The "number of days in the previous month" changes if that month was February during a leap year.</p>
          <p className="mt-2">A leap year occurs if the year is divisible by 4, but not by 100—unless it is also divisible by 400. This tool uses robust time libraries (like <code>date-fns</code>) that handle these Gregorian calendar quirks perfectly, rather than relying on flawed manual JavaScript date math.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why can't you calculate an exact age (in months) by simply subtracting the birth timestamp from the current timestamp?",
                options: [
                  "Because timestamps are only measured in seconds, not months.",
                  "Because a 'month' is not a fixed unit of time (varying between 28 and 31 days), so dividing raw milliseconds by a constant number fails.",
                  "Because timestamps do not account for timezones.",
                  "Because JavaScript cannot handle large integers."
                ],
                correctIndex: 1,
                explanation: "Unlike hours or days, months and years have variable lengths depending on the specific calendar dates involved (e.g., Leap Years)."
              },
              {
                question: "According to the Gregorian calendar, which of the following years is a Leap Year?",
                options: [
                  "2100",
                  "1900",
                  "2000",
                  "2023"
                ],
                correctIndex: 2,
                explanation: "A year is a leap year if it is divisible by 4. However, century years (1900, 2100) are NOT leap years UNLESS they are also divisible by 400. Thus, 2000 was a leap year, but 2100 will not be."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
