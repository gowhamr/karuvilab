import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator | KaruviLab",
  description: "Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text string.",
  keywords: ["hash generator", "md5 generator", "sha256 generator", "checksum", "cryptographic hash"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
