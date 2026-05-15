import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const UtcIstConverterClient = dynamic(() => import("./UtcIstConverterClient"), {
  loading: () => <ToolSkeleton />,
});

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = {
  title: "UTC ↔ IST Converter | KV",
  description: "Convert between Coordinated Universal Time (UTC) and Indian Standard Time (IST). Features live clocks and business hour references.",
  keywords: ["utc to ist", "ist to utc", "time converter", "india time", "universal time", "offset converter"],
};

export default function UtcIstConverter() {
  return (
    <ToolShell
      title="UTC ↔ IST Converter"
      description="Convert between UTC and Indian Standard Time (UTC+5:30). Times stay in sync."
      category={cat}
      content={{
        detailedDescription: "The UTC to IST Converter is an essential utility for professionals working in global environments, particularly those collaborating with teams in India. Indian Standard Time (IST) is consistently UTC+5:30, with no daylight saving time adjustments. This tool provides real-time clocks for both zones and a synchronized conversion interface, allowing you to quickly determine local times for meetings, server logs, or release schedules. It also includes a quick-reference guide for standard IST business hours and their UTC equivalents.",
        howTo: [
          "Observe the live clocks at the top for the current UTC and IST times.",
          "To convert a specific time, enter it into either the UTC or IST input field.",
          "The other field will automatically update to show the converted time in sync.",
          "Use the 'Use Current Time' button to reset the converter to the present moment.",
          "Refer to the bottom table for common business hour conversions (e.g., IST 9:00 AM = UTC 3:30 AM)."
        ],
        faq: [
          {
            question: "Does India use Daylight Saving Time?",
            answer: "No, India does not observe Daylight Saving Time. The offset is always UTC+5:30 throughout the year."
          },
          {
            question: "What is the difference between GMT and UTC?",
            answer: "For most practical purposes, GMT (Greenwich Mean Time) and UTC (Coordinated Universal Time) are the same. This tool uses UTC as the precise standard."
          },
          {
            question: "Can I use this for server log analysis?",
            answer: "Yes, by entering the UTC timestamp from your logs into the converter, you can quickly find the corresponding local time in India."
          }
        ],
        relatedTools: ["world-clock", "date-calculator", "time-calculator"]
      }}
    >
      <UtcIstConverterClient />
    </ToolShell>
  );
}
