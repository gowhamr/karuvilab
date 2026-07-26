import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import CrontabEditorWrapper from './CrontabEditorWrapper';

const toolId = 'crontab-editor';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Crontab Editor"
      description="Visual cron schedule editor. Build and understand cron expressions instantly with human-readable preview and next run times. 100% browser-native."
      category={cat}
      toolId={toolId}
    >
      <CrontabEditorWrapper />

      <LearningHub title="Understanding Cron and Time Scheduling">
        
        <LearningSection type="architecture" title="The Cron Daemon">
          <p><code>cron</code> is a time-based job scheduler built into Unix-like operating systems. It reads a configuration file called a "crontab" (cron table) that contains a list of shell commands and the exact times they should run.</p>
          <p className="mt-2">The system daemon (background process) wakes up every minute, checks the current time against all the rules in the crontab, and executes the commands for any rules that match exactly. Because it relies on strict string matching rather than complex calendar logic, it is incredibly lightweight and reliable.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The 5-Part Syntax">
          <p>A standard cron expression consists of 5 fields separated by spaces:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Minute</strong> (0-59)</li>
            <li><strong>Hour</strong> (0-23)</li>
            <li><strong>Day of Month</strong> (1-31)</li>
            <li><strong>Month</strong> (1-12)</li>
            <li><strong>Day of Week</strong> (0-6, where 0 is Sunday)</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Timezone Nightmares">
          <p>The number one reason cron jobs fail in modern distributed systems is Timezone mismatch.</p>
          <p className="mt-2">A developer writes a cron job to run at 2 AM on their local Mac (PST), pushes it to AWS, and suddenly the job runs at 6 PM. By default, cron daemon evaluates schedules against the server's local system time (which is usually UTC in cloud environments). When building web apps, always schedule your cron jobs in UTC.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What does the cron expression '0 * * * *' mean?",
                options: [
                  "Run at the start of every hour (Minute 0).",
                  "Run every minute of the day.",
                  "Run at midnight every day.",
                  "Run once a year on January 1st."
                ],
                correctIndex: 0,
                explanation: "The first field is Minute. Setting it to 0 and the rest to * means 'Run when the minute is exactly 0, regardless of the hour, day, or month'."
              },
              {
                question: "What is the most common cause of cron job scheduling bugs in cloud environments?",
                options: [
                  "The cron daemon crashes randomly.",
                  "Syntax errors in the shell command.",
                  "Timezone mismatches between the developer's local machine and the UTC cloud server.",
                  "The server running out of memory."
                ],
                correctIndex: 2,
                explanation: "Cloud servers almost universally run on UTC time. A cron expression for '2 AM' will run at 2 AM UTC, which might be the middle of the previous day for the developer."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
