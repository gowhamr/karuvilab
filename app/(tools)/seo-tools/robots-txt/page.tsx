import RobotsTxtBuilderClientWrapper from "./RobotsTxtBuilderClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("robots-txt");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="robots.txt Builder"
      description="Create a robots.txt file to control how search engines crawl your site."
      category={cat}
    >
      <RobotsTxtBuilderClientWrapper />
    </ToolShell>
  );
}
