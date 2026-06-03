"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const BarcodeScannerClient = dynamic(() => import("./BarcodeScannerClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function BarcodeScannerClientWrapper() {
  return <BarcodeScannerClient />;
}
