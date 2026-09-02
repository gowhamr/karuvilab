import { loader } from "@monaco-editor/react";

/**
 * Detects the active base path (e.g. '/karuvilab' on GitHub Pages, '' on custom domains / localhost).
 */
export function getMonacoBasePath(): string {
  if (typeof window !== "undefined") {
    if (
      window.location.hostname.includes("github.io") ||
      window.location.pathname.startsWith("/karuvilab")
    ) {
      return "/karuvilab";
    }
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      return process.env.NEXT_PUBLIC_BASE_PATH;
    }
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

/**
 * Configure Monaco Editor to load its core from the local public directory
 * rather than fetching from jsDelivr. This enforces KaruviLab's offline-first rule.
 */
export function configureMonacoLoader(customBasePath?: string) {
  if (typeof window === "undefined") return;

  const basePath = customBasePath !== undefined ? customBasePath : getMonacoBasePath();
  const localVsPath = `${basePath}/lib/monaco/vs`;

  loader.config({
    paths: {
      vs: localVsPath,
    },
  });
}

// Auto-configure on client import
if (typeof window !== "undefined") {
  configureMonacoLoader();
}
