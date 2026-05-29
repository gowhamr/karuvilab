"use client";

import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { EmptyState } from "@/components/system/EmptyState";

export default function ProductivityPageClient() {
  const router = useRouter();
  
  return (
    <EmptyState
      title="No Tools Found"
      description="We're currently expanding our productivity suite. Check back soon for new tools, or explore our other categories."
      icon={<LayoutGrid className="w-6 h-6" />}
      cta={{
        label: "Explore All Tools",
        onClick: () => router.push("/all-tools")
      }}
    />
  );
}
