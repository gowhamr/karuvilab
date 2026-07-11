import type { Metadata } from "next";
import FavoritesClientWrapper from "./FavoritesClientWrapper";

export const metadata: Metadata = {
  title: "Favorites – KV",
  description: "Your curated list of favorited tools in KaruviLab.",
};

export default function FavoritesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <FavoritesClientWrapper />
    </div>
  );
}
