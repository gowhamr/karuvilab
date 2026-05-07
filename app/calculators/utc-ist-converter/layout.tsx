import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UTC to IST Converter | KaruviLab",
  description: "Instantly convert between UTC and Indian Standard Time (IST, UTC+5:30). Supports any date and time.",
  keywords: ["utc to ist", "ist to utc", "india time converter", "timezone converter", "utc ist"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
