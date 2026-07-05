"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const Pbkdf2Client = dynamic(() => import("./Pbkdf2Client"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Pbkdf2ClientWrapper() {
  return <Pbkdf2Client />;
}
