import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-cron"
          title="How it Works: The Cron Daemon"
          preview="Learn the history and syntax of the Unix time-based job scheduler."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              <code>cron</code> is a time-based job scheduler in Unix-like operating systems. It reads a configuration file called a "crontab" (cron table) that contains a list of commands and the times they should run.
            </p>
            <h3>The 5-Part Syntax</h3>
            <p>
              A standard cron expression consists of 5 fields separated by spaces:
            </p>
            <ul>
              <li><strong>Minute</strong> (0-59)</li>
              <li><strong>Hour</strong> (0-23)</li>
              <li><strong>Day of Month</strong> (1-31)</li>
              <li><strong>Month</strong> (1-12)</li>
              <li><strong>Day of Week</strong> (0-6, where 0 is Sunday)</li>
            </ul>
            <p>
              The system daemon wakes up every minute, checks the current time against all the rules in the crontab, and executes the commands for any rules that match exactly. Because it relies on strict string matching rather than complex calendar logic, it is incredibly lightweight and reliable.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
