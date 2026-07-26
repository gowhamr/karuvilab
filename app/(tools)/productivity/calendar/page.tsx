import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import ToolClientWrapper from "./ToolClientWrapper";

export const metadata: Metadata = generateToolMetadata("calendar");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "productivity")!;
  return (
    <ToolShell
      title="Calendar"
      description="Professional, fully local-first calendar for managing your time privately."
      category={cat}
      fullWidth={true}
      toolId="calendar"
    >
      <ToolClientWrapper />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mt-16">
        <LearningHub title="Understanding Local-First Architecture">
          
          <LearningSection type="architecture" title="The Privacy Standard">
            <p>Most modern calendar applications rely heavily on cloud servers. Every event you create, every meeting you schedule, and every note you attach is sent to a remote server database (like AWS or Google Cloud). This creates significant privacy and security implications.</p>
            <p className="mt-2">This calendar is built on a <strong>Local-First Architecture</strong>. This means the primary, authoritative database for your events is stored entirely inside your physical device, not on a server.</p>
          </LearningSection>
          
          <LearningSection type="api" title="IndexedDB Storage">
            <p>To achieve this, the tool uses <strong>IndexedDB</strong>, a low-level API provided by all modern browsers for client-side storage of significant amounts of structured data.</p>
            <p className="mt-2">Unlike cookies or <code>localStorage</code> (which are limited to a few megabytes of text), IndexedDB is a fully-featured, indexed NoSQL database living directly in your browser. This is what allows you to store thousands of calendar events locally without ever triggering a loading spinner or requiring an internet connection.</p>
          </LearningSection>

          <LearningSection type="performance" title="Zero Latency">
            <p>Because the database is physically located on the exact same machine rendering the UI, latency drops from hundreds of milliseconds (server round-trip) to virtually zero. Data reads and writes happen instantly, creating an incredibly fluid user experience.</p>
          </LearningSection>

          <LearningSection type="general" title="Check Your Knowledge" fullWidth>
            <QuizWidget 
              questions={[
                {
                  question: "In a Local-First Architecture, where is the primary, authoritative source of your data stored?",
                  options: [
                    "On a secure Amazon Web Services (AWS) server.",
                    "On the developer's cloud database.",
                    "Directly on the user's physical device.",
                    "In the RAM memory, which clears every time you close the tab."
                  ],
                  correctIndex: 2,
                  explanation: "Local-First means the client device holds the primary copy of the data, ensuring absolute privacy and offline capability."
                },
                {
                  question: "Why does this calendar use IndexedDB instead of localStorage?",
                  options: [
                    "Because localStorage requires an internet connection.",
                    "Because IndexedDB is a robust NoSQL database capable of storing massive amounts of complex, indexed data, while localStorage is just a small key-value string store.",
                    "Because localStorage is illegal.",
                    "Because IndexedDB is faster for downloading images."
                  ],
                  correctIndex: 1,
                  explanation: "IndexedDB is designed for heavy-duty, structured offline data storage, making it perfect for an entire calendar database."
                }
              ]}
            />
          </LearningSection>
        </LearningHub>
      </div>
    </ToolShell>
  );
}
