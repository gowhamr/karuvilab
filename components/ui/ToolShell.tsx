"use client";

import Link from "next/link";
import { ALL_TOOLS, CategoryEntry, getToolColor } from "@/src/tool-registry";
import { TOOL_CONTENT, ToolContent } from "@/src/tool-content";
import { Check, X, ArrowUpRight, ChevronRight } from "lucide-react";
import { ToolIcon } from "@/components/ui/Icons";
import { ErrorBoundary } from "./ErrorBoundary";
import { StructuredData } from "@/src/lib/seo";
import { FavoriteButton } from "./FavoriteButton";
import { Breadcrumbs } from "./Breadcrumbs";
import { ToolMoreMenu } from "./ToolMoreMenu";
import { useWorkflowIntegration } from "@/src/lib/workflow-hook";
import { useSupportStore } from "@/src/store/useSupportStore";
import { m } from "framer-motion";

interface ToolShellProps {
  title: string;
  description?: string;
  category?: CategoryEntry;
  children: React.ReactNode;
  toolId?: string;
  content?: {
    detailedDescription?: string;
    howTo?: string[];
    faq?: { question: string; answer: string }[];
    useCases?: string[];
    examples?: { label: string; input: string; output: string }[];
    commonErrors?: { error: string; fix: string }[];
    alternatives?: string[];
    relatedTools?: string[];
  };
}

/**
 * Foundational layout wrapper for all KaruviLab tools.
 * Handles SEO metadata, breadcrumbs, favorite status, workflow integration, 
 * and provides a consistent structure for tool content and documentation.
 *
 * @param title - The primary heading and tool name.
 * @param description - Short summary of tool capability.
 * @param category - The parent category for routing and styling.
 * @param children - The interactive tool client component.
 * @param toolId - Optional explicit tool ID for registry lookups.
 * @param content - Optional detailed documentation and FAQ data.
 */
export function ToolShell({ title, description, category, children, toolId, content }: ToolShellProps): React.JSX.Element {
  const currentTool = ALL_TOOLS.find(t =>
    t.id === toolId ||
    t.name === title ||
    t.id === title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  );

  const finalToolId = toolId || currentTool?.id || "";
  useWorkflowIntegration(finalToolId);

  const color = currentTool ? getToolColor(currentTool) : (category?.color || '#4F46E5');

  const reg: ToolContent = currentTool ? (TOOL_CONTENT[currentTool.id as keyof typeof TOOL_CONTENT] ?? {}) : {};

  const merged = {
    detailedDescription: content?.detailedDescription ?? reg.detailedDescription,
    howTo:               content?.howTo               ?? reg.howTo,
    faq:                 content?.faq                 ?? reg.faq,
    useCases:            content?.useCases            ?? reg.useCases,
    examples:            content?.examples            ?? reg.examples,
    commonErrors:        content?.commonErrors        ?? reg.commonErrors,
    alternatives:        content?.alternatives        ?? reg.alternatives,
  };

  const relatedIds = content?.relatedTools ?? currentTool?.related ?? [];
  const related = ALL_TOOLS.filter(t => relatedIds.includes(t.id));

  return (
    <m.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-12 sm:space-y-16 lg:space-y-20 pb-24 px-4 sm:px-6 lg:px-8" 
      style={{ '--tool-color': color } as any}
    >
      <StructuredData 
        {...(currentTool ? { tool: currentTool } : {})}
        {...(category ? { category } : {})}
        content={{
          ...(merged.detailedDescription && { detailedDescription: merged.detailedDescription }),
          ...(merged.faq && { faq: merged.faq }),
          ...(merged.howTo && { howTo: merged.howTo }),
        }}
      />

      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Breadcrumbs category={category} title={title} />
          <div className="flex items-center gap-2">
            {currentTool && <FavoriteButton toolId={currentTool.id} />}
            <ToolMoreMenu toolId={finalToolId} toolName={title} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">{title}</h1>
          {description && (
            <p className="text-base sm:text-lg md:text-xl text-text-3 leading-relaxed max-w-3xl font-medium">
              {description}
            </p>
          )}
        </div>
      </header>

      <section className="relative z-10">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-border">
        <div className="lg:col-span-2 space-y-12">
          {merged.detailedDescription && (
            <m.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">Deep Dive</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-text-3 leading-relaxed text-sm md:text-base font-normal">
                <p>{merged.detailedDescription}</p>
              </div>
            </m.section>
          )}

          {merged.useCases && merged.useCases.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold">Who uses this?</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {merged.useCases.map((uc, i) => (
                  <m.li 
                    key={i} 
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-3 bg-surface border border-border rounded-xl p-4 transition-colors hover:border-blue/30"
                  >
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-success" />
                    <span className="text-text-2 text-sm leading-relaxed">{uc}</span>
                  </m.li>
                ))}
              </ul>
            </section>
          )}

          {merged.examples && merged.examples.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold">Examples</h2>
              <div className="space-y-4">
                {merged.examples.map((ex, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="px-4 py-2 border-b border-border bg-bg">
                      <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest">{ex.label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Input</p>
                        <code className="text-sm font-mono text-text-2 break-all">{ex.input}</code>
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest">Output</p>
                        <code className="text-sm font-mono break-all text-blue">{ex.output}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {merged.commonErrors && merged.commonErrors.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold">Common Errors & Fixes</h2>
              <div className="space-y-3">
                {merged.commonErrors.map((item, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="flex items-start gap-3 p-4 border-b border-border">
                      <X className="text-error w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-text-2 font-medium">{item.error}</p>
                    </div>
                    <div className="flex items-start gap-3 p-4">
                      <Check className="text-success w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-text-3">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {merged.faq && merged.faq.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Expert FAQ</h2>
              <div className="grid gap-4">
                {merged.faq.map((item, i) => (
                  <div key={i} className="bg-surface border border-border rounded-2xl p-6 space-y-3">
                    <h3 className="font-bold text-text">{item.question}</h3>
                    <p className="text-text-3 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-12">
          {merged.howTo && merged.howTo.length > 0 && (
            <section className="border border-border rounded-3xl p-8 space-y-8 h-fit sticky top-24 bg-surface shadow-sm">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Quick Guide</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4">Step-by-step</p>
              </div>
              <ol className="space-y-6">
                {merged.howTo.map((step, i) => (
                  <m.li 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex gap-4 group cursor-default"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue text-white flex items-center justify-center text-[10px] font-bold group-hover:scale-110 transition-transform">
                      {i + 1}
                    </span>
                    <p className="text-text-2 text-sm font-medium leading-snug group-hover:text-text transition-colors">{step}</p>
                  </m.li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="pt-12 border-t border-border space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Related Tools</h2>
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-blue hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(tool => (
              <m.div
                key={tool.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/${tool.href}`}
                  className="group flex items-center gap-3 p-4 min-h-[64px] bg-surface border border-border rounded-2xl transition-all hover:border-blue/30 hover:shadow-lg dark:hover:shadow-blue/5"
                >
                  <div className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-blue/5 transition-colors">
                    <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-text transition-colors text-sm truncate group-hover:text-blue">{tool.name}</div>
                    <div className="text-xs text-text-4 font-medium line-clamp-1">{tool.desc}</div>
                  </div>
                </Link>
              </m.div>
            ))}
          </div>
        </section>
      )}

    </m.div>
  );
}
