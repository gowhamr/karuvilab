import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Managing Browser Memory During Bulk Operations">
        
        <LearningSection type="performance" title="The Memory Explosion Problem">
          <p>An image that takes up just 2MB of disk space as a compressed JPG might take up 50MB of raw RAM when decoded into the browser's memory for resizing.</p>
          <p className="mt-2">If you try to resize 100 images at the exact same time, the browser will attempt to allocate 5 Gigabytes of RAM instantly. On most consumer devices, this will crash the browser tab with an OOM (Out of Memory) error.</p>
        </LearningSection>
        
        <LearningSection type="architecture" title="Job Queueing Architecture">
          <p>To safely resize images in bulk, this tool implements a strict <strong>Task Scheduler</strong>.</p>
          <p className="mt-2">Instead of processing everything at once, it puts all files into a queue. It decodes one image, resizes it using an <code>OffscreenCanvas</code>, encodes the final output, and then explicitly nullifies and destroys the heavy canvas data before moving to the next item in the queue.</p>
        </LearningSection>

        <LearningSection type="api" title="Garbage Collection Pacing">
          <p>By carefully throttling the concurrency of the queue, the system gives the browser's <em>Garbage Collector</em> enough time to sweep up and free the discarded memory from Image 1 before it starts allocating heavy memory for Image 2.</p>
          <p className="mt-2">This asynchronous pacing ensures that memory usage stays flat throughout the entire batch process, allowing a mobile phone to resize 500 images without crashing.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why might a 2MB JPEG image use 50MB of RAM when loaded into a Canvas for resizing?",
                options: [
                  "Because Canvas has a bug that duplicates data.",
                  "Because the browser decompresses the JPEG into raw RGB data for every single pixel to manipulate it.",
                  "Because it scales the image up automatically.",
                  "Because JavaScript objects are extremely large."
                ],
                correctIndex: 1,
                explanation: "Compressed files (like JPG/PNG) are heavily compressed on disk. To manipulate them, they must be fully decoded into uncompressed pixel arrays in RAM."
              },
              {
                question: "What is the purpose of the Task Scheduler queue in a bulk processing tool?",
                options: [
                  "To increase the total CPU usage to maximum.",
                  "To prevent the browser from running out of RAM by processing files sequentially or in limited batches, allowing Garbage Collection.",
                  "To compress the files more efficiently.",
                  "To upload the files in a specific order."
                ],
                correctIndex: 1,
                explanation: "Queuing ensures memory is allocated, used, and freed in a controlled cycle, preventing out-of-memory crashes."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
