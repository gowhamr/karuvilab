import { ToolContent } from '../../registry/types';

export const colorPaletteExtractor: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Color Extraction & Clustering

Welcome to the engineering guide to Color Extraction. This handbook explains the algorithms required to programmatically look at a photograph and determine its core thematic colors, a technique used heavily by Spotify, Apple Music, and Netflix.

---

## 1. Prerequisites: The "Average Color" Fallacy

If you want to dynamically color the background of a music player based on the album art, the naive approach is to calculate the **Average Color**. 

**The Bug:** Imagine a photo of a bright red apple sitting on a vibrant green lawn. 
If you iterate through all the pixels and calculate the mathematical average of Red (255,0,0) and Green (0,255,0), the resulting average color is **Muddy Brown** (127,127,0). Muddy brown does not actually exist in the photograph!

To build beautiful UIs, we don't want the *average* color. We want the **Dominant Colors** (the colors that appear most frequently and vibrantly).

---

## 2. Mathematical Foundations: K-Means Clustering

To extract dominant colors, engineers use a Machine Learning algorithm called **K-Means Clustering**.

1. **Mapping:** Every pixel in the image is plotted as a 3D point in a 3D space, where the axes are Red, Green, and Blue (from 0 to 255).
2. **Initialization:** The algorithm drops $K$ random "centroids" (anchors) into this 3D space. (If you want a 5-color palette, $K = 5$).
3. **Clustering:** Every pixel assigns itself to the centroid it is closest to mathematically (Euclidean distance).
4. **Recalculation:** The centroid moves to the exact center of its new cluster of pixels.
5. **Iteration:** Steps 3 and 4 repeat until the centroids stop moving. 

The final locations of the 5 centroids represent the 5 most dominant, mathematically distinct colors in the image. The muddy brown problem is completely bypassed!

---

## 3. Engineering Challenge: Performance via Quantization

**The Bottleneck:** Running the K-Means algorithm on a 12-Megapixel (4000x3000) smartphone photo requires processing 12,000,000 pixels. Performing millions of Euclidean distance calculations in JavaScript will instantly freeze the browser tab.

**The Optimization: Median Cut Quantization.**
Before running the clustering algorithm, the engine dramatically downsamples the image. 
1. It scales the image down to a tiny 200x200 pixel canvas. (This reduces the dataset from 12 million pixels to just 40,000 pixels).
2. It groups similar colors into "buckets" to reduce the total color palette (Quantization).
3. It runs K-Means on this tiny, optimized dataset.

Because color dominance is a macro-level visual property, scaling the image down mathematically produces the exact same color palette in 50 milliseconds instead of 5 seconds.

---

## 4. Color Spaces: RGB vs HSL

Once the dominant colors are extracted, they are usually in RGB format (Red, Green, Blue). However, for UI design, RGB is notoriously difficult to manipulate programmatically. 

Modern extraction engines instantly convert the palette into **HSL (Hue, Saturation, Lightness)**. 
- Why? If the engine extracts a dominant Blue, but the UI requires text to be readable on top of it, the engine can simply take the extracted HSL value and force the \`Lightness\` parameter to 20% (Dark Blue) or 80% (Light Blue) without altering the core \`Hue\`.

---

## 5. Production Workflows

- **Dynamic UIs (Spotify / Apple Music):** When a user plays a song, the frontend extracts the dominant color from the album artwork, forces the lightness to 15% (to keep the app in dark mode), and applies it as a smooth CSS gradient behind the play controls.
- **E-Commerce Tagging:** Online clothing retailers upload thousands of product photos. A backend Node.js script extracts the dominant color palette from each photo and automatically tags the database (e.g., "Navy Blue, Gold") so users can filter by color in the search engine.

---

## 6. Interactive Quiz

**Beginner:**
1. Why don't we just calculate the mathematical average color of an image? *(Answer: Because averaging contrasting colors (like red and green) results in ugly, muddy colors (like brown) that don't actually exist in the photo).*

**Intermediate:**
2. What algorithm is standard for extracting dominant color palettes? *(Answer: K-Means Clustering, which mathematically groups pixels into distinct color "buckets" in a 3D space).*

**Advanced:**
3. How do browsers extract palettes instantly without freezing when processing massive 20MB photos? *(Answer: The engine performs aggressive downsampling (scaling the image down to ~200px) and Quantization before running the K-Means algorithm, reducing the mathematical workload by 99%).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Upload any image file.",
    "**Step 2:** The internal K-Means Clustering engine will optimize and analyze the pixels locally.",
    "**Step 3:** The tool generates a primary color palette (dominant colors) and provides HEX, RGB, and HSL values.",
    "**Step 4:** Click any color swatch to copy its code directly to your clipboard for use in CSS or design tools."
  ],
  faq: [
    {
      question: "Why does the tool generate different colors than what I see?",
      answer: "A tiny speck of bright neon pink might catch your human eye, but if it only makes up 0.1% of the pixels in the photo, the clustering algorithm will mathematically ignore it in favor of colors that cover larger areas."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Image Base64", "Edit Metadata"]
};
