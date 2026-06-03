"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const FileValidatorClient = dynamic(() => import("./FileValidatorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function FileValidatorClientWrapper() {
  return <FileValidatorClient />;
}
