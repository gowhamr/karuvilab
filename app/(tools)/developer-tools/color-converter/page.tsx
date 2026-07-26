import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ColorConverterClientWrapper from "./ColorConverterClientWrapper";

const toolId = "color-converter";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ColorConverterPage() {
  const cat = CATEGORIES.find(c => c.id === 'developer')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Color Converter & Picker"
      description="Convert colors between HEX, RGB, HSL, HSV, and CMYK formats. Includes a color picker and live preview."
      category={cat}
    >
      <ColorConverterClientWrapper />

      <LearningHub title="Understanding Color Theory and Spaces">
        
        <LearningSection type="architecture" title="Additive Colors (RGB, HEX, HSL)">
          <p>Monitors and screens emit light. They start pitch black when turned off. To create colors, they <strong>add</strong> light (Red, Green, and Blue). If you add 100% of all three, you get pure White light.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>RGB:</strong> Represents the intensity of Red, Green, and Blue from 0 to 255.</li>
            <li><strong>HEX:</strong> Simply RGB translated into Base-16 hexadecimal math. <code>#FF0000</code> means maximum Red (FF = 255), zero Green, zero Blue.</li>
            <li><strong>HSL (Hue, Saturation, Lightness):</strong> Uses the exact same RGB color space, but wraps it around a 360-degree cylinder to make it easier for human brains to pick matching colors and create color palettes.</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="api" title="Subtractive Colors (CMYK)">
          <p>Printers don't emit light; they deposit ink onto paper that reflects light. To create colors, the ink <strong>subtracts</strong> light bouncing off the page.</p>
          <p className="mt-2">CMYK uses Cyan, Magenta, Yellow, and Key (Black). If you mix 100% of Cyan, Magenta, and Yellow, you theoretically get Black (though in reality, it's a muddy brown, which is why printers have a dedicated Black ink cartridge, the 'Key').</p>
        </LearningSection>

        <LearningSection type="failures" title="Color Gamut Problems">
          <p>A common mistake in graphic design is designing a vibrant UI in RGB on a screen, and expecting it to look exactly the same when printed.</p>
          <p className="mt-2">Converting RGB to CMYK is complex and lossy because the printable color <strong>gamut</strong> (the range of possible colors) is physically smaller than what a glowing monitor can display. Extremely bright, neon colors in RGB simply cannot be reproduced using standard CMYK ink.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which color model is used by computer monitors, and is it Additive or Subtractive?",
                options: [
                  "CMYK, Subtractive",
                  "RGB, Additive",
                  "HSL, Subtractive",
                  "RGB, Subtractive"
                ],
                correctIndex: 1,
                explanation: "Monitors emit light using Red, Green, and Blue (RGB). Because mixing them creates White light, it is an Additive color model."
              },
              {
                question: "Why do printers use a dedicated Black (Key) ink cartridge in the CMYK model?",
                options: [
                  "Because mixing 100% Cyan, Magenta, and Yellow produces a muddy brown rather than a true deep black.",
                  "Because black ink is the only way to print text.",
                  "Because RGB monitors cannot display black.",
                  "To save on Cyan ink."
                ],
                correctIndex: 0,
                explanation: "While CMY theoretically mixes to black in a perfect subtractive model, real-world inks are imperfect and mix to a muddy dark brown. The Key (Black) cartridge is required for true blacks and sharp text."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
