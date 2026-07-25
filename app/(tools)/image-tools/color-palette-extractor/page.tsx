import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";
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
      
      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-algorithm"
          title="How it Works: The Algorithm"
          preview="Learn about K-Means++ Clustering and dominant color extraction."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Extracting a color palette isn't as simple as picking the most frequent pixels. 
              Images can have millions of unique colors. To find the "dominant" colors, this tool uses 
              a machine learning algorithm called <strong>K-Means Clustering</strong>.
            </p>
            <h3>1. Downsampling</h3>
            <p>
              Processing millions of pixels on the main thread would freeze the browser. 
              First, the image is downscaled to a maximum width of 200px using an <code>OffscreenCanvas</code>. 
              This reduces the dataset from millions of pixels to a maximum of 40,000, which can be processed in milliseconds, 
              without significantly altering the dominant colors.
            </p>
            <h3>2. K-Means++ Initialization</h3>
            <p>
              The algorithm needs starting points (centroids). Instead of picking them randomly, we use <strong>K-Means++</strong>. 
              This picks the first centroid randomly, and then selects subsequent centroids that are as far away as possible 
              from the existing ones. This prevents the algorithm from getting "stuck" returning five shades of the background color.
            </p>
            <h3>3. Clustering & Optimization</h3>
            <p>
              Every pixel is assigned to its nearest centroid in 3D space (RGB). Then, the centroid is moved to the exact center 
              of all the pixels assigned to it. This process repeats up to 20 times until the colors stabilize.
            </p>
            <h3>4. Deduplication</h3>
            <p>
              Finally, we sort the centroids by how many pixels they "own" (most dominant first). We filter out 
              colors that are visually indistinguishable (distance &lt; 15 in RGB space) to ensure a diverse palette.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Architecture & Performance"
          preview="How we keep the UI responsive while doing heavy math."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              K-Means involves calculating the Euclidean distance between every pixel and every centroid, multiple times.
            </p>
            <ul>
              <li><strong>Web Workers:</strong> The clustering math is entirely offloaded to a background thread (<code>image.worker.ts</code>). This guarantees your UI never freezes while the algorithm is running.</li>
              <li><strong>OffscreenCanvas:</strong> Used inside the worker to decode and scale the image before extracting pixel data.</li>
              <li><strong>Zero Uploads:</strong> Everything runs locally in your browser. The image never leaves your device.</li>
            </ul>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-failures"
          title="Edge Cases & Limitations"
          preview="When might this algorithm fail?"
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>No algorithm is perfect. Here is where K-Means might struggle:</p>
            <ul>
              <li><strong>Gradients:</strong> K-Means groups colors into hard boundaries. A smooth gradient might result in arbitrary bands of color being selected as "dominant."</li>
              <li><strong>Small Details:</strong> Because we downsample the image to 200px to maintain performance, colors that only appear in tiny details (like a 1px border) will be averaged out and ignored.</li>
              <li><strong>Transparent Images:</strong> Transparent pixels (alpha &lt; 128) are explicitly ignored during extraction so they don't drag the centroids toward black/white.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
