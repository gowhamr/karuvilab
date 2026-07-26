import type { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import QAWorkbenchClientWrapper from '@/src/features/qa-workbench/components/QAWorkbenchClientWrapper';

const toolId = 'qa-workbench';
const cat = CATEGORIES.find(c => c.id === 'developer');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="QA Workbench"
      category={cat}
      description="Synthesize test data, generate edge cases, and validate JSON payloads for Quality Assurance testing."
    >
      <QAWorkbenchClientWrapper />

      <LearningHub title="Understanding Quality Assurance (QA)">
        
        <LearningSection type="architecture" title="The 'Happy Path' Trap">
          <p>Quality Assurance (QA) is the systematic process of verifying that software works exactly as intended before it reaches real users.</p>
          <p className="mt-2">When developers test their own code, they instinctively test the <strong>"happy path"</strong>—the perfect scenario where the user inputs everything correctly. But in the real world, users make mistakes, malicious bots send corrupted data, and networks fail.</p>
        </LearningSection>
        
        <LearningSection type="failures" title="Testing the Edge Cases">
          <p>Dedicated QA engineers are trained to aggressively test <strong>edge cases</strong> and boundaries. What happens if the user inputs a negative number for their age? What if they paste an entire 5MB book into a "First Name" field? What if they upload a PDF that is actually a disguised .exe file?</p>
          <p className="mt-2">If the application does not have proper error handling for these edge cases, it will crash, corrupt the database, or expose security vulnerabilities.</p>
        </LearningSection>

        <LearningSection type="performance" title="Synthesizing Test Data">
          <p>To test edge cases consistently, QA engineers need access to a wide variety of standardized test data (valid JSON, malformed JSON, exceedingly long strings, Unicode emojis, etc.).</p>
          <p className="mt-2">A QA Workbench centralizes these data generators. Instead of manually typing out a 10,000-character string to test a database column limit, the workbench synthesizes the exact payload needed instantly, allowing engineers to reliably reproduce and verify bugs.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In software testing, what does the term 'happy path' refer to?",
                options: [
                  "A test case that produces a humorous error message.",
                  "The primary scenario where everything goes perfectly and the user inputs valid data.",
                  "A test that successfully crashes the application.",
                  "The process of deploying code to production."
                ],
                correctIndex: 1,
                explanation: "The happy path is the default, flawless scenario. While important, relying solely on happy path testing leaves applications highly vulnerable to unexpected user behavior."
              },
              {
                question: "Why is it critical for QA engineers to test boundaries (e.g., inputting a 10,000-character string into a text field)?",
                options: [
                  "To see if the text renders beautifully on screen.",
                  "To improve the SEO ranking of the application.",
                  "To ensure the database and backend do not crash or truncate data unexpectedly when given exceptionally large inputs.",
                  "To train the AI models faster."
                ],
                correctIndex: 2,
                explanation: "Unbounded inputs can crash backend servers or cause database exceptions. Boundary testing ensures the application safely rejects or truncates data that exceeds limits."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
