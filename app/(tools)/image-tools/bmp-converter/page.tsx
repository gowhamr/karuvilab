import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import BmpConverterClientWrapper from './BmpConverterClientWrapper';

const toolId = 'bmp-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="BMP Converter" description="Convert images to the uncompressed BMP format" category={cat} toolId={toolId}>
      <BmpConverterClientWrapper />

      <LearningHub title="Understanding the Raw Bitmap Format">
        
        <LearningSection type="architecture" title="The Simplest Image Format">
          <p>The BMP (Windows Bitmap) format is one of the oldest and simplest image formats ever created. Unlike modern formats (JPEG, PNG, WebP) that use complex math and dictionaries to compress data, a BMP file is essentially just a giant, uncompressed array of raw pixels.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="File Structure">
          <p>A BMP file starts with a small 54-byte header. This header tells the computer the exact width, height, and color depth of the image.</p>
          <p className="mt-2">Immediately after the header, the file simply lists the exact Blue, Green, and Red byte values for every single pixel, usually scanning from the bottom-left of the image to the top-right.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Size Tradeoff">
          <p>Because there is absolutely no compression (like Deflate in PNG, or DCT in JPEG), a 1080p BMP image will always be exactly 6.2 Megabytes (1920 x 1080 x 3 bytes), even if the entire image is just a solid white square.</p>
          <p className="mt-2">While this makes BMP terrible for internet bandwidth, its raw simplicity makes it the perfect format for embedded microcontrollers and legacy industrial systems that lack the CPU power to decompress complex modern formats.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does a 1080p BMP image of a solid white square have the exact same file size as a 1080p BMP image of a complex photograph?",
                options: [
                  "Because BMP has a strict file size limit.",
                  "Because BMP uses no compression, meaning it writes a hardcoded RGB value to the disk for every single pixel regardless of patterns.",
                  "Because the computer forces a 6MB cache.",
                  "Because BMP compresses everything equally."
                ],
                correctIndex: 1,
                explanation: "Uncompressed bitmaps store the explicit color of every pixel in a grid, meaning file size is purely determined by Width × Height × Color Depth, ignoring visual complexity."
              },
              {
                question: "Why might an engineer still use the BMP format today?",
                options: [
                  "Because it is the best format for modern web design.",
                  "Because it allows for the highest quality compression.",
                  "Because simple embedded microchips (like Arduino displays) lack the CPU power to decode compressed files like JPEGs.",
                  "Because it is required by Apple devices."
                ],
                correctIndex: 2,
                explanation: "Decoding a JPEG requires complex mathematical transforms. Reading a BMP only requires copying raw bytes directly into the display's memory buffer."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
