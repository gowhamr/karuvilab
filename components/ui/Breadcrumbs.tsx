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
      className="flex flex-wrap items-center gap-2 text-tiny font-bold uppercase tracking-widest-md text-text-4 mb-6"
    >
      <Link href="/" aria-label="KV Home" className="hover:text-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm">Home</Link>
      {category && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={category.href} className="hover:text-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm">{category.label}</Link>
        </>
      )}
    </nav>
  );
}
