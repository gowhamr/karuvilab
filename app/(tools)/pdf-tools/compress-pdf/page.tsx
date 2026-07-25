import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import CompressPdfClientWrapper from './CompressPdfClientWrapper';

const toolId = 'compress-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Compress PDF"
      description="Reduce PDF file size by re-encoding with pdf-lib's object stream compression."
      category={cat}
      toolId={toolId}
    >
      <CompressPdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-compression"
          title="How it Works: PDF Compression"
          preview="Learn about Object Streams, FlateDecode, and why some PDFs don't compress well."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike images (JPEG/PNG) which are grids of pixels, a PDF is a complex database of objects (fonts, vectors, text, images, and metadata). Compressing a PDF requires parsing this database and rewriting it more efficiently.
            </p>
            <h3>1. Object Streams (PDF 1.5+)</h3>
            <p>
              Older PDFs store every object individually, which creates a lot of overhead. This tool upgrades the PDF structure to use <strong>Object Streams</strong>. This groups multiple objects together and compresses the entire group using the <code>FlateDecode</code> (zlib) algorithm.
            </p>
            <h3>2. Metadata & Orphan Removal</h3>
            <p>
              PDFs often contain invisible "orphan" objects—fonts that were embedded but are no longer used, or massive XML metadata payloads from tools like Adobe Illustrator. The "High" compression setting aggressively strips out Document Information dictionaries and unused objects.
            </p>
            <h3>Why didn't my PDF get smaller? (The "Image" Trap)</h3>
            <p>
              This tool performs <strong>structural compression</strong>, not image degradation. If your PDF is just a scanned document (a giant JPEG wrapped in a PDF), the structure is already minimal. To compress a scanned PDF further, you would need to lower the resolution or quality of the embedded image, which requires heavy image-processing algorithms not used here.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Architecture & Security"
          preview="How we compress massive PDFs entirely in your browser."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Parsing and re-encoding a 100MB PDF is extremely CPU-intensive. If we ran this on the main browser thread, the entire webpage would freeze.
            </p>
            <ul>
              <li><strong>Web Workers (karuvi.worker.ts):</strong> We offload the PDF parsing to a background thread. Your UI stays silky smooth at 60fps, even while crunching gigabytes of data.</li>
              <li><strong>Zero-Upload Privacy:</strong> Because everything happens in a Web Worker via WebAssembly and JavaScript, the PDF never leaves your device. It is mathematically impossible for us to see your data.</li>
              <li><strong>Memory Management:</strong> We use <code>ArrayBuffer</code> transfers (zero-copy operations) to move the PDF between the main thread and the worker, preventing Out-Of-Memory (OOM) crashes on mobile devices.</li>
            </ul>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="standards"
          title="Standards & References"
          preview="The official specifications powering this tool."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <ul>
              <li><strong>ISO 32000-1 (PDF 1.7):</strong> The core standard governing how PDF objects, cross-reference tables (XRef), and dictionaries are structured.</li>
              <li><strong>RFC 1951:</strong> DEFLATE Compressed Data Format Specification. This is the underlying algorithm used by PDF's <code>FlateDecode</code> filter.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
