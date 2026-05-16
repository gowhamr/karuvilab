import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import { generateToolMetadata } from "@/src/lib/seo";
import dynamic from "next/dynamic";
const HtmlViewerClient = dynamic(() => import("@/src/features/html-viewer"), {
  loading: () => <ToolSkeleton />,
});
import { Suspense } from "react";

export const metadata: Metadata = generateToolMetadata("html-viewer");

export default function HtmlViewerPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black text-blue animate-pulse">LOADING EDITOR...</div>}>
      <HtmlViewerClient />
    </Suspense>
  );
}
