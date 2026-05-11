import Link from "next/link";
import { CategoryEntry } from "@/src/tool-registry";

interface BreadcrumbsProps {
  category?: CategoryEntry | undefined;
  title?: string | undefined;
}

export function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-4 mb-6">
      <Link href="/" className="hover:text-blue transition-colors">Home</Link>
      <span>/</span>
      {category && (
        <>
          {title ? (
            <>
              <Link href={`/${category.href}`} className="hover:text-blue transition-colors">{category.label}</Link>
              <span>/</span>
              <span className="text-text-3">{title}</span>
            </>
          ) : (
            <span className="text-text-3">{category.label}</span>
          )}
        </>
      )}
    </nav>
  );
}
