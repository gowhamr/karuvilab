import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-bmi"
          title="How it Works: The Mathematics of BMI"
          preview="Learn the formula behind the Body Mass Index and its historical context."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The Body Mass Index (BMI) is a mathematical formula developed in the 1830s by a Belgian mathematician named Lambert Adolphe Jacques Quetelet. It was originally called the Quetelet Index.
            </p>
            <h3>The Formula</h3>
            <p>
              The calculation is surprisingly simple. It does not measure body fat directly. Instead, it measures mass relative to height:
            </p>
            <p>
              <code>BMI = Weight (kg) / [Height (m)]²</code>
            </p>
            <p>
              If you use Imperial units (pounds and inches), the formula requires a conversion factor of 703:
            </p>
            <p>
              <code>BMI = (Weight (lbs) / [Height (inches)]²) × 703</code>
            </p>
            <h3>Limitations</h3>
            <p>
              Because the formula only looks at total mass, it cannot distinguish between fat mass and muscle mass. A professional bodybuilder might have a BMI of 32 (technically "Obese") despite having 8% body fat. 
            </p>
            <p>
              Furthermore, the standard ranges (e.g., Normal = 18.5 to 24.9) were calibrated primarily using data from populations of European descent. This tool includes an option to view ranges adapted for South Asian demographics, as studies indicate elevated health risks at lower BMI thresholds for these populations.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
