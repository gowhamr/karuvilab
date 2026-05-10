import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lock / Unlock PDF | KaruviLab",
  description: "Add a password to protect your PDF or remove an existing PDF password in your browser.",
  keywords: ["lock pdf", "unlock pdf", "pdf password", "encrypt pdf", "pdf protection", "remove pdf password"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
