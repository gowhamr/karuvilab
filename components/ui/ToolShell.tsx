import Link from "next/link";
import { ALL_TOOLS, CategoryEntry } from "@/src/tool-registry";
import { TOOL_CONTENT, ToolContent } from "@/src/tool-content";
import { Check, X, Wrench } from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";

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

export function ToolShell({ title, description, category, children, toolId, content }: ToolShellProps) {
  const currentTool = ALL_TOOLS.find(t =>
    t.id === toolId ||
    t.name === title ||
    t.id === title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  );

  const reg: ToolContent = currentTool ? (TOOL_CONTENT[currentTool.id] ?? {}) : {};

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
    <div className="max-w-5xl mx-auto space-y-16 pb-24">
      {/* Tool Header & Navigation */}
      <header className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/${category.href}`} className="hover:text-blue transition-colors">{category.label}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-3">{title}</span>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h1>
          {description && (
            <p className="text-lg md:text-xl text-text-3 leading-relaxed max-w-3xl font-medium italic border-l-4 border-blue/20 pl-6">
              {description}
            </p>
          )}
        </div>
      </header>

      {/* Main Tool UI */}
      <section className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="absolute -inset-4 bg-blue/5 blur-3xl -z-10 rounded-full opacity-50" />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </section>

      {/* ── SEO Content & Documentation ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2 space-y-12">

          {/* Detailed Description */}
          {merged.detailedDescription && (
            <section className="space-y-4">
              <h2 className="text-2xl font-black">Deep Dive</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-text-3 leading-relaxed text-sm md:text-base font-medium">
                <p>{merged.detailedDescription}</p>
              </div>
            </section>
          )}

          {/* Use Cases */}
          {merged.useCases && merged.useCases.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-black">Who uses this?</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {merged.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-3 bg-surface border border-border rounded-xl p-4 min-h-[52px]">
                    <Check className="text-blue w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-text-2 text-sm leading-relaxed">{uc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Examples */}
          {merged.examples && merged.examples.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-black">Examples</h2>
              <div className="space-y-4">
                {merged.examples.map((ex, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="px-4 py-2 border-b border-border bg-bg">
                      <span className="text-[10px] font-black text-text-4 uppercase tracking-widest">{ex.label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] font-black text-text-4 uppercase tracking-widest">Input</p>
                        <code className="text-sm font-mono text-text-2 break-all">{ex.input}</code>
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] font-black text-text-4 uppercase tracking-widest">Output</p>
                        <code className="text-sm font-mono text-blue break-all">{ex.output}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Common Errors */}
          {merged.commonErrors && merged.commonErrors.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-black">Common Errors & Fixes</h2>
              <div className="space-y-3">
                {merged.commonErrors.map((item, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="flex items-start gap-3 p-4 border-b border-border/50">
                      <X className="text-red-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-text-2 font-medium">{item.error}</p>
                    </div>
                    <div className="flex items-start gap-3 p-4">
                      <Check className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-text-3">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {merged.faq && merged.faq.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black">Expert FAQ</h2>
              <div className="grid gap-4">
                {merged.faq.map((item, i) => (
                  <div key={i} className="group bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-blue transition-all">
                    <h3 className="font-bold text-text group-hover:text-blue transition-colors">{item.question}</h3>
                    <p className="text-text-3 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Alternatives */}
          {merged.alternatives && merged.alternatives.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-black">Alternatives</h2>
              <div className="flex flex-wrap gap-2">
                {merged.alternatives.map((alt, i) => (
                  <span key={i} className="px-3 py-2 min-h-[44px] flex items-center bg-surface border border-border rounded-full text-sm text-text-3 font-medium">
                    {alt}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-12">
          {/* How-to Quick Guide */}
          {merged.howTo && merged.howTo.length > 0 && (
            <section className="bg-blue/5 border border-blue/10 rounded-3xl p-8 space-y-8 h-fit sticky top-24">
              <div className="space-y-2">
                <h2 className="text-xl font-black">Quick Guide</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue opacity-60">Step-by-step</p>
              </div>
              <ol className="space-y-6">
                {merged.howTo.map((step, i) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue text-white flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                      {i + 1}
                    </span>
                    <p className="text-text-2 text-sm font-bold leading-snug group-hover:text-blue transition-colors">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>

      {/* ── Related Tools ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-border/50 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Next in Workflow</h2>
            <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-blue hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className="group flex items-center gap-3 p-4 min-h-[64px] bg-surface border border-border rounded-2xl hover:border-blue hover:shadow-xl hover:shadow-blue/5 transition-all active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  {'icon' in tool && tool.icon ? tool.icon : <Wrench className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <div className="font-black text-text group-hover:text-blue transition-colors text-sm truncate">{tool.name}</div>
                  <div className="text-xs text-text-4 font-medium line-clamp-1">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
