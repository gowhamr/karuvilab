import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-formats"
          title="How it Works: Image Encoders"
          preview="Learn the difference between pixel data and file formats."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              An image is fundamentally just a giant array of raw RGB pixel data. Formats like JPG, PNG, or WebP are simply different languages used to compress and store that array.
            </p>
            <h3>Decoding and Re-Encoding</h3>
            <p>
              When you convert a JPG to a PNG, the engine performs two massive mathematical steps. First, it <strong>Decodes</strong> the JPG, running the inverse Discrete Cosine Transform to extract the raw pixel array into the computer's memory. Then, it <strong>Encodes</strong> that raw array using the PNG specification (using Deflate compression). 
            </p>
            <p>
              Because this tool runs in the browser via an <code>OffscreenCanvas</code>, the decoding and encoding algorithms are natively accelerated by the browser's C++ rendering engine, making it incredibly fast without needing to upload the file to a server.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
