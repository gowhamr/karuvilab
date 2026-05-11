import { Metadata } from "next";
import dynamic from "next/dynamic";

const SettingsClient = dynamic(() => import("./SettingsClient"), {
  loading: () => (
    <div className="max-w-4xl mx-auto py-24 px-4 space-y-12 animate-pulse">
      <div className="space-y-4">
        <div className="h-10 w-48 bg-surface border border-border rounded-xl" />
        <div className="h-4 w-64 bg-surface border border-border rounded" />
      </div>
      <div className="grid gap-6">
        <div className="h-64 bg-surface border border-border rounded-[32px]" />
        <div className="h-64 bg-surface border border-border rounded-[32px]" />
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Settings | KaruviLab",
  description: "Customize your KaruviLab experience. Manage themes, local storage, and privacy preferences.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
