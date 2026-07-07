import type { Metadata } from "next";
import AllToolsClientWrapper from "./AllToolsClientWrapper";

export const metadata: Metadata = {
  title: "All Tools — Professional Browser-Side Toolkit | KaruviLab",
  description: "Browse 100+ free, private online tools — calculators, image processors, PDF editors, developer tools, and more. 100% local processing.",
  keywords: ["online tools", "free tools", "private tools", "calculators", "image editor", "pdf editor"],
  alternates: {
    canonical: "https://karuvilab.com/all-tools/",
  },
};

export default function AllToolsPage() {
  return <AllToolsClientWrapper />;
}
