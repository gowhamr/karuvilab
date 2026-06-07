"use client";

export default function ToolLoading() {
  return (
    <div className="max-w-5xl mx-auto py-24 px-4 space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-surface border border-border rounded animate-pulse" />
          <div className="h-4 w-4 text-text-4">/</div>
          <div className="h-4 w-32 bg-surface border border-border rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-12 w-3/4 bg-surface border border-border rounded-2xl animate-pulse" />
          <div className="h-20 w-full bg-surface border border-border rounded-2xl animate-pulse opacity-50" />
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 bg-blue/5 blur-3xl -z-10 rounded-full" />
        <div className="h-[400px] w-full bg-surface border border-border rounded-4xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-surface border border-border rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-surface border border-border rounded animate-pulse" />
              <div className="h-4 w-full bg-surface border border-border rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-surface border border-border rounded animate-pulse" />
            </div>
          </div>
        </div>
        <aside className="hidden lg:block h-96 bg-surface border border-border rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}
