import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter | KaruviLab",
  description: "Convert JSON arrays to CSV and CSV back to JSON. All conversion happens locally in your browser.",
  keywords: ["json to csv", "csv to json", "json csv converter", "convert json csv", "data converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
