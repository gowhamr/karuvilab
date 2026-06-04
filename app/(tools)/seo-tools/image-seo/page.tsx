import { CheckCircle2 } from "lucide-react";
import ImageSeoClientWrapper from "./ImageSeoClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

export const metadata: Metadata = generateToolMetadata("image-seo");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  
  return (
    <ToolShell
      title="Image SEO & File Renamer Tool"
      description="Generate SEO-friendly alt text, optimized filenames, and rename any file (PDF, DOCX, Images) for better search engine visibility."
      category={cat}
    >
      <ImageSeoClientWrapper />

      <section className="mt-12 prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-text mb-4">Master Your Image & File SEO</h2>
            <p className="text-text-3 leading-relaxed">
              In the world of digital marketing, search engines don't just "see" images; they read the data associated with them. Our **Image SEO Tool** is designed to bridge the gap between visual content and search engine understanding. By generating descriptive **Alt Text** and keyword-rich **Filenames**, you provide crucial context that helps your content rank higher in Google Image Search and improves accessibility for screen-reader users.
            </p>
            <p className="text-text-3 leading-relaxed mt-4">
              Beyond just images, this tool now features a comprehensive **File Renamer**. Whether you're handling PDF reports, Word documents, or spreadsheets, having a clean, hyphenated, and descriptive filename is a fundamental yet often overlooked SEO best practice. Stop using generic names like <code className="bg-surface px-2 py-0.5 rounded text-blue">IMG_1234.jpg</code> or <code className="bg-surface px-2 py-0.5 rounded text-blue">Final_v2_edit.pdf</code> and start using names that actually describe your content.
            </p>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[32px]">
            <h3 className="text-xl font-bold text-text mb-4">How to Use the Tool</h3>
            <ol className="space-y-4 text-text-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue text-white flex items-center justify-center text-xs font-bold">1</span>
                <span><strong>Choose Your Goal:</strong> Select between Alt Text generation, Filename creation, or the new File Renamer tab.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue text-white flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>Input Content:</strong> Upload your file or provide a descriptive title/context about what the file contains.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue text-white flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Optimize:</strong> Our engine automatically converts your input into a URL-safe, SEO-optimized string (lowercase, hyphenated).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue text-white flex items-center justify-center text-xs font-bold">4</span>
                <span><strong>Download/Copy:</strong> Copy the generated alt text or download your newly renamed file directly to your device.</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-12 bg-surface border border-border rounded-[32px] p-8">
          <h2 className="text-2xl font-bold text-text mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-bold text-text">Why is image alt text important for SEO?</h4>
              <p className="text-sm text-text-3">Alt text provides a text alternative for search engine crawlers to understand an image's content. It also displays if the image fails to load and is vital for web accessibility.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-text">Should I use underscores or hyphens in filenames?</h4>
              <p className="text-sm text-text-3">Search engines like Google treat hyphens (-) as word separators, whereas underscores (_) are often treated as part of the word. Hyphens are the industry standard for SEO.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-text">Are my files uploaded to your server?</h4>
              <p className="text-sm text-text-3">No. KaruviLab uses browser-native APIs to process your files locally. Your data never leaves your device, ensuring 100% privacy.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-text">Does this tool support bulk renaming?</h4>
              <p className="text-sm text-text-3">Currently, the tool processes files one-by-one to ensure the highest quality of descriptive naming for each individual asset.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-text">Which file formats are supported?</h4>
              <p className="text-sm text-text-3">We support common web images (JPG, PNG, WebP) as well as document formats like PDF, DOCX, XLSX, and even ZIP or MP4 files.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-text">Can I use this tool offline?</h4>
              <p className="text-sm text-text-3">Yes! As a PWA, KaruviLab works entirely offline once loaded, including the file renaming and SEO optimization logic.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-blue/5 border border-blue/10 rounded-2xl">
            <h4 className="font-bold text-blue mb-2 italic">Example: Photography</h4>
            <p className="text-xs text-text-3">Original: <code className="text-red-400">DSC_001.jpg</code></p>
            <p className="text-xs text-text-3 mt-1 font-bold">SEO: <code className="text-green-500">golden-gate-bridge-sunset-fog.jpg</code></p>
          </div>
          <div className="p-6 bg-blue/5 border border-blue/10 rounded-2xl">
            <h4 className="font-bold text-blue mb-2 italic">Example: Real Estate</h4>
            <p className="text-xs text-text-3">Original: <code className="text-red-400">scan_doc_2024.pdf</code></p>
            <p className="text-xs text-text-3 mt-1 font-bold">SEO: <code className="text-green-500">modern-3-bedroom-apartment-floorplan.pdf</code></p>
          </div>
          <div className="p-6 bg-blue/5 border border-blue/10 rounded-2xl">
            <h4 className="font-bold text-blue mb-2 italic">Example: E-commerce</h4>
            <p className="text-xs text-text-3">Original: <code className="text-red-400">product-red.png</code></p>
            <p className="text-xs text-text-3 mt-1 font-bold">SEO: <code className="text-green-500">ergonomic-wireless-gaming-mouse-red.png</code></p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-surface border border-border rounded-[32px] flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-text">Privacy & Security First</h3>
          <p className="text-text-3 max-w-2xl mt-2 italic">
            At KaruviLab, your security is our priority. All image and file processing happens inside your browser's sandbox. We do not use any cloud-based AI or server-side scripts for renaming, ensuring your sensitive documents and private photos stay private.
          </p>
        </div>
      </section>
    </ToolShell>
  );
}
