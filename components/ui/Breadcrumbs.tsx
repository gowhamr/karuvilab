import Link from "next/link";
import { CategoryEntry } from "@/src/tool-registry";

interface BreadcrumbsProps {
  category?: CategoryEntry | undefined;
  title?: string | undefined;
}

export function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-text-4 mb-6"
    >
      <Link href="/" aria-label="KV Home" className="hover:text-blue transition-colors">Home</Link>
      <span aria-hidden="true">/</span>
      {category && (
        <>
          {title ? (
            <>
              <Link href={`/${category.href}`} className="hover:text-blue transition-colors">{category.label}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-text-3" aria-current="page">{title}</span>
            </>
          ) : (
            <span className="text-text-3" aria-current="page">{category.label}</span>
          )}
        </>
      )}
    </nav>
  );
}
