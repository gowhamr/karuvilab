import WorldClockClientWrapper from "./WorldClockClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";


import { generateToolMetadata } from "@/src/lib/seo";

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
      content={{
        detailedDescription: "The World Clock tool provides a comprehensive view of the current time in key financial and business hubs across the globe. It automatically calculates UTC offsets and identifies business hours (9:00 AM to 6:00 PM, Monday through Friday) for each location, making it an essential tool for scheduling international meetings or monitoring global markets. The interface is optimized for high-frequency updates, ensuring that every second is accounted for with millisecond precision in the underlying logic.",
        howTo: [
          "Click 'Add Clock' to open the timezone search modal.",
          "Search for a city or timezone and select it to add a new clock to your dashboard.",
          "Your local time is automatically highlighted with a blue border.",
          "Look for the 'Open'/'Closed' indicator to see if a city is within standard business hours.",
          "The clock updates automatically every second; no manual refresh is required."
        ],
        faq: [
          {
            question: "How are the time zones determined?",
            answer: "We use the standard IANA time zone database (e.g., Asia/Kolkata, America/New_York) to ensure accuracy even during Daylight Saving Time transitions."
          },
          {
            question: "What defines 'Business Hours' in this tool?",
            answer: "We define business hours as 9:00 AM to 6:00 PM local time, from Monday to Friday."
          },
          {
            question: "Is the time synced with a server?",
            answer: "The tool uses your device's system time as a reference and applies the appropriate time zone offset. For the best accuracy, ensure your device clock is synced."
          }
        ],
        relatedTools: ["utc-ist-converter", "date-calculator", "time-calculator"]
      }}
    >
      <WorldClockClientWrapper />
    </ToolShell>
  );
}
