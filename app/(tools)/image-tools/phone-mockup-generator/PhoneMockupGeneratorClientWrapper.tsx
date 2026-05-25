"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PhoneMockupGeneratorClient = dynamic(() => import("./PhoneMockupGeneratorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function PhoneMockupGeneratorClientWrapper() {
  return <PhoneMockupGeneratorClient />;
}
