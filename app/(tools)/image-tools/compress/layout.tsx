import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor | KV",
  description: "Compress JPG, PNG, and WebP images in your browser without quality loss. No uploads to any server.",
  keywords: ["image compressor", "compress image", "reduce image size", "jpg compressor", "png optimizer"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
