"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const InvoiceGeneratorClient = dynamic(() => import("./InvoiceGeneratorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function InvoiceGeneratorClientWrapper() {
  return <InvoiceGeneratorClient />;
}
