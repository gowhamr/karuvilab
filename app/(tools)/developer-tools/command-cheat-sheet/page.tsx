import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ClientWrapper from './ClientWrapper';

const toolId = 'command-cheat-sheet';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Command Cheat Sheet"
      description="Quick reference for common CLI commands across various tools."
      category={cat}
      toolId={toolId}
    >
      <ClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-cli"
          title="How it Works: The Command-Line Interface"
          preview="Learn why the CLI remains the most powerful way to interact with computers."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              While Graphical User Interfaces (GUIs) are intuitive for exploration, the Command-Line Interface (CLI) remains the industry standard for software engineering and DevOps.
            </p>
            <h3>Standard Streams</h3>
            <p>
              Every CLI program communicates using three standard streams:
            </p>
            <ul>
              <li><strong>stdin (Standard Input):</strong> Data piped into the program (e.g. from your keyboard or another command).</li>
              <li><strong>stdout (Standard Output):</strong> The normal results printed by the program.</li>
              <li><strong>stderr (Standard Error):</strong> A separate channel used strictly for error messages and diagnostics, so they don't corrupt the actual output data.</li>
            </ul>
            <h3>The Power of Piping</h3>
            <p>
              The true power of CLI tools comes from the Unix philosophy: "Write programs that do one thing and do it well." By using the pipe operator (<code>|</code>), you can string together multiple simple commands to perform incredibly complex tasks. For example, <code>cat logs.txt | grep "ERROR" | wc -l</code> instantly counts the number of errors in a massive file without needing a dedicated log analysis app.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
