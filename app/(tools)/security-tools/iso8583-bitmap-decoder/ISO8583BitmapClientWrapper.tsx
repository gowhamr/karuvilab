"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ISO8583BitmapClient = dynamic(() => import("./ISO8583BitmapClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ISO8583BitmapClientWrapper() {
  return <ISO8583BitmapClient />;
}
