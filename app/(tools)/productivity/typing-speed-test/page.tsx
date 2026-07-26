import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import TypingSpeedTestClientWrapper from "./TypingSpeedTestClientWrapper";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "typing-speed-test";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TypingSpeedTestPage() {
  return (
    <ToolShell
      title="Typing Speed Test"
      description="Measure your Words Per Minute (WPM) and accuracy with our precise, client-side typing test. Track your progress offline."
      category={category}
      toolId={toolId}
    >
      <TypingSpeedTestClientWrapper />

      <LearningHub title="Understanding Typing Metrics">
        
        <LearningSection type="architecture" title="How is WPM Calculated?">
          <p>If you type "a" 100 times in a minute, did you type 100 words? No. To ensure fairness across tests with long vs. short words, typing software uses a standardized mathematical formula rather than counting literal dictionary words.</p>
          <p className="mt-2">The global standard defines <strong>1 Word = 5 Keystrokes</strong> (including spaces and punctuation). Therefore, the formula for Gross WPM is: <code>(Total Keystrokes / 5) / Time in Minutes</code>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Handling Keyboard Input">
          <p>When building a web app that tracks typing, developers must choose which browser event to listen to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>keydown/keyup:</strong> These events fire when physical keys are pressed. They are terrible for typing tests because they don't handle software keyboards (mobile phones) or input method editors (IME) for languages like Chinese/Japanese correctly.</li>
            <li><strong>input:</strong> This event fires when the <em>value</em> of a text field actually changes, regardless of whether a physical keyboard, a mobile touch keyboard, or voice dictation was used. It is the gold standard for text tracking.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="Net WPM vs. Gross WPM">
          <p>Gross WPM only measures speed. Net WPM measures <em>useful</em> speed by penalizing you for uncorrected errors.</p>
          <p className="mt-2">The formula for Net WPM is: <code>Gross WPM - (Uncorrected Errors / Time in Minutes)</code>. If your Net WPM is significantly lower than your Gross WPM, you are sacrificing accuracy for raw speed, which ultimately slows you down in real-world work because you have to backspace frequently.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In standardized typing tests, how many keystrokes (including spaces) are considered 'one word'?",
                options: [
                  "1 keystroke",
                  "3 keystrokes",
                  "5 keystrokes",
                  "It depends on the dictionary length of the word."
                ],
                correctIndex: 2,
                explanation: "The industry standard normalizes one word as exactly 5 keystrokes to ensure fairness regardless of the text's difficulty."
              },
              {
                question: "Why should web developers use the 'input' event instead of the 'keydown' event to track typing?",
                options: [
                  "Because 'keydown' is slower.",
                  "Because 'keydown' fails to accurately track input from mobile virtual keyboards, voice dictation, or IME tools.",
                  "Because 'input' fires before the key is pressed.",
                  "Because 'input' automatically calculates WPM."
                ],
                correctIndex: 1,
                explanation: "Physical key events don't translate 1:1 to text input on modern devices. The 'input' event reliably tells you when the actual text value changes."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
