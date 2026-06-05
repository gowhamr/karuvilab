"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ToolShell = dynamic(
  () => import("@/src/tool-engine/core/ToolShell").then(mod => mod.ToolShell),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function V2ToolClientWrapper({ toolId }: { toolId: string }) {
  return <ToolShell toolId={toolId} />;
}
