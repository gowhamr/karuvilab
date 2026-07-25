import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import BmpConverterClientWrapper from './BmpConverterClientWrapper';

const toolId = 'bmp-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="BMP Converter" description="Convert images to the uncompressed BMP format" category={cat} toolId={toolId}

      content={{
        detailedDescription: "Convert legacy BMP (Bitmap) images to modern formats, or generate strict BMP files for specialized applications. Perform lossless conversions entirely offline with total data privacy.",
        useCases: ["Converting old Windows bitmaps for the web","Generating BMPs for embedded systems","Reducing file sizes of uncompressed BMPs","Standardizing legacy assets","Offline secure format conversion"],
        howTo: ["Upload your image.","Select BMP as the output format if generating one, or select PNG/JPEG if converting from BMP.","Preview the image.","Download the converted file securely.","No server upload required."],
        faq: [{"question":"Why use BMP today?","answer":"BMP is largely obsolete for the web, but it is still required by certain legacy desktop software, industrial systems, and embedded microcontrollers."},{"question":"Is BMP lossless?","answer":"Yes, standard BMP files are uncompressed and lossless, which is why they have very large file sizes."},{"question":"Can I add transparency to BMP?","answer":"Standard 24-bit BMP does not support transparency. Alpha channels require 32-bit BMP, which isn't universally supported."},{"question":"Are my files uploaded?","answer":"Never. All parsing and encoding happens locally in your browser."},{"question":"Can I convert BMP to WebP?","answer":"Yes, simply select WebP as the output format to vastly reduce the file size."}],
        relatedTools: ["tiff-converter","ico-generator","webp-converter"]
      }}
>
      <BmpConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-bmp"
          title="How it Works: The Raw Bitmap"
          preview="Learn why BMP files are so incredibly massive compared to JPGs."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The BMP (Windows Bitmap) format is one of the oldest and simplest image formats ever created. Unlike modern formats that use complex math to compress data, a BMP file is essentially just a giant, uncompressed array of raw pixels.
            </p>
            <h3>File Structure</h3>
            <p>
              A BMP file starts with a small 54-byte header (which tells the computer the width, height, and color depth). Immediately after the header, it simply lists the exact Blue, Green, and Red byte values for every single pixel, usually scanning from the bottom-left of the image to the top-right.
            </p>
            <p>
              Because there is absolutely no compression (like Deflate in PNG, or DCT in JPEG), a 1080p BMP image will always be exactly 6.2 Megabytes (1920 * 1080 * 3 bytes), even if the entire image is just a solid white square. While terrible for the internet, this raw simplicity makes it the perfect format for embedded microcontrollers that don't have the CPU power to decompress complex files.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
