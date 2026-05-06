import Link from "next/link";
import { ToolEntry } from "@/src/tool-registry";

export function ToolCard({ tool }: { tool: ToolEntry }) {
  return (
    <Link 
      href={`/${tool.href}`}
      className="group p-5 bg-surface border border-border rounded-xl hover:border-blue hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg group-hover:text-blue transition-colors">
          {tool.name}
        </h3>
        {tool.popular && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue/10 text-blue rounded-full">
            Popular
          </span>
        )}
      </div>
      <p className="text-text-3 text-sm leading-relaxed">
        {tool.desc}
      </p>
    </Link>
  );
}
