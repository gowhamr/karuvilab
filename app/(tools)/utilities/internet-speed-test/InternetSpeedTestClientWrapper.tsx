"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const InternetSpeedTestClient = dynamic(
  () => import("./InternetSpeedTestClient"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function InternetSpeedTestClientWrapper() {
  return <InternetSpeedTestClient />;
}
