import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import NumeralConverterClientWrapper from './NumeralConverterClientWrapper';

const toolId = 'numeral-converter';
const cat = CATEGORIES.find(c => c.id === 'calculators');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Numeral & Encoding Converter"
      description="Universal encoding converter. Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text. Auto-detect format and convert to all others instantly."
      category={cat}
      toolId={toolId}
    >
      <NumeralConverterClientWrapper />

      <LearningHub title="Understanding Data Encodings">
        
        <LearningSection type="architecture" title="The Transport Problem">
          <p>Underneath everything, computers only understand binary (0s and 1s). However, humans and many internet protocols (like HTTP and JSON) are specifically designed to handle standard text characters (A-Z, 0-9).</p>
          <p className="mt-2">When a developer needs to send a binary file (like an Image or a compiled PDF) inside a JSON text payload, they must encode the binary data into safe text characters so the transport layer doesn't break.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Hexadecimal (Base-16)">
          <p>Hexadecimal uses 16 characters (0-9 and A-F) to represent binary data. Every byte (8 bits) can be perfectly represented by exactly 2 Hex characters (e.g., <code>11111111</code> becomes <code>FF</code>).</p>
          <p className="mt-2">Hex is incredibly easy for programmers to read and debug, but it is highly inefficient for data transfer over a network because it doubles the size of the payload (1 raw byte requires 2 text bytes to represent it).</p>
        </LearningSection>

        <LearningSection type="performance" title="Base64 Efficiency">
          <p>Base64 was invented to fix the size problem of Hex. Instead of 16 characters, it uses 64 characters (A-Z, a-z, 0-9, +, /). Because it has a much larger dictionary, it can pack more binary data into fewer text characters.</p>
          <p className="mt-2">Base64 groups 24 bits (3 bytes) and translates them into just 4 text characters. This means Base64 only increases the payload size by about 33% (compared to Hex's 100%), making it the industry standard for embedding images directly into HTML/CSS files or sending files through text-based APIs.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do developers use Base64 to encode images in JSON payloads instead of Hexadecimal?",
                options: [
                  "Because Base64 provides military-grade encryption.",
                  "Because Base64 only increases the payload size by 33%, while Hexadecimal doubles it (100% increase).",
                  "Because JSON parsers cannot read Hexadecimal characters like 'F'.",
                  "Because Base64 makes the image higher resolution."
                ],
                correctIndex: 1,
                explanation: "Base64 uses a larger character set (64 vs 16), allowing it to pack the same binary data into a shorter string of text, saving bandwidth."
              },
              {
                question: "Is Base64 a form of encryption?",
                options: [
                  "Yes, it requires a secret key to decode.",
                  "Yes, it hashes the data securely.",
                  "No, it is merely an encoding. Anyone with a Base64 decoder can immediately read the original data.",
                  "No, but it is mathematically impossible to reverse."
                ],
                correctIndex: 2,
                explanation: "Encoding is for transport, encryption is for security. Base64 is perfectly reversible by anyone and provides zero security."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
