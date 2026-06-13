"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WifiQrCodeClient = dynamic(
  () => import('./WifiQrCodeClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function WifiQrCodeClientWrapper() {
  return <WifiQrCodeClient />;
}
