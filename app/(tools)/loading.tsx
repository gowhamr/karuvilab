import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

export default function ToolsLoading() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8 animate-in fade-in duration-200">
      <ToolSkeleton variant="default" />
    </div>
  );
}
