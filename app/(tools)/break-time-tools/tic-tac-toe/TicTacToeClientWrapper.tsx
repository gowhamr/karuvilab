"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TicTacToeClient = dynamic(() => import("./TicTacToeClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TicTacToeClientWrapper() {
  return <TicTacToeClient />;
}
