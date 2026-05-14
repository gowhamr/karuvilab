import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Hours Calculator | KV",
  description: "Track timesheets, calculate total work hours, and compute overtime pay easily.",
  keywords: ["work hours calculator", "timesheet calculator", "overtime calculator", "hours worked"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
