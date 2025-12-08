import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

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

  return (
    <main>
      {page.contentJSON.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  );
}
