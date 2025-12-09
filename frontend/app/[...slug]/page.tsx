import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { ViewTracker } from "@/components/ViewTracker";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

interface PageData {
  id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  coverImageUrl?: string;
  contentJSON: {
    blocks: Array<{
      id: string;
      type: string;
      props: Record<string, unknown>;
    }>;
    meta?: {
      layout?: "contained" | "full";
    };
  };
  createdBy?: {
    id: string;
    name: string;
    username: string;
  };
}

async function getPage(slug: string): Promise<PageData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const slugPath = params.slug.join("/");
  const page = await getPage(slugPath);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
      images: page.ogImageUrl ? [page.ogImageUrl] : undefined,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slugPath = params.slug.join("/");
  const page = await getPage(slugPath);

  if (!page) {
    notFound();
  }

  const layout = page.contentJSON?.meta?.layout || "contained";

  return (
    <>
      {/* Analytics Tracking */}
      {page.createdBy?.username && (
        <ViewTracker username={page.createdBy.username} pageSlug={page.slug} />
      )}

      <main className={cn(
        layout === "full" && "full-width-layout"
      )}>
        {page.contentJSON.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </main>

      {/* Floating Home Button */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-amber-500 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-amber-500/30 hover:scale-110 transition-all duration-300"
        title="Voltar para a página inicial"
      >
        <Home className="h-5 w-5" />
      </Link>
    </>
  );
}
