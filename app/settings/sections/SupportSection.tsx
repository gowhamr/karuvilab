"use client";

import React from "react";
import { 
  Flag, Lightbulb, Mail, HelpCircle, 
  FileText, History, ChevronRight, ExternalLink 
} from "lucide-react";
import { useSupportStore } from "@/src/store/useSupportStore";

export function SupportSection() {
  const openFeedback = useSupportStore(state => state.openFeedback);

  const links = [
    { 
      label: "Report an Issue", 
      desc: "Found a bug or calculation error?", 
      icon: Flag, 
      onClick: () => openFeedback("bug") 
    },
    { 
      label: "Suggest a Feature", 
      desc: "What tool should we build next?", 
      icon: Lightbulb, 
      onClick: () => openFeedback("feature") 
    },
    { 
      label: "Help Center & FAQ", 
      desc: "Guides and answers to common questions", 
      icon: HelpCircle, 
      href: "/help" 
    },
    { 
      label: "Changelog", 
      desc: "Latest updates and improvements", 
      icon: History, 
      href: "/changelog" 
    },
    { 
      label: "Privacy Policy", 
      desc: "How we protect your data", 
      icon: FileText, 
      href: "/privacy" 
    },
    { 
      label: "Contact Email", 
      desc: "Talk to our team directly", 
      icon: Mail, 
      href: "mailto:KaruviLab@proton.me" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {links.map((link, i) => {
          const Icon = link.icon;
          const Component = link.href ? "a" : "button";
          return (
            <Component
              key={i}
              href={link.href}
              onClick={link.onClick}
              className="group w-full flex items-center justify-between p-5 bg-bg/50 border border-border rounded-2xl hover:bg-surface hover:border-blue/30 transition-all text-left"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center group-hover:bg-blue/5 group-hover:text-blue transition-colors">
                  <Icon className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-text group-hover:text-blue transition-colors">{link.label}</h3>
                  <p className="text-[10px] text-text-4 font-bold uppercase tracking-widest">{link.desc}</p>
                </div>
              </div>
              {link.href && link.href.startsWith("http") ? (
                <ExternalLink className="w-4 h-4 text-text-4 group-hover:text-blue opacity-20 group-hover:opacity-100 transition-all" />
              ) : (
                <ChevronRight className="w-4 h-4 text-text-4 group-hover:text-blue opacity-20 group-hover:opacity-100 transition-all" />
              )}
            </Component>
          );
        })}
      </div>
      
      <div className="p-6 bg-blue/5 border border-blue/10 rounded-[24px] space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue">Community Support</h4>
        <p className="text-xs text-text-3 font-medium leading-relaxed">
          KaruviLab is open source. You can also report issues directly on our GitHub repository or join our Discord community.
        </p>
        <div className="flex gap-4 pt-2">
           <a href="#" className="text-[10px] font-black text-blue uppercase tracking-widest hover:underline">GitHub</a>
           <a href="#" className="text-[10px] font-black text-blue uppercase tracking-widest hover:underline">Discord</a>
        </div>
      </div>
    </div>
  );
}
