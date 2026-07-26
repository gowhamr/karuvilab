import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import ImageConverterClientWrapper from './ImageConverterClientWrapper';

const toolId = 'image-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Converter"
      description="Convert images between JPG, PNG, WebP, and BMP formats in your browser."
      category={cat}
      toolId={toolId}
    >
      <ImageConverterClientWrapper />

      <LearningHub title="Understanding Image Format Conversion">
        
        <LearningSection type="architecture" title="File Formats vs Pixel Data">
          <p>An image is fundamentally just a giant array of raw RGB pixel data. Formats like JPG, PNG, or WebP are simply different compression algorithms (languages) used to store that array efficiently on a hard drive.</p>
          <p className="mt-2">Converting a file is not as simple as changing the <code>.jpg</code> extension to <code>.png</code>. The computer has to completely translate the data from one mathematical language to another.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Decoding and Re-Encoding">
          <p>When you convert a JPG to a PNG, the engine performs two massive mathematical steps.</p>
          <p className="mt-2">First, it <strong>Decodes</strong> the JPG, running the inverse Discrete Cosine Transform to extract the compressed data back into a raw, uncompressed RGB pixel array in the computer's memory.</p>
          <p className="mt-2">Second, it <strong>Encodes</strong> that raw array using the PNG specification (which uses Deflate compression) to generate a brand new file structure.</p>
        </LearningSection>

        <LearningSection type="performance" title="Hardware Acceleration">
          <p>Because this tool runs in the browser via an <code>OffscreenCanvas</code>, the decoding and encoding algorithms are natively accelerated by the browser's core C++ rendering engine.</p>
          <p className="mt-2">This makes the translation process incredibly fast, completely avoiding the need to upload your heavy photos to a cloud server to run a command-line tool like ImageMagick.</p>
        </LearningSection>

        <LearningSection type="standards" title="Standards & References">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>ISO/IEC 10918:</strong> The official international standard defining the JPEG lossy compression algorithm.</li>
            <li><strong>ISO/IEC 15948:</strong> The standard defining Portable Network Graphics (PNG), ensuring lossless data compression.</li>
            <li><strong>References:</strong> <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob" target="_blank" rel="noreferrer" className="text-primary hover:underline">MDN: HTMLCanvasElement.toBlob()</a></li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Real-World Examples">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Web Optimization:</strong> Converting a 5MB PNG screenshot to a 200KB WebP image to radically improve website load times without losing noticeable quality.</li>
            <li><strong>Logo Transparency:</strong> A client sends a logo as a JPG with a white background. It must be processed and converted to a PNG to support the alpha transparency channel required for modern web design.</li>
            <li><strong>Legacy Support:</strong> Converting a modern HEIC photo from an iPhone into a standard JPG so it can be uploaded to an older government portal.</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you simply rename 'photo.jpg' to 'photo.png' in your file explorer, what happens?",
                options: [
                  "It becomes a true PNG file.",
                  "The file is corrupted permanently.",
                  "It remains a JPEG file inside, but the operating system might be confused by the incorrect label.",
                  "It gets larger in file size."
                ],
                correctIndex: 2,
                explanation: "File extensions are just labels. Changing the label does not execute the complex Decoding and Encoding math required to actually restructure the bytes inside the file."
              },
              {
                question: "Why does converting an image from JPEG (Lossy) to PNG (Lossless) usually result in a much larger file size?",
                options: [
                  "Because PNG adds extra pixels to the image.",
                  "Because the decoder extracts the raw, uncompressed RGB data from the JPEG, and the PNG encoder saves it using mathematical patterns without throwing any data away.",
                  "Because browsers are bad at encoding PNGs.",
                  "Because it forces a transparent background."
                ],
                correctIndex: 1,
                explanation: "PNG must perfectly preserve whatever pixel data it is handed. It cannot throw away data like JPEG does to save space."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
