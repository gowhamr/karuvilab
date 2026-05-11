import { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings | KaruviLab",
  description: "Enterprise-grade customization and preferences for KaruviLab.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <SettingsClient />
    </div>
  );
}
