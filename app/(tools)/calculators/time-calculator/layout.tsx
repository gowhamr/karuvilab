import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Calculator | KaruviLab",
  description: "Add or subtract hours and minutes, or calculate the duration between two times.",
  keywords: ["time calculator", "hours calculator", "duration calculator", "time difference"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
