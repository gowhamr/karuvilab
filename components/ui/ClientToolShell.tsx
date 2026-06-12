'use client';

import Link from 'next/link';
import { ALL_TOOLS, CategoryEntry, getToolColor } from '@/src/tool-registry';
import { Check, ArrowUpRight, ChevronRight } from 'lucide-react';
import { ToolIcon } from '@/components/ui/Icons';
import { ErrorBoundary } from './ErrorBoundary';
import { FavoriteButton } from './FavoriteButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ToolMoreMenu } from './ToolMoreMenu';
import { TrustSection } from '../system/TrustSection';
import { useWorkflowIntegration } from '@/src/lib/workflow-hook';
import { m } from 'framer-motion';
import { useMemo } from 'react';
import { parseAndSanitizeMarkdownSync } from '@/src/lib/security';
import { ToolFeedback } from './ToolFeedback';

export interface ClientToolShellProps {
  title: string;
  description?: string | undefined;
  category?: CategoryEntry | undefined;
  children: React.ReactNode;
  toolId?: string | undefined;
  content: {
    detailedDescription?: string | undefined;
    howTo?: string[] | undefined;
    faq?: { question: string; answer: string }[] | undefined;
    useCases?: string[] | undefined;
    examples?: { label?: string; input: string; output: string; description?: string }[] | undefined;
    commonErrors?: { error: string; fix: string }[] | undefined;
    alternatives?: string[] | undefined;
    relatedTools?: string[] | undefined;
  };
}

export function ClientToolShell({ title, description, category, children, toolId, content }: ClientToolShellProps) {
  const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
  const finalToolId = toolId || currentTool?.id || '';
  useWorkflowIntegration(finalToolId);

  const parsedContent = useMemo(() => ({
    detailedDescription: content.detailedDescription ? parseAndSanitizeMarkdownSync(content.detailedDescription) : '',
    howTo: (content.howTo || []).map(step => parseAndSanitizeMarkdownSync(step)),
    faq: (content.faq || []).map(item => ({
      question: item.question,
      answer: parseAndSanitizeMarkdownSync(item.answer)
    }))
  }), [content.detailedDescription, content.howTo, content.faq]);

  const relatedIds = content.relatedTools ?? currentTool?.related ?? [];
  const related = ALL_TOOLS.filter(t => relatedIds.includes(t.id));

  return (
    <m.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 sm:space-y-16 lg:space-y-20 pb-24 px-4"
    >
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Breadcrumbs category={category} title={title} />
          <div className="flex items-center gap-2">
            {currentTool && <FavoriteButton toolId={currentTool.id} />}
            <ToolMoreMenu toolId={finalToolId} toolName={title} />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black">{title}</h1>
          {description && <p className="text-text-3 text-lg leading-relaxed max-w-3xl">{description}</p>}
        </div>
      </header>

      <section>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1 lg:col-span-2 space-y-16">
          {parsedContent.detailedDescription && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Deep Dive</h2>
              <div 
                className="prose prose-slate dark:prose-invert max-w-none text-text-3"
                dangerouslySetInnerHTML={{ __html: parsedContent.detailedDescription }}
              />
            </section>
          )}

          {content.useCases && content.useCases.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Use Cases</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.useCases.map((uc, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl">
                    <Check className="w-5 h-5 text-success shrink-0" />
                    <span className="text-text-2 text-sm">{uc}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {content.examples && content.examples.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Examples</h2>
              <div className="space-y-4">
                {content.examples.map((ex, i) => (
                  <div key={i} className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl overflow-hidden">
                    <div className="px-4 py-2 border-b border-mat-border bg-mat-base/50">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-4">{ex.label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-mat-border">
                      <div className="p-4 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-4">Input</p>
                        <code className="text-sm font-mono text-text-2 block break-all">{ex.input}</code>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-4">Output</p>
                        <code className="text-sm font-mono text-blue block break-all">{ex.output}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {parsedContent.faq && parsedContent.faq.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {parsedContent.faq.map((item, i) => (
                  <div key={i} className="p-6 bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl space-y-3">
                    <h3 className="font-bold text-text">{item.question}</h3>
                    <div 
                      className="text-text-3 text-sm leading-relaxed prose prose-sm prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          {parsedContent.howTo && parsedContent.howTo.length > 0 && (
            <section className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl p-8 space-y-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">Quick Guide</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4">How it works</p>
              </div>
              <ol className="space-y-4">
                {parsedContent.howTo.map((step, i) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue/10 text-blue flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <div 
                      className="text-text-2 text-sm leading-snug pt-0.5"
                      dangerouslySetInnerHTML={{ __html: step }}
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}

          <ToolFeedback toolId={finalToolId} toolName={title} />

          <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-text">Need Help?</h3>
            <p className="text-xs text-text-2 leading-relaxed">
              Check our documentation or contact support for assistance with this tool.
            </p>
            <Link 
              href="/help"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue hover:underline"
            >
              Visit Help Center <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </aside>
      </div>

      <TrustSection requiresNetwork={currentTool?.requiresNetwork ?? false} />

      {related.length > 0 && (
        <section className="pt-12 border-t border-border space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Related Tools</h2>
            <Link href="/all-tools" className="text-xs font-bold uppercase tracking-widest text-blue hover:underline">
              Browse all <ChevronRight className="inline w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className="flex items-center gap-4 p-4 bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl hover:border-brand-primary/50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-mat-base flex items-center justify-center shrink-0">
                  <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate group-hover:text-brand-primary transition-colors">{tool.name}</h3>
                  <p className="text-xs text-text-4 truncate">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </m.div>
  );
}
