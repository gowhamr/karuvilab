import Link from "next/link";
import { CategoryEntry } from "@/src/tool-registry";

interface ToolShellProps {
  title: string;
  description?: string;
  category?: CategoryEntry;
  children: React.ReactNode;
}

export function ToolShell({ title, description, category, children }: ToolShellProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        {category && (
          <nav className="flex items-center gap-2 text-sm text-text-4">
            <Link href="/" className="hover:text-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${category.href}`} className="hover:text-blue transition-colors">{category.label}</Link>
            <span>/</span>
            <span className="text-text-3">{title}</span>
          </nav>
        )}
        <h1 className="text-3xl font-black">{title}</h1>
        {description && <p className="text-text-3">{description}</p>}
      </div>
      {children}
    </div>
  );
}
