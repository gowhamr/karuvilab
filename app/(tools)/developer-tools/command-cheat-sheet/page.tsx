import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the Command-Line Interface (CLI)">
        
        <LearningSection type="architecture" title="Why CLI?">
          <p>While Graphical User Interfaces (GUIs) are intuitive for exploration, the Command-Line Interface (CLI) remains the industry standard for software engineering and DevOps.</p>
          <p className="mt-2">CLIs are highly automatable, scriptable, and operate with minimal system overhead. They form the backbone of modern CI/CD pipelines where no human is present to click a button.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Standard Streams">
          <p>Every standard CLI program communicates using three data streams:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>stdin (Standard Input):</strong> Data piped into the program (e.g., from your keyboard or another command).</li>
            <li><strong>stdout (Standard Output):</strong> The normal results printed by the program.</li>
            <li><strong>stderr (Standard Error):</strong> A separate channel used strictly for error messages and diagnostics, so they don't corrupt the actual output data stream.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The Power of Piping">
          <p>The true power of CLI tools comes from the Unix philosophy: "Write programs that do one thing and do it well."</p>
          <p className="mt-2">By using the pipe operator (<code>|</code>), you can string together multiple simple commands to perform incredibly complex tasks. For example, <code>cat logs.txt | grep "ERROR" | wc -l</code> instantly reads a massive file, filters for "ERROR", and counts the resulting lines, all in memory without needing a dedicated log analysis app.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the primary advantage of having a separate 'stderr' stream?",
                options: [
                  "It allows error messages to bypass the firewall.",
                  "It prevents diagnostic error messages from corrupting the actual data being output (stdout) when piping commands together.",
                  "It makes errors display in red text in the terminal.",
                  "It sends errors directly to the operating system's event viewer."
                ],
                correctIndex: 1,
                explanation: "If errors and data were mixed in one stream, piping data into another command would cause the downstream command to crash when it encounters the text of the error message."
              },
              {
                question: "What does the pipe operator (|) do in a Unix shell?",
                options: [
                  "It runs two commands in parallel.",
                  "It stops the first command if the second command fails.",
                  "It takes the stdout of the command on the left and feeds it into the stdin of the command on the right.",
                  "It clears the terminal screen."
                ],
                correctIndex: 2,
                explanation: "Piping chains programs together, allowing the output of one simple tool to become the input of the next, building complex workflows."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
