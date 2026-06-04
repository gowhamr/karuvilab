"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const QRCodeGeneratorClient = dynamic(() => import("./QRCodeGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function QRCodeGeneratorClientWrapper() {
  return <QRCodeGeneratorClient />;
}
