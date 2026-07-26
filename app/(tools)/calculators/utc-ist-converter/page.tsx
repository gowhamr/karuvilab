import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import UtcIstConverterClientWrapper from './UtcIstConverterClientWrapper';

const toolId = 'utc-ist-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="UTC ↔ IST Converter"
      description="Convert between UTC and Indian Standard Time (UTC+5:30). Times stay in sync."
      category={cat}
      toolId={toolId}
    >
      <UtcIstConverterClientWrapper />

      <LearningHub title="Understanding Indian Standard Time">
        
        <LearningSection type="architecture" title="The 30-Minute Offset">
          <p>Most countries have time zones offset from Coordinated Universal Time (UTC) by whole hours (e.g., UTC+1, UTC-4). India is one of the rare countries (along with Sri Lanka, Afghanistan, Iran, and parts of Australia) that uses a 30-minute offset: <strong>UTC+5:30</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Geography of Time">
          <p>The Earth rotates 360 degrees in 24 hours. This means every 15 degrees of longitude equals exactly 1 hour of time difference (360 / 24 = 15).</p>
          <p className="mt-2">India is a massive country geographically. Its westernmost point (Gujarat) is at ~68°E longitude, and its easternmost point (Arunachal Pradesh) is at ~97°E.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>68°E mathematically aligns with <strong>UTC+4:30</strong>.</li>
            <li>97°E mathematically aligns with <strong>UTC+6:30</strong>.</li>
          </ul>
          <p className="mt-2">The difference in solar time between the east coast and west coast of India is almost exactly 2 hours!</p>
        </LearningSection>

        <LearningSection type="standards" title="The Historical Compromise">
          <p>Before Independence, India actually had two time zones: Bombay Time and Calcutta Time. In 1906, the British government decided to unify the country under a single time zone for railway and administrative efficiency.</p>
          <p className="mt-2">To make it as fair as possible, they picked the exact geographical center of the country: a longitude of <strong>82.5°E</strong>, which passes through Mirzapur in Uttar Pradesh.</p>
          <p className="mt-2">If you divide 82.5 by 15 degrees-per-hour, you get exactly <strong>5.5 hours</strong>. Thus, Indian Standard Time was born as UTC+5:30.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is Indian Standard Time offset by an unusual 5 hours and 30 minutes (UTC+5:30) instead of a round hour like UTC+5 or UTC+6?",
                options: [
                  "Because 5.5 hours is exactly halfway between the solar time of India's eastern and western borders (longitude 82.5°E).",
                  "Because it aligns perfectly with London time.",
                  "Because of a software bug in early computers.",
                  "Because India observes Daylight Saving Time permanently."
                ],
                correctIndex: 0,
                explanation: "UTC+5:30 is a deliberate geographical compromise to keep the entire massive country on a single, centralized time zone."
              },
              {
                question: "Does India observe Daylight Saving Time (DST) where clocks change twice a year?",
                options: [
                  "Yes, in the Summer.",
                  "Yes, in the Winter.",
                  "No, IST is permanently UTC+5:30 all year round.",
                  "Only in Northern states."
                ],
                correctIndex: 2,
                explanation: "Unlike the US or Europe, India does not observe DST. The time offset is completely static."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
