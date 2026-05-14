import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Validator | KV",
  description: "Validate JSON syntax with detailed error messages pointing to the exact line and position.",
  keywords: ["json validator", "validate json", "json syntax checker", "json lint", "json error checker"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
