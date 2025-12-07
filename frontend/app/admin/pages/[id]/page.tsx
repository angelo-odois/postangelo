"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { useAuthStore, useEditorStore, Block } from "@/lib/store";
import { api } from "@/lib/api";

interface PageData {
  id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  contentJSON: {
    blocks: Block[];
    meta?: Record<string, unknown>;
  };
}

export default function PageEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const { setBlocks, blocks } = useEditorStore();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Page metadata
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    if (!user || !accessToken) {
      router.push("/admin");
      return;
    }

    loadPage();
  }, [user, accessToken, id, router]);

  const loadPage = async () => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const foundPage = await api.getPageById(id, token) as PageData;

      if (foundPage) {
        setPage(foundPage);
        setTitle(foundPage.title);
        setSlug(foundPage.slug);
        setSeoTitle(foundPage.seoTitle || "");
        setSeoDescription(foundPage.seoDescription || "");
        setStatus(foundPage.status);
        setBlocks(foundPage.contentJSON?.blocks || []);
      }
    } catch (error) {
      console.error("Failed to load page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (editorBlocks: Block[]) => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    setSaving(true);
    try {
      await api.updatePage(
        id,
        {
          title,
          slug,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          status,
          contentJSON: {
            blocks: editorBlocks,
            meta: page?.contentJSON?.meta || {},
          },
        },
        token
      );
    } catch (error) {
      console.error("Failed to save page:", error);
      alert("Erro ao salvar página");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/${slug}`, "_blank");
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/pages")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-6 w-px bg-border" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold border-0 bg-transparent p-0 h-auto text-lg focus-visible:ring-0"
            placeholder="Título da página"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            Configurações
          </Button>
          <Select value={status} onValueChange={(v: "draft" | "published") => setStatus(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-muted/50 border-b px-6 py-4 shrink-0">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="minha-pagina"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Título para SEO"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <textarea
                id="seoDescription"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Descrição para SEO"
              />
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <BlockEditor onSave={handleSave} onPreview={handlePreview} saving={saving} />
      </div>
    </div>
  );
}
