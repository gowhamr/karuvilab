import Link from "next/link";
import { CategoryEntry, TOOLS } from "@/src/tool-registry";

interface ToolShellProps {
  title: string;
  description?: string;
  category?: CategoryEntry;
  children: React.ReactNode;
  content?: {
    detailedDescription: string;
    howTo: string[];
    faq: { question: string; answer: string }[];
    relatedTools?: string[]; // IDs
  };
}

export function ToolShell({ title, description, category, children, content }: ToolShellProps) {
  const currentTool = TOOLS.find(t => t.name === title || t.id === title.toLowerCase().replace(/ /g, '-'));
  const relatedIds = currentTool?.related || content?.relatedTools || [];
  const related = TOOLS.filter(t => relatedIds.includes(t.id));

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* 1. Tool UI (top) - we wrap the children which is the UI */}
      <section className="space-y-8">
        {children}
      </section>

      {/* 2. H1 heading & 3. Description (below UI as per "top" instruction) */}
      <section className="space-y-6">
        <div className="space-y-3">
          {category && (
            <nav className="flex flex-wrap items-center gap-2 text-sm text-text-4">
              <Link href="/" className="hover:text-blue transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/${category.href}`} className="hover:text-blue transition-colors">{category.label}</Link>
              <span>/</span>
              <span className="text-text-3">{title}</span>
            </nav>
          )}
          <h1 className="text-4xl font-black">{title}</h1>
          {description && <p className="text-text-2 text-lg leading-relaxed">{description}</p>}
        </div>

        {content?.detailedDescription && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-text-3 leading-relaxed">
            <p>{content.detailedDescription}</p>
          </div>
        )}
      </section>

      {/* 4. How-to steps */}
      {content?.howTo && content.howTo.length > 0 && (
        <section className="bg-surface border border-border rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold">How to use {title}</h2>
          <ol className="space-y-4">
            {content.howTo.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="text-text-2 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 5. FAQ section */}
      {content?.faq && content.faq.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {content.faq.map((item, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-6 space-y-2">
                <h3 className="font-bold text-text">{item.question}</h3>
                <p className="text-text-3 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Internal links */}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className="block p-4 bg-surface border border-border rounded-xl hover:border-blue transition-colors"
              >
                <div className="font-bold text-text">{tool.name}</div>
                <div className="text-xs text-text-4">{tool.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
