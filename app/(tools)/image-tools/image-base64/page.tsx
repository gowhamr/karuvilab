import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ImageBase64ClientWrapper from './ImageBase64ClientWrapper';

const toolId = 'image-base64';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image to Base64"
      description="Encode images as Base64 data URIs or decode data URIs back to images."
      category={cat}
      toolId={toolId}
    >
      <ImageBase64ClientWrapper />

      <LearningHub title="Understanding Base64 Encoding">
        
        <LearningSection type="architecture" title="Binary to ASCII Translation">
          <p>Base64 is a way to take raw binary data (like an image file) and convert it into a safe, ASCII string that can be pasted directly into an HTML or CSS file.</p>
          <p className="mt-2">This is useful when you want to embed tiny icons directly into your stylesheet to avoid triggering an extra HTTP network request to download a separate image file.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The 33% Size Penalty">
          <p>Computers store data in bytes (8 bits). However, the standard Base64 text characters (A-Z, a-z, 0-9, +, /) only provide 64 distinct values, which can only represent 6 bits of data per character.</p>
          <p className="mt-2">To encode 8-bit binary data into 6-bit text characters, the algorithm has to take every 3 bytes of the original image (24 bits total) and split them into 4 Base64 characters (6 bits each).</p>
        </LearningSection>

        <LearningSection type="performance" title="When Not to Use It">
          <p>Because 3 bytes of binary data become 4 bytes of text data, <strong>Base64 encoding mathematically increases the file size of your image by exactly 33%.</strong></p>
          <p className="mt-2">This is why you should only use Base64 for very small images (like logos or tiny placeholders). Using it for a 5MB photograph will bloat your HTML file to over 6.6MB, severely slowing down the initial page load time.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you have a 300KB JPEG image and encode it to Base64, approximately how large will the resulting text string be?",
                options: [
                  "100KB",
                  "300KB",
                  "400KB",
                  "600KB"
                ],
                correctIndex: 2,
                explanation: "Base64 encoding always adds a 33% overhead. 300KB + 33% (100KB) = 400KB."
              },
              {
                question: "Why do developers use Base64 encoding in CSS if it increases file size?",
                options: [
                  "Because it improves image quality.",
                  "Because it bypasses ad blockers.",
                  "To reduce the number of HTTP requests made by the browser for tiny icons.",
                  "Because browsers cannot read binary files."
                ],
                correctIndex: 2,
                explanation: "For tiny icons, the time it takes the browser to establish a new HTTP connection is longer than the time it takes to download a slightly larger CSS file with the image embedded inside it."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
