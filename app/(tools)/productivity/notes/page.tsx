import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import NotesClientWrapper from "./NotesClientWrapper";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "notes";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function NotesToolPage() {
  return (
    <ToolShell
      title="KV Notes"
      description="Capture your thoughts privately. Fast, local, and offline-first."
      category={category}
      toolId={toolId}
    >
      <NotesClientWrapper />

      <LearningHub title="Understanding Browser Storage">
        
        <LearningSection type="architecture" title="Where do the notes go?">
          <p>When you type a note in a traditional web app, it sends a network request to a server. In this offline-first app, your notes are saved directly to your browser's internal storage engine.</p>
        </LearningSection>
        
        <LearningSection type="api" title="localStorage vs. IndexedDB">
          <p>Browsers offer multiple ways to store data offline:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>localStorage:</strong> Very easy to use, but limited to about 5MB of string data. It is synchronous, meaning it blocks the main thread (causing UI freezes) if you read or write too much data at once.</li>
            <li><strong>IndexedDB:</strong> A complex, asynchronous NoSQL database built into the browser. It can store hundreds of megabytes (or even gigabytes) of structured data, blobs, and files without ever freezing the UI.</li>
          </ul>
          <p className="mt-2">For a simple text notes app, <code>localStorage</code> is often sufficient, but for an app storing images or thousands of long documents, <code>IndexedDB</code> is the mandatory choice.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Clearing Cache Danger">
          <p>The biggest risk of Local-First web apps is that users often treat their browser cache as temporary.</p>
          <p className="mt-2">If a user clears their "Site Data" or "Cookies and other site data" in their browser settings, the browser will instantly wipe out the entire IndexedDB and localStorage databases, permanently deleting all their notes if they haven't exported them.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is localStorage not recommended for storing large files like images?",
                options: [
                  "Because it only works on mobile devices.",
                  "Because it is limited to ~5MB and is synchronous, meaning reading/writing large amounts of data will freeze the web page.",
                  "Because images are automatically deleted by localStorage.",
                  "Because it requires a database server password."
                ],
                correctIndex: 1,
                explanation: "localStorage's synchronous nature makes it terrible for large payloads. IndexedDB is asynchronous and built for heavy data."
              },
              {
                question: "What happens to your local-first notes if you clear your browser's 'Site Data'?",
                options: [
                  "Nothing, they are backed up to the cloud automatically.",
                  "They are permanently deleted because they live entirely inside the browser's local storage.",
                  "They are moved to your Desktop.",
                  "Only the oldest notes are deleted."
                ],
                correctIndex: 1,
                explanation: "Local storage relies entirely on the browser's data profile. Clearing site data wipes the local database completely."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
