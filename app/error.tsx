"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-24 text-center space-y-6">
      <div className="text-8xl font-black text-red-500">Error</div>
      <h1 className="text-3xl font-bold">Something went wrong!</h1>
      <p className="text-text-3">
        An unexpected error occurred while rendering this page. We've been notified and are looking into it.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-bg border border-border text-text font-bold rounded-xl hover:bg-surface transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
