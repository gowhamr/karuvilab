import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter | KaruviLab",
  description: "Convert length, weight, volume, temperature, speed, and more between metric and imperial units.",
  keywords: ["unit converter", "length converter", "weight converter", "temperature converter", "metric imperial"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
