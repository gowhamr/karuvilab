import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import QAWorkbenchClientWrapper from '@/src/features/qa-workbench/components/QAWorkbenchClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("qa-workbench");
}

export default function Page() {
  return (
    <ToolShell toolId="qa-workbench" title="QA Workbench">
      <QAWorkbenchClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-qa"
          title="How it Works: QA Workflows & Test Data"
          preview="Learn why structured QA testing requires standardized, repeatable datasets."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Quality Assurance (QA) is the process of verifying that a software application works exactly as intended before it is released to users. A critical part of QA is executing test cases—a specific set of steps, inputs, and expected outputs.
            </p>
            <h3>The Problem with Manual Testing</h3>
            <p>
              When developers test their own code, they often test the "happy path"—the scenario where everything works perfectly. Dedicated QA engineers are trained to test the "edge cases"—what happens if the user inputs a negative number, a string of emojis, or a 50MB file?
            </p>
            <h3>Why Use a QA Workbench?</h3>
            <p>
              To test edge cases consistently, QA engineers need access to a wide variety of test data (valid JSON, invalid JSON, corrupted files, extremely long strings, etc.). A QA Workbench centralizes these tools and generators, allowing engineers to quickly synthesize the exact payload needed to try and "break" the application in a controlled, repeatable manner.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
