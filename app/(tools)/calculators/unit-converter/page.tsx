import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import UnitConverterClientWrapper from './UnitConverterClientWrapper';

const toolId = 'unit-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Unit Converter"
      description="Convert between Length, Weight, Volume, Temperature, Area, and Speed units."
      category={cat}
      toolId={toolId}
    >
      <UnitConverterClientWrapper />

      <LearningHub title="Understanding Measurement Systems">
        
        <LearningSection type="architecture" title="The Imperial Problem">
          <p>In the Imperial system (still primarily used by the USA, Liberia, and Myanmar), conversion factors are historically arbitrary. To convert miles to inches, you must memorize that there are exactly 5,280 feet in a mile, and 12 inches in a foot.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Magic of Base-10 (Metric)">
          <p>The Metric system (SI) was designed during the French Revolution with one simple, universally scalable rule: <strong>Everything must be a power of 10.</strong></p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>kilo-</strong> means 1,000 (A kilometer is 1,000 meters)</li>
            <li><strong>centi-</strong> means 1/100th (A centimeter is 0.01 meters)</li>
            <li><strong>milli-</strong> means 1/1,000th (A millimeter is 0.001 meters)</li>
          </ul>
          <p className="mt-2">This makes conversions mathematically effortless. To convert 5 kilometers to centimeters, you don't need a calculator. You just move the decimal point to the right: <code>5 km = 5,000 meters = 500,000 cm</code>.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Temperature Exception">
          <p>Temperature is the one major outlier in standard unit conversion where the math is not just simple multiplication. Because the Fahrenheit and Celsius scales start at different zero-points (freezing vs absolute zero), you have to apply an offset.</p>
          <p className="mt-2">To convert Fahrenheit to Celsius, you must first subtract 32 (to align the freezing point of water), and then multiply by exactly <code>5/9</code>.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is the Metric system (SI) considered mathematically superior to the Imperial system?",
                options: [
                  "It uses French words.",
                  "Every unit scales by powers of 10, meaning conversions just require moving the decimal point.",
                  "It uses larger numbers.",
                  "It was invented by scientists."
                ],
                correctIndex: 1,
                explanation: "Base-10 scaling eliminates the need to memorize arbitrary multipliers like 12, 3, or 5280."
              },
              {
                question: "Why can't you convert Fahrenheit to Celsius just by multiplying by a fixed number (like miles to kilometers)?",
                options: [
                  "Because the two scales have different zero-points (they don't start at the same place).",
                  "Because temperature is not a real physical property.",
                  "Because Fahrenheit uses fractions.",
                  "Because Celsius is based on the speed of light."
                ],
                correctIndex: 0,
                explanation: "Because 0°F and 0°C represent completely different physical temperatures, a linear offset (-32) must be applied before scaling."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
