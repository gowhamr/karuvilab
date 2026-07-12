"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SudokuClient = dynamic(() => import("./SudokuClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SudokuClientWrapper() {
  return <SudokuClient />;
}
