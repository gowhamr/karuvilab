import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 animate-in fade-in duration-200">
      <ToolSkeleton variant="dashboard" />
    </div>
  );
}
