import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import TaskReminderClientWrapper from './TaskReminderClientWrapper';

const toolId = 'task-reminder';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Task Reminder"
      description="A simple local to-do list stored in your browser. No account required."
      category={cat}
      toolId={toolId}
    >
      <TaskReminderClientWrapper />

      <LearningHub title="Understanding the Web Storage API">
        
        <LearningSection type="architecture" title="Cookies vs LocalStorage">
          <p>When you close this tab and come back tomorrow, your tasks will still be here. But since you haven't logged in, and we don't have a backend database, where is the data saved?</p>
          <p className="mt-2">Before HTML5, websites had to use <strong>Cookies</strong> to save state. But Cookies are sent to the server with <em>every single HTTP request</em>. Saving a giant list of tasks in a cookie would waste a massive amount of network bandwidth.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The window.localStorage API">
          <p>Modern browsers provide the <strong>Web Storage API</strong> (specifically <code>window.localStorage</code>). This is a simple Key-Value store that lives securely on your hard drive.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>It can store up to 5MB of data per domain (vs only 4KB for cookies).</li>
            <li>It is <strong>never</strong> sent to the server during network requests, ensuring total privacy.</li>
            <li>It persists indefinitely until you explicitly clear your browser data.</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="The Sync Tradeoff">
          <p>Because this tool uses LocalStorage, your data is completely offline and private. The tradeoff for this privacy is that your tasks will not sync to your phone or other computers, as the data literally never leaves the physical device you are typing on.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why would it be a bad idea to store a massive to-do list in a browser Cookie?",
                options: [
                  "Cookies are automatically deleted every 24 hours.",
                  "Cookies are sent to the server with every single HTTP request, which would waste massive amounts of bandwidth.",
                  "Cookies can only store numbers.",
                  "Cookies require a high-speed internet connection."
                ],
                correctIndex: 1,
                explanation: "Every time you fetch an image or a script from a domain, the browser attaches all cookies for that domain. Adding 4KB of task text to every request is terrible for performance."
              },
              {
                question: "If you add 10 tasks on your laptop, will they appear on your phone?",
                options: [
                  "Yes, but only if you use Chrome on both devices.",
                  "Yes, they sync automatically via Bluetooth.",
                  "No. LocalStorage data is bound strictly to the physical device and browser where it was created.",
                  "Only if you refresh the page."
                ],
                correctIndex: 2,
                explanation: "LocalStorage is explicitly designed to not leave the device. Without an external database or Sync API, the data remains isolated on the local hard drive."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
