import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator | KaruviLab",
  description: "Estimate mutual fund SIP returns with step-up and lumpsum options. See year-wise projection and inflation-adjusted value.",
  keywords: ["sip calculator", "systematic investment plan", "mutual fund", "sip returns", "investment calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
