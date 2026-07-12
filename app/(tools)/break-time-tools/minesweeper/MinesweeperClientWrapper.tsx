"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MinesweeperClient = dynamic(() => import("./MinesweeperClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MinesweeperClientWrapper() {
  return <MinesweeperClient />;
}
