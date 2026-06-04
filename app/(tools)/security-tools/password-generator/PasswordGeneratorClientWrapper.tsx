"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PasswordGeneratorClient = dynamic(() => import("./PasswordGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PasswordGeneratorClientWrapper() {
  return <PasswordGeneratorClient />;
}
