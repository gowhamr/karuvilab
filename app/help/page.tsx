import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, AlertTriangle, Lightbulb, HelpCircle, Terminal, CheckCircle2, ChevronRight, Layers, Lock, Monitor, Code } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Documentation & Tutorials | KaruviLab",
  description: "Comprehensive documentation, tutorials, practical examples, and troubleshooting for KaruviLab tools.",
};

const TROUBLESHOOTING = [
  {
    issue: "My large PDF or image file is failing to process.",
    solution: "KaruviLab processes everything locally inside your browser using WebAssembly and Web Workers. If a file is too large, your browser tab might run out of memory. Try processing smaller batches (e.g., 5-10 files at a time) or close other heavy browser tabs to free up RAM."
  },
  {
    issue: "The screen freezes when I click 'Process'.",
    solution: "For extremely heavy operations (like splitting a 500-page PDF), the browser's main thread might block for a moment while transferring the file binary to the Web Workers. Wait a few seconds. We are constantly optimizing our Worker Orchestrator to minimize this."
  },
  {
    issue: "My data disappeared after clearing browser history.",
    solution: "Because KaruviLab is a local-first platform, clearing your browser's 'Site Data' or 'IndexedDB' will permanently delete your Secure Notes, favorites, and settings. Consider backing up your text manually."
  },
  {
    issue: "Dashboard Mode (F11) isn't working.",
    solution: "Ensure your browser allows full-screen requests. On some mobile browsers or restrictive environments (like embedded WebViews), the full-screen API might be disabled by the OS."
  }
];

