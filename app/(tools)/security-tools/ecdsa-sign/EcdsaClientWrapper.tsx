"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const EcdsaClient = dynamic(() => import("./EcdsaClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function EcdsaClientWrapper() {
  return <EcdsaClient />;
}
