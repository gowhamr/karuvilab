import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import BulkImageResizerClientWrapper from './BulkImageResizerClientWrapper';

const toolId = 'bulk-resizer';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Bulk Image Resizer"
      description="Resize multiple images at once with shared dimension settings."
      category={cat}
      toolId={toolId}
    >
      <BulkImageResizerClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-memory"
          title="Performance: Managing Browser Memory"
          preview="Learn why resizing 100 images at once can crash your browser."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              An image that takes up 2MB of disk space as a compressed JPG might take up 50MB of raw RAM when decoded into the browser's memory for resizing. If you try to resize 100 images at the same time, the browser will try to allocate 5 Gigabytes of RAM and likely crash with an OOM (Out of Memory) error.
            </p>
            <h3>Job Queueing and Garbage Collection</h3>
            <p>
              To safely resize images in bulk, this tool uses a <strong>Task Scheduler</strong>. Instead of processing everything at once, it puts all the files into a queue. It decodes one image, resizes it on an OffscreenCanvas, encodes it, saves the blob, and then explicitly nullifies the heavy canvas data. 
            </p>
            <p>
              By carefully throttling the concurrency, we give the browser's <em>Garbage Collector</em> enough time to sweep up the discarded memory from Image 1 before it starts working on Image 2, ensuring stable performance even on mobile devices.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
