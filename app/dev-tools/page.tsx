/**
 * app/dev-tools/page.tsx
 * Developer-only route to monitor platform performance and metrics.
 */

import { EmptyStateMetrics } from "@/src/features/dev-tools/EmptyStateMetrics";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";

export default function DevToolsPage() {
  const cat = CATEGORIES.find((c: any) => c.id === 'developer')!;

  return (
    <ToolShell
      title="Platform Diagnostics"
      description="Internal metrics and system health monitoring."
      category={cat}
    >
      <div className="space-y-12">
        <EmptyStateMetrics />
      </div>
    </ToolShell>
  );
}
