import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ISO8583BitmapClientWrapper from './ISO8583BitmapClientWrapper';

const toolId = 'iso8583-bitmap-decoder';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="ISO 8583 Bitmap Decoder & Builder"
      description="Decode ISO 8583 primary and secondary hex bitmaps into field presence indicators, or build hex bitmaps visually."
      category={cat}
      toolId={toolId}
    >
      <ISO8583BitmapClientWrapper />

      <LearningHub title="Understanding ISO 8583 Bitmaps">
        
        <LearningSection type="architecture" title="The Global Payments Standard">
          <p>When you swipe or tap a credit card at a terminal, the terminal doesn't send JSON to the bank. It sends a highly compressed binary message using the <strong>ISO 8583</strong> standard.</p>
          <p className="mt-2">ISO 8583 defines exactly how financial transaction messages (like authorizations, reversals, and settlements) are structured. Because this standard was created in the 1980s when bandwidth was extremely expensive, it is designed for maximum efficiency.</p>
        </LearningSection>
        
        <LearningSection type="api" title="How the Bitmap Works">
          <p>An ISO 8583 message can contain up to 128 different fields (e.g., Field 2 is the PAN, Field 4 is the Amount). But most transactions only use 10-15 of these fields.</p>
          <p className="mt-2">Instead of sending empty fields, the message starts with a <strong>Bitmap</strong>. The bitmap is a sequence of 64 bits (8 bytes, usually represented as 16 hexadecimal characters). Each bit corresponds directly to a field. If the 4th bit is a <code>1</code>, it means Field 4 is present in the message. If it's a <code>0</code>, Field 4 is completely omitted.</p>
        </LearningSection>

        <LearningSection type="standards" title="Primary vs Secondary Bitmaps">
          <p>The Primary Bitmap (always present) covers fields 1 through 64. What if the transaction needs to send Field 70?</p>
          <p className="mt-2">If Field 1 (the very first bit of the Primary Bitmap) is set to <code>1</code>, it acts as a flag indicating that a <strong>Secondary Bitmap</strong> immediately follows. This secondary bitmap is another 64 bits, allowing the message to indicate the presence of fields 65 through 128.</p>
        </LearningSection>

        <LearningSection type="failures" title="Parsing Catastrophes">
          <p>Unlike JSON, ISO 8583 is entirely strictly-ordered and length-prefixed. The parser uses the bitmap to know <em>what</em> to expect, and then parses the raw data stream byte-by-byte.</p>
          <p className="mt-2">If the bitmap is corrupted, or if the parser calculates a bit incorrectly, it will misread the length of a field. This causes a cascading failure where every subsequent field in the entire message is read from the wrong byte offset, completely destroying the transaction data.</p>
        </LearningSection>

        <LearningSection type="standards" title="Standards & References">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>ISO 8583-1:2003:</strong> Defines the exact 128-bit structure of the primary and secondary bitmaps.</li>
            <li><strong>Hexadecimal Conversion:</strong> The standard mandates that the 64-bit binary array is transmitted over the wire as a 16-character hexadecimal string to save bandwidth.</li>
            <li><strong>References:</strong> <a href="https://en.wikipedia.org/wiki/ISO_8583#Bitmaps" target="_blank" rel="noreferrer" className="text-primary hover:underline">Wikipedia: ISO 8583 Bitmaps</a></li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Real-World Examples">
          <p>A typical 0200 Purchase message might have the bitmap <code>7224648108808000</code>. Converted to binary, this shows that bits 2, 3, 4, 7, 11, etc. are active. This tells the Switch to expect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Field 2:</strong> Primary Account Number</li>
            <li><strong>Field 3:</strong> Processing Code</li>
            <li><strong>Field 4:</strong> Amount</li>
            <li><strong>Field 7:</strong> Transmission Date & Time</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In an ISO 8583 message, what is the purpose of the Bitmap?",
                options: [
                  "To encrypt the credit card number.",
                  "To indicate exactly which of the 128 possible data fields are present in the message.",
                  "To store a small image of the user's signature.",
                  "To calculate the total amount of the transaction."
                ],
                correctIndex: 1,
                explanation: "The bitmap acts as a strict index. Each bit (1 or 0) maps to a field number, telling the parser whether to expect data for that field in the byte stream."
              },
              {
                question: "What does it mean if the very first bit (Bit 1) of the Primary Bitmap is set to 1?",
                options: [
                  "The transaction is approved.",
                  "The Primary Account Number (PAN) is encrypted.",
                  "A Secondary Bitmap (covering fields 65-128) is present and immediately follows.",
                  "The message is a reversal request."
                ],
                correctIndex: 2,
                explanation: "Bit 1 is reserved exclusively to indicate the presence of a Secondary Bitmap. If it is 0, the message only uses fields 2-64."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
