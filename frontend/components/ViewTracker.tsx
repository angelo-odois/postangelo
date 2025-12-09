"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

interface ViewTrackerProps {
  username: string;
  pageSlug?: string;
}

export function ViewTracker({ username, pageSlug }: ViewTrackerProps) {
  useEffect(() => {
    // Track view on mount
    const referrer = typeof document !== "undefined" ? document.referrer : undefined;
    api.trackView(username, pageSlug, referrer);
  }, [username, pageSlug]);

  return null; // This component renders nothing
}
