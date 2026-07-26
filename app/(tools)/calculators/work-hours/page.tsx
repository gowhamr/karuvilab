import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import WorkHoursClientWrapper from './WorkHoursClientWrapper';

const toolId = 'work-hours';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Work Hours Tracker"
      description="Log daily work sessions and track total hours and overtime."
      category={cat}
      toolId={toolId}
    >
      <WorkHoursClientWrapper />

      <LearningHub title="Understanding the Global Work Standard">
        
        <LearningSection type="architecture" title="The 2,080 Hour Rule">
          <p>In many parts of the world, the standard full-time work schedule is universally defined as 40 hours per week (8 hours a day, 5 days a week).</p>
          <p className="mt-2">Because there are exactly 52 weeks in a year, the total number of working hours in a standard year is <code>40 hours × 52 weeks = 2,080 hours</code>.</p>
          <p className="mt-2">This <strong>2,080</strong> number is the standard mathematical metric used by HR departments globally to calculate Full-Time Equivalent (FTE) compensation and benefits.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Freelancer's Formula">
          <p>If you are a freelancer or contractor moving to a salaried role (or vice versa), you need a quick way to convert between an hourly rate and an annual salary.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Hourly to Annual:</strong> If you make ₹1,000/hour, your annual salary equivalent is <code>1,000 × 2,080 = ₹20,80,000</code>.</li>
            <li><strong>Annual to Hourly:</strong> If your salary is ₹10,00,000/year, your hourly rate equivalent is <code>10,00,000 / 2,080 = ₹480/hour</code>.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="The 2,000 Hour Shortcut">
          <p>Because most full-time employees take about 2 weeks of paid vacation (80 hours), many people just use <strong>2,000 hours</strong> as a faster mental math shortcut.</p>
          <p className="mt-2">To quickly convert an hourly wage to a yearly salary in your head, simply double the hourly rate and add three zeros. (e.g., $50/hour × 2 = 100 ➔ $100,000/year).</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In standard HR math, how many hours are in a standard full-time work year (assuming 40 hrs/week and 52 weeks)?",
                options: [
                  "2,000",
                  "2,080",
                  "1,920",
                  "2,400"
                ],
                correctIndex: 1,
                explanation: "40 hours/week * 52 weeks/year = exactly 2,080 hours."
              },
              {
                question: "What is the rapid mental-math shortcut to estimate your annual salary if you know your hourly rate?",
                options: [
                  "Multiply by 10 and add a zero.",
                  "Multiply by 12.",
                  "Double the hourly rate and add three zeros.",
                  "Divide by 2 and add four zeros."
                ],
                correctIndex: 2,
                explanation: "Doubling and adding three zeros is the same as multiplying by 2,000, which closely estimates a work year minus 2 weeks of vacation."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
