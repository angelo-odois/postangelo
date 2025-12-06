"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-muted-foreground mb-6">An error occurred</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
