"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CompoundInterestClient = dynamic(() => import("./CompoundInterestClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CompoundInterestClientWrapper() {
  return <CompoundInterestClient />;
}
