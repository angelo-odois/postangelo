"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { useAuthStore } from "@/lib/store";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, syncUser } = useAuthStore();
  const [synced, setSynced] = useState(false);

  // Sync user data on mount to get latest onboardingCompleted status
  useEffect(() => {
    if (user && !synced) {
      syncUser().then(() => setSynced(true));
    }
  }, [user, synced, syncUser]);

  useEffect(() => {
    if (!user) {
      router.push("/admin");
    } else if (synced && !user.onboardingCompleted) {
      router.push("/admin/onboarding");
    }
  }, [user, router, synced]);

  // Show loading while syncing or if not logged in
  if (!user || (!synced && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // After sync, if onboarding not completed, the useEffect will redirect
  if (!user.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="pl-0 pt-16 lg:pt-0 lg:pl-64 transition-all duration-300">
        <div className="p-4 lg:p-6 animate-fade-in-up">{children}</div>
      </main>
    </div>
  );
}
