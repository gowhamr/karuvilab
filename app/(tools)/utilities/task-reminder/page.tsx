import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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
      content={{
        detailedDescription: "Task Reminder is a privacy-first productivity tool designed for quick, ephemeral to-do lists. Unlike traditional task managers that require accounts and sync your data to a cloud, this tool operates entirely within your browser's local storage. This means your tasks never leave your device, ensuring total privacy. It's perfect for daily punch lists, temporary reminders, or managing focus during a single work session without the overhead of a complex project management system.",
        howTo: [
          "Type your task description in the 'What needs to be done?' field.",
          "Optionally select a due date to track upcoming deadlines.",
          "Click 'Add Task' or press Enter to save the task to your local list.",
          "Use the status filters (All, Active, Completed) to organize your view.",
          "Mark tasks as complete using the checkbox, or remove them entirely using the '×' button."
        ],
        faq: [
          {
            question: "Where is my data stored?",
            answer: "Your tasks are stored in your browser's 'localStorage'. This is a private area on your hard drive managed by your browser."
          },
          {
            question: "Will my tasks be available on my other devices?",
            answer: "No. Since the data is stored locally on this specific browser and device, it does not sync across other computers or phones."
          },
          {
            question: "Is there a limit to how many tasks I can add?",
            answer: "The limit is based on your browser's local storage capacity (typically around 5MB), which is enough for thousands of simple text tasks."
          }
        ],
        relatedTools: ["split-copy", "text-utility", "grammar-checker"]
      }}
    >
      <TaskReminderClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-localstorage"
          title="How it Works: Web Storage API"
          preview="Learn how websites save your preferences without requiring a database."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you close this tab and come back tomorrow, your tasks will still be here. But since you haven't logged in, and we don't have a database, where is the data saved?
            </p>
            <h3>Cookies vs LocalStorage</h3>
            <p>
              Before HTML5, websites had to use <strong>Cookies</strong> to save state (like keeping you logged in). Cookies are sent to the server with <em>every single HTTP request</em>. Saving a giant list of tasks in a cookie would waste a massive amount of network bandwidth.
            </p>
            <p>
              Modern browsers provide the <strong>Web Storage API</strong> (specifically <code>window.localStorage</code>). This is a simple Key-Value store that lives on your hard drive. 
            </p>
            <ul>
              <li>It can store up to 5MB of data per domain (vs 4KB for cookies).</li>
              <li>It is <strong>never</strong> sent to the server during network requests.</li>
              <li>It persists until you explicitly clear your browser data.</li>
            </ul>
            <p>
              Because this tool uses LocalStorage, your data is completely offline and private. However, it also means your tasks will not sync to your phone, as the data never leaves the physical device you are typing on.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
