import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import BatchImageConverterClientWrapper from './BatchImageConverterClientWrapper';

const toolId = 'batch-image-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Batch Image Converter"
      description="Convert multiple images between formats in one batch operation"
      category={cat}
      toolId={toolId}
    >
      <BatchImageConverterClientWrapper />

      <LearningHub title="Understanding Multi-threaded Processing">
        
        <LearningSection type="architecture" title="The Single-Thread Problem">
          <p>By default, JavaScript running in a web browser is <strong>single-threaded</strong>. It can only do one thing at a time.</p>
          <p className="mt-2">If an application tries to decode, resize, and re-encode 100 images on that single main thread, the entire browser tab will freeze. You wouldn't be able to click a button, scroll the page, or even see a progress bar update until all 100 images finished processing.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Concurrency via Web Workers">
          <p>To solve this, this tool utilizes the browser's <code>Web Worker</code> API. Think of Workers as invisible background tabs.</p>
          <p className="mt-2">Our internal <code>WorkerOrchestrator</code> queries your device to see how many CPU cores it has (using <code>navigator.hardwareConcurrency</code>). If your machine has 8 cores, the orchestrator spawns 8 separate Web Workers.</p>
        </LearningSection>

        <LearningSection type="performance" title="Parallel Orchestration">
          <p>When you drop 100 images into the batch, the orchestrator distributes them across your available CPU cores. It processes 8 images simultaneously in the background.</p>
          <p className="mt-2">Because the heavy computational math is happening on background threads, the main UI thread is left completely free. This guarantees that your browser remains perfectly responsive, and the progress bar animates at a smooth 60 frames per second, even under heavy load.</p>
        </LearningSection>

        <LearningSection type="security" title="Zero Upload Infrastructure">
          <p>Traditional batch converters require you to upload hundreds of megabytes of photos to a cloud server, wait in a queue, and download a ZIP file. By using Web Workers, we bring the server infrastructure directly to your CPU. Processing is faster, bandwidth usage is zero, and your private files never leave your machine.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What happens if you try to process 100 heavy images on JavaScript's main thread?",
                options: [
                  "The browser optimizes them automatically.",
                  "The UI completely freezes until the job is done because the single thread is blocked.",
                  "The images are sent to a cloud server.",
                  "The browser throws an Out of Memory error immediately."
                ],
                correctIndex: 1,
                explanation: "JavaScript's main thread handles both UI updates and script execution. If heavy math blocks the thread, the UI cannot update."
              },
              {
                question: "How does the WorkerOrchestrator know how many background threads to spawn?",
                options: [
                  "It always spawns exactly 4 threads.",
                  "It uses the navigator.hardwareConcurrency API to match your device's physical CPU cores.",
                  "It asks the user via a popup.",
                  "It counts the number of images and spawns a thread for each one."
                ],
                correctIndex: 1,
                explanation: "By matching the thread count to the hardware's core count, the app maximizes throughput without causing thread-switching overhead."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
