"use client";

import { memo } from "react";
import { Shield, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";
import { m } from "framer-motion";
import Link from "next/link";
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
  { q: "What happens if I clear my browser cache?", a: "Clearing your browser cache or site data will remove your saved tool history and local configurations. Use the Export Settings feature to keep a backup." },
];

export const HelpSection = memo(function HelpSection() {
  return (
    <div className="space-y-8">
      {/* --- FAQ Section --- */}
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-black text-text uppercase tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue" />
            Frequently Asked
          </h3>
          <Link href="/help" className="text-tiny font-bold text-blue hover:underline flex items-center gap-1">
            Full Help Center <ExternalLink className="w-3 h-3" />
          </Link>
        </header>
        
        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQ.map((item, i) => (
            <AccordionItem 
              key={i} 
              value={`item-${i}`} 
              className="bg-surface border border-border/60 shadow-sm rounded-2xl px-5 overflow-hidden hover:border-blue/30 transition-all duration-300"
            >
              <AccordionTrigger className="text-sm font-bold tracking-wide py-4 text-text hover:text-blue hover:no-underline text-left leading-snug">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-text-4 font-semibold pb-5 leading-relaxed border-t border-border/20 pt-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* --- External Resources --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
        <a 
          href="https://github.com/gowhamr/karuvilab" 
          target="_blank" 
          className="flex items-center justify-between p-6 bg-surface border border-border rounded-2xl group hover:border-blue transition-all"
        >
          <div className="space-y-1">
            <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 group-hover:text-blue">Open Source</p>
            <p className="text-xs font-medium text-text-4">View source on GitHub</p>
          </div>
          <ExternalLink className="w-4 h-4 text-text-4 group-hover:text-blue" />
        </a>
        <Link 
          href="/contact" 
          className="flex items-center justify-between p-6 bg-surface border border-border rounded-2xl group hover:border-blue transition-all"
        >
          <div className="space-y-1">
            <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 group-hover:text-blue">Support</p>
            <p className="text-xs font-medium text-text-4">Contact our team</p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-4 group-hover:text-blue" />
        </Link>
      </div>
    </div>
  );
});