import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const DateCalculatorClient = dynamic(() => import("./DateCalculatorClient"), {
  loading: () => null,
});

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = {
  title: "Date Calculator | KaruviLab",
  description: "Calculate date differences or add/subtract time from any date. Supports years, months, weeks, and days.",
  keywords: ["date calculator", "date difference", "add days to date", "subtract days from date", "business days"],
};

export default function DateCalculator() {
  return (
    <ToolShell
      title="Date Calculator"
      description="Calculate date differences or add/subtract time from any date."
      category={cat}
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
      <DateCalculatorClient />
    </ToolShell>
  );
}
