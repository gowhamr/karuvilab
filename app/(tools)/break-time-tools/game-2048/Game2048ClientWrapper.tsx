"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const Game2048Client = dynamic(() => import("./Game2048Client"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Game2048ClientWrapper() {
  return <Game2048Client />;
}