const FAQS = [
  {
    q: "Is my data really safe and private?",
    a: "Yes, 100%. KaruviLab runs entirely via client-side JavaScript. Your files, documents, and images never leave your device. We do not have servers that process your files.",
  },
  {
    q: "Does it work without the internet?",
    a: "Yes! Most tools work completely offline once the page has loaded. You can install KaruviLab as a Progressive Web App (PWA) and use it on an airplane.",
  },
  {
    q: "Can I use this for government portal submissions?",
    a: "Absolutely. We designed our image compressors and PDF tools specifically to hit exact kilobyte targets for strict upload forms commonly found on government websites.",
  }
];

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="mx-auto w-20 h-20 bg-blue/10 text-blue rounded-full flex items-center justify-center mb-6 shadow-inner">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text">Documentation & Help</h1>
        <p className="text-text-3 text-lg leading-relaxed font-medium">
          Master KaruviLab's privacy-first tools with step-by-step tutorials, practical examples, and comprehensive troubleshooting guides.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tool Documentation Accordion */}
          <section className="bg-surface border border-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Terminal className="w-6 h-6 text-blue" />
              <h2 className="text-2xl font-black tracking-tight">Tool Guides</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              
              {/* Image & Batch Processing */}
              <AccordionItem value="batch-processing" className="border-border">
                <AccordionTrigger className="hover:no-underline hover:text-blue py-5 group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Layers className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-black text-lg">Batch Processing Images & PDFs</p>
                      <p className="text-xs text-text-4 font-bold uppercase tracking-widest mt-1">Optimization Engine</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 space-y-4 text-text-2">
                  <p>
                    Our Image Resizer and PDF tools utilize a powerful local Web Worker orchestrator. This means you can drop in 100 images at once, and your browser won't freeze.
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-2">
                    <li><strong>Image Resizer:</strong> Drag and drop a folder of images. Select a target format (like WebP for better compression) and hit process. The engine handles them concurrently.</li>
                    <li><strong>PDF Split/Merge:</strong> Built on top of pdf-lib, these tools load the binary data into memory. Ensure you don't exceed 100MB of PDFs at a time on low-end mobile devices.</li>
                    <li><strong>SEO Image Renamer:</strong> Automatically converts filenames like "IMG_1234.jpg" into hyphenated, SEO-friendly slugs instantly.</li>
                  </ul>
                  <div className="p-4 bg-blue/5 border border-blue/20 rounded-xl mt-4">
                    <p className="text-sm font-bold text-blue flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Pro Tip
                    </p>
                    <p className="text-xs mt-1">If you are preparing images for a website, always use WebP with an 80% quality target. It reduces sizes by 60% with zero visible loss.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Secure Notes */}
              <AccordionItem value="secure-notes" className="border-border">
                <AccordionTrigger className="hover:no-underline hover:text-blue py-5 group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-black text-lg">Secure Notes & Offline Persistence</p>
                      <p className="text-xs text-text-4 font-bold uppercase tracking-widest mt-1">Encrypted Storage</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 space-y-4 text-text-2">
                  <p>
                    KaruviLab's note-taking tool relies heavily on IndexedDB for offline persistence. Your data is structured using the Zustand state management library and directly cached into your browser.
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-2">
                    <li><strong>No Servers:</strong> We literally have no database. If you write a note, it only exists on your hard drive inside the browser's hidden IndexedDB folder.</li>
                    <li><strong>Speech Recognition:</strong> Uses the native Web Speech API. Audio is processed natively by your OS, ensuring speed and privacy.</li>
                    <li><strong>Exporting:</strong> Always export important notes as a Markdown or TXT file using the 'Export' button before clearing your browser cache!</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Dashboard Mode */}
              <AccordionItem value="dashboard-mode" className="border-border">
                <AccordionTrigger className="hover:no-underline hover:text-blue py-5 group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Monitor className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-black text-lg">Dashboard Mode & Clocks</p>
                      <p className="text-xs text-text-4 font-bold uppercase tracking-widest mt-1">Productivity</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 space-y-4 text-text-2">
                  <p>
                    Dashboard Mode transforms your browser into a kiosk. Available on the Pomodoro Timer, Stopwatch, and Countdown Timer.
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-2">
                    <li><strong>F11 Fullscreen:</strong> Click the "Enter Dashboard" button or press F11 to remove all browser UI elements.</li>
                    <li><strong>World Clock:</strong> We use an advanced, cached Intl.DateTimeFormat engine. This allows you to track dozens of global timezones at 60 frames per second without any battery drain.</li>
                    <li><strong>Wake Lock:</strong> If supported by your browser, our timers will request a Wake Lock to prevent your screen from dimming while a timer is running.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Developer Sandbox */}
              <AccordionItem value="dev-sandbox" className="border-border">
                <AccordionTrigger className="hover:no-underline hover:text-blue py-5 group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Code className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-black text-lg">Developer Tools & Sandboxes</p>
                      <p className="text-xs text-text-4 font-bold uppercase tracking-widest mt-1">Code Parsing</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 space-y-4 text-text-2">
                  <p>
                    Our developer utilities are built for extreme speed and security. We never send your proprietary code payloads to a backend for formatting or validation.
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-2">
                    <li><strong>HTML/CSS Viewer:</strong> Powered by Monaco Editor (the same engine as VS Code). The preview window uses an isolated iframe sandbox to prevent XSS.</li>
                    <li><strong>JSON Formatting:</strong> Parses payloads natively. Can easily handle 10MB+ JSON files instantly.</li>
                    <li><strong>Base64 / URL Encoders:</strong> Completely pure functions. Instantly translates strings directly in memory.</li>
                  </ul>
                  <div className="p-4 bg-pink-500/5 border border-pink-500/20 rounded-xl mt-4">
                    <p className="text-sm font-bold text-pink-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Security Note
                    </p>
                    <p className="text-xs mt-1">If you are pasting API keys or production database dumps, you can rest easy. We strip all analytics trackers from these specific pages to guarantee zero leakage.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </section>

          {/* Troubleshooting Section */}
          <section className="bg-surface border border-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h2 className="text-2xl font-black tracking-tight">Troubleshooting</h2>
            </div>
            <div className="space-y-6">
              {TROUBLESHOOTING.map((item, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-bold text-text flex items-start gap-2">
                    <span className="text-error mt-0.5">•</span>
                    {item.issue}
                  </h3>
                  <p className="text-sm text-text-3 font-medium leading-relaxed pl-4">{item.solution}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Quick FAQ */}
          <section className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-black tracking-tight">Quick FAQ</h2>
            </div>
            <div className="space-y-5">
              {FAQS.map((faq, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="font-bold text-sm leading-snug">{faq.q}</p>
                  <p className="text-sm text-text-4 font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Practical Examples */}
          <section className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Lightbulb className="w-5 h-5 text-success" />
              <h2 className="text-xl font-black tracking-tight">Use Cases</h2>
            </div>
            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">For Developers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-text-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5 opacity-70" />
                    <span className="leading-relaxed">Minifying CSS/JS bundles instantly before deployment.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5 opacity-70" />
                    <span className="leading-relaxed">Validating massive JSON payloads locally to prevent server errors.</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 mt-6">For Creators</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-text-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5 opacity-70" />
                    <span className="leading-relaxed">Merging multiple assignment PDFs into a single file for submission.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5 opacity-70" />
                    <span className="leading-relaxed">Generating high-density QR codes for WiFi networks or vCards.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Need More Help? */}
          <section className="bg-gradient-to-br from-blue/10 to-indigo-500/5 border border-blue/20 p-6 rounded-3xl shadow-sm text-center space-y-4">
            <h3 className="font-black text-lg text-blue">Still stuck?</h3>
            <p className="text-sm text-text-3 font-medium">If you've encountered a bug or need specific feature help, reach out to us directly.</p>
            <Link href="/contact" className="inline-block w-full py-3 bg-blue text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-blue/20 hover:scale-105 active:scale-95 transition-all">
              Contact Support
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
