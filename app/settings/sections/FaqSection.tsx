"use client";

import { memo } from "react";
import { Shield, HelpCircle } from "lucide-react";
import dynamic from "next/dynamic";

const Accordion = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.Accordion), { ssr: false });
const AccordionItem = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.AccordionItem), { ssr: false });
const AccordionTrigger = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.AccordionTrigger), { ssr: false });
const AccordionContent = dynamic(() => import("@/components/ui/Accordion").then(mod => mod.AccordionContent), { ssr: false });

const FAQ = [
  { q: "Is KV free for commercial use?", a: "Yes. KV (KaruviLab) is 100% free for personal and commercial projects. No limits, no subscriptions, no credit cards required." },
  { q: "How secure is my data on KV?", a: "Security is our core mission. All processing happens locally in your browser. Your files and text never leave your device." },
  { q: "Can I use these tools offline?", a: "Most KV tools are designed to work offline once loaded. Since processing is 100% client-side, you can disconnect and keep working." },
  { q: "Do you store any of my inputs or outputs?", a: "Absolutely not. KV does not have a backend that processes your data. Everything stays in your browser's volatile memory." },
  { q: "Where is my history stored?", a: "Your calculation history and 'Save this Calculation' data are stored in your browser's IndexedDB. It never leaves your computer." },
  { q: "What if I switch browsers?", a: "Since data is local to the browser, it won't sync automatically to Chrome if you use it in Edge. Use the 'Storage & Data' section to export and import your settings." },
];

export const FaqSection = memo(function FaqSection() {
  return (
    <div className="space-y-8">
      <div className="p-8 bg-blue/5 border border-blue/10 rounded-4xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
        <div className="w-16 h-16 rounded-2xl bg-blue text-white flex items-center justify-center shadow-lg shadow-blue/20 shrink-0">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight">Need more help?</h3>
          <p className="text-sm text-text-3 font-medium leading-relaxed max-w-md">
            Check out our community guides or reach out via our feedback form if you have specific architectural questions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 px-2">Knowledge Base</h4>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-surface border border-border shadow-sm rounded-2xl px-6 overflow-hidden hover:border-blue/30 hover:shadow-md transition-all duration-300 group">
              <AccordionTrigger className="text-sm font-black tracking-tight py-5 text-text [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-text-4 [&>svg]:shrink-0 hover:no-underline text-left leading-snug group-data-[state=open]:text-blue">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-text-3 font-medium pb-6 leading-relaxed border-t border-border/40 pt-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
});
