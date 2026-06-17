import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 – KV" };

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-24 text-center space-y-6">
      <div className="text-8xl font-black text-blue">404</div>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-text-3">The tool or page you're looking for doesn't exist yet.</p>
      <Link href="/" className="inline-block px-6 py-3 bg-blue text-white font-bold rounded-xl hover:scale-102 transition-all">
        Back to all tools
      </Link>
    </div>
  );
}
