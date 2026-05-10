import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const WorldClockClient = dynamic(() => import("./WorldClockClient"), {
  loading: () => null,
});

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = {
  title: "World Clock | KaruviLab",
  description: "Current time across major cities worldwide. Real-time updates with business hour indicators.",
  keywords: ["world clock", "time zone", "current time", "global time", "utc offset"],
};

export default function WorldClock() {
  return (
    <ToolShell
      title="World Clock"
      description="Current time across major cities worldwide. Updates every second."
      category={cat}
      content={{
        detailedDescription: "The World Clock tool provides a comprehensive view of the current time in key financial and business hubs across the globe. It automatically calculates UTC offsets and identifies business hours (9:00 AM to 6:00 PM, Monday through Friday) for each location, making it an essential tool for scheduling international meetings or monitoring global markets. The interface is optimized for high-frequency updates, ensuring that every second is accounted for with millisecond precision in the underlying logic.",
        howTo: [
          "Scan the grid to find the current time in major cities like Mumbai, New York, London, and Tokyo.",
          "Look for the status indicator (green dot) to see if a city is currently within standard business hours.",
          "Check the bottom of each card for the current local date and UTC offset.",
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
      <WorldClockClient />
    </ToolShell>
  );
}
