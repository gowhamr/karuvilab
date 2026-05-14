import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder | KV",
  description: "Decode and inspect JSON Web Tokens (JWT). View header, payload, and verify token structure.",
  keywords: ["jwt decoder", "json web token", "jwt parser", "decode jwt", "jwt inspector"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
