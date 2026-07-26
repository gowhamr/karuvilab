import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import TimeZoneConverterClientWrapper from "./TimeZoneConverterClientWrapper";

const toolId = "timezone-converter";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TimeZoneConverterPage() {
  return (
    <ToolShell
      title="Time Zone Converter"
      description="Compare and convert times across different regions. Perfect for scheduling meetings and remote work."
      category={category}
      toolId={toolId}
    >
      <TimeZoneConverterClientWrapper />

      <LearningHub title="Understanding Global Time">
        
        <LearningSection type="architecture" title="The TZ Database">
          <p>Timezones are a political construct, not just a geographical one. Countries change their time offsets and Daylight Saving Time (DST) rules frequently. </p>
          <p className="mt-2">To handle this chaos, all modern software relies on the <strong>IANA Time Zone Database (tzdb)</strong>. This database tracks every historical and current timezone rule for the entire planet. When you select a timezone like <code>America/New_York</code>, the browser engine uses this database to instantly know if DST is active on the specific date you've selected.</p>
        </LearningSection>
        
        <LearningSection type="failures" title="The Offset Illusion">
          <p>A common mistake in programming is storing timezones as fixed offsets (e.g., <code>UTC-5</code> for New York). This is fundamentally flawed.</p>
          <p className="mt-2">New York is <code>UTC-5</code> in the winter, but <code>UTC-4</code> in the summer due to Daylight Saving Time. If you schedule a meeting in July using a hardcoded <code>UTC-5</code> offset, everyone will show up an hour late. You must always store the named region (<code>America/New_York</code>) and let the engine calculate the offset dynamically based on the target date.</p>
        </LearningSection>

        <LearningSection type="api" title="UTC: The Anchor">
          <p>UTC (Coordinated Universal Time) is the global standard baseline for time. It never observes Daylight Saving Time and never changes.</p>
          <p className="mt-2">Best practice for databases is to instantly convert all timestamps to UTC the moment they are saved, and only convert them back to local time (like <code>Asia/Kolkata</code> or <code>Europe/London</code>) at the exact moment they are displayed to the user on the screen.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why should you never store a timezone purely as an offset like 'UTC-5' for a future calendar event?",
                options: [
                  "Because UTC-5 doesn't exist.",
                  "Because it makes the database too large.",
                  "Because Daylight Saving Time changes the actual offset depending on the time of year, making a hardcoded offset inaccurate.",
                  "Because you can't subtract numbers in time calculations."
                ],
                correctIndex: 2,
                explanation: "Timezones shift dynamically throughout the year. Storing the geographical name (e.g., 'America/New_York') allows the system to check the IANA database for the correct seasonal offset."
              },
              {
                question: "What is the recommended standard for storing timestamps in a server database?",
                options: [
                  "The user's local time.",
                  "Coordinated Universal Time (UTC).",
                  "The timezone of the company's headquarters.",
                  "Greenwich Mean Time (GMT)."
                ],
                correctIndex: 1,
                explanation: "UTC is the absolute standard that never observes DST, making it the perfect neutral anchor for storing time globally."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
