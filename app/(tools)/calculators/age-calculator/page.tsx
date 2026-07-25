import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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
      content={{
        detailedDescription: "The Age Calculator is a precision tool for determining the exact time elapsed between two dates. While most people use it to find their current age in years, this tool goes much further by providing a detailed breakdown into months, weeks, days, and even total months or weeks. It accurately accounts for leap years and the varying number of days in different months, ensuring 100% accuracy. Beyond just birthdays, it's incredibly useful for calculating the age of infants (often measured in weeks or months), project durations, or the time remaining until a significant event. The clean interface allows you to set a custom 'Calculate As Of' date, making it easy to find out how old you were on a specific historical date or how old you will be in the future.",
        howTo: [
          "Select your Date of Birth from the calendar picker.",
          "Specify the 'Calculate As Of' date (defaults to today).",
          "View your exact age in years, months, and days instantly.",
          "Check the additional metrics for total months, total weeks, and total days.",
          "Change the dates at any time to see immediate updates."
        ],
        faq: [
          {
            question: "Does this calculator account for leap years?",
            answer: "Yes, the tool correctly identifies leap years and adjusts the day count for February accordingly."
          },
          {
            question: "Can I calculate the age of someone born in the future?",
            answer: "The calculator is designed for past dates. If the 'Date of Birth' is later than the 'As Of' date, it will not return a result."
          },
          {
            question: "Why is my age in weeks different from total days divided by 7?",
            answer: "It shouldn't be; the tool calculates total weeks by dividing total days by 7 for consistency."
          }
        ],
        relatedTools: ["date-calculator", "time-calculator", "world-clock"]
      }}
    >
      <AgeCalculatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-date-math"
          title="How it Works: Date Math & Leap Years"
          preview="Learn why calculating months and days between two dates is deceptively complicated."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Calculating age seems like simple subtraction. But if you were born on January 31st, and today is March 1st, are you 1 month old? How many days are left over?
            </p>
            <h3>The Problem with "Months"</h3>
            <p>
              Unlike seconds or minutes, a "month" is not a fixed unit of time. It can be 28, 29, 30, or 31 days long. Therefore, <code>Date(A) - Date(B)</code> only gives you an absolute number of milliseconds, which you cannot perfectly divide into months.
            </p>
            <h3>The Algorithm</h3>
            <p>
              To get an exact "Years, Months, Days" breakdown, developers have to use calendar-aware math instead of absolute timestamps:
            </p>
            <ol>
              <li><strong>Calculate Years:</strong> Subtract birth year from current year. (Adjust down by 1 if the current month/day is before the birth month/day).</li>
              <li><strong>Calculate Months:</strong> Subtract birth month from current month. (If negative, add 12 and borrow a year).</li>
              <li><strong>Calculate Days:</strong> Subtract birth day from current day. If negative, borrow 1 month, and add the <em>exact number of days in the previous month</em> to the day total.</li>
            </ol>
            <p>
              Step 3 is where most custom scripts fail, because the "number of days in the previous month" changes if that month was February during a leap year (years divisible by 4, but not 100, unless also divisible by 400). This tool uses robust libraries (like <code>date-fns</code>) that handle these Gregorian calendar quirks perfectly.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
