"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function HtmlPrecacher() {
  const pathname = usePathname();

  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.pathname !== '/') {
      // Fetch the HTML in the background to populate the SW cache for offline hard-reloads
      // This solves the Next.js App Router issue where client-side navigation doesn't fetch HTML
      fetch(window.location.href, { 
        headers: { 'Accept': 'text/html' } 
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
