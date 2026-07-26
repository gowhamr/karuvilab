import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ColorPaletteExtractorClientWrapper from "./ColorPaletteExtractorClientWrapper";

const toolId = "color-palette-extractor";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ColorPaletteExtractorPage() {
  const cat = CATEGORIES.find(c => c.id === "image")!;

  return (
    <ToolShell
      toolId={toolId}
      title="Color Palette Extractor"
      description="Extract dominant colors from any image."
      category={cat}
    >
      <ColorPaletteExtractorClientWrapper />
      
      <LearningHub title="Understanding Color Clustering and Machine Learning">
        
        <LearningSection type="algorithm" title="K-Means Clustering">
          <p>Extracting a color palette isn't as simple as picking the most frequent pixels. A high-resolution image can have millions of unique colors.</p>
          <p className="mt-2">To find the true "dominant" thematic colors, this tool uses a classic machine learning algorithm called <strong>K-Means Clustering</strong>.</p>
        </LearningSection>
        
        <LearningSection type="architecture" title="The Four Step Pipeline">
          <ul className="list-decimal pl-5 space-y-2">
            <li><strong>Downsampling:</strong> Processing millions of pixels on the main thread would freeze the browser. First, the image is downscaled to a maximum width of 200px using an <code>OffscreenCanvas</code>. This reduces the dataset from millions of pixels to a maximum of 40,000 without significantly altering the dominant visual colors.</li>
            <li><strong>K-Means++ Initialization:</strong> The algorithm needs starting points (centroids). Instead of picking them randomly, we use <em>K-Means++</em>, which picks the first centroid randomly, and then selects subsequent centroids that are as far away as possible from the existing ones to ensure a diverse palette.</li>
            <li><strong>Optimization Loop:</strong> Every pixel is assigned to its nearest centroid in 3D RGB space. Then, the centroid is mathematically moved to the exact center of all the pixels assigned to it. This loop repeats up to 20 times until the colors stabilize.</li>
            <li><strong>Deduplication:</strong> Finally, we sort the centroids by how many pixels they "own" (most dominant first) and filter out colors that are visually indistinguishable (distance &lt; 15 in RGB space).</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Web Workers & Multithreading">
          <p>K-Means involves calculating the Euclidean distance between every single pixel and every centroid, multiple times per second.</p>
          <p className="mt-2">To prevent this heavy math from causing the UI to stutter, the clustering loop is entirely offloaded to a background thread (<code>image.worker.ts</code>). This guarantees your browser remains perfectly responsive while the algorithm crunches the numbers locally.</p>
        </LearningSection>

        <LearningSection type="security" title="Edge Cases and Failures">
          <p>No algorithm is perfect. K-Means groups colors into hard boundaries. If an image is mostly a smooth sunset gradient, the algorithm might result in arbitrary, harsh bands of color being selected as "dominant."</p>
          <p className="mt-2">Additionally, because we downsample the image to 200px to maintain performance, colors that only appear in tiny details (like a 1px thin border) will be averaged out by the canvas scaling and completely ignored by the algorithm.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does the tool downsample the image to 200px before running the color extraction?",
                options: [
                  "Because K-Means only works on small images.",
                  "To reduce the mathematical dataset from millions of pixels to ~40,000, preventing the algorithm from taking minutes to execute.",
                  "To increase the color accuracy.",
                  "To remove the background automatically."
                ],
                correctIndex: 1,
                explanation: "Processing a 4K image pixel-by-pixel would require billions of distance calculations. Downsampling retains the macro-color theme while making the math instantaneous."
              },
              {
                question: "What is the purpose of the K-Means++ initialization step?",
                options: [
                  "To make the algorithm run faster on mobile devices.",
                  "To ensure the starting centroids are spread far apart, preventing the algorithm from returning 5 nearly-identical shades of the same color.",
                  "To convert RGB colors to HEX codes.",
                  "To remove transparent pixels."
                ],
                correctIndex: 1,
                explanation: "Standard K-Means picks random starting points, which can result in poor, clumped color palettes. K-Means++ forces the starting points to be diverse."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
