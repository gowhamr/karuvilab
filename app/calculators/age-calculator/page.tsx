import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import AgeCalculatorClient from "./AgeCalculatorClient";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("age-calculator");

export default function AgeCalculator() {
  return (
    <ToolShell
      title="Age Calculator"
      description="Calculate exact age in years, months, and days."
      category={cat}
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
      <AgeCalculatorClient />
    </ToolShell>
  );
}
