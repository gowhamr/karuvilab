import { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "About – KV",
  description: "Learn about KaruviLab — a privacy-first browser toolset built for compressing, converting, and validating files locally.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-sm text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">About Us</span>
        </nav>
        <h1 className="text-3xl font-black">About KaruviLab</h1>
        <p className="text-text-3">Privacy-first browser tools for everyday document work.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold">What is KaruviLab?</h2>
          <p className="text-text-2 leading-relaxed">
            KaruviLab is a free, browser-based utility designed to help individuals prepare images and PDF documents that meet the strict requirements of government portals, online application systems, and official document submissions.
          </p>
          <p className="text-text-2 leading-relaxed">
            From passport photos and signatures to ID proofs and thumb impressions — every government document upload has its own format, size, and dimension requirements. Our tool takes the guesswork out of the process by letting you compress, convert, create, and validate files directly in your browser, without uploading anything to a server.
          </p>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Why We Built This</h2>
          <p className="text-text-2 leading-relaxed">
            Millions of people struggle every year when uploading documents to government portals. Common errors include file size limits, wrong dimensions, or unsupported formats. We built this tool to be the one-stop solution for all these problems — fast, free, and private.
          </p>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Key Features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🗜️", title: "Compressor", desc: "Reduce image size to under 100 KB or PDFs to under 1 MB." },
              { icon: "🔄", title: "Converter", desc: "Convert between JPG, PNG, GIF, WebP, AVIF, TIFF, BMP, HEIC, and PDF." },
              { icon: "🖼️", title: "Image Creator", desc: "Create passport photos, signatures, and custom-sized images." },
              { icon: "📄", title: "PDF Tools", desc: "Merge PDFs, convert images to PDF, and compress PDF files." },
              { icon: "✅", title: "Validator", desc: "Validate files against government portal rules and auto-fix issues." },
              { icon: "💻", title: "Developer Tools", desc: "Base64, Regex, JSON/XML formatter, and Markdown editor." },
              { icon: "✂️", title: "Split & Copy", desc: "Break large text into parts for easy mobile clipboard sharing." },
              { icon: "🔒", title: "100% Private", desc: "All processing happens locally. No file is ever uploaded to any server." },
            ].map(f => (
              <div key={f.title} className="bg-bg border border-border rounded-xl p-4 space-y-2">
                <span className="text-2xl">{f.icon}</span>
                <p className="font-bold text-sm">{f.title}</p>
                <p className="text-xs text-text-3 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold">About the Owner</h2>
          <div className="flex gap-5 items-start">
            <div className="w-16 h-16 rounded-full bg-blue flex items-center justify-center text-white font-black text-xl flex-shrink-0">RG</div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">R Gowtham</h3>
              <p className="text-sm text-text-3">Owner &amp; Administrator</p>
              <p className="text-text-2 text-sm leading-relaxed">
                R Gowtham is the creator and maintainer of KaruviLab under the <strong>Wanderseven</strong> brand. Passionate about building practical, privacy-first tools for everyday users.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a href="https://wanderseven.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue hover:underline">
                  wanderseven.com
                </a>
                <a href="mailto:KaruviLab@proton.me" className="text-sm text-blue hover:underline">
                  KaruviLab@proton.me
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
          <h2 className="text-xl font-bold">Technology</h2>
          <p className="text-text-2 leading-relaxed">
            This tool is built with Next.js and TypeScript, using Tailwind CSS for styling. It leverages open-source libraries like pdf-lib, PDF.js, and Canvas APIs for advanced format support. No server-side processing. No tracking. No cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
