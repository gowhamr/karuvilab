import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, AlertTriangle, Lightbulb, HelpCircle, Terminal, FileCode, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation, Tutorials & Help | KaruviLab",
  description: "Comprehensive documentation, tutorials, practical examples, and troubleshooting for KaruviLab tools.",
};

const TUTORIALS = [
  {
    title: "Batch Processing Images & PDFs",
    desc: "Learn how to optimize hundreds of images or split massive PDFs using KaruviLab's local worker engine without crashing your browser.",
    link: "/help/tutorials/batch-processing"
  },
  {
    title: "Mastering the Dashboard Mode",
    desc: "Turn your device into a dedicated kiosk. Press F11 on any productivity tool (Timer, Clock) to enter a distraction-free full-screen environment.",
    link: "/help/tutorials/dashboard-mode"
  },
  {
    title: "Secure Notes & Local Storage",
    desc: "A deep dive into how KaruviLab uses IndexedDB and WebCrypto API to keep your notes encrypted and entirely on your device.",
    link: "/help/tutorials/secure-notes"
  }
];

const EXAMPLES = [
  {
    category: "Developers",
    scenarios: [
      "Minifying CSS/JS bundles instantly before deployment.",
      "Validating massive JSON payloads locally to prevent server errors.",
      "Generating high-density QR codes for WiFi networks or vCards."
    ]
  },
  {
    category: "Students & Professionals",
    scenarios: [
      "Merging multiple assignment PDFs into a single file for submission.",
      "Using the Pomodoro Timer in Dashboard Mode to stay focused while studying.",
      "Tracking global team hours using the World Clock."
    ]
  }
];

const TROUBLESHOOTING = [
  {
    issue: "My large PDF or image file is failing to process.",
    solution: "KaruviLab processes everything locally. If a file is too large, your browser might run out of memory. Try processing smaller batches (e.g., 5-10 files at a time) or close other heavy browser tabs to free up RAM."
  },
  {
    issue: "The screen freezes when I click 'Process'.",
    solution: "For very heavy operations, the browser's main thread might block for a moment while transferring data to the Web Workers. Wait a few seconds. We are constantly optimizing our Worker Orchestrator to minimize this."
  },
  {
    issue: "My data disappeared after clearing browser history.",
    solution: "Because KaruviLab is a local-first platform, clearing your browser's 'Site Data' or 'IndexedDB' will permanently delete your Secure Notes, favorites, and settings. Consider backing up your text manually."
  },
  {
    issue: "Dashboard Mode (F11) isn't working.",
    solution: "Ensure your browser allows full-screen requests. On some mobile browsers or restrictive environments (like embedded WebViews), the full-screen API might be disabled."
  }
];

const FAQS = [
  {
    q: "Is my data safe?",
    a: "Yes, 100%. KaruviLab uses client-side JavaScript. Your documents never leave your device.",
  },
  {
    q: "Does it work without the internet?",
    a: "Most tools work completely offline once the page has loaded, functioning perfectly as a PWA.",
  },
  {
    q: "Can I use this for government portal submissions?",
    a: "Absolutely. We designed our image compressors and PDF tools specifically to hit exact kilobyte targets for strict upload forms.",
  }
];

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="mx-auto w-20 h-20 bg-blue/10 text-blue rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Documentation & Help</h1>
        <p className="text-text-3 text-lg leading-relaxed">
          Master KaruviLab's tools with step-by-step tutorials, practical examples, and comprehensive troubleshooting guides.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tutorials Section */}
          <section className="bg-surface border border-border p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Terminal className="w-6 h-6 text-blue" />
              <h2 className="text-2xl font-bold">Tutorials & Guides</h2>
            </div>
            <div className="space-y-4">
              {TUTORIALS.map((tut, i) => (
                <div key={i} className="group block bg-bg border border-border rounded-2xl p-5 hover:border-blue/30 transition-all">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue transition-colors">{tut.title}</h3>
                  <p className="text-sm text-text-3 leading-relaxed mb-4">{tut.desc}</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue opacity-80 group-hover:opacity-100">Read Guide →</span>
                </div>
              ))}
            </div>
          </section>

          {/* Troubleshooting Section */}
          <section className="bg-surface border border-border p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h2 className="text-2xl font-bold">Troubleshooting</h2>
            </div>
            <div className="space-y-6">
              {TROUBLESHOOTING.map((item, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-bold text-text flex items-start gap-2">
                    <span className="text-error mt-0.5">•</span>
                    {item.issue}
                  </h3>
                  <p className="text-sm text-text-3 leading-relaxed pl-4">{item.solution}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Examples Section */}
          <section className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Lightbulb className="w-5 h-5 text-success" />
              <h2 className="text-xl font-bold">Practical Examples</h2>
            </div>
            <div className="space-y-6">
              {EXAMPLES.map((ex, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text-4">{ex.category}</h3>
                  <ul className="space-y-3">
                    {ex.scenarios.map((scenario, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-2">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5 opacity-70" />
                        <span className="leading-relaxed">{scenario}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Quick FAQ */}
          <section className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Quick FAQ</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-bold text-sm leading-snug">{faq.q}</p>
                  <p className="text-sm text-text-4 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Need More Help? */}
          <section className="bg-blue/5 border border-blue/20 p-6 rounded-3xl shadow-sm text-center space-y-4">
            <h3 className="font-bold text-lg text-blue">Still stuck?</h3>
            <p className="text-sm text-text-3">If you've encountered a bug or need specific help, reach out to us directly.</p>
            <Link href="/contact" className="inline-block w-full py-3 bg-blue text-white font-bold rounded-xl shadow-lg shadow-blue/20 hover:scale-105 active:scale-95 transition-all">
              Contact Support
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
