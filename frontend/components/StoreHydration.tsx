"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useEditorStore } from "@/lib/store";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Manually rehydrate the stores from localStorage
    useAuthStore.persist.rehydrate();
    useEditorStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  // While hydrating, show nothing to avoid hydration mismatch
  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
