"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const FakeDataGeneratorClient = dynamic(
  () => import('./FakeDataGeneratorClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function FakeDataGeneratorClientWrapper() {
  return <FakeDataGeneratorClient />;
}
