"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PageNumberingClient = dynamic(() => import("@/src/features/page-numbering"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PageNumberingClientWrapper() {
  return <PageNumberingClient />;
}
