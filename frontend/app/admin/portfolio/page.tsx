"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin";

export default function PortfolioRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/profile");
  }, [router]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    </AdminLayout>
  );
}
