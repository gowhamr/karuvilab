"use client";

import dynamic from 'next/dynamic';

const FavoritesClient = dynamic(
  () => import('./FavoritesClient'),
  { ssr: false, loading: () => <div className="animate-pulse space-y-8"><div className="h-10 w-1/4 bg-surface rounded-lg" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div className="h-40 w-full bg-surface rounded-3xl" /><div className="h-40 w-full bg-surface rounded-3xl" /></div></div> }
);

export default function FavoritesClientWrapper() {
  return <FavoritesClient />;
}
