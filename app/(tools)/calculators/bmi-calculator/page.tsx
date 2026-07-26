import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import BmiCalculatorWrapper from './BmiCalculatorWrapper';

const toolId = 'bmi-calculator';
const cat = CATEGORIES.find(c => c.id === 'calculators')!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function BmiCalculatorPage() {
  return (
    <ToolShell 
      title="BMI Calculator"
      description="Calculate your Body Mass Index with visual healthy range indicator. Supports metric and imperial units with Indian body type context."
      category={cat}
      toolId={toolId}
    >
      <BmiCalculatorWrapper />

      <LearningHub title="Understanding the Body Mass Index">
        
        <LearningSection type="architecture" title="The Quetelet Index">
          <p>The Body Mass Index (BMI) is a mathematical formula developed in the 1830s by a Belgian mathematician and sociologist named Lambert Adolphe Jacques Quetelet. It was originally known as the Quetelet Index.</p>
          <p className="mt-2">Quetelet was not a physician; his goal was to define the "average man" using statistics, not to create a diagnostic tool for individual health.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Mathematics">
          <p>The calculation is surprisingly simple. It does not measure body fat directly. Instead, it measures total mass relative to height:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>BMI = Weight (kg) / [Height (m)]²</code></pre>
          <p className="mt-2">If you use Imperial units (pounds and inches), the formula requires a scaling conversion factor of 703:</p>
          <pre className="bg-surface-2 p-4 rounded-xl text-sm overflow-x-auto mt-2"><code>BMI = (Weight (lbs) / [Height (inches)]²) × 703</code></pre>
        </LearningSection>

        <LearningSection type="failures" title="Limitations & Bias">
          <p>Because the formula only looks at total mass, it cannot distinguish between fat mass and muscle mass. A professional athlete or bodybuilder might have a BMI of 32 (technically "Obese") despite having extremely low body fat.</p>
          <p className="mt-2">Furthermore, the standard healthy ranges (e.g., Normal = 18.5 to 24.9) were calibrated primarily using data from populations of European descent. Studies indicate that South Asian populations face elevated cardiovascular and metabolic risks at much lower BMI thresholds. The World Health Organization (WHO) has established modified criteria for Asian populations, where a BMI over 23 is considered overweight.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why might a professional athlete with very low body fat be classified as 'Obese' by the BMI scale?",
                options: [
                  "Because their metabolism is much faster than average.",
                  "Because the BMI formula only measures total mass relative to height and cannot distinguish between heavy muscle and fat.",
                  "Because the formula is inverted for athletes.",
                  "Because their height is usually above average."
                ],
                correctIndex: 1,
                explanation: "Muscle is denser than fat. A highly muscular person is heavy for their height, resulting in a high BMI, even though they are extremely healthy."
              },
              {
                question: "Why do organizations like the WHO provide adjusted BMI thresholds for Asian populations?",
                options: [
                  "Because the Imperial to Metric conversion factor is different in Asia.",
                  "Because the original 1830s data was lost.",
                  "Because studies show Asian populations develop metabolic diseases (like Type 2 Diabetes) at significantly lower body weights than populations of European descent.",
                  "To make the calculation mathematically simpler."
                ],
                correctIndex: 2,
                explanation: "Genetic and physiological differences mean that body fat is distributed differently. Health risks begin at lower BMI thresholds for South Asian populations compared to the original European baseline."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
