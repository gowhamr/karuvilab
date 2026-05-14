import { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";

const FileViewerDiffClient = dynamic(() => import("@/components/tools/file-viewer-diff/FileViewerDiffClient"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Online File Viewer & Diff Tool – Code Editor & Compare | KV",
  description: "View, edit, and compare text/code files directly in your browser. Works offline, no upload. Supports syntax highlighting, side-by-side diff, and download. Privacy-first.",
  keywords: ["file viewer", "diff checker", "code editor", "compare files", "text diff", "privacy tools", "offline editor"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "File Viewer & Diff",
  "description": "Local-first file editor and comparison tool. No upload, fully offline.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0" }
};

export default function FileViewerDiffPage() {
  return (
    <>
      <Script
        id="file-viewer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FileViewerDiffClient />

      <section className="mt-20 max-w-4xl mx-auto px-6 space-y-16 pb-20">
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-text">Privacy-First File Analysis</h2>
          <p className="text-text-3 leading-relaxed text-lg">
            Traditional online diff tools require you to upload your source code or sensitive documents to their servers. 
            <strong> KV File Viewer & Diff</strong> changes that by performing all calculations locally in your browser. 
            Your data never leaves your device, making it safe for proprietary code, logs, and confidential text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-text">How to compare two files?</h3>
            <p className="text-sm text-text-3 leading-relaxed">
              Switch to the "Compare Files" tab, upload your original and modified files, and click "Compare". 
              Our engine will compute the difference using a high-performance LCS algorithm and display them 
              side-by-side with clear color highlighting.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-text">Supported File Types</h3>
            <p className="text-sm text-text-3 leading-relaxed">
              You can view and edit any text-based file, including .txt, .js, .ts, .json, .html, .css, .md, .py, .java, .xml, and more. 
              Syntax highlighting is automatically applied based on the file extension.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <h3 className="text-2xl font-black text-text">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 gap-6">
            <FAQItem 
              q="Does this tool work offline?"
              a="Yes. Once the page is loaded, you can disconnect from the internet. All file reading, editing, and diffing logic is self-contained and runs in your browser."
            />
            <FAQItem 
              q="What is the maximum file size?"
              a="For optimal performance, especially on mobile devices, we recommend files up to 10MB. Larger files might cause the browser to slow down due to memory constraints."
            />
            <FAQItem 
              q="Can I use this on my phone?"
              a="Absolutely. The editor is designed to be mobile-friendly, with responsive layouts for both editing and viewing differences."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-8 bg-surface border border-border rounded-[32px] space-y-4 shadow-sm">
      <h4 className="font-black text-text text-lg">{q}</h4>
      <p className="text-sm text-text-3 leading-relaxed">{a}</p>
    </div>
  );
}
