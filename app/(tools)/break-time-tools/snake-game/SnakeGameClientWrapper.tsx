"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SnakeGameClient = dynamic(() => import("./SnakeGameClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SnakeGameClientWrapper() {
  return <SnakeGameClient />;
}
